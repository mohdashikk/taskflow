"use client";

import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CreateIcon from "@mui/icons-material/Create";
import CommentIcon from "@mui/icons-material/Comment";
import FolderIcon from "@mui/icons-material/Folder";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import WidgetCard from "./WidgetCard";

interface ActivityFeedProps {
  items?: Array<{
    id: string;
    action: string;
    target: string;
    time: string;
    type: "task" | "project" | "comment" | "update";
  }>;
  delay?: number;
}

const iconConfig = {
  task: { icon: <CheckCircleIcon sx={{ fontSize: 16 }} />, color: "#22C55E" },
  project: { icon: <FolderIcon sx={{ fontSize: 16 }} />, color: "#715AF8" },
  comment: { icon: <CommentIcon sx={{ fontSize: 16 }} />, color: "#F59E0B" },
  update: { icon: <TrendingUpIcon sx={{ fontSize: 16 }} />, color: "#2563eb" },
};

export default function ActivityFeed({ items = [], delay = 0 }: ActivityFeedProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (items.length === 0) return null;

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
      <WidgetCard title="Activity Feed" delay={delay} icon={<CreateIcon sx={{ fontSize: 18 }} />}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {items.slice(0, 6).map((item) => {
            const config = iconConfig[item.type];
            return (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
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
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: alpha(config.color, 0.1),
                    color: config.color,
                    flexShrink: 0,
                    mt: 0.25,
                  }}
                >
                  {config.icon}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 13, color: theme.palette.text.primary, lineHeight: 1.4 }}>
                    {item.action}{" "}
                    <Box component="span" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                      {item.target}
                    </Box>
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: theme.palette.text.secondary, mt: 0.25 }}>
                    {item.time}
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
