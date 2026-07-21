"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { motion } from "framer-motion";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";
import ThemeSwitcher from "@/features/auth/components/ThemeSwitcher";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/tasks": "Tasks",
  "/space": "Space",
};

export default function Header() {
  const pathname = usePathname();
  const theme = useTheme();
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
  const pageTitle =
    PAGE_TITLES[pathname] ||
    pathname.split("/").filter(Boolean).pop()?.charAt(0).toUpperCase() +
      (pathname.split("/").filter(Boolean).pop()?.slice(1) ?? "");

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
        height: 72,
        px: { xs: 2, sm: 3, md: 4 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.mode === "dark" ? "#0D0F11" : "#FFFFFF",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Page Title */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            fontSize: { xs: 22, sm: 26 },
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
          }}
        >
          {pageTitle}
        </Typography>
      </Box>

      {/* Right Actions */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 0.75, sm: 1.5 },
        }}
      >
        {/* Search */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            height: 40,
            px: 1.5,
            borderRadius: 3,
            bgcolor: theme.palette.mode === "dark"
              ? alpha("#FFFFFF", 0.04)
              : "#F2F4F7",
            border: `1px solid ${theme.palette.divider}`,
            transition: "all 180ms ease",
            maxWidth: 280,
            width: "100%",
            "&:hover": {
              borderColor: theme.palette.primary.main,
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

        {/* Quick Add */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon fontSize="small" />}
            sx={{
              borderRadius: 3,
              height: 40,
              px: 2.5,
              textTransform: "none",
              fontWeight: 600,
              fontSize: 14,
              whiteSpace: "nowrap",
              bgcolor: theme.palette.primary.main,
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            <Box sx={{ display: { xs: "none", sm: "inline" } }}>Add Task</Box>
          </Button>
        </motion.div>

        <ThemeSwitcher />

        {/* Notifications */}
        <Tooltip title="Notifications" arrow>
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <IconButton
              sx={{
                width: 40,
                height: 40,
                borderRadius: 3,
                bgcolor: theme.palette.mode === "dark"
                  ? alpha("#FFFFFF", 0.04)
                  : "#F2F4F7",
                border: `1px solid ${theme.palette.divider}`,
                color: theme.palette.text.primary,
                transition: "all 180ms ease",
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                },
              }}
            >
              <NotificationsOutlinedIcon fontSize="small" />
            </IconButton>
            <Box
              sx={{
                position: "absolute",
                top: 9,
                right: 9,
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: theme.palette.success.main,
                border: `1.5px solid ${theme.palette.background.paper}`,
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
            gap: 0.75,
            px: 0.75,
            py: 0.5,
            borderRadius: 3,
            cursor: "pointer",
            transition: "background 180ms ease",
            "&:hover": {
              bgcolor: theme.palette.mode === "dark"
                ? alpha("#FFFFFF", 0.04)
                : "#F2F4F7",
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
              width: 36,
              height: 36,
              fontSize: 14,
              fontWeight: 700,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {initials}
          </Avatar>
          <Box sx={{ display: { xs: "none", sm: "flex" }, flexDirection: "column", lineHeight: 1.3, maxWidth: 120 }}>
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
                border: `1px solid ${theme.palette.divider}`,
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
