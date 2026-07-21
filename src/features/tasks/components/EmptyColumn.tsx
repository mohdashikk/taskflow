"use client";

import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface EmptyColumnProps {
  statusName: string;
}

const INSTRUCTION_MAP: Record<string, string> = {
  "todo": "Drag a task here when it's ready to be picked up",
  "in progress": "Drag a task here when you start working on it",
  "done": "Drag completed tasks here to close them out",
};

function getInstruction(statusName: string): string {
  const key = statusName.toLowerCase();
  if (INSTRUCTION_MAP[key]) return INSTRUCTION_MAP[key];
  if (key.includes("progress")) return "Drag a task here when you start working on it";
  if (key.includes("done") || key.includes("complete")) return "Drag completed tasks here to close them out";
  return "Drag a task here when you're ready to start";
}

export default function EmptyColumn({ statusName }: EmptyColumnProps) {
  const theme = useTheme();
  const instruction = getInstruction(statusName);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
        textAlign: "center",
        px: 2,
        border: `2px dashed ${theme.palette.mode === "dark" ? theme.palette.grey[600] : "#E6E8EB"}`,
        borderRadius: "14px",
        bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#F7F8FA",
        m: 1,
      }}
    >
      <Typography
        sx={{ fontWeight: 600, color: theme.palette.text.secondary, fontSize: 13, mb: 0.5 }}
      >
        No work items
      </Typography>
      <Typography sx={{ color: theme.palette.text.disabled, fontSize: 12, lineHeight: 1.5 }}>
        {instruction}
      </Typography>
    </Box>
  );
}
