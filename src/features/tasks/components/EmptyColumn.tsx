"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function EmptyColumn() {
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
      }}
    >
      <Typography
        variant="body2"
        sx={{ fontWeight: 700, color: "#1E293B", fontSize: 14 }}
      >
        No work items
      </Typography>
    </Box>
  );
}
