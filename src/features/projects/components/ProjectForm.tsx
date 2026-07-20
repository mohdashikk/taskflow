"use client";

import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { STATUS_LABELS, type ProjectStatus } from "../data/mockData";

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
}

const STATUS_OPTIONS = Object.keys(STATUS_LABELS) as ProjectStatus[];

export default function ProjectForm({
  open,
  mode = "create",
  initialValues,
  onSubmit,
  onCancel,
  isPending,
  error,
}: ProjectFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("planning");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (open && initialValues) {
      setTitle(initialValues.title);
      setDescription(initialValues.description);
      setStatus(initialValues.status);
      setDueDate(initialValues.due_date ? initialValues.due_date.slice(0, 10) : "");
    } else if (!open) {
      setTitle("");
      setDescription("");
      setStatus("planning");
      setDueDate("");
    }
  }, [open, initialValues]);

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
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle sx={{ fontWeight: 800, fontSize: 20 }}>
        {mode === "edit" ? "Edit Project" : "Add Project"}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            size="small"
            sx={{ "& .MuiOutlinedInput-notchedOutline": { borderRadius: 2 } }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            size="small"
            multiline
            minRows={2}
            sx={{ "& .MuiOutlinedInput-notchedOutline": { borderRadius: 2 } }}
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
                "& .MuiOutlinedInput-notchedOutline": { borderRadius: 2 },
              }}
            >
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>
                  {STATUS_LABELS[s]}
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
                "& .MuiOutlinedInput-notchedOutline": { borderRadius: 2 },
              }}
            />
          </Box>

          {error && (
            <Typography variant="body2" sx={{ color: "error.main", fontWeight: 600 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={isPending}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isPending || !title.trim()}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": { boxShadow: "none", bgcolor: "primary.dark" },
            }}
          >
            {isPending ? "Saving..." : "Save Project"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
