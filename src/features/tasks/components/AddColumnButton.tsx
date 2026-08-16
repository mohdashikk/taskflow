"use client";

import { useState } from "react";
import { useTheme, alpha } from "@mui/material/styles";
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
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
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
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={handleOpen}
          aria-label="Add column"
          sx={{
            width: 320,
            minWidth: 320,
            height: 120,
            borderRadius: "12px",
            border: `1px dashed ${isDark ? "#36324D" : "rgba(0,0,0,0.1)"}`,
            color: "text.secondary",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            p: 0,
            transition: "all 150ms ease",
            bgcolor: isDark ? "#1C1929" : "rgba(0,0,0,0.02)",
            textTransform: "none",
            fontWeight: 500,
            fontSize: 14,
            "&:hover": {
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              bgcolor: isDark ? alpha(theme.palette.primary.main, 0.08) : alpha(theme.palette.primary.main, 0.04),
            },
          }}
        >
          <AddOutlinedIcon sx={{ fontSize: 24 }} />
          Add another list
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
            border: `1px solid ${isDark ? "#36324D" : theme.palette.divider}`,
            boxShadow: isDark ? "0 24px 64px rgba(0,0,0,.4)" : "0 24px 64px rgba(15, 23, 42, 0.12)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 22, color: "text.primary", letterSpacing: "-0.01em" }}>
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
                bgcolor: isDark ? "#2B2942" : "#F7F8FA",
                fontSize: 14,
                color: "text.primary",
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
                    border: color === c ? "2px solid text.primary" : "2px solid transparent",
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
              color: "text.secondary",
              textTransform: "none",
              fontWeight: 600,
              fontSize: 14,
              borderRadius: "14px",
              py: 0.75,
              px: 2,
              "&:hover": { bgcolor: theme.palette.action.hover, color: "text.primary" },
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
                bgcolor: "primary.main",
                boxShadow: isDark ? "0 4px 12px rgba(0,0,0,.3)" : "0 4px 12px rgba(0, 111, 153, 0.2)",
                "&:hover": { boxShadow: "none", bgcolor: theme.palette.primary.dark },
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