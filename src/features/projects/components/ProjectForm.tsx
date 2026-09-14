"use client";

import { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import MuiTypography from "@mui/material/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { motion } from "framer-motion";
import { useTheme, alpha } from "@mui/material/styles";
import { STATUS_LABELS, type ProjectStatus } from "../data/mockData";
import type { ProjectStatusRow } from "../data/mockData";

interface ProjectFormProps {
  open: boolean;
  mode?: "create" | "edit";
  initialValues?: {
    title: string;
    description: string;
    status: ProjectStatus;
    due_date: string | null;
    start_date?: string | null;
  };
  onSubmit: (values: {
    title: string;
    description: string;
    status: ProjectStatus;
    due_date: string | null;
    start_date?: string | null;
  }) => void;
  onCancel: () => void;
  isPending?: boolean;
  error?: string | null;
  statuses?: ProjectStatusRow[];
  ownerName?: string;
  ownerEmail?: string;
}

const FALLBACK_OPTIONS = Object.keys(STATUS_LABELS) as ProjectStatus[];
const Typography = MuiTypography as any;

export default function ProjectForm({
  open,
  mode = "create",
  initialValues,
  onSubmit,
  onCancel,
  isPending,
  error,
  statuses,
  ownerName = "You",
  ownerEmail = "",
}: ProjectFormProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const statusOptions = statuses && statuses.length > 0
    ? statuses.map((s) => ({ value: s.name as ProjectStatus, label: s.name }))
    : FALLBACK_OPTIONS.map((s) => ({ value: s, label: STATUS_LABELS[s] }));

  const defaultStatus = statusOptions[0]?.value ?? "planning";

  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [status, setStatus] = useState<ProjectStatus>(initialValues?.status ?? defaultStatus);
  const [dueDate, setDueDate] = useState(initialValues?.due_date ? initialValues.due_date.slice(0, 10) : "");
  const [startDate, setStartDate] = useState(initialValues?.start_date ? initialValues.start_date.slice(0, 10) : "");

  useEffect(() => {
    if (!open) return;
    setTitle(initialValues?.title ?? "");
    setDescription(initialValues?.description ?? "");
    setStatus(initialValues?.status ?? defaultStatus);
    setStartDate(initialValues?.start_date ? initialValues.start_date.slice(0, 10) : "");
    setDueDate(initialValues?.due_date ? initialValues.due_date.slice(0, 10) : "");
  }, [open, initialValues?.title, initialValues?.description, initialValues?.status, initialValues?.start_date, initialValues?.due_date, defaultStatus]);

  const inputBg = isDark ? "#1A1728" : "#FFFFFF";
  const inputBorder = isDark ? "rgba(255,255,255,0.08)" : "#E6E8EB";
  const inputHoverBorder = theme.palette.primary.main;
  const inputFocusShadow = alpha(theme.palette.primary.main, 0.1);
  const titleColor = isDark ? "#FFFFFF" : "#111827";
  const dialogBorder = isDark ? "rgba(255,255,255,0.08)" : "#E6E8EB";
  const dialogShadow = isDark ? "0 24px 64px rgba(0, 0, 0, 0.4)" : "0 24px 64px rgba(15, 23, 42, 0.1)";
  const cancelBorder = isDark ? "rgba(255,255,255,0.12)" : "#E6E8EB";
  const cancelColor = isDark ? "#B5B7C8" : "#6B7280";

  const resetForm = () => {
    setTitle(initialValues?.title ?? "");
    setDescription(initialValues?.description ?? "");
    setStatus(initialValues?.status ?? defaultStatus);
    setStartDate(initialValues?.start_date ? initialValues.start_date.slice(0, 10) : "");
    setDueDate(initialValues?.due_date ? initialValues.due_date.slice(0, 10) : "");
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
      start_date: startDate || null,
    });
  };

  return (
    <Drawer
      open={open}
      onClose={handleCancel}
      anchor="right"
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: 560, md: 620 },
          maxWidth: "100vw",
          borderLeft: `1px solid ${dialogBorder}`,
          boxShadow: dialogShadow,
          bgcolor: "background.paper",
        },
      }}
    >
      <Box sx={{ display:"flex", alignItems:"center", gap:2, px:{xs:2.5,sm:4}, py:2.5, borderBottom:"1px solid", borderColor:"divider" }}>
        <Box sx={{flex:1}}><Typography sx={{ fontWeight: 700, fontSize: 22, color: titleColor }}>Edit project</Typography><Typography color="text.secondary" fontSize={13} mt={0.25}>Update every part of this project in one place.</Typography></Box>
        <IconButton onClick={handleCancel} aria-label="Close edit project" sx={{border:"1px solid",borderColor:"divider",borderRadius:"10px"}}><CloseRoundedIcon /></IconButton>
      </Box>
      <Box component="form" onSubmit={handleSubmit} sx={{display:"flex",flexDirection:"column",minHeight:0,flex:1}}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, px:{xs:2.5,sm:4}, py:3.5, overflowY:"auto", flex:1 }}>
          <Box><Typography fontWeight={700} fontSize={17}>Project details</Typography><Typography color="text.secondary" fontSize={13} mt={0.5}>Name, description, current status, and delivery dates.</Typography></Box>
          <TextField
            label="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                bgcolor: inputBg,
                "& fieldset": { borderColor: inputBorder },
                "&:hover fieldset": { borderColor: inputHoverBorder },
                "&.Mui-focused fieldset": {
                  borderColor: inputHoverBorder,
                  boxShadow: `0 0 0 3px ${inputFocusShadow}`,
                },
                "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus": {
                  WebkitBoxShadow: `0 0 0px 1000px ${inputBg} inset`,
                  transition: "background-color 5000s ease-in-out 0s",
                },
              },
            }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            size="small"
            multiline
            minRows={2}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                bgcolor: inputBg,
                "& fieldset": { borderColor: inputBorder },
                "&:hover fieldset": { borderColor: inputHoverBorder },
                "&.Mui-focused fieldset": {
                  borderColor: inputHoverBorder,
                  boxShadow: `0 0 0 3px ${inputFocusShadow}`,
                },
                "& textarea:-webkit-autofill, & textarea:-webkit-autofill:hover, & textarea:-webkit-autofill:focus": {
                  WebkitBoxShadow: `0 0 0px 1000px ${inputBg} inset`,
                  transition: "background-color 5000s ease-in-out 0s",
                },
              },
            }}
          />
          <Box sx={{ maxWidth: { sm: 260 } }}>
            <TextField
              select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              size="small"
              sx={{
                minWidth: 150,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  bgcolor: inputBg,
                  "& fieldset": { borderColor: inputBorder },
                  "&:hover fieldset": { borderColor: inputHoverBorder },
                  "&.Mui-focused fieldset": {
                    borderColor: inputHoverBorder,
                    boxShadow: `0 0 0 3px ${inputFocusShadow}`,
                  },
                  "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus": {
                    WebkitBoxShadow: `0 0 0px 1000px ${inputBg} inset`,
                    transition: "background-color 5000s ease-in-out 0s",
                  },
                },
              }}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ display:"grid", gridTemplateColumns:{xs:"1fr",sm:"1fr 1fr"}, gap:2 }}>
            <TextField label="Start date" type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} slotProps={{inputLabel:{shrink:true}}} />
            <TextField label="Deadline" type="date" value={dueDate} onChange={(e)=>setDueDate(e.target.value)} slotProps={{inputLabel:{shrink:true}}} />
          </Box>

          <Divider />
          <Box><Typography fontWeight={700} fontSize={17}>Team access</Typography><Typography color="text.secondary" fontSize={13} mt={0.5} mb={2}>This workspace currently supports one project owner.</Typography>
            <Box sx={{display:"flex",alignItems:"center",gap:2,p:2,border:"1px solid",borderColor:"primary.main",borderRadius:"10px",bgcolor:"action.selected"}}>
              <Avatar sx={{bgcolor:"primary.main"}}>{(ownerName || ownerEmail || "Y").charAt(0).toUpperCase()}</Avatar>
              <Box sx={{flex:1,minWidth:0}}><Typography fontWeight={650}>{ownerName}</Typography><Typography color="text.secondary" fontSize={13} noWrap>{ownerEmail}</Typography></Box>
              <Chip label="Owner" size="small" color="primary" icon={<CheckRoundedIcon />} />
            </Box>
          </Box>

          <Divider />
          <Box><Typography fontWeight={700} fontSize={17}>Milestones</Typography><Typography color="text.secondary" fontSize={13} mt={0.5}>Milestones remain available in the Plan tab, where delivery stages can be reviewed and managed.</Typography></Box>

          <Divider />
          <Box><Typography fontWeight={700} fontSize={17}>Review</Typography><Typography color="text.secondary" fontSize={13} mt={0.5} mb={2}>Confirm the project information before saving.</Typography>
            {[["Project",title || "Untitled project"],["Owner",ownerName],["Status",STATUS_LABELS[status] || status],["Timeline",`${startDate || "Not set"} — ${dueDate || "Not set"}`]].map(([label,value])=><Box key={label} sx={{display:"flex",justifyContent:"space-between",gap:3,py:1.25,borderBottom:"1px solid",borderColor:"divider"}}><Typography color="text.secondary" fontSize={13}>{label}</Typography><Typography fontWeight={600} fontSize={13} textAlign="right">{value}</Typography></Box>)}
          </Box>

          {error && (
            <Typography sx={{ color: "#EF4444", fontWeight: 600, fontSize: 14 }}>
              {error}
            </Typography>
          )}
        </Box>
        <Box sx={{ px:{xs:2.5,sm:4}, py:2.5, display:"flex", justifyContent:"flex-end", gap:1.5, borderTop:"1px solid", borderColor:"divider", bgcolor:"background.paper" }}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={isPending}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                borderColor: cancelBorder,
                color: cancelColor,
                "&:hover": { borderColor: theme.palette.primary.main, color: theme.palette.primary.main },
              }}
            >
              Cancel
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isPending || !title.trim()}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                bgcolor: theme.palette.primary.main,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                "&:hover": { boxShadow: "none", bgcolor: theme.palette.primary.dark },
              }}
            >
              {isPending ? "Saving..." : "Save Project"}
            </Button>
          </motion.div>
        </Box>
      </Box>
    </Drawer>
  );
}
