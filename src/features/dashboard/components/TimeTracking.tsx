"use client";

import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TimerIcon from "@mui/icons-material/Timer";

import WidgetCard from "./WidgetCard";

interface TimeTrackingProps {
  hoursToday?: number;
  weeklyFocusTime?: number;
  dailyGoal?: number;
  weeklyGoal?: number;
  delay?: number;
}

export default function TimeTracking({ 
  hoursToday = 0, 
  weeklyFocusTime = 0, 
  dailyGoal = 8, 
  weeklyGoal = 40,
  delay = 0 
}: TimeTrackingProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (hoursToday === 0 && weeklyFocusTime === 0) return null;

  const dailyProgress = Math.min((hoursToday / dailyGoal) * 100, 100);
  const weeklyProgress = Math.min((weeklyFocusTime / weeklyGoal) * 100, 100);

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
      <WidgetCard title="Time Tracking" delay={delay} icon={<TimerIcon sx={{ fontSize: 18 }} />}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccessTimeIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: theme.palette.text.primary }}>
                  Today
                </Typography>
              </Box>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: theme.palette.text.primary }}>
                {hoursToday}h / {dailyGoal}h
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={dailyProgress}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: isDark ? "#1A1728" : "#F2F4F7",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 3,
                  bgcolor: dailyProgress >= 100 ? theme.palette.success.main : theme.palette.primary.main,
                },
              }}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: theme.palette.text.primary }}>
                This Week
              </Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: theme.palette.text.primary }}>
                {weeklyFocusTime}h / {weeklyGoal}h
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={weeklyProgress}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: isDark ? "#1A1728" : "#F2F4F7",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 3,
                  bgcolor: weeklyProgress >= 100 ? theme.palette.success.main : theme.palette.primary.main,
                },
              }}
            />
          </Box>
        </Box>
      </WidgetCard>
    </motion.div>
  );
}
