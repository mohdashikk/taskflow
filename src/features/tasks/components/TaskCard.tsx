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
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { alpha, useTheme } from "@mui/material/styles";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { motion, AnimatePresence } from "framer-motion";
import type { TaskRow } from "../services/tasksService";
import PriorityBars, { getPriorityOption, PRIORITY_OPTIONS } from "./PriorityBars";
import AppDatePicker from "@/components/inputs/AppDatePicker";

interface TaskCardProps {
  task: TaskRow;
  onEdit?: (task: TaskRow) => void;
  onDelete?: (taskId: string) => void;
  onUpdate?: (taskId: string, updates: { title?: string; priority?: string; due_date?: string | null; status_id?: string }) => void;
  tags?: Array<{ label: string; color?: string }>;
  assignee?: { name: string; avatarUrl?: string } | null;
}

export default function TaskCard({ task, onEdit: _onEdit, onDelete, onUpdate, tags: _tags, assignee }: TaskCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDueDate, setEditDueDate] = useState(task.due_date || "");
  const [priorityAnchor, setPriorityAnchor] = useState<null | HTMLElement>(null);

  const currentPriority = getPriorityOption(editPriority);
  const displayedPriority = getPriorityOption(task.priority);

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

  const cardBg = isDark ? "#12101e" : "#FFFFFF";
  const cardBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const cardShadow = isDark ? "0 2px 8px rgba(0,0,0,.18)" : "0 2px 6px rgba(15,23,42,.04)";
  const hoverBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const cardHoverShadow = isDark ? "0 8px 24px rgba(0,0,0,.18)" : "0 8px 24px rgba(0,0,0,0.08)";

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
      transition={{
        layout: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
      }}
      {...attributes}
      {...listeners}
      data-sortable="true"
    >
      <Box
        sx={{
          bgcolor: cardBg,
          borderRadius: "12px",
          border: `1px solid ${cardBorder}`,
          boxShadow: cardShadow,
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 16,
            left: 0,
            width: 3,
            height: 24,
            borderRadius: "0 3px 3px 0",
            bgcolor: displayedPriority.color,
          },
          cursor: "grab",
          transition: "box-shadow 200ms ease-in-out, border-color 200ms ease-in-out, transform 200ms ease-in-out",
          "&:active": {
            cursor: "grabbing",
          },
          "&:hover": {
            boxShadow: cardHoverShadow,
            borderColor: hoverBorder,
          },
        }}
      >
        <Box sx={{ p: 2, position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                if (isEditing) return;
                setMenuAnchor(e.currentTarget);
              }}
              aria-label="Task options"
              sx={{
                width: 28,
                height: 28,
                color: theme.palette.text.secondary,
                borderRadius: "8px",
                "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: theme.palette.text.primary },
              }}
            >
              <MoreVertOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                sx: {
                  bgcolor: isDark ? "#232135" : "#FFFFFF",
                  backdropFilter: "blur(24px)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : theme.palette.divider}`,
                  boxShadow: theme.palette.mode === "dark" ? "0 10px 30px rgba(0,0,0,.25)" : theme.shadows[4],
                }
              }
            }}
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
              sx={{ fontSize: 14, py: 1, px: 2, color: theme.palette.error.main, borderRadius: 1, mx: 0.5 }}
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
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.palette.mode === "dark" ? "0 24px 64px rgba(0,0,0,.4)" : "0 24px 64px rgba(15, 23, 42, 0.12)",
              },
            }}
          >
            <DialogTitle sx={{ fontSize: 18, fontWeight: 700, color: "text.primary" }}>
              Delete Task
            </DialogTitle>
            <DialogContent>
              <Typography sx={{ fontSize: 15, color: "text.secondary", lineHeight: 1.6 }}>
                Are you sure you want to delete <strong>&quot;{task.title}&quot;</strong>? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5, pt: 0 }}>
              <Button
                onClick={() => setDeleteConfirmOpen(false)}
                sx={{
                  color: "text.secondary",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: 14,
                  borderRadius: "10px",
                  py: 0.75,
                  px: 2,
                  "&:hover": { bgcolor: theme.palette.action.hover, color: "text.primary" },
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
                  bgcolor: theme.palette.error.main,
                  boxShadow: "none",
                  "&:hover": { boxShadow: "none", bgcolor: alpha(theme.palette.error.main, 0.9) },
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
                        bgcolor: isDark ? "rgba(0,0,0,0.2)" : "#F7F8FA",
                        fontSize: 16,
                        color: "text.primary",
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
                      border: `1px solid ${cardBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      bgcolor: isDark ? "rgba(0,0,0,0.2)" : "#F7F8FA",
                      position: "relative",
                      transition: "all 120ms ease",
                      "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" },
                    }}
                  >
                    <PriorityBars priority={editPriority} color={currentPriority.color} size={18} />
                  </Box>

                  <Menu
                    anchorEl={priorityAnchor}
                    open={Boolean(priorityAnchor)}
                    onClose={() => setPriorityAnchor(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    slotProps={{
                      paper: {
                        sx: {
                          bgcolor: isDark ? "#232135" : "#FFFFFF",
                          backdropFilter: "blur(24px)",
                          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : theme.palette.divider}`,
                          boxShadow: theme.palette.mode === "dark" ? "0 10px 30px rgba(0,0,0,.25)" : theme.shadows[4],
                        }
                      }
                    }}
                  >
                    {PRIORITY_OPTIONS.map((option) => (
                      <MenuItem
                        key={option.value}
                        selected={editPriority === option.value}
                        onClick={() => handlePrioritySelect(option.value)}
                        sx={{ gap: 1.5, py: 1, px: 2, borderRadius: 1, mx: 0.5 }}
                      >
                        <PriorityBars priority={option.value} color={option.color} size={18} />
                        <Typography sx={{ fontSize: 14, fontWeight: 600, textTransform: "capitalize" }}>
                          {option.label}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Menu>

                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      border: `1px solid ${cardBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      bgcolor: isDark ? "rgba(0,0,0,0.2)" : "#F7F8FA",
                      color: editDueDate ? "text.primary" : "text.secondary",
                      transition: "all 120ms ease",
                      "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" },
                    }}
                  >
                    <AppDatePicker
                      value={editDueDate}
                      onChange={setEditDueDate}
                      label="Due date"
                      compact
                      compactSize={40}
                    />
                  </Box>

                  <Box sx={{ flex: 1 }} />

                  <Button
                    size="small"
                    onClick={cancelEditing}
                    sx={{
                      color: "text.secondary",
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: 14,
                      borderRadius: "10px",
                      py: 0.5,
                      px: 1.5,
                      "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: "text.primary" },
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
                      bgcolor: "primary.main",
                      boxShadow: "none",
                      "&:hover": { boxShadow: "none", bgcolor: theme.palette.primary.dark },
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
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: 14,
                      pr: 4,
                      lineHeight: 1.5,
                      color: "text.primary",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflowWrap: "anywhere",
                      minHeight: 42,
                    }}
                  >
                    {task.title}
                  </Typography>

                  <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto auto", alignItems: "center", columnGap: 1, mt: 1.5, pt: 1.25, borderTop: "1px solid", borderColor: "divider", minHeight: 28 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0 }}>
                      <CalendarTodayOutlinedIcon sx={{ fontSize: 14, flexShrink: 0, color: theme.palette.text.secondary }} />
                      <Typography sx={{ fontSize: 12, fontWeight: 500, color: "text.secondary", lineHeight: 1.4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {task.due_date
                          ? new Date(task.due_date + "T00:00:00").toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "No date"}
                      </Typography>
                    </Box>
                    <Box aria-label={`${displayedPriority.label} priority`} sx={{ display: "flex", alignItems: "center", gap: 0.625, whiteSpace: "nowrap", px: 0.75, py: 0.375, borderRadius: "6px", bgcolor: alpha(displayedPriority.color, 0.08) }}>
                      <PriorityBars priority={task.priority} color={displayedPriority.color} size={14} />
                      <Typography sx={{ fontSize: 12, fontWeight: 500, color: "text.secondary", lineHeight: 1.4, textTransform: "capitalize" }}>
                        {displayedPriority.label}
                      </Typography>
                    </Box>
                    {assignee && (
                      <Tooltip title={`Assigned to ${assignee.name}`} arrow>
                        <Avatar
                          src={assignee.avatarUrl}
                          alt={assignee.name}
                          sx={{
                            width: 26,
                            height: 26,
                            flexShrink: 0,
                            bgcolor: alpha(theme.palette.primary.main, 0.14),
                            color: "primary.main",
                            fontSize: 11,
                            fontWeight: 700,
                            border: "2px solid",
                            borderColor: "background.paper",
                          }}
                        >
                          {assignee.name.charAt(0).toUpperCase()}
                        </Avatar>
                      </Tooltip>
                    )}
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
