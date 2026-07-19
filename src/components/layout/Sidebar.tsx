"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { alpha } from "@mui/material/styles";
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

export const SIDEBAR_WIDTH = 280;

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

  const navItemSx = (selected: boolean) => ({
    minHeight: 44,
    borderRadius: 2,
    px: 2,
    py: 1,
    gap: 1.5,
    transition: "all 200ms ease",
    color: "text.secondary",
    "&:hover": {
      bgcolor: (theme: { palette: { primary: { main: string } } }) =>
        alpha(theme.palette.primary.main, 0.08),
      color: "primary.main",
      "& .MuiListItemIcon-root": {
        color: "primary.main",
      },
    },
    ...(selected && {
      "&.Mui-selected": {
        bgcolor: "primary.main",
        color: "primary.contrastText",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        "&:hover": {
          bgcolor: "primary.main",
          color: "primary.contrastText",
          "& .MuiListItemIcon-root": {
            color: "primary.contrastText",
          },
        },
        "& .MuiListItemIcon-root": {
          color: "primary.contrastText",
        },
      },
    }),
  });

  const iconSx = {
    minWidth: "auto",
    color: "inherit",
    "& .MuiSvgIcon-root": {
      fontSize: 20,
    },
  };

  const textSx = (selected: boolean, weight: number = 500) => ({
    "& .MuiListItemText-primary": {
      fontWeight: selected ? 600 : weight,
      fontSize: 14,
    },
  });

  return (
    <Box
      component="nav"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        height: "100vh",
        bgcolor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        px: 2,
        py: 3,
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
          mb: 5,
        }}
      >
        <Avatar
          sx={{
            bgcolor: "primary.main",
            width: 40,
            height: 40,
          }}
        >
          <AssignmentTurnedInOutlinedIcon fontSize="small" />
        </Avatar>
        <Typography
          sx={{
            fontWeight: 700,
            color: "text.primary",
            fontSize: 20,
            lineHeight: 1.2,
          }}
        >
          TaskFlow
        </Typography>
      </Box>

      {/* Main Menu */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 600,
            color: "text.secondary",
            letterSpacing: 0.5,
            textTransform: "uppercase",
            px: 1,
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

      <Divider sx={{ borderColor: "divider", my: 1 }} />

      {/* Workspace */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 1, mb: 1.5 }}>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: "text.secondary",
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            Workspace
          </Typography>
          <IconButton
            size="small"
            sx={{
              width: 24,
              height: 24,
              color: "text.secondary",
              "&:hover": {
                bgcolor: "action.hover",
                color: "primary.main",
              },
            }}
          >
            <AddOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
        <List sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {WORKSPACE_GROUPS.map((group) => {
            const isExpanded = expandedGroups[group.label];
            return (
              <Box key={group.label}>
                <ListItemButton
                  onClick={() => toggleGroup(group.label)}
                  sx={{
                    minHeight: 44,
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    transition: "all 200ms ease",
                    color: "text.secondary",
                    "&:hover": {
                      bgcolor: (theme: { palette: { primary: { main: string } } }) =>
                        alpha(theme.palette.primary.main, 0.08),
                      color: "primary.main",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: "auto",
                      color: "inherit",
                      "& .MuiSvgIcon-root": {
                        fontSize: 20,
                        transition: "transform 200ms ease",
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
                        fontSize: 14,
                      },
                    }}
                  />
                  {group.badge && (
                    <Box
                      sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        fontSize: 11,
                        fontWeight: 600,
                        px: 1,
                        py: 0.25,
                        borderRadius: 2,
                        minWidth: 20,
                        textAlign: "center",
                      }}
                    >
                      {group.badge}
                    </Box>
                  )}
                </ListItemButton>
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <List sx={{ pl: 2.5 }}>
                    {group.items.map((item) => {
                      const selected = isSelected(item.href);
                      return (
                        <ListItemButton
                          key={item.label}
                          component={item.href === "#" ? "div" : Link}
                          href={item.href}
                          selected={selected}
                          sx={{
                            minHeight: 36,
                            borderRadius: 2,
                            px: 2,
                            py: 0.5,
                            gap: 1.5,
                            transition: "all 200ms ease",
                            color: "text.secondary",
                            "&:hover": {
                              bgcolor: (theme: { palette: { primary: { main: string } } }) =>
                                alpha(theme.palette.primary.main, 0.08),
                              color: "primary.main",
                              "& .MuiListItemIcon-root": {
                                color: "primary.main",
                              },
                            },
                            "&.Mui-selected": {
                              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                              color: "primary.main",
                              "&:hover": {
                                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.18),
                              },
                              "& .MuiListItemIcon-root": {
                                color: "primary.main",
                              },
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: "auto",
                              color: "inherit",
                              "& .MuiSvgIcon-root": {
                                fontSize: 16,
                              },
                            }}
                          >
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

      <Divider sx={{ borderColor: "divider", my: 1 }} />

      {/* General */}
      <Box>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 600,
            color: "text.secondary",
            letterSpacing: 0.5,
            textTransform: "uppercase",
            px: 1,
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
              borderRadius: 2,
              px: 2,
              py: 1,
              gap: 1.5,
              transition: "all 200ms ease",
              color: "text.secondary",
              "&:hover": {
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                color: "error.main",
                "& .MuiListItemIcon-root": {
                  color: "error.main",
                },
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
