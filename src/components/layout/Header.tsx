"use client";

import { useState } from "react";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { motion } from "framer-motion";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";
import ThemeSwitcher from "@/features/auth/components/ThemeSwitcher";

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { user } = useAuth();
  const logout = useLogout();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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
    <Box
      component={motion.header}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }}
      sx={{
        height: { xs: 64, sm: 72 },
        px: { xs: 1.5, sm: 2.5, md: 3.5, lg: 4 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: { xs: 1, sm: 0 },
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        bgcolor: theme.palette.background.paper,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Page Title */}
      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 }, flex: 1, minWidth: 0 }}>
        {onMobileMenuToggle && (
          <IconButton
            onClick={onMobileMenuToggle}
            sx={{
              display: { xs: "inline-flex", md: "none" },
              width: 36,
              height: 36,
              borderRadius: 2,
              color: theme.palette.text.primary,
              bgcolor: isDark ? theme.palette.grey[900] : "#F2F4F7",
              border: `1px solid ${isDark ? theme.palette.divider : "rgba(0,0,0,0.06)"}`,
              transition: "all 180ms ease",
              flexShrink: 0,
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
              },
            }}
          >
            <MenuOutlinedIcon fontSize="small" />
          </IconButton>
        )}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: { xs: "none", md: "block" },
            maxWidth: 280,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: 40,
              px: 1.5,
              borderRadius: 3,
              bgcolor: isDark
                ? theme.palette.grey[900]
                : "#F2F4F7",
              border: `1px solid ${isDark ? theme.palette.divider : "rgba(0,0,0,0.06)"}`,
              transition: "all 180ms ease",
              "&:hover": {
                borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
              },
              "&:focus-within": {
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.08)}`,
              },
            }}
          >
            <SearchOutlinedIcon
              sx={{
                color: theme.palette.text.secondary,
                fontSize: 18,
                mr: 1,
                flexShrink: 0,
              }}
            />
            <input
              placeholder="Search..."
              aria-label="Search"
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                width: "100%",
                color: theme.palette.text.primary,
                fontSize: 14,
                fontFamily: "inherit",
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Right Actions */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 0.75, sm: 1.5 },
        }}
      >
        <ThemeSwitcher />

        {/* Notifications */}
        <Tooltip title="Notifications" arrow>
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <IconButton
              sx={{
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                borderRadius: 2,
                bgcolor: isDark ? theme.palette.grey[900] : "#F2F4F7",
                border: `1px solid ${isDark ? theme.palette.divider : "rgba(0,0,0,0.06)"}`,
                color: theme.palette.text.primary,
                transition: "all 180ms ease",
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                },
              }}
            >
              <NotificationsOutlinedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
            </IconButton>
            <Box
              sx={{
                position: "absolute",
                top: { xs: 7, sm: 9 },
                right: { xs: 7, sm: 9 },
                width: { xs: 7, sm: 8 },
                height: { xs: 7, sm: 8 },
                borderRadius: "50%",
                bgcolor: theme.palette.success.main,
                border: `1.5px solid ${isDark ? "rgba(255,255,255,0.08)" : theme.palette.background.paper}`,
              }}
            />
          </Box>
        </Tooltip>

        {/* Profile */}
        <Box
          onClick={handleOpen}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0, sm: 0.75 },
            px: { xs: 0.25, sm: 0.75 },
            py: 0.5,
            borderRadius: 2,
            cursor: "pointer",
            transition: "background 180ms ease",
            "&:hover": {
              bgcolor: isDark ? theme.palette.grey[900] : "#F2F4F7",
            },
          }}
        >
          <Avatar
            sx={{
              bgcolor: theme.palette.mode === "dark"
                ? theme.palette.primary.main
                : alpha(theme.palette.primary.main, 0.12),
              color: theme.palette.mode === "dark"
                ? theme.palette.primary.contrastText
                : theme.palette.primary.main,
              width: { xs: 32, sm: 36 },
              height: { xs: 32, sm: 36 },
              fontSize: { xs: 12, sm: 14 },
              fontWeight: 700,
              border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            }}
          >
            {initials}
          </Avatar>
          <Box sx={{ display: { xs: "none", sm: "flex" }, flexDirection: "column", lineHeight: 1.3, maxWidth: 120, ml: 0.5 }}>
            <Typography
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                fontSize: 13,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {displayName}
            </Typography>
            <Typography
              sx={{
                color: theme.palette.text.secondary,
                fontSize: 11,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {email}
            </Typography>
          </Box>
          <KeyboardArrowDownOutlinedIcon
            sx={{
              color: theme.palette.text.secondary,
              fontSize: 16,
              display: { xs: "none", sm: "block" },
              ml: { xs: 0, sm: 0.25 },
            }}
          />
        </Box>

        {/* Profile Menu */}
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
              sx: {
                mt: 1,
                minWidth: 220,
                borderRadius: 3,
              border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : theme.palette.divider}`,
                boxShadow: `0 8px 24px ${alpha(theme.palette.text.primary, 0.08)}`,
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography
              component="div"
              sx={{ fontWeight: 600, fontSize: 14 }}
              noWrap
            >
              {displayName}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary, fontSize: 13 }}
              noWrap
            >
              {email}
            </Typography>
          </Box>
          <Divider sx={{ borderColor: theme.palette.divider, my: 0.5 }} />
          <MenuItem
            onClick={handleClose}
            sx={{
              fontSize: 14,
              py: 1,
              px: 2,
              borderRadius: 1,
              mx: 0.5,
              my: 0.25,
            }}
          >
            <ListItemIcon>
              <EditOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Edit profile
          </MenuItem>
          <MenuItem
            onClick={handleClose}
            sx={{
              fontSize: 14,
              py: 1,
              px: 2,
              borderRadius: 1,
              mx: 0.5,
              my: 0.25,
            }}
          >
            <ListItemIcon>
              <SettingsOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Account settings
          </MenuItem>
          <MenuItem
            onClick={handleClose}
            sx={{
              fontSize: 14,
              py: 1,
              px: 2,
              borderRadius: 1,
              mx: 0.5,
              my: 0.25,
            }}
          >
            <ListItemIcon>
              <InfoOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Support
          </MenuItem>
          <Divider sx={{ borderColor: theme.palette.divider, my: 0.5 }} />
          <MenuItem
            onClick={handleLogout}
            sx={{
              fontSize: 14,
              py: 1,
              px: 2,
              borderRadius: 1,
              mx: 0.5,
              my: 0.25,
              color: theme.palette.error.main,
              "&:hover": {
                bgcolor: alpha(theme.palette.error.main, 0.08),
              },
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.error.main }}>
              <LogoutOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Sign out
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
