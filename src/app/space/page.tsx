import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function SpacePage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Space
      </Typography>
      <Typography color="text.secondary">
        Your workspace overview will appear here.
      </Typography>
    </Box>
  );
}
