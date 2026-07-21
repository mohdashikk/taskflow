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
import { motion } from "framer-motion";

interface AddColumnButtonProps {
  projectId: string;
  onAdd: (name: string, color: string) => void;
  adding?: boolean;
}

const COLORS = ["#64748B", "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899"];

export default function AddColumnButton({ onAdd, adding }: AddColumnButtonProps) {
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
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={handleOpen}
          aria-label="Add column"
          sx={{
            width: 48,
            height: 48,
            minWidth: 48,
            borderRadius: "14px",
            border: "1px dashed #D1D5DB",
            color: "#6B7280",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 0,
            transition: "all 150ms ease",
            "&:hover": {
              borderColor: "#006F99",
              color: "#006F99",
              bgcolor: "rgba(0, 111, 153, 0.04)",
            },
          }}
        >
          <AddOutlinedIcon sx={{ fontSize: 22 }} />
        </Button>
      </motion.div>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "24px",
            border: "1px solid #E6E8EB",
            boxShadow: "0 24px 64px rgba(15, 23, 42, 0.12)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 22, color: "#111827", letterSpacing: "-0.01em" }}>
          New Board
        </DialogTitle>
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
                borderRadius: "14px",
                bgcolor: "#F7F8FA",
                fontSize: 14,
                "& fieldset": { border: "none" },
                "&.Mui-focused": { boxShadow: "none" },
              },
            }}
          />

          <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mt: 2.5 }}>
            {COLORS.map((c) => (
              <motion.div
                key={c}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                <Box
                  onClick={() => setColor(c)}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "8px",
                    bgcolor: c,
                    cursor: "pointer",
                    border: color === c ? "2px solid #111827" : "2px solid transparent",
                    transition: "border-color 100ms ease",
                  }}
                />
              </motion.div>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 0, justifyContent: "flex-end", gap: 1 }}>
          <Button
            onClick={handleClose}
            sx={{
              color: "#6B7280",
              textTransform: "none",
              fontWeight: 600,
              fontSize: 14,
              borderRadius: "14px",
              py: 0.75,
              px: 2,
              "&:hover": { bgcolor: "#F2F4F7", color: "#111827" },
            }}
          >
            Cancel
          </Button>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={adding || !name.trim()}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: 14,
                borderRadius: "14px",
                py: 0.75,
                px: 2,
                bgcolor: "#006F99",
                boxShadow: "0 4px 12px rgba(0, 111, 153, 0.2)",
                "&:hover": { boxShadow: "none", bgcolor: "#005670" },
              }}
            >
              {adding ? "Saving..." : "Save"}
            </Button>
          </motion.div>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
