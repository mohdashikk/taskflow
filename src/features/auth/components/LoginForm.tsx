"use client";

import { useState } from "react";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useLoginMutation } from "../hooks/useLoginMutation";

export default function LoginForm() {
  const [showPassword, setShowPassword] =
    useState(false);

  const passwordInputType = showPassword
    ? "text"
    : "password";

  const {
    mutate: login,
    isSubmitting,
    isError,
    error,
  } = useLoginMutation();

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    login({ email, password });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        borderRadius: "16px",
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        p: {
          xs: 3,
          sm: 4,
        },
        boxShadow:
          "0 24px 64px rgba(15, 23, 42, 0.08)",
      }}
    >
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          sx={{
            mb: 1,
            color: "primary.main",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          TaskFlow
        </Typography>
        <Typography
          component="h2"
          sx={{
            color: "text.primary",
            fontSize: {
              xs: 28,
              sm: 32,
            },
            fontWeight: 800,
            letterSpacing: 0,
            lineHeight: 1.2,
          }}
        >
          Sign in to your workspace
        </Typography>
        <Typography
          sx={{
            mt: 1.25,
            color: "text.secondary",
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >
          Manage tasks, track delivery, and hit your milestones.
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <TextField
          fullWidth
          required
          autoComplete="email"
          label="Email"
          name="email"
          placeholder="you@company.com"
          type="email"
        />

        <TextField
          fullWidth
          required
          autoComplete="current-password"
          label="Password"
          name="password"
          type={passwordInputType}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    edge="end"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                  >
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Box className="flex items-center justify-between gap-4">
          <FormControlLabel
            control={<Checkbox name="remember" />}
            label="Remember me"
            sx={{
              m: 0,
              color: "text.primary",
              ".MuiFormControlLabel-label": {
                fontSize: 14,
                fontWeight: 600,
              },
            }}
          />
          <Link
            href="/forgot-password"
            underline="hover"
            sx={{
              color: "primary.main",
              flexShrink: 0,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            Forgot Password?
          </Link>
        </Box>

        <Button
          fullWidth
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{
            height: 48,
            borderRadius: "12px",
            backgroundColor: "primary.main",
            boxShadow:
              "0 16px 32px rgba(37, 99, 235, 0.24)",
            fontSize: 15,
            fontWeight: 800,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "primary.dark",
              boxShadow:
                "0 18px 36px rgba(37, 99, 235, 0.28)",
            },
          }}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </Box>

      {isError && (
        <Typography
          sx={{
            mt: 2,
            color: "error.main",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          {error instanceof Error
            ? error.message
            : "Invalid email or password"}
        </Typography>
      )}

      <Typography
        sx={{
          mt: 3,
          color: "text.secondary",
          fontSize: 14,
          textAlign: "center",
        }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          underline="hover"
          sx={{
            color: "primary.main",
            fontWeight: 800,
          }}
        >
          Create one
        </Link>
      </Typography>
    </Paper>
  );
}
