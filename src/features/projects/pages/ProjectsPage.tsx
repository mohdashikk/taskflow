"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

import ProjectCard from "../components/ProjectCard";
import { PROJECTS } from "../data/mockData";

export default function ProjectsPage() {
  return (
    <Box sx={{ maxWidth: 1600, mx: "auto" }}>
      {/* Breadcrumb */}
      <Breadcrumbs
        separator={<NavigateNextRoundedIcon fontSize="small" sx={{ color: "text.disabled" }} />}
        sx={{ mb: 2, "& .MuiBreadcrumbs-li": { fontSize: 13, fontWeight: 600 } }}
      >
        <Link underline="hover" color="text.secondary" href="/" sx={{ cursor: "pointer" }}>
          Workspace
        </Link>
        <Typography color="text.primary" sx={{ fontSize: 13, fontWeight: 700 }}>
          Projects
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
          Projects
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Manage your projects and monitor overall progress.
        </Typography>
      </Box>

      {/* Single project card */}
      <Box sx={{ maxWidth: 460 }}>
        <ProjectCard project={PROJECTS[0]} />
      </Box>
    </Box>
  );
}
