"use client";

import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MarkunreadIcon from "@mui/icons-material/Markunread";
import UpdateIcon from "@mui/icons-material/Update";
import Avatar from "@mui/material/Avatar";

import WidgetCard from "./WidgetCard";

interface NotificationsWidgetProps {
  alerts?: Array<{
    id: string;
    title: string;
    message: string;
    time: string;
    type: "alert" | "mention" | "update";
    read: boolean;
  }>;
  delay?: number;
}

const notificationConfig = {
  alert: { color: "#EF4444", icon: <NotificationsIcon sx={{ fontSize: 16 }} /> },
  mention: { color: "#715AF8", icon: <MarkunreadIcon sx={{ fontSize: 16 }} /> },
  update: { color: "#22C55E", icon: <UpdateIcon sx={{ fontSize: 16 }} /> },
};

export default function NotificationsWidget({ alerts = [], delay = 0 }: NotificationsWidgetProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const unreadCount = alerts.filter(a => !a.read).length;
  const recentAlerts = alerts.slice(0, 4);

  if (recentAlerts.length === 0) return null;

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
      <WidgetCard
        title="Notifications"
        delay={delay}
        icon={
          <Badge badgeContent={unreadCount} color="error" sx={{ "& .MuiBadge-badge": { fontSize: 10, height: 16, minWidth: 16 } }}>
            <NotificationsIcon sx={{ fontSize: 18 }} />
          </Badge>
        }
        action={
          <Button
            size="small"
            sx={{ 
              textTransform: "none", 
              fontSize: 12, 
              fontWeight: 600,
              color: theme.palette.primary.main,
              "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.08) }
            }}
          >
            Mark all read
          </Button>
        }
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {recentAlerts.map((alert) => {
            const config = notificationConfig[alert.type];
            return (
              <Box
                key={alert.id}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: "12px",
                  bgcolor: !alert.read ? alpha(theme.palette.primary.main, 0.04) : isDark ? "#12101e" : "#F7F8FA",
                  border: `1px solid ${theme.palette.divider}`,
                  borderLeft: !alert.read ? `3px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
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
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: theme.palette.text.primary }}>
                    {alert.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: theme.palette.text.secondary,
                      mt: 0.25,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {alert.message}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: theme.palette.text.secondary, mt: 0.5 }}>
                    {alert.time}
                  </Typography>
                </Box>
                {!alert.read && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: theme.palette.primary.main,
                      flexShrink: 0,
                      mt: 1,
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      </WidgetCard>
    </motion.div>
  );
}
