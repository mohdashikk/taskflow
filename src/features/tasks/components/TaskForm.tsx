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
import type { ProjectStatusRow } from "@/features/projects/data/mockData";

interface TaskFormProps {
  open: boolean;
  statuses: ProjectStatusRow[];
  onSubmit: (values: {
    title: string;
    status_id?: string | null;
    description?: string | null;
    priority: string;
    start_date?: string | null;
    due_date?: string | null;
  }) => void;
  onCancel: () => void;
  isPending?: boolean;
  error?: string | null;
}

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export default function TaskForm({
  open,
  statuses,
  onSubmit,
  onCancel,
  isPending,
  error,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [statusId, setStatusId] = useState<string>("");

  const defaultStatusId =
    statuses.find((s) => s.is_default)?.id ?? statuses[0]?.id ?? "";

  console.log("[TaskForm] render:", {
    statusesLength: statuses.length,
    statuses: statuses.map(s => ({ id: s.id, name: s.name, is_default: s.is_default })),
    defaultStatusId,
    statusId,
  });

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setStartDate("");
    setDueDate("");
    setStatusId(defaultStatusId);
    onCancel();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedStatusId = statusId || defaultStatusId || null;

    console.log("[TaskForm] submit:", {
      title: title.trim(),
      statusId,
      defaultStatusId,
      selectedStatusId,
      statusesLength: statuses.length,
    });

    onSubmit({
      title: title.trim(),
      status_id: selectedStatusId,
      description: description.trim() || null,
      priority,
      start_date: startDate || null,
      due_date: dueDate || null,
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
        Add Task
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {statuses.length > 0 ? (
            <TextField
              select
              label="Status"
              value={statusId || defaultStatusId}
              onChange={(e) => setStatusId(e.target.value)}
              size="small"
              sx={{
                minWidth: 160,
                "& .MuiOutlinedInput-notchedOutline": { borderRadius: 2 },
              }}
            >
              {statuses.map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: status.color,
                      mr: 1.5,
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  {status.name}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <Typography variant="body2" color="warning.main" sx={{ fontWeight: 500 }}>
              No statuses configured for this project. Tasks will use the first available status.
            </Typography>
          )}
          <TextField
            label="Title"
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
          <TextField
            select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            size="small"
            sx={{
              minWidth: 140,
              "& .MuiOutlinedInput-notchedOutline": { borderRadius: 2 },
            }}
          >
            {PRIORITY_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{
                flexGrow: 1,
                minWidth: 160,
                "& .MuiOutlinedInput-notchedOutline": { borderRadius: 2 },
              }}
            />
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
            onClick={handleCancel}
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
            {isPending ? "Saving..." : "Save Task"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
