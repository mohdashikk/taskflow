"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import type { TaskRow } from "../services/tasksService";

interface TaskCardProps {
  task: TaskRow;
  onEdit?: (task: TaskRow) => void;
  onDelete?: (taskId: string) => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#10B981",
};

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
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

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        bgcolor: "#FFFFFF",
        borderRadius: "10px",
        border: "1px solid #F1F5F9",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderColor: "#E2E8F0",
        },
        transition: "box-shadow 0.15s ease, border-color 0.15s ease",
      }}
    >
      <Box sx={{ p: 2, position: "relative" }}>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setMenuAnchor(e.currentTarget);
          }}
          sx={{
            position: "absolute",
            top: 4,
            right: 4,
            width: 24,
            height: 24,
            color: "#94A3B8",
            "&:hover": { bgcolor: "#F1F5F9", color: "#475569" },
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
            onClick={() => {
              setMenuAnchor(null);
              onEdit?.(task);
            }}
            sx={{ fontSize: 13, py: 1, px: 2 }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              setMenuAnchor(null);
              onDelete?.(task.id);
            }}
            sx={{ fontSize: 13, py: 1, px: 2, color: "#EF4444" }}
          >
            Delete
          </MenuItem>
        </Menu>

        {/* Task Title */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            fontSize: 16,
            lineHeight: 1.5,
            color: "#1E293B",
            mb: task.due_date ? 1.5 : 0,
            pr: 4,
          }}
        >
          {task.title}
        </Typography>

        {/* Due Date */}
        {task.due_date && (
          <Box sx={{ mb: 1.5 }}>
            <Typography
              variant="caption"
              sx={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, display: "block" }}
            >
              Due Date
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: 12, color: "#475569", mt: 0.25, display: "block" }}
            >
              {new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </Typography>
            <Box sx={{ borderTop: "1px solid #E2E8F0", mt: 1 }} />
          </Box>
        )}

        {/* Priority */}
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "6px",
            border: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            bgcolor: "#FAFBFC",
            ml: "auto",
          }}
        >
          <FlagOutlinedIcon sx={{ fontSize: 14, color: priorityColor }} />
          <Box
            sx={{
              position: "absolute",
              bottom: -2,
              right: -2,
              width: 7,
              height: 7,
              borderRadius: "50%",
              bgcolor: priorityColor,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
