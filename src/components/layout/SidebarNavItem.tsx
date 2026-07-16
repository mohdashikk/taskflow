"use client";

import Link from "next/link";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import type { NavItem } from "./Sidebar";

interface SidebarNavItemProps {
  item: NavItem;
  selected: boolean;
  onNavigate?: () => void;
}

export default function SidebarNavItem({
  item,
  selected,
  onNavigate,
}: SidebarNavItemProps) {
  const buttonSx = {
    position: "relative",
    borderRadius: 2.5,
    minHeight: 44,
    mb: 0.5,
    color: selected ? "primary.main" : "text.secondary",
    bgcolor: selected
      ? (theme: { palette: { primary: { main: string } } }) =>
          alpha(theme.palette.primary.main, 0.12)
      : "transparent",
    "&:hover": {
      bgcolor: selected
        ? (theme: { palette: { primary: { main: string } } }) =>
            alpha(theme.palette.primary.main, 0.18)
        : "action.hover",
    },
  };

  const content = (
    <>
      <Box
        sx={{
          position: "absolute",
          left: -2,
          top: 10,
          bottom: 10,
          width: 4,
          borderRadius: 2,
          bgcolor: "primary.main",
          opacity: selected ? 1 : 0,
          transition: "opacity 120ms ease",
        }}
      />
      <ListItemIcon
        sx={{
          minWidth: 40,
          color: selected ? "primary.main" : "text.secondary",
        }}
      >
        {item.icon}
      </ListItemIcon>
      <ListItemText
        primary={item.label}
        primaryTypographyProps={{
          fontWeight: selected ? 700 : 500,
          fontSize: 14,
        }}
      />
    </>
  );

  if (item.onClick) {
    return (
      <ListItemButton sx={buttonSx} onClick={item.onClick}>
        {content}
      </ListItemButton>
    );
  }

  return (
    <ListItemButton
      component={Link}
      href={item.href}
      selected={selected}
      sx={buttonSx}
      onClick={onNavigate}
    >
      {content}
    </ListItemButton>
  );
}
