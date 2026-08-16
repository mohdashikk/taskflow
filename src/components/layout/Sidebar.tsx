"use client";

import { usePathname } from "next/navigation";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Link from "next/link";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useLogout } from "@/features/auth/hooks/useLogout";

export const SIDEBAR_WIDTH = 260;

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const MAIN_MENU_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <DashboardOutlinedIcon />,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: <FolderOutlinedIcon />,
  },
  {
    label: "Calendar",
    href: "/calendar",
    icon: <CalendarTodayOutlinedIcon />,
  },
];

const GENERAL_ITEMS: NavItem[] = [
  {
    label: "Settings",
    href: "#",
    icon: <SettingsOutlinedIcon />,
  },
  {
    label: "Help & Center",
    href: "#",
    icon: <HelpOutlineOutlinedIcon />,
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  permanent?: boolean;
}

export default function Sidebar({ open, onClose, permanent = false }: SidebarProps) {
  const pathname = usePathname();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const logout = useLogout();

  const handleLogout = () => {
    void logout();
  };

  const isSelected = (href: string) => {
    if (href === "#") return false;
    return pathname === href || pathname.startsWith(href);
  };

  const navItemSx = (selected: boolean) => {
    return {
      minHeight: 48,
      borderRadius: 2,
      px: 2,
      py: 1.25,
      gap: 1.5,
      transition: "all 180ms cubic-bezier(0.4, 0, 0.2, 1)",
      color: selected
        ? theme.palette.text.primary
        : theme.palette.text.secondary,
      bgcolor: selected
        ? isDark
          ? "rgba(255,255,255,0.06)"
          : theme.palette.action.selected
        : "transparent",
      position: "relative",
      "&:hover": {
        bgcolor: selected
          ? isDark
            ? "rgba(255,255,255,0.08)"
            : theme.palette.action.hover
          : isDark
            ? "rgba(255,255,255,0.04)"
            : alpha(theme.palette.primary.main, 0.04),
        color: selected
          ? theme.palette.text.primary
          : isDark
            ? theme.palette.text.primary
            : theme.palette.primary.main,
        "& .MuiListItemIcon-root": {
          color: selected
            ? theme.palette.text.primary
            : isDark
              ? theme.palette.text.primary
              : theme.palette.primary.main,
        },
        "&::before": {
          opacity: selected ? 0 : 1,
        },
      },
      "&::before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: "50%",
        transform: "translateY(-50%)",
        width: 3,
        height: 16,
        borderRadius: 2,
        bgcolor: theme.palette.primary.main,
        opacity: 0,
        transition: "opacity 180ms ease",
      },
      ...(selected && {
        "&::before": {
          opacity: 1,
        },
      }),
      "& .MuiListItemIcon-root": {
        color: selected
          ? theme.palette.text.primary
          : "inherit",
        minWidth: "auto",
      },
    };
  };

  const iconSx = {
    minWidth: "auto",
    color: "inherit",
    "& .MuiSvgIcon-root": {
      fontSize: 20,
    },
  };

  const textSx = (selected: boolean) => ({
    "& .MuiListItemText-primary": {
      fontWeight: selected ? 600 : 500,
      fontSize: 14,
      lineHeight: 1.4,
    },
  });

  const sidebarContent = (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: "100vh",
        bgcolor: "background.paper",
        borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : theme.palette.divider}`,
        boxShadow: isDark ? "none" : "0 1px 2px rgba(0,0,0,0.04)",
        px: 2.5,
        py: 3.5,
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        scrollbarWidth: "none",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 1,
          mb: 6,
        }}
      >
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            width: 40,
            height: 40,
            borderRadius: 3,
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
          }}
        >
          <AssignmentTurnedInOutlinedIcon fontSize="small" sx={{ color: "#FFFFFF" }} />
        </Avatar>
        <Typography
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            fontSize: 20,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
          }}
        >
          TaskFlow
        </Typography>
      </Box>

      {/* Main Menu */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: theme.palette.text.secondary,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            px: 1.5,
            mb: 2,
          }}
        >
          Main Menu
        </Typography>
        <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {MAIN_MENU_ITEMS.map((item) => {
            const selected = isSelected(item.href);
            return (
              <ListItemButton
                key={item.label}
                component={item.href === "#" ? "div" : Link}
                href={item.href}
                selected={selected}
                sx={navItemSx(selected)}
              >
                <ListItemIcon sx={iconSx}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} sx={textSx(selected)} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ borderColor: theme.palette.divider, my: 1 }} />

      {/* General */}
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: theme.palette.text.secondary,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            px: 1.5,
            mb: 2,
          }}
        >
          General
        </Typography>
        <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {GENERAL_ITEMS.map((item) => {
            const selected = isSelected(item.href);
            return (
              <ListItemButton
                key={item.label}
                component={item.href === "#" ? "div" : Link}
                href={item.href}
                selected={selected}
                sx={navItemSx(selected)}
              >
                <ListItemIcon sx={iconSx}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} sx={textSx(selected)} />
              </ListItemButton>
            );
          })}
          <ListItemButton
            onClick={handleLogout}
            sx={{
              minHeight: 48,
              borderRadius: 2,
              px: 2,
              py: 1.25,
              gap: 1.5,
              transition: "all 180ms cubic-bezier(0.4, 0, 0.2, 1)",
              color: theme.palette.text.secondary,
              position: "relative",
              "&:hover": {
                bgcolor: alpha(theme.palette.error.main, 0.08),
                color: theme.palette.error.main,
                "& .MuiListItemIcon-root": {
                  color: theme.palette.error.main,
                },
              },
              "& .MuiListItemIcon-root": {
                minWidth: "auto",
                color: "inherit",
              },
            }}
          >
            <ListItemIcon sx={iconSx}>
              <LogoutOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{
                "& .MuiListItemText-primary": {
                  fontWeight: 500,
                  fontSize: 14,
                },
              }}
            />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );

  if (permanent) {
    return sidebarContent;
  }

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: "block", md: "none" },
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
}
