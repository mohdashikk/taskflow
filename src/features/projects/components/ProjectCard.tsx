"use client";

import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";

import { cardBase, hoverElevation } from "../theme";
import { StatusBadge } from "./StatusBadge";
import type { Project } from "../data/mockData";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const remaining = Math.max(project.tasksTotal - project.tasksDone, 0);

  return (
    <Box
      sx={{
        ...cardBase,
        ...hoverElevation,
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          bgcolor: project.color,
        },
      }}
    >
      {/* Top row: icon, status badge */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          mb: 1.5,
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha(project.color, 0.14),
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          {project.icon}
        </Box>
        <StatusBadge status={project.status} />
      </Box>

      {/* Name */}
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 700, lineHeight: 1.3, mb: 0.5 }}
        noWrap
      >
        {project.name}
      </Typography>

      {/* Description (max two lines) */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 2,
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
      <Box sx={{ mb: 2 }}>
        <LinearProgress
          variant="determinate"
          value={project.progress}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: (theme) => alpha(theme.palette.divider, 0.8),
            "& .MuiLinearProgress-bar": {
              borderRadius: 4,
              bgcolor: project.color,
            },
          }}
        />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 0.5, display: "block", fontWeight: 600 }}
        >
          {project.progress}% Complete
        </Typography>
      </Box>

      <Divider sx={{ mb: 1.5 }} />

      {/* Project information */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1.25,
          mb: 2,
        }}
      >
        <InfoItem label="Due Date" value={project.dueDate} />
        <InfoItem label="Total Tasks" value={`${project.tasksTotal}`} />
        <InfoItem label="Completed" value={`${project.tasksDone}`} />
        <InfoItem label="Remaining" value={`${remaining}`} />
      </Box>

      {/* Footer */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          mt: "auto",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 800, color: project.color, lineHeight: 1 }}
        >
          {project.progress}%
        </Typography>
        <Button
          variant="contained"
          endIcon={<ArrowOutwardOutlinedIcon fontSize="small" />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 3,
            px: 2,
            py: 0.75,
            boxShadow: "none",
            "&:hover": { boxShadow: "none", bgcolor: "primary.dark" },
          }}
        >
          Open Project
        </Button>
      </Box>
    </Box>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", fontWeight: 600, mb: 0.25 }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontWeight: 700, lineHeight: 1.2 }}
        noWrap
      >
        {value}
      </Typography>
    </Box>
  );
}
