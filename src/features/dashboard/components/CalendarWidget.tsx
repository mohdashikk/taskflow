"use client";

import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import WidgetCard from "./WidgetCard";

interface CalendarWidgetProps {
  events?: Array<{
    id: string;
    title: string;
    time: string;
    date: string;
    type: "meeting" | "deadline" | "reminder";
  }>;
  delay?: number;
}

const eventConfig = {
  meeting: { color: "#715AF8", bgcolor: alpha("#715AF8", 0.08) },
  deadline: { color: "#EF4444", bgcolor: alpha("#EF4444", 0.08) },
  reminder: { color: "#F59E0B", bgcolor: alpha("#F59E0B", 0.08) },
};

export default function CalendarWidget({ events = [], delay = 0 }: CalendarWidgetProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const today = new Date();
  const currentMonth = today.toLocaleString("en-US", { month: "long", year: "numeric" });
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const todayDate = today.getDate();

  const upcomingEvents = events
    .filter(e => e.date >= today.toISOString().split("T")[0])
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

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
      <WidgetCard title="Calendar" delay={delay} icon={<CalendarTodayIcon sx={{ fontSize: 18 }} />}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: theme.palette.text.primary }}>
              {currentMonth}
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Button
                size="small"
                sx={{ minWidth: 28, height: 28, borderRadius: "8px", color: theme.palette.text.secondary }}
              >
                &lt;
              </Button>
              <Button
                size="small"
                sx={{ minWidth: 28, height: 28, borderRadius: "8px", color: theme.palette.text.secondary }}
              >
                &gt;
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 0.5,
              textAlign: "center",
            }}
          >
            {["S", "M", "T", "W", "T", "F", "S"].map((d, idx) => (
              <Typography
                key={idx}
                sx={{ fontSize: 11, fontWeight: 600, color: theme.palette.text.secondary, py: 0.5 }}
              >
                {d}
              </Typography>
            ))}
            {Array.from({ length: startingDay }).map((_, i) => (
              <Box key={`empty-${i}`} />
            ))}
            {days.map((day) => {
              const isToday = day === todayDate;
              const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const hasEvent = events.some(e => e.date === dateStr);
              
              return (
                <Box
                  key={day}
                  sx={{
                    aspectRatio: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    fontSize: 12,
                    fontWeight: isToday ? 700 : 400,
                    color: isToday ? theme.palette.primary.main : theme.palette.text.primary,
                    bgcolor: isToday ? alpha(theme.palette.primary.main, 0.08) : hasEvent ? alpha(theme.palette.primary.main, 0.04) : "transparent",
                    cursor: "pointer",
                    transition: "all 120ms ease",
                    position: "relative",
                    "&:hover": {
                      bgcolor: isToday ? alpha(theme.palette.primary.main, 0.12) : isDark ? "rgba(255,255,255,0.04)" : "#F2F4F7",
                    },
                    ...(hasEvent && {
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 4,
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        bgcolor: theme.palette.primary.main,
                      },
                    }),
                  }}
                >
                  {day}
                </Box>
              );
            })}
          </Box>
          {upcomingEvents.length > 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: theme.palette.text.secondary }}>
                Upcoming Events
              </Typography>
              {upcomingEvents.map((event) => {
                const config = eventConfig[event.type];
                return (
                  <Box
                    key={event.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: "10px",
                      bgcolor: config.bgcolor,
                      border: `1px solid ${alpha(config.color, 0.15)}`,
                    }}
                  >
                    <EventIcon sx={{ fontSize: 16, color: config.color, flexShrink: 0 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {event.title}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.25 }}>
                        <AccessTimeIcon sx={{ fontSize: 11, color: theme.palette.text.secondary }} />
                        <Typography sx={{ fontSize: 11, color: theme.palette.text.secondary }}>
                          {event.time}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      </WidgetCard>
    </motion.div>
  );
}
