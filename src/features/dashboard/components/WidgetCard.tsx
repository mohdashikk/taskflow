"use client";

import { type ReactNode } from "react";
import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
  },
};

interface WidgetCardProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  delay?: number;
  span?: number;
}

export default function WidgetCard({ title, children, icon, action, delay = 0, span }: WidgetCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="show"
      transition={{ delay }}
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
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
          gap: 2,
          height: "100%",
          transition: "all 220ms cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: isDark ? "0 8px 24px rgba(0, 0, 0, 0.18)" : "0 8px 24px rgba(0, 0, 0, 0.06)",
            borderColor: isDark ? "rgba(255,255,255,0.1)" : "#D1D5DB",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {icon && (
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  color: theme.palette.primary.main,
                }}
              >
                {icon}
              </Box>
            )}
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                color: theme.palette.text.secondary,
                letterSpacing: "-0.01em",
              }}
            >
              {title}
            </Typography>
          </Box>
          {action}
        </Box>
        {children}
      </Paper>
    </motion.div>
  );
}
