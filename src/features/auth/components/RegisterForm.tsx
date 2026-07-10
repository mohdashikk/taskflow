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
import toast from "react-hot-toast";
import { useRegisterMutation } from "../hooks/useRegisterMutation";

export default function RegisterForm() {
  const router = useRouter();
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
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        borderRadius: "16px",
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        p: { xs: 3, sm: 4 },
        boxShadow: "0 24px 64px rgba(15, 23, 42, 0.08)",
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
            fontSize: { xs: 28, sm: 32 },
            fontWeight: 800,
            letterSpacing: 0,
            lineHeight: 1.2,
          }}
        >
          Create your account
        </Typography>
        <Typography
          sx={{
            mt: 1.25,
            color: "text.secondary",
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >
          Start organizing your work and hitting your delivery targets.
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
                      color: "text.secondary",
                    }}
                  >
                    <PersonOutlineOutlinedIcon fontSize="small" />
                  </Box>
                </InputAdornment>
              ),
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

        <Button
          fullWidth
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{
            height: 48,
            borderRadius: "12px",
            backgroundColor: "primary.main",
            boxShadow: "0 16px 32px rgba(37, 99, 235, 0.24)",
            fontSize: 15,
            fontWeight: 800,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "primary.dark",
              boxShadow: "0 18px 36px rgba(37, 99, 235, 0.28)",
            },
            "&.Mui-disabled": {
              backgroundColor: "action.disabledBackground",
              color: "action.disabled",
            },
          }}
        >
          {isSubmitting ? "Creating account..." : "Get Started"}
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
          {error instanceof Error ? error.message : "Unable to create account"}
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
        Already have an account?{" "}
        <Link
          href="/"
          underline="hover"
          sx={{
            color: "primary.main",
            fontWeight: 800,
          }}
        >
          Sign in
        </Link>
      </Typography>
    </Paper>
  );
}
