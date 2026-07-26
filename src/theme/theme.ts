import { alpha, createTheme, type Theme } from "@mui/material/styles";

const lightColors = {
  primary: "#006F99",
  primaryLight: alpha("#006F99", 0.08),
  primaryDark: "#005670",
  background: "#F7F8FA",
  paper: "#FFFFFF",
  card: "#FFFFFF",
  surface: "#F2F4F7",
  border: "#E6E8EB",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  shadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
  shadowHover: "0 8px 24px rgba(0, 0, 0, 0.08)",
};

const darkColors = {
  primary: "#715AF8",
  primaryLight: alpha("#715AF8", 0.08),
  primaryDark: "#5B46D8",
  background: "#0D0D14",
  paper: "#232135",
  card: "#232135",
  surface: "#2B2942",
  border: "#36324D",
  textPrimary: "#FFFFFF",
  textSecondary: "#B5B7C8",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  shadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
  shadowHover: "0 8px 24px rgba(0, 0, 0, 0.3)",
};

export type DesignTokens = typeof lightColors;
export type ColorMode = "light" | "dark";
export type ThemeMode = ColorMode;

export const getColors = (mode: ColorMode): DesignTokens =>
  mode === "light" ? lightColors : darkColors;

export const getTheme = (mode: ColorMode): Theme => {
  const colors = getColors(mode);

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.primary,
        light: colors.primaryLight,
        dark: colors.primaryDark,
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: "#715AF8",
        contrastText: "#FFFFFF",
      },
      background: {
        default: colors.background,
        paper: colors.paper,
      },
      text: {
        primary: colors.textPrimary,
        secondary: colors.textSecondary,
      },
      divider: colors.border,
      success: { main: colors.success },
      warning: { main: colors.warning },
      error: { main: colors.danger },
      action: {
        hover: alpha(colors.primary, 0.08),
        selected: alpha(colors.primary, 0.12),
        disabled: alpha(colors.textSecondary, 0.4),
        disabledBackground: alpha(colors.textSecondary, 0.12),
      },
      grey: {
        50: "#2B2942",
        100: "#232135",
        200: "#36324D",
        300: "#4B4568",
        400: "#8B8EA3",
        500: "#B5B7C8",
        600: "#9CA3AF",
        700: "#6B7280",
        800: "#4B5563",
        900: "#2B2942",
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
      h1: {
        fontSize: "3rem",
        fontWeight: 700,
        letterSpacing: "-0.02em",
        lineHeight: 1.2,
      },
      h2: {
        fontSize: "2.25rem",
        fontWeight: 700,
        letterSpacing: "-0.02em",
        lineHeight: 1.2,
      },
      h3: {
        fontSize: "1.75rem",
        fontWeight: 600,
        letterSpacing: "-0.01em",
        lineHeight: 1.3,
      },
      h4: {
        fontSize: "1.5rem",
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: "1.25rem",
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: "1.125rem",
        fontWeight: 600,
        lineHeight: 1.4,
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.6,
      },
      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.5,
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "*": {
            boxSizing: "border-box",
            margin: 0,
            padding: 0,
          },
          html: {
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
            background: "transparent",
          },
          body: {
            margin: 0,
            padding: 0,
            background: colors.background,
            color: colors.textPrimary,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: "10px 20px",
            height: 44,
            transition: "all 180ms cubic-bezier(0.4, 0, 0.2, 1)",
            "&:active": {
              transform: "scale(0.97)",
            },
          },
          contained: {
            boxShadow: colors.shadow,
            "&:hover": {
              boxShadow: colors.shadowHover,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            transition: "all 180ms cubic-bezier(0.4, 0, 0.2, 1)",
            "&:active": {
              transform: "scale(0.92)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadow,
            transition: "all 220ms cubic-bezier(0.4, 0, 0.2, 1)",
            backgroundImage: "none",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            borderRadius: 20,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 12,
              transition: "all 180ms ease",
              "& fieldset": {
                borderColor: colors.border,
              },
              "&:hover fieldset": {
                borderColor: alpha(colors.primary, 0.4),
              },
              "&.Mui-focused fieldset": {
                borderColor: colors.primary,
                boxShadow: `0 0 0 3px ${alpha(colors.primary, 0.08)}`,
              },
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 20,
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadowHover,
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadowHover,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            transition: "all 180ms cubic-bezier(0.4, 0, 0.2, 1)",
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 10,
            padding: "6px 12px",
            fontSize: 12,
            fontWeight: 500,
            background: mode === "dark" ? "#2B2942" : colors.textPrimary,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            fontWeight: 600,
          },
        },
      },
    },
  });
};
