"use client";

import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import FlagIcon from "@mui/icons-material/Flag";

import WidgetCard from "./WidgetCard";

interface GoalsProgressProps {
  goals?: Array<{
    id: string;
    title: string;
    progress: number;
    target: string;
    deadline?: string;
  }>;
  projectCompletion?: number;
  delay?: number;
}

export default function GoalsProgress({ goals = [], projectCompletion = 0, delay = 0 }: GoalsProgressProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (goals.length === 0 && projectCompletion === 0) return null;

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
      <WidgetCard title="Goals & Progress" delay={delay} icon={<FlagIcon sx={{ fontSize: 18 }} />}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {projectCompletion > 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: theme.palette.text.primary }}>
                  Project Completion
                </Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: theme.palette.primary.main }}>
                  {projectCompletion}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={projectCompletion}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: isDark ? "#1A1728" : "#F2F4F7",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                    bgcolor: theme.palette.primary.main,
                  },
                }}
              />
            </Box>
          )}
          {goals.map((goal) => (
            <Box key={goal.id} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: theme.palette.text.primary }}>
                  {goal.title}
                </Typography>
                <Typography sx={{ fontSize: 12, color: theme.palette.text.secondary }}>
                  {goal.target}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <LinearProgress
                  variant="determinate"
                  value={goal.progress}
                  sx={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: isDark ? "#1A1728" : "#F2F4F7",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 3,
                      bgcolor: goal.progress >= 100 ? theme.palette.success.main : theme.palette.primary.main,
                    },
                  }}
                />
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: theme.palette.text.primary, minWidth: 36, textAlign: "right" }}>
                  {goal.progress}%
                </Typography>
              </Box>
              {goal.deadline && (
                <Typography sx={{ fontSize: 11, color: theme.palette.text.secondary }}>
                  Due: {goal.deadline}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </WidgetCard>
    </motion.div>
  );
}
