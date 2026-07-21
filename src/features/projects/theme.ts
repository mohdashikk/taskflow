import { alpha, type Theme } from "@mui/material/styles";

export const RADIUS = 14;

export const cardBase = {
  borderRadius: RADIUS,
  border: "1px solid",
  borderColor: "#E6E8EB",
  bgcolor: "#FFFFFF",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
};

export const hoverElevation = {
  transition: "transform 220ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 220ms ease, border-color 220ms ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.08)",
    borderColor: "#D1D5DB",
  },
};

export const primaryChip = {
  fontWeight: 600,
  fontSize: 12,
  borderRadius: 10,
  px: 1.25,
  py: 0.25,
  textTransform: "none",
};

export const getHoverBg = (theme: Theme, mode: "light" | "dark") => {
  const isDark = mode === "dark";
  return {
    bgcolor: isDark
      ? alpha("#FFFFFF", 0.06)
      : alpha("#000000", 0.04),
  };
};
