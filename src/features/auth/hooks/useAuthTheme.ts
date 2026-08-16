"use client";

import { useTheme } from "@mui/material/styles";
import { alpha, type Theme } from "@mui/material/styles";

export interface AuthThemeColors {
  accent: string;
  accentHover: string;
  accentAlpha: (opacity: number) => string;
  cardBg: string;
  cardBorder: string;
  inputBg: string;
  inputBorder: string;
  gradientFrom: string;
  gradientTo: string;
  surface: string;
  isDark: boolean;
}

export const AUTH_ACCENT = "#4F46E5";
export const AUTH_ACCENT_HOVER = "#4338CA";

function buildAuthColors(theme: Theme): AuthThemeColors {
  const isDark = theme.palette.mode === "dark";

  return {
    accent: AUTH_ACCENT,
    accentHover: AUTH_ACCENT_HOVER,
    accentAlpha: (opacity: number) => alpha(AUTH_ACCENT, opacity),
    cardBg: isDark ? "#161226" : "#FFFFFF",
    cardBorder: isDark ? "rgba(79, 70, 229, 0.15)" : "#E6E8EB",
    inputBg: isDark ? "#1A1528" : "#F7F8FA",
    inputBorder: isDark ? "rgba(79, 70, 229, 0.12)" : "#E6E8EB",
    gradientFrom: isDark ? "#0a0614" : "#EEF2FF",
    gradientTo: isDark ? "#140f1f" : "#C7D2FE",
    surface: isDark ? "#1A1528" : "#F7F8FA",
    isDark,
  };
}

export function useAuthTheme(): AuthThemeColors {
  const theme = useTheme();
  return buildAuthColors(theme);
}
