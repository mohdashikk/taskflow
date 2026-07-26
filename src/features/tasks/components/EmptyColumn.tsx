"use client";

import { useTheme, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface EmptyColumnProps {
  statusName: string;
  isDragOver?: boolean;
}

export default function EmptyColumn(_props: EmptyColumnProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: "25px",
        textAlign: "center",
        border: `1px dashed ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        borderRadius: "12px",
        bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
        transition: "background-color 150ms ease, border-color 150ms ease",
        ...(_props.isDragOver ? {
          borderColor: theme.palette.primary.main,
          bgcolor: isDark ? alpha(theme.palette.primary.main, 0.08) : alpha(theme.palette.primary.main, 0.04),
        } : {}),
      }}
    >
      <Typography sx={{ fontWeight: 600, color: "text.secondary", fontSize: 14 }}>
        No work items
      </Typography>
    </Box>
  );
}