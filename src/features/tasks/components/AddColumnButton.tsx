"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

interface AddColumnButtonProps {
  projectId: string;
  onAdd: (name: string, color: string) => void;
  adding?: boolean;
}

const COLORS = ["#64748B", "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899"];

export default function AddColumnButton({ projectId, onAdd, adding }: AddColumnButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);

  const handleOpen = () => {
    setName("");
    setColor(COLORS[0]);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setName("");
    setColor(COLORS[0]);
  };

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed, color);
    handleClose();
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        pt: 0,
      }}
    >
      <Button
        onClick={handleOpen}
        aria-label="Add column"
        sx={{
          width: 48,
          height: 48,
          minWidth: 48,
          borderRadius: "12px",
          border: "1px dashed",
          borderColor: "divider",
          color: "text.secondary",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 0,
          "&:hover": {
            border: "1px dashed",
            borderColor: "text.secondary",
            bgcolor: "background.default",
            color: "text.primary",
          },
          transition: "all 0.15s ease",
        }}
      >
        <AddOutlinedIcon sx={{ fontSize: 22 }} />
      </Button>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
            bgcolor: "background.paper",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: 16, fontWeight: 600, color: "text.primary" }}>New Board</DialogTitle>
        <DialogContent>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              } else if (e.key === "Escape") {
                handleClose();
              }
            }}
            placeholder="Board name..."
            size="small"
            fullWidth
            autoFocus
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                bgcolor: "background.paper",
                fontSize: 14,
                "& fieldset": {
                  border: "none",
                },
                "&.MuiOutlinedInput-root": {
                  boxShadow: "none",
                  "&.Mui-focused": {
                    boxShadow: "none",
                  },
                },
              },
            }}
          />

          <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mt: 2.5 }}>
            {COLORS.map((c) => (
              <Box
                key={c}
                onClick={() => setColor(c)}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "6px",
                  bgcolor: c,
                  cursor: "pointer",
                  border: color === c ? "2px solid" : "2px solid transparent",
                  borderColor: color === c ? "text.primary" : "transparent",
                  transition: "border-color 0.1s ease",
                  "&:hover": {
                    borderColor: color === c ? "text.primary" : "text.secondary",
                  },
                }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, pt: 0 }}>
          <Button
            onClick={handleClose}
            sx={{
              color: "text.secondary",
              textTransform: "none",
              fontWeight: 600,
              fontSize: 13,
              borderRadius: "6px",
              py: 0.5,
              px: 1.5,
              "&:hover": { bgcolor: "divider", color: "text.primary" },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={adding || !name.trim()}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: 13,
              borderRadius: "6px",
              py: 0.5,
              px: 1.5,
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
          >
            {adding ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
