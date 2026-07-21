"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import type { TaskRow } from "../services/tasksService";
import TaskCard from "./TaskCard";

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
}

const PRIORITY_OPTIONS = [
  { value: "high", label: "High", color: "#EF4444" },
  { value: "medium", label: "Medium", color: "#F59E0B" },
  { value: "low", label: "Low", color: "#10B981" },
] as const;

export default function BoardColumn({ statusId, statusName, tasks, onCreate, createPending, onEditTask, onDeleteTask, onDeleteColumn, onUpdateTask }: BoardColumnProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<string>("medium");
  const [dueDate, setDueDate] = useState<string>("");
  const [priorityAnchor, setPriorityAnchor] = useState<null | HTMLElement>(null);
  const [formMenuAnchor, setFormMenuAnchor] = useState<null | HTMLElement>(null);
  const [columnMenuAnchor, setColumnMenuAnchor] = useState<null | HTMLElement>(null);

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({ id: statusId });

  const currentPriority = PRIORITY_OPTIONS.find((p) => p.value === priority) ?? PRIORITY_OPTIONS[1];

  const resetForm = () => {
    setTitle("");
    setPriority("medium");
    setDueDate("");
    setPriorityAnchor(null);
    setIsOpen(false);
  };

  const handleSubmit = () => {
    const trimmed = title.trim() || "Untitled task";
    onCreate({
      title: trimmed,
      status_id: statusId,
      priority,
      due_date: dueDate || null,
    });
    resetForm();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      resetForm();
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
  };

  const handlePrioritySelect = (value: string) => {
    setPriority(value);
    setPriorityAnchor(null);
  };

  const handleCreateClick = () => {
    setIsOpen(true);
    setTitle("");
    setPriority("medium");
    setDueDate("");
  };

  return (
    <Box
      ref={setDroppableRef}
      sx={{
        width: 320,
        flex: "0 0 auto",
        bgcolor: "background.default",
        borderRadius: "12px",
        border: isOver ? "2px solid #3B82F6" : "1px solid",
        borderColor: isOver ? "#3B82F6" : "divider",
        boxShadow: isOver ? "0 0 0 3px rgba(59, 130, 246, 0.15)" : "none",
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 180px)",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          borderColor: "divider",
        },
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
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            fontSize: 14,
            flex: 1,
            textTransform: "capitalize",
          }}
        >
          {statusName}
        </Typography>

        {/* Count Badge */}
        <Box
          sx={{
            bgcolor: "divider",
            borderRadius: "12px",
            px: 1,
            py: 0.25,
            minWidth: 24,
            textAlign: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, fontSize: 12, color: "text.disabled" }}
          >
            {tasks.length}
          </Typography>
        </Box>

        {/* Menu Button */}
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
            color: "text.secondary",
            "&:hover": { bgcolor: "divider" },
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
            sx={{ fontSize: 13, py: 1, px: 2, color: "#EF4444" }}
          >
            Delete Board
          </MenuItem>
        </Menu>
      </Box>

      {/* Column Body */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {tasks.length > 0 && (
          <>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} onUpdate={onUpdateTask} />
            ))}
          </>
        )}

        {isOpen && (
          <Box
            data-create-form
            sx={{
              bgcolor: "background.paper",
              borderRadius: "10px",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              overflow: "visible",
              position: "relative",
            }}
          >
            {/* Selected due date under header */}
            {dueDate && (
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: 12,
                  px: 2,
                  pt: 1,
                  display: "block",
                }}
              >
                📅 {new Date(dueDate + "T00:00:00").toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Typography>
            )}

            <Box sx={{ p: 1.5 }}>
              <TextField
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                    fontSize: 13,
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

            <Box sx={{ display: "flex", gap: 1, px: 1.5, pb: 1.5, alignItems: "center" }}>
              {/* Priority Icon Button */}
              <Box
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.stopPropagation();
                  setPriorityAnchor(e.currentTarget);
                }}
                sx={{
                  width: 36,
                  height: 36,
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

              {/* Priority Dropdown Menu */}
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
                    sx={{ gap: 1.5, py: 1, px: 2 }}
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

              {/* Calendar Icon Button with transparent date input overlay */}
              <Box
                sx={{
                  position: "relative",
                  width: 36,
                  height: 36,
                  borderRadius: "8px",
                  border: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  bgcolor: "background.paper",
                  color: dueDate ? "text.primary" : "text.secondary",
                  "&:hover": {
                    borderColor: "divider",
                    bgcolor: "background.default",
                  },
                }}
              >
                <CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} />
                <input
                  type="date"
                  value={dueDate}
                  onChange={handleDateChange}
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

            <Box sx={{ display: "flex", gap: 1, px: 1.5, pb: 1.5, justifyContent: "flex-end" }}>
              <Button
                size="small"
                onClick={resetForm}
                sx={{
                  color: "text.secondary",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: 12,
                  borderRadius: "6px",
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
                onClick={handleSubmit}
                disabled={createPending}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: 12,
                  borderRadius: "6px",
                  py: 0.5,
                  px: 1.5,
                  boxShadow: "none",
                  "&:hover": { boxShadow: "none" },
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* Create Button Area */}
      {!isOpen && (
        <Box sx={{ p: 1.5, borderTop: "1px solid", borderColor: "divider" }}>
          <Button
            fullWidth
            size="small"
            startIcon={<AddOutlinedIcon sx={{ fontSize: 16 }} />}
            onClick={handleCreateClick}
            sx={{
              justifyContent: "flex-start",
              color: "text.secondary",
              textTransform: "none",
              fontWeight: 600,
              fontSize: 13,
              borderRadius: "8px",
              py: 0.75,
              "&:hover": {
                bgcolor: "divider",
                color: "text.primary",
              },
            }}
          >
            Create
          </Button>
        </Box>
      )}
    </Box>
  );
}
