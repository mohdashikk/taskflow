"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
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
      sx={{
        height: 72,
        px: { xs: 2, sm: 3 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            fontSize: { xs: 20, sm: 24 },
            whiteSpace: "nowrap",
          }}
        >
          {pageTitle}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 1.5 },
          flex: 2,
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            height: 40,
            px: 1.5,
            borderRadius: 2,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            transition: "border-color 0.2s ease",
            "&:hover": {
              borderColor: "primary.main",
            },
            "&:focus-within": {
              borderColor: "primary.main",
              boxShadow: "0 0 0 2px",
              boxShadowColor: "primary.main",
            },
            maxWidth: 360,
            width: "100%",
          }}
        >
          <SearchOutlinedIcon sx={{ color: "text.secondary", fontSize: 20, mr: 1 }} />
          <input
            placeholder="Search..."
            aria-label="Search"
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              width: "100%",
              color: "inherit",
              fontSize: 14,
              fontFamily: "inherit",
            }}
          />
        </Box>

        <Button
          variant="contained"
          startIcon={<AddOutlinedIcon fontSize="small" />}
          sx={{
            borderRadius: 2,
            height: 40,
            px: 2,
            textTransform: "none",
            fontWeight: 600,
            fontSize: 14,
            whiteSpace: "nowrap",
          }}
        >
          Add Task
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 0.5, sm: 1 },
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <ThemeSwitcher />

        <Tooltip title="Notifications">
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <IconButton
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                bgcolor: "transparent",
                border: "1px solid",
                borderColor: "divider",
                color: "text.primary",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "transparent",
                  borderColor: "primary.main",
                  color: "primary.main",
                },
              }}
            >
              <NotificationsOutlinedIcon fontSize="small" />
            </IconButton>
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 8,
                height: 8,
                borderRadius: 4,
                bgcolor: "#22C55E",
                border: "1.5px solid",
                borderColor: "background.paper",
              }}
            />
          </Box>
        </Tooltip>

        <Box
          onClick={handleOpen}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            py: 1,
            borderRadius: 2,
            bgcolor: "background.paper",
            cursor: "pointer",
            transition: "background 0.2s ease",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <Avatar
            sx={{
              bgcolor: "grey.300",
              color: "text.primary",
              width: 44,
              height: 44,
              fontSize: 16,
              fontWeight: 700,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {initials}
          </Avatar>
          <Box sx={{ display: { xs: "none", sm: "flex" }, flexDirection: "column", lineHeight: 1.2 }}>
            <Typography sx={{ fontWeight: 600, color: "text.primary", fontSize: 14 }}>
              {displayName}
            </Typography>
          </Box>
          <KeyboardArrowDownOutlinedIcon
            sx={{ color: "text.secondary", fontSize: 18, ml: 0.5 }}
          />
        </Box>

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
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography component="div" sx={{ fontWeight: 700, fontSize: 14 }} noWrap>
                {displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {email}
              </Typography>
            </Box>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <EditOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Edit profile
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <SettingsOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Account settings
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <InfoOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Support
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Sign out
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
