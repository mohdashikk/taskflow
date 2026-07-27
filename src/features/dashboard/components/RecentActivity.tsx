"use client";

import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CreateIcon from "@mui/icons-material/Create";
import CommentIcon from "@mui/icons-material/Comment";
import FolderIcon from "@mui/icons-material/Folder";

import WidgetCard from "./WidgetCard";

import type { RecentActivityItem } from "../hooks/useDashboardData";

interface RecentActivityProps {
  items: RecentActivityItem[];
  delay?: number;
}

const iconConfig = {
  task: { icon: <CheckCircleIcon sx={{ fontSize: 16 }} />, color: "#22C55E" },
  project: { icon: <FolderIcon sx={{ fontSize: 16 }} />, color: "#715AF8" },
  comment: { icon: <CommentIcon sx={{ fontSize: 16 }} />, color: "#F59E0B" },
};

export default function RecentActivity({ items, delay = 0 }: RecentActivityProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const recentItems = items.slice(0, 6);

  if (recentItems.length === 0) {
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
        <WidgetCard title="Recent Activity" delay={delay}>
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: 14 }}>
              No recent activity. Start working on something!
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
      <WidgetCard title="Recent Activity" delay={delay}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {recentItems.map((item) => {
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
