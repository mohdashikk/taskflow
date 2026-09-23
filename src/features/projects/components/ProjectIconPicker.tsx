"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { alpha, useTheme } from "@mui/material/styles";

const PROJECT_ICONS = [
  { emoji: "📁", color: "#08BFD0" },
  { emoji: "🚀", color: "#6657CC" },
  { emoji: "✨", color: "#2C7DF7" },
  { emoji: "💻", color: "#FF5538" },
  { emoji: "📈", color: "#F04F37" },
  { emoji: "🎨", color: "#10BCCD" },
  { emoji: "🧠", color: "#FFB900" },
  { emoji: "🛠️", color: "#6151C8" },
  { emoji: "💡", color: "#FFB900" },
  { emoji: "📌", color: "#2F80ED" },
  { emoji: "✅", color: "#2168C9" },
  { emoji: "🌱", color: "#FFB600" },
  { emoji: "⚡", color: "#FF5C3A" },
  { emoji: "🏆", color: "#2C7DF7" },
  { emoji: "📝", color: "#08BFD0" },
  { emoji: "📊", color: "#04B6C7" },
  { emoji: "🎯", color: "#FFB800" },
  { emoji: "📅", color: "#7657C8" },
  { emoji: "🌍", color: "#203A59" },
  { emoji: "👥", color: "#08BFD0" },
  { emoji: "📷", color: "#FF5B3B" },
  { emoji: "❤️", color: "#FF5B3B" },
  { emoji: "🔒", color: "#6A55C9" },
  { emoji: "📦", color: "#2D82F4" },
] as const;

export function getProjectIconColor(value: string) {
  return PROJECT_ICONS.find(({ emoji }) => emoji === value)?.color ?? "#08BFD0";
}

interface ProjectIconPickerProps {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
}

export default function ProjectIconPicker({ value, onChange, compact = false }: ProjectIconPickerProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const selectedColor = getProjectIconColor(value);

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        startIcon={
          <Box
            component="span"
            sx={{
              width: 36,
              height: 36,
              display: "grid",
              placeItems: "center",
              borderRadius: "10px",
              bgcolor: selectedColor,
              fontSize: 21,
              lineHeight: 1,
              boxShadow: `inset 0 0 0 1px ${alpha("#000000", 0.05)}`,
            }}
          >
            {value}
          </Box>
        }
        sx={{
          width: compact ? 190 : "auto",
          minWidth: compact ? 190 : 174,
          height: 50,
          px: 1,
          pr: 2,
          borderRadius: "12px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          color: "text.primary",
          textTransform: "none",
          fontWeight: 600,
          justifyContent: "flex-start",
          boxShadow: "0 3px 10px rgba(15,23,42,.05)",
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            boxShadow: `0 5px 14px ${alpha(theme.palette.primary.main, 0.12)}`,
          },
          "& .MuiButton-startIcon": { mr: 1.25 },
        }}
      >
        Choose icon
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="project-icon-picker-title"
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: {
            sx: {
              width: "calc(100% - 32px)",
              maxWidth: 492,
              m: 2,
              borderRadius: "16px",
              bgcolor: "background.paper",
              backgroundImage: "none",
              boxShadow: "0 22px 60px rgba(15, 23, 42, .22)",
              overflow: "hidden",
            },
          },
          backdrop: { sx: { bgcolor: "rgba(15, 23, 42, .38)" } },
        }}
      >
        <DialogTitle
          id="project-icon-picker-title"
          sx={{ display: "flex", alignItems: "center", px: 2, py: 1.5, pr: 1.25 }}
        >
          <Typography component="span" sx={{ flex: 1, fontSize: 18, fontWeight: 700 }}>
            Select a project icon
          </Typography>
          <IconButton type="button" onClick={() => setOpen(false)} aria-label="Close icon picker" size="small">
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ px: 2, py: 2.25 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(8, minmax(0, 1fr))",
              columnGap: { xs: 0.75, sm: 1.25 },
              rowGap: 1.25,
            }}
          >
            {PROJECT_ICONS.map(({ emoji, color }) => {
              const selected = value === emoji;
              return (
                <IconButton
                  type="button"
                  key={emoji}
                  onClick={() => {
                    onChange(emoji);
                    setOpen(false);
                  }}
                  aria-label={`Choose ${emoji} project icon`}
                  aria-pressed={selected}
                  sx={{
                    width: { xs: 36, sm: 40 },
                    height: { xs: 36, sm: 40 },
                    justifySelf: "center",
                    borderRadius: "11px",
                    border: "2px solid",
                    borderColor: selected ? "background.paper" : "transparent",
                    bgcolor: color,
                    color: "#FFFFFF",
                    fontSize: { xs: 19, sm: 21 },
                    lineHeight: 1,
                    boxShadow: selected
                      ? `0 0 0 2px ${theme.palette.primary.main}, 0 5px 12px ${alpha(color, 0.34)}`
                      : `0 2px 5px ${alpha(color, 0.22)}`,
                    transition: "transform 150ms ease, box-shadow 150ms ease, filter 150ms ease",
                    "&:hover": {
                      bgcolor: color,
                      filter: "brightness(1.06)",
                      transform: "translateY(-2px)",
                      boxShadow: `0 7px 14px ${alpha(color, 0.32)}`,
                    },
                    "&:focus-visible": {
                      outline: `3px solid ${alpha(theme.palette.primary.main, 0.35)}`,
                      outlineOffset: 2,
                    },
                  }}
                >
                  {emoji}
                </IconButton>
              );
            })}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
