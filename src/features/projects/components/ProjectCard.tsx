"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

import { StatusBadge } from "./StatusBadge";
import type { Project } from "../data/mockData";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const openProject = () => router.push(`/projects/${project.id}`);
  const handleMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const closeMenu = () => setAnchorEl(null);

  return (
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
        bgcolor: "background.paper",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
        p: 2.5,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        transition: "transform 200ms ease, box-shadow 200ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 10px 24px rgba(15, 23, 42, 0.12)",
        },
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.main",
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
        <StatusBadge status={project.status} />
        <IconButton
          size="small"
          onClick={handleMenu}
          sx={{ color: "text.secondary", flexShrink: 0 }}
          aria-label="Project options"
        >
          <MoreVertOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Title */}
      <Typography
        component="h3"
        sx={{ fontSize: 18, fontWeight: 600, lineHeight: 1.3 }}
      >
        {project.name}
      </Typography>

      {/* Description (max two lines) */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: 40,
        }}
      >
        {project.description}
      </Typography>

      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      />

      {/* Project information row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          color: "text.secondary",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <EventOutlinedIcon sx={{ fontSize: 16 }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {project.dueDate}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 16 }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {project.tasksDone}/{project.tasksTotal} Tasks
          </Typography>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={closeMenu}
        onClick={(e) => e.stopPropagation()}
        slotProps={{ paper: { sx: { borderRadius: 2, minWidth: 180 } } }}
      >
        <MenuItem onClick={closeMenu}>
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Edit Project
        </MenuItem>
        <MenuItem onClick={closeMenu}>
          <ListItemIcon>
            <ArchiveOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Archive Project
        </MenuItem>
        <MenuItem onClick={closeMenu} sx={{ color: "error.main" }}>
          <ListItemIcon sx={{ color: "error.main" }}>
            <DeleteOutlineOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Delete Project
        </MenuItem>
      </Menu>
    </Box>
  );
}
