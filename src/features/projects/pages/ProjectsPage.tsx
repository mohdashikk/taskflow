"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
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
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
            Projects
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage your projects and monitor overall progress.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddOutlinedIcon fontSize="small" />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            height: 44,
            px: 2.5,
            flexShrink: 0,
            boxShadow: "none",
            "&:hover": { boxShadow: "none", bgcolor: "primary.dark" },
          }}
        >
          Add Project
        </Button>
      </Box>

      {/* Single project card */}
      <Box sx={{ maxWidth: 460 }}>
        <ProjectCard project={PROJECTS[0]} />
      </Box>
    </Box>
  );
}
