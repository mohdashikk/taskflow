"use client";

import { type ReactNode } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

interface WelcomeBannerProps {
  userName: string;
  subtitle: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
}

export default function WelcomeBanner({ userName, subtitle, primaryAction, secondaryAction }: WelcomeBannerProps) {
  const theme = useTheme();

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    return "Evening";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as const }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: "24px",
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
          boxShadow: theme.palette.mode === "dark" ? "0 8px 24px rgba(0, 0, 0, 0.18)" : "0 1px 3px rgba(0, 0, 0, 0.04)",
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "#FFFFFF",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 180,
            height: 180,
            borderRadius: "50%",
            bgcolor: alpha("#FFFFFF", 0.08),
          }}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            position: "relative",
            zIndex: 1,
            flexWrap: "wrap",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              width: 56,
              height: 56,
              fontSize: 24,
              fontWeight: 700,
              border: "2px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: { xs: 22, md: 28 },
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              Good {getGreeting()}, {userName}
            </Typography>
            <Typography
              sx={{
                mt: 0.5,
                opacity: 0.85,
                fontSize: 15,
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            {primaryAction}
            {secondaryAction}
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
}
