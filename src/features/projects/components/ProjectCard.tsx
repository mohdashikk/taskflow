"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { motion } from "framer-motion";
import { StatusBadge } from "./StatusBadge";
import type { Project, ProjectStatusRow } from "../data/mockData";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
  statuses?: ProjectStatusRow[];
}

export default function ProjectCard({ project, onEdit, onDelete, statuses }: ProjectCardProps) {
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const statusMap = useMemo(() => {
    const map = new Map<string, ProjectStatusRow>();
    if (statuses) {
      for (const s of statuses) {
        map.set(s.name, s);
      }
    }
    return map;
  }, [statuses]);

  const openProject = () => router.push(`/projects/${project.id}`);
  const handleMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const closeMenu = () => setAnchorEl(null);

  const completionRate = project.tasksTotal > 0
    ? Math.round((project.tasksDone / project.tasksTotal) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
    >
      <Box
        role="button"
        tabIndex={0}
        onClick={openProject}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openProject();
          }
        }}
        sx={{
          bgcolor: isDark ? "#12101e" : "#FFFFFF",
          borderRadius: "16px",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          boxShadow: isDark ? "0 8px 24px rgba(0,0,0,.18)" : "0 8px 24px rgba(0,0,0,0.04)",
          p: 3,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          transition: "all 220ms cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          overflow: "hidden",
          "&:hover": {
            boxShadow: isDark ? "0 8px 24px rgba(0,0,0,.18)" : "0 12px 24px rgba(0,0,0,0.08)",
            borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          },
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: theme.palette.primary.main,
            outlineOffset: 2,
          },
        }}
      >
        {/* Header: status left, three-dot right */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <StatusBadge status={project.status} statuses={statusMap} />
          <IconButton
            size="small"
            onClick={handleMenu}
            sx={{
              color: theme.palette.text.secondary,
              borderRadius: "8px",
              width: 32,
              height: 32,
              "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: theme.palette.text.primary },
            }}
            aria-label="Project options"
          >
            <MoreVertOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Title */}
        <Typography
          component="h3"
          sx={{
            fontSize: 17,
            fontWeight: 600,
            lineHeight: 1.4,
            letterSpacing: "-0.01em",
            color: theme.palette.text.primary,
          }}
        >
          {project.name}
        </Typography>

        {/* Description (max two lines) */}
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: 14,
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 40,
          }}
        >
          {project.description}
        </Typography>

        {/* Progress bar */}
        <Box
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: isDark ? "rgba(255,255,255,0.06)" : "#F2F4F7",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: `${completionRate}%`,
              height: "100%",
              borderRadius: 3,
              bgcolor: theme.palette.primary.main,
              transition: "width 400ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </Box>

        {/* Project information row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            color: theme.palette.text.secondary,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <EventOutlinedIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 13 }}>
              {project.dueDate}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 13 }}>
              {project.tasksDone}/{project.tasksTotal} Tasks
            </Typography>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={closeMenu}
          onClick={(e) => e.stopPropagation()}
          slotProps={{
            paper: {
              sx: {
                bgcolor: isDark ? "#232135" : "#FFFFFF",
                backdropFilter: "blur(24px)",
                borderRadius: "12px",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : theme.palette.divider}`,
                boxShadow: isDark ? "0 10px 30px rgba(0,0,0,.25)" : "0 10px 30px rgba(0,0,0,0.08)",
                minWidth: 180,
              },
            },
          }}
        >
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              closeMenu();
              onEdit?.(project);
            }}
            sx={{ fontSize: 14, py: 1, px: 2, borderRadius: 1, mx: 0.5 }}
          >
            <ListItemIcon>
              <EditOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Edit Project
          </MenuItem>
          <MenuItem onClick={closeMenu} sx={{ fontSize: 14, py: 1, px: 2, borderRadius: 1, mx: 0.5 }}>
            <ListItemIcon>
              <ArchiveOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Archive Project
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              closeMenu();
              onDelete?.(project.id);
            }}
            sx={{ fontSize: 14, py: 1, px: 2, color: theme.palette.error.main, borderRadius: 1, mx: 0.5 }}
          >
            <ListItemIcon sx={{ color: theme.palette.error.main }}>
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Delete Project
          </MenuItem>
        </Menu>
      </Box>
    </motion.div>
  );
}