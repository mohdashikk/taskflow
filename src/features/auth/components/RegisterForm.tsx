"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useRegisterMutation } from "../hooks/useRegisterMutation";
import { useAuthTheme, AUTH_ACCENT_HOVER } from "../hooks/useAuthTheme";

export default function RegisterForm() {
  const router = useRouter();
  const colors = useAuthTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    mutate: register,
    isSubmitting,
    isSuccess,
    isError,
    error,
  } = useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account created successfully!");
      router.replace("/");
    }
  }, [isSuccess, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    register({ displayName, email, password });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          borderRadius: "24px",
          border: `1px solid ${colors.cardBorder}`,
          backgroundColor: colors.cardBg,
          p: { xs: 3, sm: 4 },
          boxShadow: colors.isDark
            ? "0 24px 64px rgba(0, 0, 0, 0.4)"
            : "0 24px 64px rgba(15, 23, 42, 0.06)",
        }}
      >
        <Box sx={{ mb: 5, textAlign: "center" }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 52,
                height: 52,
                borderRadius: 4,
                bgcolor: colors.accent,
                mb: 2.5,
                boxShadow: colors.accentAlpha(0.25),
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            </Box>
          </motion.div>
          <Typography
            component="h1"
            sx={{
              color: colors.isDark ? "#FFFFFF" : "#111827",
              fontSize: { xs: 26, sm: 30 },
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              mb: 0.75,
            }}
          >
            Create your account
          </Typography>
          <Typography
            sx={{
              color: colors.isDark ? "#B5B7C8" : "#6B7280",
              fontSize: 15,
              lineHeight: 1.6,
            }}
          >
            Start organizing your work and hitting your targets
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <TextField
            fullWidth
            required
            label="Display Name"
            name="displayName"
            placeholder="Jane Doe"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        display: "grid",
                        placeItems: "center",
                        color: colors.isDark ? "#B5B7C8" : "#6B7280",
                      }}
                    >
                      <PersonOutlineOutlinedIcon fontSize="small" />
                    </Box>
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                bgcolor: colors.inputBg,
                "& fieldset": {
                  borderColor: colors.inputBorder,
                },
                "&:hover fieldset": {
                  borderColor: colors.accent,
                },
                "&.Mui-focused fieldset": {
                  borderColor: colors.accent,
                  boxShadow: colors.accentAlpha(0.1),
                },
                "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus": {
                  WebkitBoxShadow: "0 0 0px 1000px #FFFFFF inset",
                  transition: "background-color 5000s ease-in-out 0s",
                },
              },
            }}
          />

          <TextField
            fullWidth
            required
            label="Email"
            name="email"
            placeholder="you@company.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                bgcolor: colors.inputBg,
                "& fieldset": {
                  borderColor: colors.inputBorder,
                },
                "&:hover fieldset": {
                  borderColor: colors.accent,
                },
                "&.Mui-focused fieldset": {
                  borderColor: colors.accent,
                  boxShadow: colors.accentAlpha(0.1),
                },
                "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus": {
                  WebkitBoxShadow: "0 0 0px 1000px #FFFFFF inset",
                  transition: "background-color 5000s ease-in-out 0s",
                },
              },
            }}
          />

          <TextField
            fullWidth
            required
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      edge="end"
                      onClick={() => setShowPassword((current) => !current)}
                      sx={{
                        borderRadius: 2,
                        color: colors.isDark ? "#B5B7C8" : "#6B7280",
                        "&:hover": {
                          bgcolor: colors.accentAlpha(0.06),
                          color: colors.accent,
                        },
                      }}
                    >
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon fontSize="small" />
                      ) : (
                        <VisibilityOutlinedIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                bgcolor: colors.inputBg,
                "& fieldset": {
                  borderColor: colors.inputBorder,
                },
                "&:hover fieldset": {
                  borderColor: colors.accent,
                },
                "&.Mui-focused fieldset": {
                  borderColor: colors.accent,
                  boxShadow: colors.accentAlpha(0.1),
                },
                "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus": {
                  WebkitBoxShadow: "0 0 0px 1000px #FFFFFF inset",
                  transition: "background-color 5000s ease-in-out 0s",
                },
              },
            }}
          />

          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                height: 52,
                borderRadius: "14px",
                bgcolor: colors.accent,
                boxShadow: colors.accentAlpha(0.25),
                fontSize: 16,
                fontWeight: 600,
                textTransform: "none",
                letterSpacing: "-0.01em",
                "&:hover": {
                  bgcolor: AUTH_ACCENT_HOVER,
                  boxShadow: colors.accentAlpha(0.3),
                },
                "&.Mui-disabled": {
                  bgcolor: colors.isDark ? "rgba(255,255,255,0.08)" : "#D1D5DB",
                  boxShadow: "none",
                },
              }}
            >
              {isSubmitting ? "Creating account..." : "Get Started"}
            </Button>
          </motion.div>
        </Box>

        {isError && (
          <Typography
            sx={{
              mt: 3,
              color: "#EF4444",
              fontSize: 14,
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            {error instanceof Error ? error.message : "Unable to create account"}
          </Typography>
        )}

        <Typography
          sx={{
            mt: 4,
            color: colors.isDark ? "#B5B7C8" : "#6B7280",
            fontSize: 14,
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          Already have an account?{" "}
          <Link
            href="/"
            underline="hover"
            sx={{
              color: colors.accent,
              fontWeight: 700,
              "&:hover": {
                color: AUTH_ACCENT_HOVER,
              },
            }}
          >
            Sign in
          </Link>
        </Typography>
      </Paper>
    </motion.div>
  );
}
