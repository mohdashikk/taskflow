import { alpha, createTheme, type Theme } from "@mui/material/styles";

const lightColors = {
  primary: "#00A15D",
  primaryLight: alpha("#00A15D", 0.1),
  primaryDark: "#006E40",
  background: "#F8F8F8",
  paper: "#FFFFFF",
  card: "#FFFFFF",
  surface: "#F5F5F7",
  board: "#FFFFFF",
  border: "#E5E5E7",
  textPrimary: "#000000",
  textSecondary: "#717579",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  shadow: "0 5px 5px rgba(82,63,105,.05)",
  shadowHover: "0 7px 29px rgba(136,108,192,.20)",
};

const darkColors = {
  primary: "#2997FF",
  primaryLight: alpha("#2997FF", 0.1),
  primaryDark: "#147CE5",
  background: "#0E0D18",
  paper: "#141320",
  card: "#181725",
  surface: "#1D1B2C",
  board: "#0E0D18",
  border: "rgba(255,255,255,0.085)",
  textPrimary: "#F3F2FA",
  textSecondary: "#A8A6B8",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  shadow: "0 8px 24px rgba(0, 0, 0, 0.18)",
  shadowHover: "0 8px 24px rgba(0, 0, 0, 0.18)",
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
        main: colors.primary,
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
        50: "#2D2A45",
        100: "#26233D",
        200: "#232135",
        300: "#1A1728",
        400: "#8B8EA3",
        500: "#B5B7C8",
        600: "#9CA3AF",
        700: "#6B7280",
        800: "#4B5563",
        900: "#141221",
      },
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: '"Poppins", Arial, sans-serif',
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
        letterSpacing: "normal",
        lineHeight: 1.4,
      },
      h6: {
        fontSize: "1.125rem",
        fontWeight: 600,
        lineHeight: 1.4,
      },
      body1: {
        fontSize: "0.875rem",
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
            borderRadius: 8,
            padding: "10px 20px",
            height: 44,
            transition: "all 180ms cubic-bezier(0.4, 0, 0.2, 1)",
            "&:active": {
              transform: "scale(0.97)",
            },
          },
          contained: {
            boxShadow: "none",
            "&:hover": {
              boxShadow: colors.shadowHover,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
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
            border: "2px solid transparent",
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
            borderRadius: 10,
            boxShadow: "none",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              minHeight: 48,
              borderRadius: 10,
              backgroundColor: colors.paper,
              transition: "all 180ms ease",
              "&.MuiInputBase-multiline": {
                minHeight: 112,
                height: "auto",
                padding: "13px 16px",
                alignItems: "flex-start",
              },
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
            "& .MuiInputBase-input": {
              boxSizing: "border-box",
              height: "auto",
              padding: "13px 16px",
              fontFamily: '"Poppins", Arial, sans-serif',
              fontSize: 14,
              lineHeight: "22px",
            },
            "& .MuiInputBase-inputSizeSmall": {
              padding: "13px 16px",
            },
            "& .MuiInputBase-multiline .MuiInputBase-input": {
              minHeight: 84,
              padding: 0,
            },
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
            },
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            fontFamily: '"Poppins", Arial, sans-serif',
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontFamily: '"Poppins", Arial, sans-serif',
            fontSize: 14,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadowHover,
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: 10,
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadowHover,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: "all 180ms cubic-bezier(0.4, 0, 0.2, 1)",
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 7,
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
            borderRadius: 7,
            fontWeight: 600,
          },
        },
      },
    },
  });
};
