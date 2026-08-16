"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useUpdateProfile } from "@/features/auth/hooks/useUpdateProfile";
import { useAuthTheme, AUTH_ACCENT_HOVER } from "@/features/auth/hooks/useAuthTheme";

export default function SettingsPage() {
  const theme = useAuthTheme();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { mutate: updateProfile, isSubmitting } = useUpdateProfile();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.user_metadata?.display_name ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  const handleSubmitProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfile(
      {
        displayName: displayName.trim() || undefined,
        email: email.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully");
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : "Failed to update profile");
        },
      }
    );
  };

  const handleSubmitPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    updateProfile(
      { password: newPassword },
      {
        onSuccess: () => {
          toast.success("Password updated successfully");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : "Failed to update password");
        },
      }
    );
  };

  if (isLoading || !user) {
    return null;
  }

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
            Settings
          </Typography>
          <Typography sx={{ color: theme.isDark ? "#B5B7C8" : "#6B7280", fontSize: 15 }}>
            Manage your account preferences
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: "24px",
              border: `1px solid ${theme.cardBorder}`,
              backgroundColor: theme.cardBg,
              p: { xs: 3, sm: 4 },
              boxShadow: theme.isDark
                ? "0 24px 64px rgba(0, 0, 0, 0.4)"
                : "0 24px 64px rgba(15, 23, 42, 0.06)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  bgcolor: theme.accent,
                  color: "#FFFFFF",
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                {(user.user_metadata?.display_name ?? user.email ?? "U")
                  .charAt(0)
                  .toUpperCase()}
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
                  {user.user_metadata?.display_name ?? "User"}
                </Typography>
                <Typography sx={{ color: theme.isDark ? "#B5B7C8" : "#6B7280", fontSize: 14 }}>
                  {user.email}
                </Typography>
              </Box>
            </Box>

            <Box
              component="form"
              onSubmit={handleSubmitProfile}
              noValidate
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <TextField
                fullWidth
                label="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    bgcolor: theme.inputBg,
                    "& fieldset": { borderColor: theme.inputBorder },
                    "&:hover fieldset": { borderColor: theme.accent },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.accent,
                      boxShadow: theme.accentAlpha(0.1),
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    bgcolor: theme.inputBg,
                    "& fieldset": { borderColor: theme.inputBorder },
                    "&:hover fieldset": { borderColor: theme.accent },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.accent,
                      boxShadow: theme.accentAlpha(0.1),
                    },
                  },
                }}
              />

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    height: 52,
                    borderRadius: "14px",
                    bgcolor: theme.accent,
                    boxShadow: theme.accentAlpha(0.25),
                    fontSize: 16,
                    fontWeight: 600,
                    textTransform: "none",
                    letterSpacing: "-0.01em",
                    "&:hover": {
                      bgcolor: AUTH_ACCENT_HOVER,
                      boxShadow: theme.accentAlpha(0.3),
                    },
                    "&.Mui-disabled": {
                      bgcolor: theme.isDark ? "rgba(255,255,255,0.08)" : "#D1D5DB",
                      boxShadow: "none",
                    },
                  }}
                >
                  {isSubmitting ? "Saving..." : "Save Profile"}
                </Button>
              </motion.div>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              borderRadius: "24px",
              border: `1px solid ${theme.cardBorder}`,
              backgroundColor: theme.cardBg,
              p: { xs: 3, sm: 4 },
              boxShadow: theme.isDark
                ? "0 24px 64px rgba(0, 0, 0, 0.4)"
                : "0 24px 64px rgba(15, 23, 42, 0.06)",
            }}
          >
            <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 3 }}>
              Change Password
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmitPassword}
              noValidate
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <TextField
                fullWidth
                label="Current Password"
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    bgcolor: theme.inputBg,
                    "& fieldset": { borderColor: theme.inputBorder },
                    "&:hover fieldset": { borderColor: theme.accent },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.accent,
                      boxShadow: theme.accentAlpha(0.1),
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="New Password"
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    bgcolor: theme.inputBg,
                    "& fieldset": { borderColor: theme.inputBorder },
                    "&:hover fieldset": { borderColor: theme.accent },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.accent,
                      boxShadow: theme.accentAlpha(0.1),
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Confirm New Password"
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    bgcolor: theme.inputBg,
                    "& fieldset": { borderColor: theme.inputBorder },
                    "&:hover fieldset": { borderColor: theme.accent },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.accent,
                      boxShadow: theme.accentAlpha(0.1),
                    },
                  },
                }}
              />

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    height: 52,
                    borderRadius: "14px",
                    bgcolor: theme.accent,
                    boxShadow: theme.accentAlpha(0.25),
                    fontSize: 16,
                    fontWeight: 600,
                    textTransform: "none",
                    letterSpacing: "-0.01em",
                    "&:hover": {
                      bgcolor: AUTH_ACCENT_HOVER,
                      boxShadow: theme.accentAlpha(0.3),
                    },
                    "&.Mui-disabled": {
                      bgcolor: theme.isDark ? "rgba(255,255,255,0.08)" : "#D1D5DB",
                      boxShadow: "none",
                    },
                  }}
                >
                  {isSubmitting ? "Updating..." : "Update Password"}
                </Button>
              </motion.div>
            </Box>
          </Paper>
        </Box>
      </motion.div>
    </Box>
  );
}
