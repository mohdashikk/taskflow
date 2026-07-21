"use client";

import { useState, useRef, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import { alpha, useTheme } from "@mui/material/styles";
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
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { motion, AnimatePresence } from "framer-motion";
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
}: BoardColumnProps) {
  const theme = useTheme();
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [quickTitle, setQuickTitle] = useState("");
  const [showOptions, setShowOptions] = useState(false);
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
    setShowOptions(false);
    setPriority("medium");
    setDueDate("");
  };

  const handleQuickAddCancel = () => {
    setIsQuickAdding(false);
    setQuickTitle("");
    setShowOptions(false);
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
    setShowOptions(false);
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

  return (
    <Box
      sx={{
        width: { xs: 300, sm: 320 },
        flex: "0 0 auto",
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 200px)",
        borderRadius: "20px",
        overflow: "hidden",
      }}
    >
      {/* Column Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1.5,
          bgcolor: theme.palette.primary.main,
        }}
      >
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: statusName === "Done"
              ? "#22C55E"
              : statusName === "In Progress"
                ? "#F59E0B"
                : statusName === "Review"
                  ? "#FFFFFF"
                  : "#FFFFFF",
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            fontWeight: 600,
            color: theme.palette.primary.contrastText,
            fontSize: 14,
            flex: 1,
            letterSpacing: "-0.01em",
          }}
        >
          {statusName}
        </Typography>

        <Box
          sx={{
            bgcolor: isOverWipLimit
              ? "transparent"
              : alpha(theme.palette.primary.contrastText, 0.2),
            borderRadius: "12px",
            px: 1,
            py: 0.25,
            minWidth: 28,
            textAlign: "center",
            border: isOverWipLimit ? "1.5px solid #EF4444" : "none",
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 12,
              color: theme.palette.primary.contrastText,
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
            color: theme.palette.primary.contrastText,
            borderRadius: 2,
            "&:hover": { bgcolor: alpha(theme.palette.primary.contrastText, 0.1) },
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

      {/* Tasks - droppable scrollable area */}
      <Box
        ref={setDroppableRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 1.5,
          pt: 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          bgcolor: theme.palette.mode === "dark" ? theme.palette.background.default : "#F9FAFB",
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
          "&::-webkit-scrollbar": {
            width: 6,
          },
          "&::-webkit-scrollbar-track": {
            bgcolor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[600] : "#D1D5DB",
            borderRadius: 3,
            "&:hover": { bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[500] : "#9CA3AF" },
          },
        }}
      >
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1] as const,
                layout: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
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
          ))}
        </AnimatePresence>

        {tasks.length === 0 && !isQuickAdding && (
          <EmptyColumn statusName={statusName} />
        )}
      </Box>

      {/* Quick add form */}
      <AnimatePresence>
        {isQuickAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
          >
            <Box
              sx={{
                mx: 1.5,
                mb: 1.5,
                bgcolor: theme.palette.background.paper,
                borderRadius: "14px",
                border: `2px solid ${theme.palette.primary.main}`,
                boxShadow: theme.palette.mode === "dark"
                  ? "0 4px 16px rgba(0, 0, 0, 0.3)"
                  : "0 4px 16px rgba(0, 111, 153, 0.08)",
                overflow: "hidden",
              }}
            >
              <Box sx={{ p: 2 }}>
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
                      bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#F7F8FA",
                      fontSize: 14,
                      "& fieldset": { border: "none" },
                      "&.Mui-focused": { boxShadow: "none" },
                    },
                  }}
                />

                <AnimatePresence>
                  {showOptions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Box sx={{ display: "flex", gap: 1, mt: 1.5, flexWrap: "wrap" }}>
                        <Box
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPriorityAnchor(e.currentTarget);
                          }}
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "10px",
                            border: `1px solid ${theme.palette.divider}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#F7F8FA",
                            position: "relative",
                            transition: "all 120ms ease",
                            "&:hover": { bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#F2F4F7" },
                          }}
                        >
                          <FlagOutlinedIcon sx={{ fontSize: 16, color: currentPriority.color }} />
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: -2,
                              right: -2,
                              width: 8,
                              height: 8,
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
                              selected={priority === option.value}
                              onClick={() => handlePrioritySelect(option.value)}
                              sx={{ gap: 1.5, py: 1, px: 2, borderRadius: 1, mx: 0.5 }}
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
                            width: 36,
                            height: 36,
                            borderRadius: "10px",
                            border: `1px solid ${theme.palette.divider}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#F7F8FA",
                            color: dueDate ? theme.palette.text.primary : theme.palette.text.secondary,
                            transition: "all 120ms ease",
                            "&:hover": { bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#F2F4F7" },
                          }}
                        >
                          <CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} />
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
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 0.5,
                  px: 2,
                  pb: 1.5,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  size="small"
                  onClick={() => setShowOptions(!showOptions)}
                  sx={{
                    color: theme.palette.text.secondary,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: 12,
                    borderRadius: 2,
                    py: 0.5,
                    px: 1,
                    "&:hover": { bgcolor: theme.palette.mode === "dark" ? alpha(theme.palette.primary.contrastText, 0.06) : "#F2F4F7", color: theme.palette.text.primary },
                  }}
                  startIcon={
                    showOptions ? (
                      <KeyboardArrowUpOutlinedIcon sx={{ fontSize: 16 }} />
                    ) : (
                      <KeyboardArrowDownOutlinedIcon sx={{ fontSize: 16 }} />
                    )
                  }
                >
                  {showOptions ? "Less" : "More"}
                </Button>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={handleQuickAddCancel}
                    sx={{
                      width: 32,
                      height: 32,
                      color: theme.palette.text.secondary,
                      borderRadius: 2,
                      "&:hover": { bgcolor: theme.palette.mode === "dark" ? alpha(theme.palette.primary.contrastText, 0.06) : "#F2F4F7", color: theme.palette.text.primary },
                    }}
                  >
                    <CloseOutlinedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handleQuickAddSubmit}
                    disabled={createPending}
                    sx={{
                      width: 32,
                      height: 32,
                      color: theme.palette.primary.main,
                      borderRadius: 2,
                      "&:hover": { bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText },
                      "&.Mui-disabled": { color: theme.palette.mode === "dark" ? theme.palette.grey[600] : "#D1D5DB" },
                    }}
                  >
                    <SendOutlinedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Task Button */}
      {!isQuickAdding && (
        <Box sx={{ p: 1.5, mt: "auto" }}>
          <Button
            fullWidth
            size="small"
            onClick={handleQuickAddClick}
            sx={{
              justifyContent: "flex-start",
              color: theme.palette.text.secondary,
              textTransform: "none",
              fontWeight: 600,
              fontSize: 13,
              borderRadius: "10px",
              py: 1,
              border: `1px dashed ${theme.palette.mode === "dark" ? theme.palette.grey[600] : "#D1D5DB"}`,
              "&:hover": {
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                bgcolor: "transparent",
              },
              transition: "all 150ms ease",
            }}
          >
            + Add task
          </Button>
        </Box>
      )}
    </Box>
  );
}
