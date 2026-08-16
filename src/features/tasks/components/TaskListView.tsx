"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { motion, AnimatePresence } from "framer-motion";
import type { TaskRow } from "../services/tasksService";
import type { ProjectStatusRow } from "@/features/projects/data/mockData";

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

interface TaskListViewProps {
  tasks: TaskRow[];
  statuses: ProjectStatusRow[];
  onCreate?: (values: { title: string; status_id: string; priority: string; due_date: string | null }) => void;
  createPending?: boolean;
  onEdit?: (task: TaskRow) => void;
  onDelete?: (taskId: string) => void;
  onUpdate?: (taskId: string, updates: { title?: string; priority?: string; due_date?: string | null; status_id?: string }) => void;
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TaskListView({
  tasks,
  statuses,
  onCreate,
  createPending,
  onEdit,
  onDelete,
  onUpdate,
}: TaskListViewProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [editingTask, setEditingTask] = useState<TaskRow | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [editDueDate, setEditDueDate] = useState("");
  const [priorityAnchor, setPriorityAnchor] = useState<null | HTMLElement>(null);
  const [menuTaskId, setMenuTaskId] = useState<string | null>(null);

  const statusMap = new Map(statuses.map((s) => [s.id, s]));

  const currentPriority = PRIORITY_OPTIONS.find((p) => p.value === newPriority) ?? PRIORITY_OPTIONS[1];
  const editingPriorityOption = PRIORITY_OPTIONS.find((p) => p.value === editPriority) ?? PRIORITY_OPTIONS[1];

  const handleAddClick = () => {
    setIsAdding(true);
    setNewTitle("");
    setNewPriority("medium");
  };

  const handleAddSubmit = () => {
    const trimmed = newTitle.trim() || "Untitled task";
    const defaultStatusId = statuses[0]?.id ?? "";
    if (defaultStatusId && onCreate) {
      onCreate({
        title: trimmed,
        status_id: defaultStatusId,
        priority: newPriority,
        due_date: null,
      });
    }
    setIsAdding(false);
    setNewTitle("");
    setNewPriority("medium");
  };

  const handleAddCancel = () => {
    setIsAdding(false);
    setNewTitle("");
    setNewPriority("medium");
  };

  const startEditing = (task: TaskRow) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditDueDate(task.due_date || "");
    setMenuAnchor(null);
    setMenuTaskId(null);
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setEditTitle("");
    setEditPriority("medium");
    setEditDueDate("");
  };

  const saveEditing = () => {
    const trimmed = editTitle.trim() || "Untitled task";
    if (editingTask && onUpdate) {
      onUpdate(editingTask.id, {
        title: trimmed,
        priority: editPriority,
        due_date: editDueDate || null,
      });
    }
    setEditingTask(null);
    setEditTitle("");
    setEditPriority("medium");
    setEditDueDate("");
  };

  const handleDeleteClick = (taskId: string) => {
    setDeleteTaskId(taskId);
    setDeleteConfirmOpen(true);
    setMenuAnchor(null);
    setMenuTaskId(null);
  };

  const confirmDelete = () => {
    if (deleteTaskId && onDelete) {
      onDelete(deleteTaskId);
    }
    setDeleteConfirmOpen(false);
    setDeleteTaskId(null);
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, taskId: string) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setMenuTaskId(taskId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuTaskId(null);
  };

  const cardBg = isDark ? "#12101e" : "#FFFFFF";
  const cardBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const rowHoverBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)";
  const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  const sortedTasks = [...tasks].sort((a, b) => a.position - b.position);

  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer
        sx={{
          bgcolor: cardBg,
          borderRadius: "16px",
          border: `1px solid ${cardBorder}`,
          boxShadow: isDark ? "0 8px 24px rgba(0,0,0,.18)" : "0 8px 24px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        <Table size="small" sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                borderBottom: `1px solid ${borderColor}`,
              }}
            >
              <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "text.secondary", py: 1.5, pl: 2 }}>
                Task
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "text.secondary", py: 1.5 }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "text.secondary", py: 1.5 }}>
                Priority
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "text.secondary", py: 1.5 }}>
                Start Date
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "text.secondary", py: 1.5 }}>
                Due Date
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "text.secondary", py: 1.5 }}>
                Created At
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "text.secondary", py: 1.5, pr: 2, width: 60 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {isAdding && (
              <TableRow
                sx={{
                  bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
                  borderBottom: `1px solid ${borderColor}`,
                }}
              >
                <TableCell sx={{ py: 1.5, pl: 2 }}>
                  <TextField
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSubmit();
                      } else if (e.key === "Escape") {
                        handleAddCancel();
                      }
                    }}
                    placeholder="Task title..."
                    size="small"
                    fullWidth
                    autoFocus
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        bgcolor: isDark ? "rgba(0,0,0,0.2)" : "#F7F8FA",
                        fontSize: 14,
                        color: "text.primary",
                        "& fieldset": { border: "none" },
                        "&.Mui-focused": { boxShadow: "none" },
                      },
                    }}
                  />
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                    {statuses[0]?.name || "—"}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <Box
                    onClick={(e) => {
                      e.stopPropagation();
                      setPriorityAnchor(e.currentTarget);
                    }}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.75,
                      px: 1,
                      py: 0.5,
                      borderRadius: "8px",
                      cursor: "pointer",
                      bgcolor: isDark ? "rgba(0,0,0,0.2)" : "#F7F8FA",
                      border: `1px solid ${cardBorder}`,
                      transition: "all 120ms ease",
                      "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" },
                    }}
                  >
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: currentPriority.color }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 500, color: "text.primary", textTransform: "capitalize" }}>
                      {currentPriority.label}
                    </Typography>
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
                          boxShadow: isDark ? "0 10px 30px rgba(0,0,0,.25)" : theme.shadows[4],
                        },
                      },
                    }}
                  >
                    {PRIORITY_OPTIONS.map((option) => (
                      <MenuItem
                        key={option.value}
                        selected={newPriority === option.value}
                        onClick={() => {
                          setNewPriority(option.value);
                          setPriorityAnchor(null);
                        }}
                        sx={{ gap: 1.5, py: 1, px: 2, borderRadius: 1, mx: 0.5 }}
                      >
                        <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: option.color }} />
                        <Typography sx={{ fontSize: 14, fontWeight: 600, textTransform: "capitalize" }}>
                          {option.label}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>—</Typography>
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>—</Typography>
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>—</Typography>
                </TableCell>
                <TableCell sx={{ py: 1.5, pr: 2 }}>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={handleAddCancel}
                      sx={{
                        width: 32,
                        height: 32,
                        color: "text.secondary",
                        borderRadius: "8px",
                        "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: "text.primary" },
                      }}
                    >
                      <CloseOutlinedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={handleAddSubmit}
                      disabled={createPending}
                      sx={{
                        width: 32,
                        height: 32,
                        color: "primary.main",
                        borderRadius: "8px",
                        "&:hover": { bgcolor: "primary.main", color: "primary.contrastText" },
                        "&.Mui-disabled": { color: isDark ? "#4B5563" : "#D1D5DB" },
                      }}
                    >
                      <SendOutlinedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            )}
            {sortedTasks.length === 0 && !isAdding ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ borderBottom: "none" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      py: 6,
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        bgcolor: isDark ? "#1C1929" : "action.hover",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 1.5,
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="text.secondary"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </Box>
                    <Typography sx={{ fontWeight: 600, color: "text.primary", fontSize: 14, mb: 0.5 }}>
                      No tasks yet
                    </Typography>
                    <Typography sx={{ color: "text.secondary", fontSize: 13, lineHeight: 1.5, maxWidth: 280 }}>
                      Create tasks to see them listed here.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              sortedTasks.map((task) => {
                const isEditing = editingTask?.id === task.id;
                const statusRow = statusMap.get(task.status_id);
                const statusName = statusRow?.name ?? "—";
                const statusColor = statusRow?.color ?? "#6B7280";
                const priorityColor = PRIORITY_COLORS[task.priority] ?? "#64748B";
                const priorityLabel = PRIORITY_OPTIONS.find((p) => p.value === task.priority)?.label ?? "Medium";

                if (isEditing) {
                  return (
                    <TableRow
                      key={task.id}
                      sx={{
                        bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
                        borderBottom: `1px solid ${borderColor}`,
                      }}
                    >
                      <TableCell sx={{ py: 1.5, pl: 2 }}>
                        <TextField
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              saveEditing();
                            } else if (e.key === "Escape") {
                              cancelEditing();
                            }
                          }}
                          placeholder="Task title..."
                          size="small"
                          fullWidth
                          multiline
                          minRows={1}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "10px",
                              bgcolor: isDark ? "rgba(0,0,0,0.2)" : "#F7F8FA",
                              fontSize: 14,
                              color: "text.primary",
                              "& fieldset": { border: "none" },
                              "&.Mui-focused": { boxShadow: "none" },
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{statusName}</Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Box
                          onClick={(e) => {
                            e.stopPropagation();
                            setPriorityAnchor(e.currentTarget);
                          }}
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.75,
                            px: 1,
                            py: 0.5,
                            borderRadius: "8px",
                            cursor: "pointer",
                            bgcolor: isDark ? "rgba(0,0,0,0.2)" : "#F7F8FA",
                            border: `1px solid ${cardBorder}`,
                            transition: "all 120ms ease",
                            "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" },
                          }}
                        >
                          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: editingPriorityOption.color }} />
                          <Typography sx={{ fontSize: 13, fontWeight: 500, color: "text.primary", textTransform: "capitalize" }}>
                            {editingPriorityOption.label}
                          </Typography>
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
                                boxShadow: isDark ? "0 10px 30px rgba(0,0,0,.25)" : theme.shadows[4],
                              },
                            },
                          }}
                        >
                          {PRIORITY_OPTIONS.map((option) => (
                            <MenuItem
                              key={option.value}
                              selected={editPriority === option.value}
                              onClick={() => {
                                setEditPriority(option.value);
                                setPriorityAnchor(null);
                              }}
                              sx={{ gap: 1.5, py: 1, px: 2, borderRadius: 1, mx: 0.5 }}
                            >
                              <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: option.color }} />
                              <Typography sx={{ fontSize: 14, fontWeight: 600, textTransform: "capitalize" }}>
                                {option.label}
                              </Typography>
                            </MenuItem>
                          ))}
                        </Menu>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Box
                          sx={{
                            position: "relative",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                            px: 1,
                            py: 0.5,
                            borderRadius: "8px",
                            bgcolor: isDark ? "rgba(0,0,0,0.2)" : "#F7F8FA",
                            border: `1px solid ${cardBorder}`,
                            cursor: "pointer",
                            transition: "all 120ms ease",
                            "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" },
                          }}
                        >
                          <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: editDueDate ? "text.primary" : "text.secondary" }} />
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
                          {editDueDate && (
                            <Typography sx={{ fontSize: 13, color: "text.primary", fontWeight: 500 }}>
                              {formatDate(editDueDate)}
                            </Typography>
                          )}
                        </Box>
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                            {task.start_date ? formatDate(task.start_date) : "—"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                            {task.created_at ? formatDate(task.created_at) : "—"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1.5, pr: 2 }}>
                         <Box sx={{ display: "flex", gap: 0.5 }}>
                           <IconButton
                             size="small"
                             onClick={cancelEditing}
                             sx={{
                               width: 32,
                               height: 32,
                               color: "text.secondary",
                               borderRadius: "8px",
                               "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: "text.primary" },
                             }}
                           >
                             <CloseOutlinedIcon sx={{ fontSize: 16 }} />
                           </IconButton>
                           <IconButton
                             size="small"
                             onClick={saveEditing}
                             sx={{
                               width: 32,
                               height: 32,
                               color: "primary.main",
                               borderRadius: "8px",
                               "&:hover": { bgcolor: "primary.main", color: "primary.contrastText" },
                             }}
                           >
                             <SendOutlinedIcon sx={{ fontSize: 16 }} />
                           </IconButton>
                         </Box>
                       </TableCell>
                     </TableRow>
                   );
                 }

                return (
                  <TableRow
                    key={task.id}
                    hover
                    sx={{
                      borderBottom: `1px solid ${borderColor}`,
                      transition: "background-color 150ms ease",
                      "&:hover": { bgcolor: rowHoverBg },
                      "&:last-child": { borderBottom: "none" },
                    }}
                  >
                    <TableCell sx={{ py: 1.5, pl: 2 }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: 14,
                          lineHeight: 1.4,
                          color: "text.primary",
                        }}
                      >
                        {task.title}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.5,
                          color: statusColor,
                          bgcolor: alpha(statusColor, 0.1),
                          fontWeight: 600,
                          fontSize: 12,
                          borderRadius: "10px",
                          px: 1.25,
                          py: 0.25,
                          lineHeight: 1.4,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: statusColor }} />
                        {statusName}
                      </Box>
                    </TableCell>
                     <TableCell sx={{ py: 1.5 }}>
                       <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                         <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: priorityColor }} />
                         <Typography sx={{ fontSize: 13, fontWeight: 500, color: "text.secondary", textTransform: "capitalize" }}>
                           {priorityLabel}
                         </Typography>
                       </Box>
                     </TableCell>
                     <TableCell sx={{ py: 1.5 }}>
                       {task.start_date ? (
                         <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                           <CalendarTodayOutlinedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                           <Typography sx={{ fontSize: 13, fontWeight: 500, color: "text.secondary", lineHeight: 1.4 }}>
                             {formatDate(task.start_date)}
                           </Typography>
                         </Box>
                       ) : (
                         <Typography sx={{ fontSize: 13, color: "text.secondary" }}>—</Typography>
                       )}
                     </TableCell>
                     <TableCell sx={{ py: 1.5 }}>
                       {task.due_date ? (
                         <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                           <CalendarTodayOutlinedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                           <Typography sx={{ fontSize: 13, fontWeight: 500, color: "text.secondary", lineHeight: 1.4 }}>
                             {formatDate(task.due_date)}
                           </Typography>
                         </Box>
                       ) : (
                         <Typography sx={{ fontSize: 13, color: "text.secondary" }}>—</Typography>
                       )}
                     </TableCell>
                     <TableCell sx={{ py: 1.5 }}>
                       <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                         {task.created_at ? formatDate(task.created_at) : "—"}
                       </Typography>
                     </TableCell>
                     <TableCell sx={{ py: 1.5, pr: 2, width: 60 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, task.id)}
                        aria-label="Task options"
                        sx={{
                          width: 28,
                          height: 28,
                          color: "text.secondary",
                          borderRadius: "8px",
                          "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: "text.primary" },
                        }}
                      >
                        <MoreVertOutlinedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <Menu
                        anchorEl={menuAnchor}
                        open={Boolean(menuAnchor) && menuTaskId === task.id}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                        slotProps={{
                          paper: {
                            sx: {
                              bgcolor: isDark ? "#232135" : "#FFFFFF",
                              backdropFilter: "blur(24px)",
                              border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : theme.palette.divider}`,
                              boxShadow: isDark ? "0 10px 30px rgba(0,0,0,.25)" : theme.shadows[4],
                            },
                          },
                        }}
                      >
                        <MenuItem
                          onClick={() => {
                            handleMenuClose();
                            startEditing(task);
                          }}
                          sx={{ fontSize: 14, py: 1, px: 2, borderRadius: 1, mx: 0.5 }}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleDeleteClick(task.id);
                          }}
                          sx={{ fontSize: 14, py: 1, px: 2, color: theme.palette.error.main, borderRadius: 1, mx: 0.5 }}
                        >
                          Delete
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: isDark ? "0 24px 64px rgba(0,0,0,.4)" : "0 24px 64px rgba(15, 23, 42, 0.12)",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: 18, fontWeight: 700, color: "text.primary" }}>
          Delete Task
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 15, color: "text.secondary", lineHeight: 1.6 }}>
            Are you sure you want to delete <strong>&quot;{deleteTaskId ? tasks.find((t) => t.id === deleteTaskId)?.title ?? "" : ""}&quot;</strong>? This action cannot be undone.
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
            onClick={confirmDelete}
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
    </Box>
  );
}
