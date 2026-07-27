"use client";

import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import ShowChartIcon from "@mui/icons-material/ShowChart";

import WidgetCard from "./WidgetCard";

import type { WeeklyProductivityData } from "../hooks/useDashboardData";

interface WeeklyProductivityProps {
  data: WeeklyProductivityData[];
  delay?: number;
}

export default function WeeklyProductivity({ data, delay = 0 }: WeeklyProductivityProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const maxValue = Math.max(...data.map(d => Math.max(d.completed, d.created)), 1);

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
      <WidgetCard title="Weekly Productivity" delay={delay} icon={<ShowChartIcon sx={{ fontSize: 18 }} />}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
              <Typography
                sx={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  letterSpacing: "-0.02em",
                }}
              >
                {data.reduce((sum, d) => sum + d.completed, 0)}
              </Typography>
              <Typography sx={{ fontSize: 13, color: theme.palette.text.secondary }}>
                tasks completed
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-end", height: 120 }}>
            {data.map((item, index) => {
              const completedHeight = (item.completed / maxValue) * 100;
              const createdHeight = (item.created / maxValue) * 100;
              
              return (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5,
                    height: "100%",
                    justifyContent: "flex-end",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      gap: 0.5,
                      alignItems: "flex-end",
                      height: 80,
                    }}
                  >
                    <Box
                      sx={{
                        flex: 1,
                        height: `${completedHeight}%`,
                        borderRadius: "4px 4px 0 0",
                        bgcolor: theme.palette.primary.main,
                        opacity: 0.9,
                        transition: "height 400ms ease",
                        minHeight: 4,
                      }}
                    />
                    <Box
                      sx={{
                        flex: 1,
                        height: `${createdHeight}%`,
                        borderRadius: "4px 4px 0 0",
                        bgcolor: isDark ? alpha("#FFFFFF", 0.1) : "#E5E7EB",
                        transition: "height 400ms ease",
                        minHeight: 4,
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: theme.palette.text.secondary,
                      mt: 0.5,
                    }}
                  >
                    {item.day}
                  </Typography>
                </Box>
              );
            })}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "2px", bgcolor: theme.palette.primary.main }} />
              <Typography sx={{ fontSize: 11, color: theme.palette.text.secondary }}>Completed</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "2px", bgcolor: isDark ? alpha("#FFFFFF", 0.1) : "#E5E7EB" }} />
              <Typography sx={{ fontSize: 11, color: theme.palette.text.secondary }}>Created</Typography>
            </Box>
          </Box>
        </Box>
      </WidgetCard>
    </motion.div>
  );
}
