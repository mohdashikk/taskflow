"use client";

import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FlagIcon from "@mui/icons-material/Flag";
import WidgetCard from "./WidgetCard";

import type { ContinueWorkingItem } from "../hooks/useDashboardData";

interface ContinueWorkingProps {
  items: ContinueWorkingItem[];
  delay?: number;
}

const priorityConfig = {
  high: { color: "#EF4444", label: "High" },
  medium: { color: "#F59E0B", label: "Medium" },
  low: { color: "#22C55E", label: "Low" },
};

export default function ContinueWorking({ items, delay = 0 }: ContinueWorkingProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const router = useRouter();

  if (items.length === 0) {
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
        <WidgetCard title="Continue Working" delay={delay}>
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: 14 }}>
              No tasks in progress. Start by creating a new task!
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
      <WidgetCard title="Continue Working" delay={delay} action={
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {items.slice(0, 4).map((item) => {
            const priority = priorityConfig[item.priority as keyof typeof priorityConfig] || priorityConfig.medium;
            return (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: "14px",
                  bgcolor: isDark ? "#12101e" : "#F7F8FA",
                  border: `1px solid ${theme.palette.divider}`,
                  cursor: "pointer",
                  transition: "all 180ms ease",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    bgcolor: isDark ? "#1A1728" : "#F2F4F7",
                    transform: "translateX(4px)",
                  },
                }}
                onClick={() => router.push(`/projects/${item.projectId}`)}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: alpha(priority.color, 0.1),
                    color: priority.color,
                    flexShrink: 0,
                  }}
                >
                  <FlagIcon sx={{ fontSize: 18 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: theme.palette.text.secondary, mt: 0.25 }}>
                    {item.projectName}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
                  {item.dueDate && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
                      <Typography sx={{ fontSize: 11, color: theme.palette.text.secondary }}>
                        {formatDueDate(item.dueDate)}
                      </Typography>
                    </Box>
                  )}
                  <Chip
                    label={priority.label}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: 11,
                      height: 22,
                      bgcolor: alpha(priority.color, 0.1),
                      color: priority.color,
                      "& .MuiChip-label": { px: 1 },
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
