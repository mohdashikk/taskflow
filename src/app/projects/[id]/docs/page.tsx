import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function DocsPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        textAlign: "center",
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: 18, mb: 1 }}>
        Project Docs
      </Typography>
      <Typography sx={{ color: "text.secondary", maxWidth: 480, lineHeight: 1.6 }}>
        Centralize project documentation, notes, and references here.
      </Typography>
    </Box>
  );
}
