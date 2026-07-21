import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import {
  STATUS_COLORS,
  STATUS_LABELS,
  type ProjectStatus,
} from "../data/mockData";
import type { ProjectStatusRow } from "../data/mockData";

interface StatusBadgeProps {
  status: ProjectStatus;
  statuses?: Map<string, ProjectStatusRow>;
}

export function StatusBadge({ status, statuses }: StatusBadgeProps) {
  const statusRow = statuses?.get(status);
  const color = statusRow?.color ?? (status === "active" ? "#22C55E" : STATUS_COLORS[status]);
  const label = statusRow?.name ?? STATUS_LABELS[status];

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        color,
        bgcolor: alpha(color, 0.1),
        fontWeight: 600,
        fontSize: 12,
        borderRadius: "10px",
        px: 1.25,
        py: 0.25,
        lineHeight: 1.4,
        letterSpacing: "-0.01em",
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
      {label}
    </Box>
  );
}
