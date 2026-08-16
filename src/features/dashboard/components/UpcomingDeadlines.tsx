"use client";

import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import WidgetCard from "./WidgetCard";

interface UpcomingDeadlinesProps {
  items: Array<{
    id: string;
    title: string;
    dueDate: string;
    projectName: string;
  }>;
  delay?: number;
}

export default function UpcomingDeadlines({ items, delay = 0 }: UpcomingDeadlinesProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const router = useRouter();

  const upcomingItems = items
    .filter(item => item.dueDate)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  if (upcomingItems.length === 0) {
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
        <WidgetCard title="Upcoming Deadlines" delay={delay} action={
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
              No upcoming deadlines. Great job!
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
      <WidgetCard title="Upcoming Deadlines" delay={delay} action={
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
          {upcomingItems.map((item) => {
            const dueDate = new Date(item.dueDate);
            const today = new Date();
            const isOverdue = dueDate < today && dueDate.toDateString() !== today.toDateString();
            const isToday = dueDate.toDateString() === today.toDateString();
            const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

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
                  transition: "all 180ms ease",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    bgcolor: isDark ? "#1A1728" : "#F2F4F7",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: isOverdue ? alpha("#EF4444", 0.1) : isToday ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.text.secondary, 0.08),
                    color: isOverdue ? theme.palette.error.main : isToday ? theme.palette.primary.main : theme.palette.text.secondary,
                    flexShrink: 0,
                  }}
                >
                  <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>
                    {dueDate.getDate()}
                  </Typography>
                  <Typography sx={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", lineHeight: 1 }}>
                    {dueDate.toLocaleString("en-US", { month: "short" })}
                  </Typography>
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
                  <AccessTimeIcon sx={{ fontSize: 14, color: isOverdue ? theme.palette.error.main : theme.palette.text.secondary }} />
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: isOverdue ? theme.palette.error.main : theme.palette.text.secondary,
                    }}
                  >
                    {isOverdue ? `${Math.abs(daysUntil)}d overdue` : isToday ? "Today" : `${daysUntil}d`}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </WidgetCard>
    </motion.div>
  );
}
