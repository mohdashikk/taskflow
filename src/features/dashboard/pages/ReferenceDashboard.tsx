"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDashboardData } from "../hooks/useDashboardData";

const panel = {
  bgcolor: "background.paper", border: "1px solid", borderColor: "divider",
  borderRadius: "20px", p: { xs: 2.5, lg: 3.5 }, boxShadow: "0 3px 6px rgba(20,30,25,.035)",
};
const row = {
  display: "flex", justifyContent: "space-between", gap: 2, py: 2,
  borderTop: "1px solid", borderColor: "divider", color: "inherit", textDecoration: "none",
  "&:hover": { color: "primary.main" },
};

export default function ReferenceDashboard() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { stats, tasks, projects, isLoading, error } = useDashboardData();
  const [period, setPeriod] = useState<7 | 30 | 180>(30);

  if (authLoading || isLoading) return <Box sx={{ py: 12, textAlign: "center" }}><CircularProgress aria-label="Loading dashboard" /></Box>;
  if (!isAuthenticated) return <Alert severity="info">Sign in to view your dashboard.</Alert>;
  if (error) return <Alert severity="error">Unable to load dashboard data. Please refresh and try again.</Alert>;

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const total = tasks.length;
  const completion = total ? Math.round(stats.completedTasks / total * 100) : 0;
  const activeProjects = projects.filter(project => project.status === "active").length;
  const todayTasks = tasks.filter(task => task.due_date === today && !task.completed_at).slice(0, 4);
  const projectDeadlines = projects
    .filter(project => project.dueDateRaw && project.status !== "completed" && project.status !== "archived")
    .sort((a, b) => a.dueDateRaw!.localeCompare(b.dueDateRaw!))
    .slice(0, 4);
  const buckets = Array.from({ length: 6 }, (_, index) => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    end.setDate(end.getDate() - Math.floor((5 - index) * period / 6));
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - Math.floor((6 - index) * period / 6) + 1);
    const within = (value: string | null) => value && new Date(value) >= start && new Date(value) <= end;
    return { label: end.toLocaleDateString("en-US", { month: "short", day: "numeric" }), created: tasks.filter(task => within(task.created_at)).length, completed: tasks.filter(task => within(task.completed_at)).length };
  });
  const maximum = Math.max(4, ...buckets.flatMap(bucket => [bucket.created, bucket.completed]));
  const points = (key: "created" | "completed") => buckets.map((bucket, index) => `${54 + index * 122},${250 - bucket[key] / maximum * 210}`).join(" ");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2.5, lg: 3.5 } }}>
      <Box sx={{ ...panel, border: 0, color: "white", background: "linear-gradient(110deg,#00A768,#007648 58%,#00A768)", display: "grid", gridTemplateColumns: { xs: "1fr", sm: "minmax(0, 1fr) auto" }, alignItems: "center", columnGap: 3, rowGap: 2, minHeight: { sm: 148 } }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: { xs: 23, lg: 28 }, fontWeight: 750, lineHeight: 1.25 }}>Your work, clearly in view</Typography>
          <Typography sx={{ mt: 1, fontSize: 15, lineHeight: 1.6 }}>{stats.dueToday ? `${stats.dueToday} task${stats.dueToday === 1 ? "" : "s"} need attention today.` : "You have no tasks due today."}</Typography>
        </Box>
        <Button component={Link} href="/projects/new" sx={{ justifySelf: { xs: "start", sm: "end" }, bgcolor: "white", color: "#173A2B", borderRadius: "30px", px: 3, height: 54, whiteSpace: "nowrap", "&:hover": { bgcolor: "#E6F5EE" } }}>New project</Button>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", xl: "1fr 1fr" }, gap: { xs: 2.5, lg: 3.5 }, alignItems: "start" }}>
        <Box sx={{ display: "grid", gap: { xs: 2.5, lg: 3.5 } }}>
          <Box sx={panel}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}><Typography sx={{ fontSize: 20, fontWeight: 750 }}>Today&apos;s tasks</Typography><Typography color="text.secondary" sx={{ fontSize: 13 }}>{todayTasks.length} due</Typography></Box>
            {todayTasks.length ? todayTasks.map(task => <Box component={Link} href={`/projects/${task.project_id}/tasks`} key={task.id} sx={row}><Typography sx={{ fontWeight: 600, fontSize: 14 }}>{task.title}</Typography><Typography color="text.secondary" sx={{ fontSize: 12, textTransform: "capitalize" }}>{task.priority}</Typography></Box>) : <Typography color="text.secondary">No tasks due today.</Typography>}
          </Box>

          <Box sx={panel}>
            <Typography sx={{ fontSize: 20, fontWeight: 750 }}>Your workload</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 2, mt: 3 }}>
              {[["Open", stats.openTasks], ["Due today", stats.dueToday], ["Completed", stats.completedTasks]].map(([label, value]) => <Box key={label} sx={{ p: 2, borderRadius: "14px", bgcolor: "action.hover" }}><Typography color="text.secondary" sx={{ fontSize: 12 }}>{label}</Typography><Typography sx={{ mt: 0.5, fontSize: { xs: 22, sm: 28 }, fontWeight: 750 }}>{value}</Typography></Box>)}
            </Box>
            <Typography color="text.secondary" sx={{ fontSize: 14, mt: 2.5 }}>{activeProjects} active project{activeProjects === 1 ? "" : "s"} and {total} total task{total === 1 ? "" : "s"}.</Typography>
          </Box>

          <Box sx={panel}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}><Typography sx={{ fontSize: 20, fontWeight: 750 }}>Your projects</Typography><Button component={Link} href="/projects" size="small" sx={{ textTransform: "none" }}>View all</Button></Box>
            {projects.length ? projects.slice(0, 4).map(project => <Box component={Link} href={`/projects/${project.id}/overview`} key={project.id} sx={row}><Typography sx={{ fontWeight: 600 }}>{project.name}</Typography><Typography color="text.secondary" sx={{ fontSize: 13, textTransform: "capitalize" }}>{project.status}</Typography></Box>) : <Typography color="text.secondary">No projects yet.</Typography>}
          </Box>

        </Box>

        <Box sx={{ display: "grid", gap: { xs: 2.5, lg: 3.5 } }}>
          <Box sx={panel}>
            <Typography sx={{ fontSize: 20, fontWeight: 750 }}>Completion</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 2.5 }}><Box sx={{ width: 72, height: 72, borderRadius: "50%", display: "grid", placeItems: "center", bgcolor: "action.hover", color: "primary.main", fontSize: 20, fontWeight: 750, flexShrink: 0 }}>{completion}%</Box><Box><Typography sx={{ fontWeight: 650 }}>Overall progress</Typography><Typography color="text.secondary" sx={{ fontSize: 14, mt: 0.5 }}>{stats.completedTasks} of {total} tasks completed across your workspace.</Typography></Box></Box>
          </Box>

          <Box sx={panel}>
            <Typography sx={{ fontSize: 20, fontWeight: 750, mb: 2 }}>Project deadlines</Typography>
            {projectDeadlines.length ? projectDeadlines.map(project => {
              const dueDate = new Date(`${project.dueDateRaw}T00:00:00`);
              const daysUntil = Math.ceil((dueDate.getTime() - new Date(`${today}T00:00:00`).getTime()) / 86_400_000);
              const deadlineLabel = daysUntil < 0 ? `${Math.abs(daysUntil)}d overdue` : daysUntil === 0 ? "Today" : `${daysUntil}d left`;
              return <Box component={Link} href={`/projects/${project.id}/overview`} key={project.id} sx={row}><Box><Typography sx={{ fontSize: 14, fontWeight: 600 }}>{project.name}</Typography><Typography color="text.secondary" sx={{ fontSize: 12, textTransform: "capitalize" }}>{project.status}</Typography></Box><Box sx={{ textAlign: "right" }}><Typography sx={{ fontSize: 13, fontWeight: 600, color: daysUntil < 0 ? "error.main" : "text.primary" }}>{deadlineLabel}</Typography><Typography color="text.secondary" sx={{ fontSize: 12 }}>{project.dueDate}</Typography></Box></Box>;
            }) : <Typography color="text.secondary">No project deadlines yet.</Typography>}
          </Box>

          <Box sx={panel}>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap", mb: 2 }}><Box><Typography sx={{ fontSize: 20, fontWeight: 750 }}>Task statistics</Typography><Typography color="text.secondary" sx={{ fontSize: 13, mt: 0.5 }}>Created and completed tasks</Typography></Box><Box sx={{ display: "flex", gap: 0.5 }}>{([7, 30, 180] as const).map(value => <Button key={value} size="small" onClick={() => setPeriod(value)} sx={{ minWidth: 48, height: 30, borderRadius: "16px", bgcolor: period === value ? "action.selected" : "transparent", color: period === value ? "primary.main" : "text.secondary" }}>{value === 7 ? "Week" : value === 30 ? "Month" : "6 mo"}</Button>)}</Box></Box>
            <Box sx={{ display: "flex", gap: 3, mb: 2, fontSize: 12 }}><span style={{ color: "#00A768" }}>● Created</span><span style={{ color: "#FF6257" }}>● Completed</span></Box>
            <Box component="svg" viewBox="0 0 700 295" role="img" aria-label="Tasks created and completed over the selected period" sx={{ width: "100%", height: "auto", minHeight: 220, overflow: "visible" }}>
              {[0, 1, 2, 3, 4].map(index => <g key={index}><line x1="54" x2="664" y1={250 - index * 52.5} y2={250 - index * 52.5} stroke="currentColor" opacity=".1" strokeDasharray="5 6" /><text x="35" y={255 - index * 52.5} fontSize="12" fill="currentColor" textAnchor="end">{Math.round(maximum * index / 4)}</text></g>)}
              <polyline points={points("created")} fill="none" stroke="#00A768" strokeWidth="4" strokeLinejoin="round" /><polyline points={points("completed")} fill="none" stroke="#FF6257" strokeWidth="4" strokeLinejoin="round" />
              {buckets.map((bucket, index) => <text key={bucket.label} x={54 + index * 122} y="280" textAnchor="middle" fontSize="11" fill="currentColor">{bucket.label}</text>)}
            </Box>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}
