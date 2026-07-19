import { alpha, type Theme } from "@mui/material/styles";

export const RADIUS = 16;

export const cardBase = {
  borderRadius: RADIUS,
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "background.paper",
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
};

export const hoverElevation = {
  transition: "transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.12)",
    borderColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.4),
  },
};

export const primaryChip = {
  fontWeight: 700,
  fontSize: 12,
  borderRadius: 2,
  px: 1.25,
  py: 0.25,
  textTransform: "none",
};
