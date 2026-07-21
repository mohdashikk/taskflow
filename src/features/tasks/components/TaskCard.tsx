"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import type { TaskRow } from "../services/tasksService";

interface TaskCardProps {
  task: TaskRow;
  onEdit?: (task: TaskRow) => void;
  onDelete?: (taskId: string) => void;
  onUpdate?: (taskId: string, updates: { title?: string; priority?: string; due_date?: string | null; status_id?: string }) => void;
}

const PRIORITY_OPTIONS = [
  { value: "high", label: "High", color: "#EF4444" },
  { value: "medium", label: "Medium", color: "#F59E0B" },
  { value: "low", label: "Low", color: "#10B981" },
] as const;

const PRIORITY_COLORS: Record<string, string> = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#10B981",
};

export default function TaskCard({ task, onEdit, onDelete, onUpdate }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  const priorityColor = PRIORITY_COLORS[task.priority] ?? "#64748B";
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDueDate, setEditDueDate] = useState(task.due_date || "");
  const [priorityAnchor, setPriorityAnchor] = useState<null | HTMLElement>(null);

  const currentPriority = PRIORITY_OPTIONS.find((p) => p.value === editPriority) ?? PRIORITY_OPTIONS[1];

  const startEditing = () => {
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditDueDate(task.due_date || "");
    setIsEditing(true);
    setMenuAnchor(null);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditDueDate(task.due_date || "");
  };

  const saveEditing = () => {
    const trimmed = editTitle.trim() || "Untitled task";
    onUpdate?.(task.id, {
      title: trimmed,
      priority: editPriority,
      due_date: editDueDate || null,
    });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEditing();
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };

  const handlePrioritySelect = (value: string) => {
    setEditPriority(value);
    setPriorityAnchor(null);
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        bgcolor: "background.paper",
        borderRadius: "10px",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderColor: "divider",
        },
        transition: "box-shadow 0.15s ease, border-color 0.15s ease",
      }}
    >
      <Box sx={{ p: 2, position: "relative" }}>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            if (isEditing) return;
            setMenuAnchor(e.currentTarget);
          }}
          sx={{
            position: "absolute",
            top: 4,
            right: 4,
            width: 24,
            height: 24,
            color: "text.secondary",
            "&:hover": { bgcolor: "background.default", color: "text.primary" },
          }}
        >
          <MoreVertOutlinedIcon sx={{ fontSize: 16 }} />
        </IconButton>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem
            onClick={startEditing}
            sx={{ fontSize: 14, py: 1, px: 2 }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              setMenuAnchor(null);
              setDeleteConfirmOpen(true);
            }}
            sx={{ fontSize: 14, py: 1, px: 2, color: "#EF4444" }}
          >
            Delete
          </MenuItem>
        </Menu>

        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          maxWidth="xs"
          fullWidth
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "12px",
              bgcolor: "background.paper",
            },
          }}
        >
          <DialogTitle sx={{ fontSize: 18, fontWeight: 700, color: "text.primary" }}>Delete Task</DialogTitle>
          <DialogContent>
            <Typography sx={{ fontSize: 15, color: "text.secondary" }}>
              Are you sure you want to delete <strong>"{task.title}"</strong>? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, pt: 0 }}>
            <Button
              onClick={() => setDeleteConfirmOpen(false)}
              sx={{
                color: "text.secondary",
                textTransform: "none",
                fontWeight: 700,
                fontSize: 14,
                borderRadius: "8px",
                py: 0.75,
                px: 2,
                "&:hover": { bgcolor: "divider", color: "text.primary" },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setDeleteConfirmOpen(false);
                onDelete?.(task.id);
              }}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                fontSize: 14,
                borderRadius: "8px",
                py: 0.75,
                px: 2,
                boxShadow: "none",
                "&:hover": { boxShadow: "none" },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {isEditing ? (
          <>
            <Box sx={{ mb: 1.5 }}>
              <TextField
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Task title..."
                size="small"
                fullWidth
                multiline
                minRows={2}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    bgcolor: "background.paper",
                    fontSize: 17,
                    "& fieldset": {
                      border: "none",
                    },
                    "&.MuiOutlinedInput-root": {
                      boxShadow: "none",
                      "&.Mui-focused": {
                        boxShadow: "none",
                      },
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
              <Box
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.stopPropagation();
                  setPriorityAnchor(e.currentTarget);
                }}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "8px",
                  border: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  bgcolor: "background.paper",
                  position: "relative",
                  "&:hover": {
                    borderColor: "divider",
                    bgcolor: "background.default",
                  },
                }}
              >
                <FlagOutlinedIcon sx={{ fontSize: 18, color: currentPriority.color }} />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -2,
                    right: -2,
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    bgcolor: currentPriority.color,
                  }}
                />
              </Box>

              <Menu
                anchorEl={priorityAnchor}
                open={Boolean(priorityAnchor)}
                onClose={() => setPriorityAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <MenuItem
                    key={option.value}
                    selected={editPriority === option.value}
                    onClick={() => handlePrioritySelect(option.value)}
                    sx={{ gap: 1.5, py: 1, px: 2 }}
                  >
                    <Box
                      sx={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        bgcolor: option.color,
                      }}
                    />
                    <Typography sx={{ fontSize: 14, fontWeight: 600, textTransform: "capitalize" }}>
                      {option.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>

              <Box
                sx={{
                  position: "relative",
                  width: 40,
                  height: 40,
                  borderRadius: "8px",
                  border: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  bgcolor: "background.paper",
                  color: editDueDate ? "text.primary" : "text.secondary",
                  "&:hover": {
                    borderColor: "divider",
                    bgcolor: "background.default",
                  },
                }}
              >
                <CalendarTodayOutlinedIcon sx={{ fontSize: 18 }} />
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0,
                    cursor: "pointer",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </Box>

              <Box sx={{ flex: 1 }} />

              <Button
                size="small"
                onClick={cancelEditing}
                sx={{
                  color: "text.secondary",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 14,
                  borderRadius: "8px",
                  py: 0.5,
                  px: 1.5,
                  "&:hover": { bgcolor: "divider", color: "text.primary" },
                }}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={saveEditing}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 14,
                  borderRadius: "8px",
                  py: 0.5,
                  px: 1.5,
                  boxShadow: "none",
                  "&:hover": { boxShadow: "none" },
                }}
              >
                Save
              </Button>
            </Box>
          </>
        ) : (
          <>
            {/* Task Title */}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: 17,
                lineHeight: 1.6,
                color: "text.primary",
                mb: task.due_date ? 1.5 : 0,
                pr: 5,
              }}
            >
              {task.title}
            </Typography>

            {/* Due Date */}
            {task.due_date && (
              <Box sx={{ mb: 1.5 }}>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 12, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.5, display: "block" }}
                >
                  Due Date
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 13, color: "text.disabled", mt: 0.25, display: "block" }}
                >
                  {new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </Typography>
                <Box sx={{ borderTop: "1px solid", borderColor: "divider", mt: 1 }} />
              </Box>
            )}

            {/* Priority */}
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: "6px",
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                bgcolor: "background.paper",
                ml: "auto",
              }}
            >
              <FlagOutlinedIcon sx={{ fontSize: 15, color: priorityColor }} />
              <Box
                sx={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: priorityColor,
                }}
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
