"use client";

import { AnimatePresence, motion } from "framer-motion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTheme } from "@mui/material/styles";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";
import WelcomeBanner from "@/features/dashboard/components/WelcomeBanner";
import ContinueWorking from "@/features/dashboard/components/ContinueWorking";
import TodayTasks from "@/features/dashboard/components/TodayTasks";
import RecentProjects from "@/features/dashboard/components/RecentProjects";
import UpcomingDeadlines from "@/features/dashboard/components/UpcomingDeadlines";
import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData";
import StatCard from "@/features/dashboard/components/QuickStats";

export default function DashboardPage() {
  const theme = useTheme();
  const { user, isLoading, isAuthenticated } = useAuth();
  const logout = useLogout();
  const {
    stats,
    continueWorking,
    upcomingDeadlines,
    recentProjects,
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
          subtitle={`You have ${todayCount} task${todayCount !== 1 ? "s" : ""} due today across ${stats.totalProjects} project${stats.totalProjects !== 1 ? "s" : ""}. Keep up the momentum!`}
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
          <Box key="continue-working" sx={{ gridColumn: { xs: "1", sm: "span 2", lg: "span 3", xl: "span 3" } }}>
            <ContinueWorking items={continueWorking} delay={0.1} />
          </Box>

          <Box key="today-tasks" sx={{ gridColumn: { xs: "1", sm: "span 2", lg: "span 1", xl: "span 1" } }}>
            <TodayTasks items={continueWorking.map(i => ({ ...i, completed: false }))} delay={0.2} />
          </Box>

          <Box key="upcoming-deadlines" sx={{ gridColumn: { xs: "1", sm: "span 2", lg: "span 1", xl: "span 2" } }}>
            <UpcomingDeadlines items={upcomingDeadlines} delay={0.15} />
          </Box>

          <Box key="recent-projects" sx={{ gridColumn: { xs: "1", sm: "span 2", lg: "span 1", xl: "span 2" } }}>
            <RecentProjects projects={recentProjects} delay={0.25} />
          </Box>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
