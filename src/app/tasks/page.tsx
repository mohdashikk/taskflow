import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function TasksPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800 }} gutterBottom>
        Tasks
      </Typography>
      <Typography color="text.secondary">
        Your tasks will appear here.
      </Typography>
    </Box>
  );
}
