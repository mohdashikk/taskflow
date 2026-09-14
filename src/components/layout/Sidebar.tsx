"use client";

import { usePathname } from "next/navigation";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
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
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useLogout } from "@/features/auth/hooks/useLogout";

export const SIDEBAR_WIDTH = 104;

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
    label: "Profile",
    href: "/profile",
    icon: <PersonOutlinedIcon />,
  },
  {
    label: "Settings",
    href: "/settings",
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
      minHeight: 60,
      borderRadius: 2,
      px: 2,
      py: 1.25,
      justifyContent: "center",
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
        boxShadow: "none",
        px: 2,
        py: 4,
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
          justifyContent: "center",
          mb: 6,
        }}
      >
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            width: 40,
            height: 40,
            borderRadius: 3,
            boxShadow: "none",
          }}
        >
          <AssignmentTurnedInOutlinedIcon fontSize="small" sx={{ color: "#FFFFFF" }} />
        </Avatar>
        </Box>

      {/* Main Menu */}
      <Box sx={{ mb: 4 }}>
        <List sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
          {MAIN_MENU_ITEMS.map((item) => {
            const selected = isSelected(item.href);
            return (
              <ListItemButton
                key={item.label}
                component={item.href === "#" ? "div" : Link}
                href={item.href}
                selected={selected}
                sx={navItemSx(selected)}
                title={item.label}
              >
                <ListItemIcon sx={iconSx}>{item.icon}</ListItemIcon>
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ borderColor: theme.palette.divider, my: 1 }} />

      {/* General */}
      <Box sx={{ flex: 1 }}>
        <List sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
          {GENERAL_ITEMS.map((item) => {
            const selected = isSelected(item.href);
            return (
              <ListItemButton
                key={item.label}
                component={item.href === "#" ? "div" : Link}
                href={item.href}
                selected={selected}
                sx={navItemSx(selected)}
                title={item.label}
              >
                <ListItemIcon sx={iconSx}>{item.icon}</ListItemIcon>
              </ListItemButton>
            );
          })}
          <ListItemButton
            onClick={handleLogout}
            sx={navItemSx(false)}
            title="Logout"
          >
            <ListItemIcon sx={iconSx}>
              <LogoutOutlinedIcon />
            </ListItemIcon>
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

