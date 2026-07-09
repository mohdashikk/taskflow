import {
  createTheme,
  type Theme,
} from "@mui/material/styles";

export type ThemeMode = "light" | "dark";

export const getTheme = (
  mode: ThemeMode
): Theme =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#2563eb",
      },
      secondary: {
        main: "#7c3aed",
      },
      background: {
        default:
          mode === "light" ? "#f8fafc" : "#0f172a",
        paper:
          mode === "light" ? "#ffffff" : "#111827",
      },
    },
    typography: {
      fontFamily:
        'Arial, "Helvetica Neue", sans-serif',
    },
  });
