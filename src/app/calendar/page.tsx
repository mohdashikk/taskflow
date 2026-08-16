"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { fetchTasksByProject, type TaskRow } from "@/features/tasks/services/tasksService";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const priorityConfig = {
  high: { color: "#EF4444", bgcolor: alpha("#EF4444", 0.08) },
  medium: { color: "#F59E0B", bgcolor: alpha("#F59E0B", 0.08) },
  low: { color: "#64748B", bgcolor: alpha("#64748B", 0.08) },
};

export default function CalendarPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { user } = useAuth();
  const userId = user?.id;

  const { data: projects = [] } = useProjects(userId);

  const taskQueries = useQueries({
    queries: projects.map(project => ({
      queryKey: ["tasks", project.id, userId],
      queryFn: async () => fetchTasksByProject(project.id, userId ?? ""),
      enabled: Boolean(project.id && userId),
      staleTime: 30_000,
    })),
  });

  const allTasks = useMemo<TaskRow[]>(() => {
    return taskQueries.filter(q => q.data).flatMap(q => q.data as TaskRow[]);
  }, [taskQueries]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const tasksByDate = useMemo(() => {
    const map = new Map<string, TaskRow[]>();
    allTasks.forEach(task => {
      if (!task.due_date) return;
      const dateKey = task.due_date.split("T")[0];
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(task);
    });
    return map;
  }, [allTasks]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: Array<{ date: Date; dateKey: string; isCurrentMonth: boolean }> = [];

    for (let i = startingDay - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, dateKey: d.toISOString().split("T")[0], isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      days.push({ date: d, dateKey: d.toISOString().split("T")[0], isCurrentMonth: true });
    }

    const remaining = 42 - days.length;
    for (let day = 1; day <= remaining; day++) {
      const d = new Date(year, month + 1, day);
      days.push({ date: d, dateKey: d.toISOString().split("T")[0], isCurrentMonth: false });
    }

    return days;
  }, [year, month]);

  const todayStr = new Date().toISOString().split("T")[0];

  const selectedTasks = useMemo(() => {
    if (!selectedDate) return [];
    return tasksByDate.get(selectedDate) ?? [];
  }, [selectedDate, tasksByDate]);

  const upcomingDeadlines = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return allTasks
      .filter(t => t.due_date && new Date(t.due_date) >= today && t.completed_at === null)
      .sort((a, b) => (a.due_date ?? "").localeCompare(b.due_date ?? ""))
      .slice(0, 5);
  }, [allTasks]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (dateKey: string) => {
    setSelectedDate(dateKey);
    setDrawerOpen(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 1200, mx: "auto", width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: { xs: 24, md: 28 }, fontWeight: 700, letterSpacing: "-0.02em" }}>
          {MONTHS[month]} {year}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={handlePrevMonth} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton onClick={handleNextMonth} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 1,
          bgcolor: isDark ? "#12101e" : "#FFFFFF",
          borderRadius: "20px",
          border: `1px solid ${theme.palette.divider}`,
          p: 2,
          boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.18)" : "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        {WEEKDAYS.map(day => (
          <Box
            key={day}
            sx={{
              textAlign: "center",
              py: 1,
              fontSize: 12,
              fontWeight: 600,
              color: theme.palette.text.secondary,
              letterSpacing: "0.05em",
            }}
          >
            {day}
          </Box>
        ))}

        {calendarDays.map(({ date, dateKey, isCurrentMonth }) => {
          const dayTasks = tasksByDate.get(dateKey) ?? [];
          const isToday = dateKey === todayStr;
          const isSelected = dateKey === selectedDate;

          return (
            <Box
              key={dateKey}
              onClick={() => isCurrentMonth && handleDayClick(dateKey)}
              sx={{
                aspectRatio: "1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                borderRadius: "12px",
                fontSize: 14,
                fontWeight: isToday ? 700 : isCurrentMonth ? 500 : 400,
                color: isCurrentMonth ? theme.palette.text.primary : theme.palette.text.disabled,
                bgcolor: isSelected
                  ? alpha(theme.palette.primary.main, 0.12)
                  : isToday
                    ? alpha(theme.palette.primary.main, 0.08)
                    : "transparent",
                cursor: isCurrentMonth ? "pointer" : "default",
                transition: "all 120ms ease",
                position: "relative",
                "&:hover": isCurrentMonth
                  ? {
                      bgcolor: isSelected
                        ? alpha(theme.palette.primary.main, 0.16)
                        : isDark ? "rgba(255,255,255,0.04)" : "#F2F4F7",
                    }
                  : {},
              }}
            >
              <Typography sx={{ fontSize: 14, lineHeight: 1 }}>{date.getDate()}</Typography>
              {dayTasks.length > 0 && (
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", justifyContent: "center" }}>
                  {dayTasks.slice(0, 2).map(task => {
                    const config = priorityConfig[task.priority as keyof typeof priorityConfig];
                    return (
                      <Box
                        key={task.id}
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: config?.color ?? theme.palette.primary.main,
                        }}
                      />
                    );
                  })}
                  {dayTasks.length > 2 && (
                    <Typography sx={{ fontSize: 9, color: theme.palette.text.secondary, lineHeight: 1 }}>
                      +{dayTasks.length - 2}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>

      {upcomingDeadlines.length > 0 && (
        <Box
          sx={{
            bgcolor: isDark ? "#12101e" : "#FFFFFF",
            borderRadius: "20px",
            border: `1px solid ${theme.palette.divider}`,
            p: 3,
            boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.18)" : "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 2, letterSpacing: "-0.01em" }}>
            Upcoming Deadlines
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {upcomingDeadlines.map(task => {
              const dueDate = new Date(task.due_date ?? "");
              const today = new Date();
              const isOverdue = dueDate < today && dueDate.toDateString() !== today.toDateString();
              const isToday = dueDate.toDateString() === today.toDateString();
              const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

              return (
                <Box
                  key={task.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: "14px",
                    bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#F7F8FA",
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
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: isOverdue
                        ? alpha("#EF4444", 0.1)
                        : isToday
                          ? alpha(theme.palette.primary.main, 0.1)
                          : alpha(theme.palette.text.secondary, 0.08),
                      color: isOverdue
                        ? theme.palette.error.main
                        : isToday
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                      flexShrink: 0,
                    }}
                  >
                    <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>
                      {dueDate.getDate()}
                    </Typography>
                    <Typography sx={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", lineHeight: 1 }}>
                      {dueDate.toLocaleString("en-US", { month: "short" })}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {task.title}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: theme.palette.text.secondary, mt: 0.25 }}>
                      {projects.find(p => p.id === task.project_id)?.name ?? "Unknown Project"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
                    <AccessTimeIcon sx={{ fontSize: 14, color: isOverdue ? theme.palette.error.main : theme.palette.text.secondary }} />
                    <Typography
                      sx={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: isOverdue ? theme.palette.error.main : theme.palette.text.secondary,
                      }}
                    >
                      {isOverdue ? `${Math.abs(daysUntil)}d overdue` : isToday ? "Today" : `${daysUntil}d`}
                    </Typography>
                  </Box>
                  <Chip
                    label={task.priority}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: 11,
                      height: 22,
                      bgcolor: alpha(priorityConfig[task.priority as keyof typeof priorityConfig]?.color ?? "#64748B", 0.1),
                      color: priorityConfig[task.priority as keyof typeof priorityConfig]?.color ?? "#64748B",
                      "& .MuiChip-label": { px: 1 },
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: 400 },
            boxSizing: "border-box",
            borderRadius: "20px 0 0 20px",
          },
        }}
      >
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
              {selectedDate
                ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <ChevronLeftIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, overflowY: "auto", flex: 1 }}>
            {selectedTasks.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <EventIcon sx={{ fontSize: 40, color: theme.palette.text.disabled, mb: 1 }} />
                <Typography sx={{ color: theme.palette.text.secondary, fontSize: 14 }}>
                  No tasks scheduled for this day.
                </Typography>
              </Box>
            ) : (
              selectedTasks.map(task => {
                const config = priorityConfig[task.priority as keyof typeof priorityConfig];
                const isCompleted = task.completed_at !== null;

                return (
                  <Box
                    key={task.id}
                    sx={{
                      p: 2,
                      borderRadius: "14px",
                      bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#F7F8FA",
                      border: `1px solid ${theme.palette.divider}`,
                      borderLeft: `4px solid ${config?.color ?? theme.palette.primary.main}`,
                      opacity: isCompleted ? 0.6 : 1,
                    }}
                  >
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: theme.palette.text.primary, mb: 0.5 }}>
                      {task.title}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                      <Chip
                        label={task.priority}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: 11,
                          height: 22,
                          bgcolor: alpha(config?.color ?? "#64748B", 0.1),
                          color: config?.color ?? "#64748B",
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                      <Typography sx={{ fontSize: 12, color: theme.palette.text.secondary }}>
                        {isCompleted ? "Completed" : "In Progress"}
                      </Typography>
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
