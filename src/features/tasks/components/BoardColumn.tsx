"use client";

import { useState, useRef, useEffect, Fragment } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme, alpha } from "@mui/material/styles";
import type { TaskRow } from "../services/tasksService";
import TaskCard from "./TaskCard";
import EmptyColumn from "./EmptyColumn";

interface BoardColumnProps {
  statusId: string;
  statusName: string;
  tasks: TaskRow[];
  onCreate: (values: { title: string; status_id: string; priority: string; due_date: string | null }) => void;
  createPending?: boolean;
  onEditTask?: (task: TaskRow) => void;
  onDeleteTask?: (taskId: string) => void;
  onDeleteColumn?: (statusId: string) => void;
  onUpdateTask?: (taskId: string, updates: { title?: string; priority?: string; due_date?: string | null; status_id?: string }) => void;
  wipLimit?: number;
  activeTaskId?: string;
  isDragOver?: boolean;
  dragOverIndex?: number;
}

const PRIORITY_OPTIONS = [
  { value: "high", label: "High", color: "#EF4444" },
  { value: "medium", label: "Medium", color: "#F59E0B" },
  { value: "low", label: "Low", color: "#64748B" },
] as const;

export default function BoardColumn({
  statusId,
  statusName,
  tasks,
  onCreate,
  createPending,
  onEditTask,
  onDeleteTask,
  onDeleteColumn,
  onUpdateTask,
  wipLimit = 0,
  activeTaskId,
  isDragOver = false,
  dragOverIndex = -1,
}: BoardColumnProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [quickTitle, setQuickTitle] = useState("");
  const [priority, setPriority] = useState<string>("medium");
  const [dueDate, setDueDate] = useState<string>("");
  const [priorityAnchor, setPriorityAnchor] = useState<null | HTMLElement>(null);
  const [columnMenuAnchor, setColumnMenuAnchor] = useState<null | HTMLElement>(null);

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({ id: statusId });
  const inputRef = useRef<HTMLInputElement>(null);

  const currentPriority = PRIORITY_OPTIONS.find((p) => p.value === priority) ?? PRIORITY_OPTIONS[1];

  useEffect(() => {
    if (isQuickAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isQuickAdding]);

  const handleQuickAddClick = () => {
    setIsQuickAdding(true);
    setQuickTitle("");
    setPriority("medium");
    setDueDate("");
  };

  const handleQuickAddCancel = () => {
    setIsQuickAdding(false);
    setQuickTitle("");
    setPriority("medium");
    setDueDate("");
  };

  const handleQuickAddSubmit = () => {
    const trimmed = quickTitle.trim() || "Untitled task";
    onCreate({
      title: trimmed,
      status_id: statusId,
      priority,
      due_date: dueDate || null,
    });
    setIsQuickAdding(false);
    setQuickTitle("");
    setPriority("medium");
    setDueDate("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleQuickAddSubmit();
    } else if (e.key === "Escape") {
      handleQuickAddCancel();
    }
  };

  const handlePrioritySelect = (value: string) => {
    setPriority(value);
    setPriorityAnchor(null);
  };

  const isOverWipLimit = wipLimit > 0 && tasks.length >= wipLimit;

  const columnBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const columnShadow = isDark ? "0 8px 24px rgba(0,0,0,.18)" : "0 8px 24px rgba(0,0,0,0.04)";
  const menuBg = isDark ? "#232135" : "#FFFFFF";
  const menuBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const mutedText = isDark ? "#B5B7C8" : "#6B7280";

  return (
    <Box
      ref={setDroppableRef}
      sx={{
        width: { xs: 300, sm: 320 },
        flex: "0 0 auto",
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 200px)",
        minWidth: { xs: 300, sm: 320 },
        borderRadius: "14px",
        transition: "box-shadow 150ms ease, background-color 150ms ease, border-color 150ms ease",
        border: `2px solid transparent`,
        ...(isOver || isDragOver ? {
          borderColor: theme.palette.primary.main,
          bgcolor: isDark ? alpha(theme.palette.primary.main, 0.08) : alpha(theme.palette.primary.main, 0.04),
        } : {}),
      }}
    >
      {/* Column Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1,
          height: 48,
          mb: "15px",
          bgcolor: isDark ? "#12101e" : "rgba(0, 0, 0, 0.02)",
          borderRadius: "12px",
          border: `1px solid ${columnBorder}`,
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            color: "text.primary",
            fontSize: 15,
            flex: 1,
            letterSpacing: "-0.01em",
            lineHeight: 1.4,
          }}
        >
          {statusName}
        </Typography>

        <Box
          sx={{
            bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
            borderRadius: "999px",
            px: 1.5,
            py: 0.5,
            minWidth: 32,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${columnBorder}`,
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: 12,
              color: mutedText,
              lineHeight: 1,
            }}
          >
            {tasks.length}{wipLimit > 0 ? ` / ${wipLimit}` : ""}
          </Typography>
        </Box>

        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setColumnMenuAnchor(e.currentTarget);
          }}
          aria-label={`${statusName} options`}
          sx={{
            width: 28,
            height: 28,
            color: mutedText,
            borderRadius: "8px",
            "&:hover": { bgcolor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0,0,0,0.04)", color: "text.primary" },
          }}
        >
          <MoreVertOutlinedIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Menu
          anchorEl={columnMenuAnchor}
          open={Boolean(columnMenuAnchor)}
          onClose={() => setColumnMenuAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: {
              sx: {
                bgcolor: menuBg,
                backdropFilter: "blur(24px)",
                border: `1px solid ${menuBorder}`,
                boxShadow: columnShadow,
              }
            }
          }}
        >
          <MenuItem
            onClick={() => {
              setColumnMenuAnchor(null);
              onDeleteColumn?.(statusId);
            }}
            sx={{ fontSize: 13, py: 1, px: 2, color: theme.palette.error.main, borderRadius: 1, mx: 0.5 }}
          >
            Delete Column
          </MenuItem>
        </Menu>
      </Box>

{/* Tasks - scrollable area */}
        <Box
          className="thin-scrollbar hide-scrollbar"
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            minHeight: 120,
            px: 0,
            pt: 0.5,
            borderRadius: "10px",
          }}
        >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {(() => {
              const isSourceColumn = Boolean(activeTaskId && tasks.some((t) => t.id === activeTaskId));
              const draggedIdx = isSourceColumn ? tasks.findIndex((t) => t.id === activeTaskId) : -1;
              const effectiveDragOverIndex =
                isSourceColumn && draggedIdx !== -1 && dragOverIndex >= 0
                  ? dragOverIndex < draggedIdx
                    ? dragOverIndex
                    : dragOverIndex + 1
                  : dragOverIndex;

              return tasks.map((task, index) => {
                const showPlaceholder = isDragOver && index === effectiveDragOverIndex;
                return (
                  <Fragment key={task.id}>
                    {showPlaceholder ? (
                      <Box
                        sx={{
                          height: 80,
                          borderRadius: "12px",
                          border: `2px dashed ${theme.palette.primary.main}`,
                          bgcolor: isDark ? alpha(theme.palette.primary.main, 0.08) : alpha(theme.palette.primary.main, 0.04),
                          transition: "all 150ms ease",
                        }}
                      />
                    ) : null}
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.15,
                        ease: "easeOut",
                        layout: { duration: 0.15, ease: "easeOut" },
                      }}
                      style={{ originX: 0.5, originY: 0 }}
                    >
                    <TaskCard
                      task={task}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                      onUpdate={onUpdateTask}
                    />
                    </motion.div>
                  </Fragment>
                );
              });
            })()}
          </AnimatePresence>
          {(() => {
            const isSourceColumn = Boolean(activeTaskId && tasks.some((t) => t.id === activeTaskId));
            const draggedIdx = isSourceColumn ? tasks.findIndex((t) => t.id === activeTaskId) : -1;
            const effectiveDragOverIndex =
              isSourceColumn && draggedIdx !== -1 && dragOverIndex >= 0
                ? dragOverIndex < draggedIdx
                  ? dragOverIndex
                  : dragOverIndex + 1
                : dragOverIndex;

            return isDragOver && effectiveDragOverIndex >= tasks.length ? (
              <Box
                sx={{
                  height: 80,
                  borderRadius: "12px",
                  border: `2px dashed ${theme.palette.primary.main}`,
                  bgcolor: isDark ? alpha(theme.palette.primary.main, 0.08) : alpha(theme.palette.primary.main, 0.04),
                  transition: "all 150ms ease",
                }}
              />
            ) : null;
          })()}
        </SortableContext>

        {tasks.length === 0 && !isQuickAdding && (
          <EmptyColumn statusName={statusName} isDragOver={isDragOver} />
        )}
      </Box>

      {/* Quick add form */}
      <AnimatePresence>
        {isQuickAdding && (
          <motion.div
            style={{ marginTop: 12 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <Box
              sx={{
                bgcolor: isDark ? "#12101e" : "#FFFFFF",
                borderRadius: "12px",
                border: `1px solid ${columnBorder}`,
                boxShadow: columnShadow,
              }}
            >
              <Box sx={{ p: 1.5 }}>
                <TextField
                  inputRef={inputRef}
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a title, press Enter..."
                  size="small"
                  fullWidth
                  multiline
                  minRows={1}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      bgcolor: isDark ? "rgba(0,0,0,0.2)" : "#F7F8FA",
                      color: "text.primary",
                      fontSize: 14,
                      "& fieldset": { border: "none" },
                      "&.Mui-focused": { boxShadow: "none" },
                      "&::placeholder": { color: mutedText },
                    },
                  }}
                  />

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
                  <Box
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPriorityAnchor(e.currentTarget);
                    }}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      border: `1px solid ${columnBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      bgcolor: isDark ? "rgba(0,0,0,0.2)" : "#F7F8FA",
                      position: "relative",
                      transition: "all 120ms ease",
                      "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)" },
                    }}
                  >
                    <FlagOutlinedIcon sx={{ fontSize: 15, color: currentPriority.color }} />
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: -2,
                        right: -2,
                        width: 7,
                        height: 7,
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
                    slotProps={{
                      paper: {
                        sx: {
                          bgcolor: menuBg,
                          backdropFilter: "blur(24px)",
                          border: `1px solid ${menuBorder}`,
                          boxShadow: columnShadow,
                        }
                      }
                    }}
                  >
                    {PRIORITY_OPTIONS.map((option) => (
                      <MenuItem
                        key={option.value}
                        selected={priority === option.value}
                        onClick={() => handlePrioritySelect(option.value)}
                        sx={{ gap: 1.5, py: 1, px: 2, borderRadius: 1, mx: 0.5, color: "text.primary" }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: option.color,
                          }}
                        />
                        <Typography sx={{ fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>
                          {option.label}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Menu>

                  <Box
                    sx={{
                      position: "relative",
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      border: `1px solid ${columnBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      bgcolor: isDark ? "rgba(0,0,0,0.2)" : "#F7F8FA",
                      color: dueDate ? "text.primary" : mutedText,
                      transition: "all 120ms ease",
                      "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" },
                    }}
                  >
                    <CalendarTodayOutlinedIcon sx={{ fontSize: 15 }} />
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
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

                  <IconButton
                    size="small"
                    onClick={handleQuickAddCancel}
                    sx={{
                      width: 32,
                      height: 32,
                      color: mutedText,
                      borderRadius: "8px",
                      "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: "text.primary" },
                    }}
                  >
                    <CloseOutlinedIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handleQuickAddSubmit}
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
                    <SendOutlinedIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Task Button */}
      {!isQuickAdding && (
        <Box sx={{ px: 0.5, mt: 2 }}>
          <Button
            fullWidth
            size="small"
            onClick={handleQuickAddClick}
            sx={{
              justifyContent: "flex-start",
              color: mutedText,
              textTransform: "none",
              fontWeight: 500,
              fontSize: 13,
              borderRadius: "10px",
              py: 1,
              border: `1px dashed ${columnBorder}`,
              "&:hover": {
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                bgcolor: isDark ? alpha(theme.palette.primary.main, 0.08) : alpha(theme.palette.primary.main, 0.04),
              },
              transition: "all 150ms ease",
            }}
          >
            + Add a card
          </Button>
        </Box>
      )}
    </Box>
  );
}