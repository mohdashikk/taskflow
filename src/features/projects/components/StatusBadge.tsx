import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import {
  STATUS_COLORS,
  STATUS_LABELS,
  type ProjectStatus,
} from "../data/mockData";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const color = status === "active" ? "#10b981" : STATUS_COLORS[status];
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        color,
        bgcolor: alpha(color, 0.12),
        fontWeight: 700,
        fontSize: 12,
        borderRadius: 2,
        px: 1.25,
        py: 0.25,
        textTransform: "none",
      }}
    >
      <Box
        sx={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          bgcolor: color,
        }}
      />
      {STATUS_LABELS[status]}
    </Box>
  );
}
