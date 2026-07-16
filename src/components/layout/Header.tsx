"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";
import ThemeSwitcher from "@/features/auth/components/ThemeSwitcher";

export default function Header() {
  const { user } = useAuth();
  const logout = useLogout();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const open = Boolean(anchorEl);

  const displayName =
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "User";
  const email = user?.email ?? "";
  const initials = displayName.charAt(0).toUpperCase();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    void logout();
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "text.primary",
            }}
          >
            <AssignmentTurnedInOutlinedIcon
              color="primary"
              fontSize="medium"
            />
            <Typography
              variant="h6"
              component="span"
              fontWeight={800}
            >
              TaskFlow
            </Typography>
          </Box>
        </Link>

        <Box sx={{ flexGrow: 1 }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ThemeSwitcher />

          <Tooltip title="Account">
            <IconButton
              onClick={handleOpen}
              size="small"
              aria-label="account menu"
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              sx={{ p: 0.25 }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 36,
                  height: 36,
                  fontSize: 16,
                  fontWeight: 800,
                }}
              >
                {initials}
              </Avatar>
              <KeyboardArrowDownOutlinedIcon
                fontSize="small"
                sx={{ ml: 0.25, color: "text.secondary" }}
              />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{
              horizontal: "right",
              vertical: "top",
            }}
            anchorOrigin={{
              horizontal: "right",
              vertical: "bottom",
            }}
            slotProps={{
              paper: {
                sx: { mt: 1, minWidth: 220, borderRadius: 2 },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography fontWeight={700} noWrap>
                {displayName}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
              >
                {email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutOutlinedIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
