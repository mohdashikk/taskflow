"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { supabase } from "@/lib/supabase/client";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

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
        <CircularProgress />
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 56,
              height: 56,
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              component="h1"
            >
              {displayName}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {user?.email}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ mb: 3 }}>
          This is your dashboard. Task management features
          will appear here.
        </Typography>

        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Logout
        </Button>
      </Paper>
    </Container>
  );
}
