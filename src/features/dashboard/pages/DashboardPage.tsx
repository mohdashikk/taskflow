"use client";

import { type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";
import WelcomeBanner from "@/features/dashboard/components/WelcomeBanner";
import QuickStats from "@/features/dashboard/components/QuickStats";
import ContinueWorking from "@/features/dashboard/components/ContinueWorking";
import TodayTasks from "@/features/dashboard/components/TodayTasks";
import RecentProjects from "@/features/dashboard/components/RecentProjects";
import UpcomingDeadlines from "@/features/dashboard/components/UpcomingDeadlines";
import WeeklyProductivity from "@/features/dashboard/components/WeeklyProductivity";
import RecentActivity from "@/features/dashboard/components/RecentActivity";
import GitHubIntegration from "@/features/dashboard/components/GitHubIntegration";
import CalendarWidget from "@/features/dashboard/components/CalendarWidget";
import NotificationsWidget from "@/features/dashboard/components/NotificationsWidget";
import TeamCollaboration from "@/features/dashboard/components/TeamCollaboration";
import TimeTracking from "@/features/dashboard/components/TimeTracking";
import GoalsProgress from "@/features/dashboard/components/GoalsProgress";
import ActivityFeed from "@/features/dashboard/components/ActivityFeed";
import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData";
import StatCard from "@/features/dashboard/components/QuickStats";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const todayStr = new Date().toISOString().split("T")[0];
const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];

export default function DashboardPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { user, isLoading, isAuthenticated } = useAuth();
  const logout = useLogout();
  const {
    stats,
    continueWorking,
    upcomingDeadlines,
    recentProjects,
    recentActivity,
    weeklyProductivity,
    isLoading: isDataLoading,
  } = useDashboardData();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: `3px solid ${theme.palette.divider}`,
              borderTopColor: theme.palette.primary.main,
            }}
          />
        </motion.div>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const displayName =
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "User";

  const taskCount = stats.openTasks + stats.completedTasks;
  const todayCount = stats.dueToday;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        maxWidth: 1440,
        mx: "auto",
        width: "100%",
      }}
    >
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } } }} initial="hidden" animate="show">
        <WelcomeBanner
          userName={displayName}
          subtitle={
            isDataLoading
              ? "Loading your dashboard..."
              : `You have ${todayCount} task${todayCount !== 1 ? "s" : ""} due today across ${stats.totalProjects} project${stats.totalProjects !== 1 ? "s" : ""}. Keep up the momentum!`
          }
          primaryAction={
            <Button
              variant="contained"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                color: "#FFFFFF",
                borderRadius: 3,
                px: 3,
                py: 1.25,
                textTransform: "none",
                fontWeight: 600,
                fontSize: 14,
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              New Task
            </Button>
          }
          secondaryAction={
            <Button
              variant="outlined"
              onClick={() => void logout()}
              startIcon={<LogoutIcon />}
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.1)",
                color: "#FFFFFF",
                borderRadius: 3,
                px: 3,
                py: 1.25,
                textTransform: "none",
                fontWeight: 600,
                fontSize: 14,
                border: "1px solid rgba(255, 255, 255, 0.2)",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              Logout
            </Button>
          }
        />
      </motion.div>

      {/* Quick Stats */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
          width: "100%",
        }}
      >
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={
            <Box component="svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </Box>
          }
          delay={0.05}
        />
        <StatCard
          title="Open Tasks"
          value={stats.openTasks}
          change={stats.openTasks > 0 ? `${stats.openTasks} active` : undefined}
          changeType={stats.openTasks > 0 ? "neutral" : "positive"}
          icon={
            <Box component="svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </Box>
          }
          delay={0.1}
        />
        <StatCard
          title="Due Today"
          value={stats.dueToday}
          change={stats.dueToday > 0 ? "Urgent" : "All clear"}
          changeType={stats.dueToday > 0 ? "negative" : "positive"}
          icon={
            <Box component="svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx={12} cy={12} r={10} />
              <polyline points="12 6 12 12 16 14" />
            </Box>
          }
          delay={0.15}
        />
        <StatCard
          title="Completed Tasks"
          value={stats.completedTasks}
          change={`${taskCount > 0 ? Math.round((stats.completedTasks / taskCount) * 100) : 0}% rate`}
          changeType="positive"
          icon={
            <Box component="svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </Box>
          }
          delay={0.2}
        />
      </Box>

      {/* Main Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
            xl: "repeat(4, 1fr)",
          },
          gap: 3,
          width: "100%",
          alignItems: "stretch",
        }}
      >
        <AnimatePresence>
          {/* Continue Working - spans 2 cols on sm+, 2 on xl */}
          <Box sx={{ gridColumn: { xs: "1", sm: "span 2", lg: "span 2", xl: "span 2" } }}>
            <ContinueWorking items={continueWorking} delay={0.1} />
          </Box>

          {/* Upcoming Deadlines */}
          <Box sx={{ gridColumn: { xs: "1", sm: "span 2", lg: "span 1", xl: "span 1" } }}>
            <UpcomingDeadlines items={upcomingDeadlines} delay={0.15} />
          </Box>

          {/* Today's Tasks */}
          <Box sx={{ gridColumn: { xs: "1", sm: "span 1", lg: "span 1", xl: "span 1" } }}>
            <TodayTasks items={continueWorking.map(i => ({ ...i, completed: false }))} delay={0.2} />
          </Box>

          {/* Recent Projects */}
          <Box sx={{ gridColumn: { xs: "1", sm: "span 1", lg: "span 1", xl: "span 1" } }}>
            <RecentProjects projects={recentProjects} delay={0.25} />
          </Box>

          {/* Weekly Productivity - spans 2 cols */}
          <Box sx={{ gridColumn: { xs: "1", sm: "span 2", lg: "span 2", xl: "span 2" } }}>
            <WeeklyProductivity data={weeklyProductivity} delay={0.3} />
          </Box>

          {/* Recent Activity */}
          <Box sx={{ gridColumn: { xs: "1", sm: "span 2", lg: "span 2", xl: "span 2" } }}>
            <RecentActivity items={recentActivity} delay={0.35} />
          </Box>

          {/* Optional Widgets - only render when data is available */}
          <Box sx={{ gridColumn: { xs: "1", sm: "span 2", lg: "span 2", xl: "span 2" } }}>
            <ActivityFeed items={recentActivity} delay={0.4} />
          </Box>
        </AnimatePresence>
      </Box>

      {/* Optional Widgets Section - displayed in a row when available */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 3,
          width: "100%",
        }}
      >
        <GitHubIntegration
          data={{
            branch: "main",
            latestCommit: "feat: Add dashboard widgets",
            lastCommitTime: "2h ago",
            openPullRequests: 2,
            openIssues: 5,
            repoStatus: "healthy",
            deploymentStatus: "deployed",
            repoUrl: "https://github.com/example/taskflow",
          }}
          delay={0.1}
        />
        <CalendarWidget
          events={[
            { id: "1", title: "Team Standup", time: "10:00 AM", date: todayStr, type: "meeting" },
            { id: "2", title: "Project Review", time: "2:00 PM", date: tomorrowStr, type: "meeting" },
          ]}
          delay={0.15}
        />
        <NotificationsWidget
          alerts={[
            { id: "1", title: "New comment on Task", message: "Alice commented on 'Update design mockups'", time: "5m ago", type: "mention", read: false },
            { id: "2", title: "Task completed", message: "Bob completed 'Fix navigation bug'", time: "1h ago", type: "alert", read: false },
            { id: "3", title: "Project updated", message: "Website Redesign project was updated", time: "3h ago", type: "update", read: true },
          ]}
          delay={0.2}
        />
        <TeamCollaboration
          members={[
            { id: "1", name: "John Doe", tasksCompleted: 12, lastActive: "2m ago" },
            { id: "2", name: "Alice Smith", tasksCompleted: 9, lastActive: "15m ago" },
            { id: "3", name: "Mike Johnson", tasksCompleted: 7, lastActive: "1h ago" },
          ]}
          recentAssignments={[
            { id: "1", taskTitle: "Review PR #42", assignedTo: "Alice Smith", time: "30m ago" },
            { id: "2", taskTitle: "Update documentation", assignedTo: "Mike Johnson", time: "2h ago" },
          ]}
          delay={0.25}
        />
        <TimeTracking hoursToday={6.5} weeklyFocusTime={28} dailyGoal={8} weeklyGoal={40} delay={0.3} />
        <GoalsProgress
          goals={[
            { id: "1", title: "Complete Q3 roadmap", progress: 75, target: "By Aug 31" },
            { id: "2", title: "Reduce bug count", progress: 60, target: "By Sep 15" },
          ]}
          projectCompletion={68}
          delay={0.35}
        />
      </Box>
    </Box>
  );
}
