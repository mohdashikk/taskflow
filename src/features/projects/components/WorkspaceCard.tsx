import { Card, type CardProps } from "@mui/material";

export default function WorkspaceCard(props: CardProps) {
  return (
    <Card
      variant="outlined"
      {...props}
      sx={{
        borderRadius: "20px",
        border: "2px solid transparent",
        backgroundImage: "none",
        boxShadow: "0 5px 5px rgba(82,63,105,.05)",
        ...props.sx,
      }}
    />
  );
}
