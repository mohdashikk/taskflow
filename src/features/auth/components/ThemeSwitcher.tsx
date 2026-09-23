"use client";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useAppDispatch } from "@/store/hooks";
import { toggleTheme } from "@/store/slices/themeSlice";
import { useAppSelector } from "@/store/hooks";
import { alpha, useTheme } from "@mui/material/styles";

export default function ThemeSwitcher() {
  const mode = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();
  const theme = useTheme();

  return (
    <Tooltip
      title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
      arrow
    >
      <IconButton
        onClick={() => dispatch(toggleTheme())}
        sx={{
          width: { xs: 36, sm: 48, xl: 58 },
          height: { xs: 36, sm: 48, xl: 58 },
          borderRadius: 2,
          color: theme.palette.text.primary,
          bgcolor: theme.palette.mode === "dark"
            ? alpha("#FFFFFF", 0.04)
            : "#F2F4F7",
          border: `1px solid ${theme.palette.divider}`,
          transition: "all 180ms cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
          },
        }}
      >
        {mode === "light" ? (
          <DarkModeOutlinedIcon sx={{ fontSize: { xs: 18, sm: 21, xl: 24 } }} />
        ) : (
          <LightModeOutlinedIcon sx={{ fontSize: { xs: 18, sm: 21, xl: 24 } }} />
        )}
      </IconButton>
    </Tooltip>
  );
}
