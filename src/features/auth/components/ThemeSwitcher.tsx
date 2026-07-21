"use client";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme } from "@/store/slices/themeSlice";
import { alpha } from "@mui/material/styles";

export default function ThemeSwitcher() {
  const mode = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();

  return (
    <Tooltip
      title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
      arrow
    >
      <IconButton
        onClick={() => dispatch(toggleTheme())}
        sx={{
          width: 40,
          height: 40,
          borderRadius: 3,
          color: mode === "dark" ? "#F3F4F6" : "#111827",
          bgcolor: mode === "dark" ? alpha("#FFFFFF", 0.06) : "#F2F4F7",
          border: `1px solid ${mode === "dark" ? "#30343A" : "#E6E8EB"}`,
          transition: "all 180ms cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            bgcolor: mode === "dark" ? alpha("#3ECFDF", 0.12) : alpha("#006F99", 0.08),
            borderColor: mode === "dark" ? "#3ECFDF" : "#006F99",
            color: mode === "dark" ? "#3ECFDF" : "#006F99",
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
