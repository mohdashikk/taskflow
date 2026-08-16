"use client";

import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
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
  };
  onSubmit: (values: {
    title: string;
    description: string;
    status: ProjectStatus;
    due_date: string | null;
  }) => void;
  onCancel: () => void;
  isPending?: boolean;
  error?: string | null;
  statuses?: ProjectStatusRow[];
}

const FALLBACK_OPTIONS = Object.keys(STATUS_LABELS) as ProjectStatus[];

export default function ProjectForm({
  open,
  mode = "create",
  initialValues,
  onSubmit,
  onCancel,
  isPending,
  error,
  statuses,
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

  const inputBg = isDark ? "#1A1728" : "#FFFFFF";
  const inputBorder = isDark ? "rgba(255,255,255,0.08)" : "#E6E8EB";
  const inputHoverBorder = "#006F99";
  const inputFocusShadow = isDark ? alpha("#006F99", 0.12) : "rgba(0, 111, 153, 0.08)";
  const titleColor = isDark ? "#FFFFFF" : "#111827";
  const dialogBorder = isDark ? "rgba(255,255,255,0.08)" : "#E6E8EB";
  const dialogShadow = isDark ? "0 24px 64px rgba(0, 0, 0, 0.4)" : "0 24px 64px rgba(15, 23, 42, 0.1)";
  const cancelBorder = isDark ? "rgba(255,255,255,0.12)" : "#E6E8EB";
  const cancelColor = isDark ? "#B5B7C8" : "#6B7280";

  const resetForm = () => {
    setTitle(initialValues?.title ?? "");
    setDescription(initialValues?.description ?? "");
    setStatus(initialValues?.status ?? defaultStatus);
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
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "24px",
          border: `1px solid ${dialogBorder}`,
          boxShadow: dialogShadow,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: 22, color: titleColor, letterSpacing: "-0.01em" }}>
        {mode === "edit" ? "Edit Project" : "Add Project"}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit} key={open ? "form-open" : "form-closed"}>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            label="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
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
                borderRadius: "14px",
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
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              size="small"
              sx={{
                minWidth: 150,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
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
            <TextField
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{
                flexGrow: 1,
                minWidth: 160,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
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
          </Box>

          {error && (
            <Typography sx={{ color: "#EF4444", fontWeight: 600, fontSize: 14 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, justifyContent: "flex-end", gap: 1 }}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={isPending}
              sx={{
                borderRadius: "14px",
                textTransform: "none",
                fontWeight: 600,
                borderColor: cancelBorder,
                color: cancelColor,
                "&:hover": { borderColor: "#006F99", color: "#006F99" },
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
                borderRadius: "14px",
                textTransform: "none",
                fontWeight: 600,
                bgcolor: "#006F99",
                boxShadow: "0 4px 12px rgba(0, 111, 153, 0.2)",
                "&:hover": { boxShadow: "none", bgcolor: "#005670" },
              }}
            >
              {isPending ? "Saving..." : "Save Project"}
            </Button>
          </motion.div>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
