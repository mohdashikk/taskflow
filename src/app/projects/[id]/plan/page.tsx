import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function PlanPage() {
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
        Project Plan
      </Typography>
      <Typography sx={{ color: "text.secondary", maxWidth: 480, lineHeight: 1.6 }}>
        Plan timelines, milestones, and deliverables for this project.
      </Typography>
    </Box>
  );
}
