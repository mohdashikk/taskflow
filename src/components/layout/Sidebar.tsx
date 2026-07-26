"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { alpha, useTheme } from "@mui/material/styles";
import Link from "next/link";
import {
  Avatar,
  Box,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import { useLogout } from "@/features/auth/hooks/useLogout";

export const SIDEBAR_WIDTH = 260;

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface WorkspaceGroup {
  label: string;
  items: NavItem[];
  defaultExpanded?: boolean;
  badge?: number;
}

const MAIN_MENU_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <DashboardOutlinedIcon />,
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: <TaskAltOutlinedIcon />,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: <FolderOutlinedIcon />,
  },
  {
    label: "Team Members",
    href: "#",
    icon: <PeopleOutlinedIcon />,
  },
  {
    label: "Calendar",
    href: "#",
    icon: <CalendarTodayOutlinedIcon />,
  },
  {
    label: "Reports",
    href: "#",
    icon: <AssessmentOutlinedIcon />,
  },
];

const WORKSPACE_GROUPS: WorkspaceGroup[] = [
  {
    label: "Ongoing Projects",
    defaultExpanded: true,
    items: [
      { label: "Website Revamp", href: "#", icon: <CircleOutlinedIcon fontSize="small" /> },
      { label: "Landing Page Design", href: "#", icon: <CircleOutlinedIcon fontSize="small" /> },
    ],
  },
  {
    label: "Daily Tasks",
    defaultExpanded: false,
    items: [
      { label: "Design Review", href: "#", icon: <CircleOutlinedIcon fontSize="small" /> },
      { label: "Client Meeting", href: "#", icon: <CircleOutlinedIcon fontSize="small" /> },
    ],
  },
  {
    label: "Dribbble Shots",
    defaultExpanded: false,
    badge: 3,
    items: [
      { label: "Inspiration", href: "#", icon: <CircleOutlinedIcon fontSize="small" /> },
      { label: "Uploads", href: "#", icon: <CircleOutlinedIcon fontSize="small" /> },
    ],
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

export default function Sidebar() {
  const pathname = usePathname();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const logout = useLogout();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    () =>
      WORKSPACE_GROUPS.reduce((acc, group) => {
        acc[group.label] = group.defaultExpanded ?? false;
        return acc;
      }, {} as Record<string, boolean>)
  );

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleLogout = () => {
    void logout();
  };

  const isSelected = (href: string) => {
    if (href === "#") return false;
    return pathname === href || pathname.startsWith(href);
  };

  const navItemSx = (selected: boolean) => {
    return {
      minHeight: 44,
      borderRadius: 3,
      px: 1.5,
      py: 1,
      gap: 1.5,
      transition: "all 180ms cubic-bezier(0.4, 0, 0.2, 1)",
      color: selected
        ? theme.palette.primary.contrastText
        : theme.palette.text.secondary,
      bgcolor: selected
        ? theme.palette.primary.main
        : "transparent",
      position: "relative",
      "&:hover": {
        bgcolor: selected
          ? theme.palette.primary.dark
          : isDark
            ? "rgba(255,255,255,0.04)"
            : alpha("#000000", 0.04),
        color: selected
          ? theme.palette.primary.contrastText
          : theme.palette.text.primary,
        "& .MuiListItemIcon-root": {
          color: selected
            ? theme.palette.primary.contrastText
            : theme.palette.text.primary,
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
          ? theme.palette.primary.contrastText
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

  const groupHeaderSx = {
    minHeight: 36,
    borderRadius: 3,
    px: 1.5,
    py: 0.75,
    transition: "all 180ms cubic-bezier(0.4, 0, 0.2, 1)",
    color: theme.palette.text.secondary,
    "&:hover": {
      bgcolor: isDark
        ? "rgba(255,255,255,0.04)"
        : alpha("#000000", 0.04),
      color: theme.palette.text.primary,
    },
  };

  const subItemSx = () => {
    const isDark = theme.palette.mode === "dark";
    return {
      minHeight: 36,
      borderRadius: 3,
      px: 1.5,
      py: 0.5,
      pl: 4,
      gap: 1.5,
      transition: "all 180ms cubic-bezier(0.4, 0, 0.2, 1)",
      color: theme.palette.text.secondary,
      "&:hover": {
        bgcolor: isDark
          ? "rgba(255,255,255,0.04)"
          : alpha("#000000", 0.04),
        color: theme.palette.text.primary,
        "& .MuiListItemIcon-root": {
          color: theme.palette.text.primary,
        },
      },
      "&.Mui-selected": {
        bgcolor: alpha(theme.palette.primary.main, 0.12),
        color: theme.palette.primary.main,
        "&:hover": {
          bgcolor: alpha(theme.palette.primary.main, 0.18),
        },
        "& .MuiListItemIcon-root": {
          color: theme.palette.primary.main,
        },
      },
      "& .MuiListItemIcon-root": {
        minWidth: "auto",
        color: "inherit",
        "& .MuiSvgIcon-root": {
          fontSize: 16,
        },
      },
    };
  };

  return (
    <Box
      component="nav"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        height: "100vh",
      bgcolor: isDark ? "transparent" : "#FFFFFF",
      borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : theme.palette.divider}`,
      boxShadow: isDark ? "none" : theme.palette.mode === "dark"
        ? "0 1px 2px rgba(0,0,0,0.2)"
        : "0 1px 2px rgba(0,0,0,0.04)",
        px: 2,
        py: 3,
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        scrollbarWidth: "none",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 1,
          mb: 5,
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
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: theme.palette.text.secondary,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            px: 1.5,
            mb: 1.5,
          }}
        >
          Main Menu
        </Typography>
        <List sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
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

      {/* Workspace */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 1, mb: 1.5 }}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 600,
              color: theme.palette.text.secondary,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Workspace
          </Typography>
          <IconButton
            size="small"
            sx={{
              width: 28,
              height: 28,
              color: theme.palette.text.secondary,
              borderRadius: 2,
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.main,
              },
            }}
          >
            <AddOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
        <List sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {WORKSPACE_GROUPS.map((group) => {
            const isExpanded = expandedGroups[group.label];
            return (
              <Box key={group.label}>
                <ListItemButton
                  onClick={() => toggleGroup(group.label)}
                  sx={groupHeaderSx}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: "auto",
                      color: "inherit",
                      "& .MuiSvgIcon-root": {
                        fontSize: 18,
                        transition: "transform 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      },
                    }}
                  >
                    <KeyboardArrowDownOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={group.label}
                    sx={{
                      "& .MuiListItemText-primary": {
                        fontWeight: 500,
                        fontSize: 13,
                      },
                    }}
                  />
                  {group.badge && (
                    <Box
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        fontSize: 11,
                        fontWeight: 600,
                        px: 1.25,
                        py: 0.25,
                        borderRadius: 2,
                        minWidth: 22,
                        textAlign: "center",
                        lineHeight: 1.4,
                      }}
                    >
                      {group.badge}
                    </Box>
                  )}
                </ListItemButton>
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <List sx={{ pl: 1.5, display: "flex", flexDirection: "column", gap: 0.25 }}>
                    {group.items.map((item) => {
                      const selected = isSelected(item.href);
                      return (
                        <ListItemButton
                          key={item.label}
                          component={item.href === "#" ? "div" : Link}
                          href={item.href}
                          selected={selected}
                          sx={subItemSx()}
                        >
                          <ListItemIcon sx={{ minWidth: "auto" }}>
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.label}
                            sx={{
                              "& .MuiListItemText-primary": {
                                fontWeight: selected ? 600 : 400,
                                fontSize: 13,
                              },
                            }}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
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
            mb: 1.5,
          }}
        >
          General
        </Typography>
        <List sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
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
              minHeight: 44,
              borderRadius: 3,
              px: 1.5,
              py: 1,
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
}
