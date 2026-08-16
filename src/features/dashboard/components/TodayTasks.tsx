"use client";

import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FlagIcon from "@mui/icons-material/Flag";

import WidgetCard from "./WidgetCard";

interface TodayTasksProps {
  items: Array<{
    id: string;
    title: string;
    dueDate: string | null;
    priority: string;
    projectName: string;
    completed: boolean;
  }>;
  delay?: number;
}

const priorityConfig = {
  high: { color: "#EF4444", label: "High" },
  medium: { color: "#F59E0B", label: "Medium" },
  low: { color: "#22C55E", label: "Low" },
};

export default function TodayTasks({ items, delay = 0 }: TodayTasksProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const router = useRouter();

  const todayTasks = items.filter(item => {
    if (!item.dueDate) return false;
    const today = new Date().toISOString().split("T")[0];
    return item.dueDate === today || (!item.completed);
  }).slice(0, 5);

  if (todayTasks.length === 0) {
    return (
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
        }}
        initial="hidden"
        animate="show"
        transition={{ delay }}
      >
        <WidgetCard title="Today's Tasks" delay={delay} action={
          <Button
            size="small"
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              textTransform: "none", 
              fontSize: 12, 
              fontWeight: 600,
              color: theme.palette.primary.main,
              "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.08) }
            }}
            onClick={() => router.push("/tasks")}
          >
            View All
          </Button>
        }>
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: 14 }}>
              No tasks due today. Enjoy your day!
            </Typography>
          </Box>
        </WidgetCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
      }}
      initial="hidden"
      animate="show"
      transition={{ delay }}
    >
      <WidgetCard title="Today's Tasks" delay={delay} action={
        <Button
          size="small"
          endIcon={<ArrowForwardIcon />}
          sx={{ 
            textTransform: "none", 
            fontSize: 12, 
            fontWeight: 600,
            color: theme.palette.primary.main,
            "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.08) }
          }}
          onClick={() => router.push("/tasks")}
        >
          View All
        </Button>
      }>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {todayTasks.map((task) => {
            const priority = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig.medium;
            return (
              <Box
                key={task.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 1.5,
                  borderRadius: "12px",
                  bgcolor: isDark ? "#12101e" : "#F7F8FA",
                  border: `1px solid ${theme.palette.divider}`,
                  transition: "all 180ms ease",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    bgcolor: isDark ? "#1A1728" : "#F2F4F7",
                  },
                }}
              >
                <Checkbox
                  size="small"
                  sx={{
                    color: theme.palette.text.secondary,
                    "&.Mui-checked": { color: theme.palette.primary.main },
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textDecoration: task.completed ? "line-through" : "none",
                      opacity: task.completed ? 0.6 : 1,
                    }}
                  >
                    {task.title}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: theme.palette.text.secondary, mt: 0.25 }}>
                    {task.projectName}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
                  {task.dueDate && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
                      <Typography sx={{ fontSize: 11, color: theme.palette.text.secondary }}>
                        {formatDueDate(task.dueDate)}
                      </Typography>
                    </Box>
                  )}
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: priority.color,
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      </WidgetCard>
    </motion.div>
  );
}

function formatDueDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
