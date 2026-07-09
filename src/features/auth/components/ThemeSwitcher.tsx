"use client";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useAppDispatch } from "@/store/hooks";
import { toggleTheme } from "@/store/slices/themeSlice";
import { useAppSelector } from "@/store/hooks";

export default function ThemeSwitcher() {
  const mode = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();

  return (
    <Tooltip title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}>
      <IconButton
        onClick={() => dispatch(toggleTheme())}
        color="inherit"
        sx={{
          color: "text.secondary",
          backgroundColor: "action.hover",
          "&:hover": {
            backgroundColor: "action.selected",
          },
        }}
      >
        {mode === "light" ? (
          <DarkModeOutlinedIcon fontSize="small" />
        ) : (
          <LightModeOutlinedIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
}
