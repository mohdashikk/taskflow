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
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { TaskRow } from "../services/tasksService";

interface TaskCardProps {
  task: TaskRow;
  onEdit?: (task: TaskRow) => void;
  onDelete?: (taskId: string) => void;
  onUpdate?: (taskId: string, updates: { title?: string; priority?: string; due_date?: string | null; status_id?: string }) => void;
  tags?: Array<{ label: string; color?: string }>;
  assignee?: { name: string; avatarUrl?: string } | null;
}

const PRIORITY_OPTIONS = [
  { value: "high", label: "High", color: "#EF4444" },
  { value: "medium", label: "Medium", color: "#F59E0B" },
  { value: "low", label: "Low", color: "#64748B" },
] as const;

const PRIORITY_COLORS: Record<string, string> = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#64748B",
};

const TAG_STYLES: Record<string, { bg: string; fg: string }> = {
  Bug: { bg: "#FEE2E2", fg: "#991B1B" },
  Feature: { bg: "#DBEAFE", fg: "#1E40AF" },
  Design: { bg: "#FCE7F3", fg: "#9D174D" },
  Improvement: { bg: "#D1FAE5", fg: "#065F46" },
  Docs: { bg: "#FEF3C7", fg: "#92400E" },
};

function getTagStyle(label: string): { bg: string; fg: string } {
  return TAG_STYLES[label] || { bg: "#F1F5F9", fg: "#334155" };
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getDueDateStatus(dueDate: string | null): "overdue" | "upcoming" | "normal" {
  if (!dueDate) return "normal";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + "T00:00:00");
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "overdue";
  if (diffDays <= 2) return "upcoming";
  return "normal";
}

export default function TaskCard({ task, onEdit: _onEdit, onDelete, onUpdate, tags, assignee }: TaskCardProps) {
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

  const dueStatus = getDueDateStatus(task.due_date);
  const cardTags = tags && tags.length > 0 ? tags.slice(0, 2) : [];

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
      whileHover={{ y: -2 }}
      transition={{
        layout: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
      }}
      {...attributes}
      {...listeners}
    >
      <Box
        sx={{
          bgcolor: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid",
          borderColor: isDragging ? "#006F99" : "#E6E8EB",
          boxShadow: isDragging
            ? "0 12px 32px rgba(0, 0, 0, 0.12)"
            : "0 1px 3px rgba(0, 0, 0, 0.04)",
          position: "relative",
          cursor: "grab",
          transition: "box-shadow 200ms ease, border-color 200ms ease",
          overflow: "hidden",
          "&:active": {
            cursor: "grabbing",
          },
        }}
      >
        {/* Priority strip */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 12,
            bottom: 12,
            width: 3,
            borderRadius: 2,
            bgcolor: priorityColor,
            opacity: 0.7,
          }}
        />

        <Box sx={{ p: 2.5, position: "relative" }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              if (isEditing) return;
              setMenuAnchor(e.currentTarget);
            }}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 28,
              height: 28,
              color: "#6B7280",
              borderRadius: 2,
              "&:hover": { bgcolor: "#F2F4F7", color: "#111827" },
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
              sx={{ fontSize: 14, py: 1, px: 2, borderRadius: 1, mx: 0.5 }}
            >
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                setMenuAnchor(null);
                setDeleteConfirmOpen(true);
              }}
              sx={{ fontSize: 14, py: 1, px: 2, color: "#EF4444", borderRadius: 1, mx: 0.5 }}
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
                borderRadius: "20px",
                border: "1px solid #E6E8EB",
                boxShadow: "0 24px 64px rgba(15, 23, 42, 0.12)",
              },
            }}
          >
            <DialogTitle sx={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
              Delete Task
            </DialogTitle>
            <DialogContent>
              <Typography sx={{ fontSize: 15, color: "#6B7280", lineHeight: 1.6 }}>
                Are you sure you want to delete <strong>&quot;{task.title}&quot;</strong>? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5, pt: 0 }}>
              <Button
                onClick={() => setDeleteConfirmOpen(false)}
                sx={{
                  color: "#6B7280",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: 14,
                  borderRadius: "10px",
                  py: 0.75,
                  px: 2,
                  "&:hover": { bgcolor: "#F2F4F7", color: "#111827" },
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
                  fontWeight: 600,
                  fontSize: 14,
                  borderRadius: "10px",
                  py: 0.75,
                  px: 2,
                  bgcolor: "#EF4444",
                  boxShadow: "none",
                  "&:hover": { boxShadow: "none", bgcolor: "#DC2626" },
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
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
                        borderRadius: "10px",
                        bgcolor: "#F7F8FA",
                        fontSize: 16,
                        "& fieldset": { border: "none" },
                        "&.Mui-focused": { boxShadow: "none" },
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
                      borderRadius: "10px",
                      border: "1px solid #E6E8EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      bgcolor: "#F7F8FA",
                      position: "relative",
                      transition: "all 120ms ease",
                      "&:hover": { bgcolor: "#F2F4F7" },
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
                        sx={{ gap: 1.5, py: 1, px: 2, borderRadius: 1, mx: 0.5 }}
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
                      borderRadius: "10px",
                      border: "1px solid #E6E8EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      bgcolor: "#F7F8FA",
                      color: editDueDate ? "#111827" : "#6B7280",
                      transition: "all 120ms ease",
                      "&:hover": { bgcolor: "#F2F4F7" },
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
                      color: "#6B7280",
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: 14,
                      borderRadius: "10px",
                      py: 0.5,
                      px: 1.5,
                      "&:hover": { bgcolor: "#F2F4F7", color: "#111827" },
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
                      fontWeight: 600,
                      fontSize: 14,
                      borderRadius: "10px",
                      py: 0.5,
                      px: 1.5,
                      bgcolor: "#006F99",
                      boxShadow: "none",
                      "&:hover": { boxShadow: "none", bgcolor: "#005670" },
                    }}
                  >
                    Save
                  </Button>
                </Box>
              </motion.div>
            ) : (
              <motion.div
                key="display"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {/* Task Title */}
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: "#111827",
                    mb: cardTags.length > 0 ? 1.5 : (task.due_date ? 1.5 : 0),
                    pr: 5,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {task.title}
                </Typography>

                {/* Tags */}
                {cardTags.length > 0 && (
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: task.due_date ? 1.5 : 0 }}>
                    {cardTags.map((tag, idx) => {
                      const style = getTagStyle(tag.label);
                      return (
                        <Box
                          key={idx}
                          sx={{
                            px: 1,
                            py: 0.25,
                            borderRadius: "8px",
                            bgcolor: tag.color || style.bg,
                            color: style.fg,
                            fontSize: 11,
                            fontWeight: 600,
                            lineHeight: 1.4,
                            letterSpacing: 0.2,
                            textTransform: "capitalize",
                          }}
                        >
                          {tag.label}
                        </Box>
                      );
                    })}
                  </Box>
                )}

                {/* Due Date */}
                {task.due_date && (
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <CalendarTodayOutlinedIcon
                        sx={{
                          fontSize: 12,
                          color:
                            dueStatus === "overdue"
                              ? "#EF4444"
                              : dueStatus === "upcoming"
                                ? "#F59E0B"
                                : "#9CA3AF",
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: dueStatus === "overdue" ? 700 : 500,
                          color:
                            dueStatus === "overdue"
                              ? "#EF4444"
                              : dueStatus === "upcoming"
                                ? "#F59E0B"
                                : "#9CA3AF",
                        }}
                      >
                        {new Date(task.due_date + "T00:00:00").toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Bottom row: assignee + priority flag */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {assignee && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          bgcolor: assignee.avatarUrl ? "transparent" : "#006F99",
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 700,
                          overflow: "hidden",
                          flexShrink: 0,
                          position: "relative",
                        }}
                      >
                        {assignee.avatarUrl ? (
                          <Image
                            src={assignee.avatarUrl}
                            alt={assignee.name}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="24px"
                          />
                        ) : (
                          getInitials(assignee.name)
                        )}
                      </Box>
                      <Typography sx={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>
                        {assignee.name}
                      </Typography>
                    </Box>
                  )}
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "8px",
                      border: "1px solid #E6E8EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      bgcolor: "#F7F8FA",
                      ml: "auto",
                    }}
                  >
                    <FlagOutlinedIcon sx={{ fontSize: 14, color: priorityColor }} />
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
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </motion.div>
  );
}
