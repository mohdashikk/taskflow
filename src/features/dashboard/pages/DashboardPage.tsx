"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { motion } from "framer-motion";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const logout = useLogout();

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
        <CircularProgress size={32} sx={{ color: "#006F99" }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    router.replace("/");
    return null;
  }

  const displayName =
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "User";

  const handleLogout = () => {
    void logout();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Welcome Banner */}
      <motion.div variants={fadeInUp} initial="hidden" animate="show">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: "24px",
            border: "1px solid #E6E8EB",
            bgcolor: "#FFFFFF",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
            background: "linear-gradient(135deg, #006F99 0%, #005670 100%)",
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
              {displayName.charAt(0).toUpperCase()}
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
                Good {getTimeOfDay()}, {displayName}
              </Typography>
              <Typography
                sx={{
                  mt: 0.5,
                  opacity: 0.85,
                  fontSize: 15,
                  lineHeight: 1.5,
                }}
              >
                You have 3 tasks due today. Keep up the momentum!
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1.5 }}>
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
              <Button
                variant="outlined"
                onClick={handleLogout}
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
            </Box>
          </Box>
        </Paper>
      </motion.div>

      {/* Bento Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 24,
        }}
      >
        {/* Today's Focus */}
        <motion.div
          variants={fadeInUp}
        >
          <WidgetCard title="Today's Focus">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[1, 2, 3].map((i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: "14px",
                    bgcolor: "#F7F8FA",
                    border: "1px solid #E6E8EB",
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "#006F99",
                      flexShrink: 0,
                    }}
                  />
                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>
                    {["Review design mockups", "Update project timeline", "Team sync meeting"][i - 1]}
                  </Typography>
                  <Box sx={{ flex: 1 }} />
                  <Typography sx={{ fontSize: 12, color: "#6B7280" }}>
                    {["2h", "4h", "30m"][i - 1]}
                  </Typography>
                </Box>
              ))}
            </Box>
          </WidgetCard>
        </motion.div>

        {/* Weekly Progress */}
        <motion.div variants={fadeInUp}>
          <WidgetCard title="Weekly Progress">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                <Typography
                  sx={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: "#006F99",
                    letterSpacing: "-0.02em",
                  }}
                >
                  68%
                </Typography>
                <Typography sx={{ fontSize: 13, color: "#6B7280" }}>
                  completion rate
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                {[65, 45, 80, 55, 90, 40, 68].map((val, i) => (
                  <Box
                    key={i}
                    sx={{
                      flex: 1,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: "#F2F4F7",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: `${val}%`,
                        bgcolor: "#006F99",
                        borderRadius: 2,
                        opacity: 0.8,
                        transition: "height 400ms ease",
                      }}
                    />
                  </Box>
                ))}
              </Box>
              <Typography sx={{ fontSize: 12, color: "#6B7280", textAlign: "center" }}>
                Mon Tue Wed Thu Fri Sat Sun
              </Typography>
            </Box>
          </WidgetCard>
        </motion.div>

        {/* Task Completion */}
        <motion.div variants={fadeInUp}>
          <WidgetCard title="Task Completion">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    border: "4px solid #006F99",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#006F99" }}>
                    42
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                    of 62 tasks
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#6B7280" }}>
                    completed this week
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ flex: 1, textAlign: "center" }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>
                    12
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#6B7280" }}>
                    In Progress
                  </Typography>
                </Box>
                <Box sx={{ width: 1, bgcolor: "#E6E8EB" }} />
                <Box sx={{ flex: 1, textAlign: "center" }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>
                    8
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#6B7280" }}>
                    Pending
                  </Typography>
                </Box>
              </Box>
            </Box>
          </WidgetCard>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          variants={fadeInUp}
        >
          <WidgetCard title="Recent Projects">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {[
                { name: "Website Redesign", progress: 75, status: "In Progress" },
                { name: "Mobile App v2", progress: 40, status: "Planning" },
                { name: "API Integration", progress: 90, status: "Review" },
              ].map((project, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: "14px",
                    bgcolor: "#F7F8FA",
                    border: "1px solid #E6E8EB",
                    cursor: "pointer",
                    transition: "all 180ms ease",
                    "&:hover": {
                      borderColor: "#006F99",
                      bgcolor: "#FFFFFF",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#111827",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {project.name}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "#6B7280", mt: 0.25 }}>
                      {project.status}
                    </Typography>
                  </Box>
                  <Box sx={{ width: 120, flexShrink: 0 }}>
                    <Box
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: "#E6E8EB",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${project.progress}%`,
                          height: "100%",
                          bgcolor: "#006F99",
                          borderRadius: 3,
                        }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontSize: 11,
                        color: "#6B7280",
                        mt: 0.5,
                        textAlign: "right",
                      }}
                    >
                      {project.progress}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </WidgetCard>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={fadeInUp}>
          <WidgetCard title="Activity Feed">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {[
                { action: "Completed task", target: "Design Review", time: "2h ago" },
                { action: "Added comment to", target: "API Docs", time: "4h ago" },
                { action: "Moved", target: "Homepage Redesign", time: "Yesterday" },
              ].map((activity, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.25,
                    p: 1.5,
                    borderRadius: "10px",
                    bgcolor: "#F7F8FA",
                    border: "1px solid #E6E8EB",
                  }}
                >
                  <Typography sx={{ fontSize: 13, color: "#111827" }}>
                    {activity.action}{" "}
                    <Box component="span" sx={{ fontWeight: 600, color: "#006F99" }}>
                      {activity.target}
                    </Box>
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "#6B7280" }}>
                    {activity.time}
                  </Typography>
                </Box>
              ))}
            </Box>
          </WidgetCard>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={fadeInUp}>
          <WidgetCard title="Team Stats">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "#006F99",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  JD
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                    John Doe
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "#6B7280" }}>
                    12 tasks completed
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "#7C3AED",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  AS
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                    Alice Smith
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "#6B7280" }}>
                    9 tasks completed
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "#F59E0B",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  MJ
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                    Mike Johnson
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "#6B7280" }}>
                    7 tasks completed
                  </Typography>
                </Box>
              </Box>
            </Box>
          </WidgetCard>
        </motion.div>

        {/* Calendar Preview */}
        <motion.div variants={fadeInUp}>
          <WidgetCard title="Calendar">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                  July 2026
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <Button size="small" sx={{ minWidth: 28, height: 28, borderRadius: 2, color: "#6B7280" }}>
                    &lt;
                  </Button>
                  <Button size="small" sx={{ minWidth: 28, height: 28, borderRadius: 2, color: "#6B7280" }}>
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
                {["M", "T", "W", "T", "F", "S", "S"].map((d) => (
                  <Typography
                    key={d}
                    sx={{ fontSize: 11, fontWeight: 600, color: "#6B7280", py: 0.5 }}
                  >
                    {d}
                  </Typography>
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <Box
                    key={day}
                    sx={{
                      aspectRatio: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 2,
                      fontSize: 12,
                      fontWeight: day === 21 ? 700 : 400,
                      color: day === 21 ? "#006F99" : "#111827",
                      bgcolor: day === 21 ? "rgba(0, 111, 153, 0.08)" : "transparent",
                      cursor: "pointer",
                      transition: "all 120ms ease",
                      "&:hover": {
                        bgcolor: day === 21 ? "rgba(0, 111, 153, 0.12)" : "#F2F4F7",
                      },
                    }}
                  >
                    {day}
                  </Box>
                ))}
              </Box>
            </Box>
          </WidgetCard>
        </motion.div>
      </motion.div>
    </Box>
  );
}

function WidgetCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: "20px",
        border: "1px solid #E6E8EB",
        bgcolor: "#FFFFFF",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        transition: "all 220ms cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
          borderColor: "#D1D5DB",
        },
      }}
    >
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 600,
          color: "#6B7280",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </Typography>
      {children}
    </Paper>
  );
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function alpha(hex: string, opacity: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
