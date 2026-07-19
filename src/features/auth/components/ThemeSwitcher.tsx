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
        sx={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          color: "text.primary",
          backgroundColor: "transparent",
          border: "1px solid",
          borderColor: "divider",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "transparent",
            borderColor: "primary.main",
            color: "primary.main",
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
