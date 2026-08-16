"use client";

import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: ReactNode;
  color?: string;
  delay?: number;
}

export default function StatCard({ title, value, change, changeType = "neutral", icon, color, delay = 0 }: StatCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const getChangeColor = (): string => {
    if (changeType === "positive") return theme.palette.success.main;
    if (changeType === "negative") return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  const defaultColor = color || theme.palette.primary.main;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
        },
      }}
      initial="hidden"
      animate="show"
      transition={{ delay }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: "20px",
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
          boxShadow: isDark ? "0 8px 24px rgba(0, 0, 0, 0.18)" : "0 1px 3px rgba(0, 0, 0, 0.04)",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          height: "100%",
          transition: "all 220ms cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: isDark ? "0 8px 24px rgba(0, 0, 0, 0.18)" : "0 8px 24px rgba(0, 0, 0, 0.06)",
            borderColor: isDark ? "rgba(255,255,255,0.1)" : "#D1D5DB",
            transform: "translateY(-2px)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: alpha(defaultColor, 0.08),
              color: defaultColor,
            }}
          >
            {icon}
          </Box>
          {change && (
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: getChangeColor(),
                bgcolor: alpha(getChangeColor(), 0.08),
                px: 1,
                py: 0.25,
                borderRadius: "8px",
              }}
            >
              {change}
            </Typography>
          )}
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 700,
              color: theme.palette.text.primary,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {value}
          </Typography>
          <Typography
            sx={{
              fontSize: 13,
              color: theme.palette.text.secondary,
              mt: 0.5,
            }}
          >
            {title}
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
}
