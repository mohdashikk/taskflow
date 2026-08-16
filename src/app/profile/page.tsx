"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAuthTheme, AUTH_ACCENT_HOVER } from "@/features/auth/hooks/useAuthTheme";

export default function ProfilePage() {
  const theme = useAuthTheme();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return null;
  }

  const displayName =
    user.user_metadata?.display_name ||
    user.email?.split("@")[0] ||
    "User";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", width: "100%" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: { xs: 24, md: 28 },
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              mb: 0.5,
            }}
          >
            Profile
          </Typography>
          <Typography sx={{ color: theme.isDark ? "#B5B7C8" : "#6B7280", fontSize: 15 }}>
            View and manage your account details
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            borderRadius: "24px",
            border: `1px solid ${theme.cardBorder}`,
            backgroundColor: theme.cardBg,
            overflow: "hidden",
            boxShadow: theme.isDark
              ? "0 24px 64px rgba(0, 0, 0, 0.4)"
              : "0 24px 64px rgba(15, 23, 42, 0.06)",
          }}
        >
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`,
              p: { xs: 4, sm: 6 },
              textAlign: "center",
              color: "#FFFFFF",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 180,
                height: 180,
                borderRadius: "50%",
                bgcolor: "rgba(255, 255, 255, 0.08)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -60,
                left: -60,
                width: 200,
                height: 200,
                borderRadius: "50%",
                bgcolor: "rgba(255, 255, 255, 0.05)",
              }}
            />
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 4,
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  color: "#FFFFFF",
                  fontSize: 32,
                  fontWeight: 700,
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  margin: "0 auto",
                  mb: 2,
                }}
              >
                {initials}
              </Avatar>
              <Typography sx={{ fontSize: 24, fontWeight: 700, mb: 0.5 }}>
                {displayName}
              </Typography>
              <Typography sx={{ opacity: 0.85, fontSize: 14 }}>
                {user.email}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: { xs: 3, sm: 4 }, display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: theme.isDark ? "rgba(255,255,255,0.04)" : "#F7F8FA",
                    color: theme.accent,
                  }}
                >
                  <PersonOutlineOutlinedIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 12, color: theme.isDark ? "#B5B7C8" : "#6B7280", fontWeight: 500 }}>
                    Display Name
                  </Typography>
                  <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
                    {user.user_metadata?.display_name ?? "Not set"}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: theme.isDark ? "rgba(255,255,255,0.04)" : "#F7F8FA",
                    color: theme.accent,
                  }}
                >
                  <EmailOutlinedIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 12, color: theme.isDark ? "#B5B7C8" : "#6B7280", fontWeight: 500 }}>
                    Email Address
                  </Typography>
                  <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ pt: 1 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => router.push("/settings")}
                sx={{
                  height: 48,
                  borderRadius: "14px",
                  bgcolor: theme.accent,
                  boxShadow: theme.accentAlpha(0.25),
                  fontSize: 15,
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: AUTH_ACCENT_HOVER,
                    boxShadow: theme.accentAlpha(0.3),
                  },
                }}
              >
                Edit Profile
              </Button>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}
