"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";

import ProjectCard from "../components/ProjectCard";
import ProjectForm from "../components/ProjectForm";
import { useProjects, useCreateProject } from "../hooks/useProjects";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { ProjectStatus } from "../data/mockData";

export default function ProjectsPage() {
  const { user } = useAuth();
  const { data: projects, isLoading, isError, error, refetch } = useProjects(
    user?.id,
  );
  const createProject = useCreateProject(user?.id);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreate = (values: {
    title: string;
    description: string;
    status: ProjectStatus;
    due_date: string | null;
  }) => {
    createProject.mutate(values, {
      onSuccess: () => setIsFormOpen(false),
    });
  };

  const showEmpty = !isLoading && !isError && (!projects || projects.length === 0);

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
          onClick={() => setIsFormOpen(true)}
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

      {/* Body */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={28} />
        </Box>
      ) : isError ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            py: 8,
            textAlign: "center",
          }}
        >
          <ErrorOutlineOutlinedIcon sx={{ fontSize: 40, color: "error.main" }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Couldn&apos;t load projects
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
            {error instanceof Error ? error.message : "Something went wrong. Please try again."}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => refetch()}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Try again
          </Button>
        </Box>
      ) : showEmpty ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            py: 8,
            textAlign: "center",
          }}
        >
          <FolderOutlinedIcon sx={{ fontSize: 40, color: "text.disabled" }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            No Projects
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
            Create your first project to start managing tasks.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon fontSize="small" />}
            onClick={() => setIsFormOpen(true)}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, boxShadow: "none" }}
          >
            Create Project
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 2.5,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
              xl: "repeat(4, 1fr)",
            },
            alignItems: "stretch",
          }}
        >
          {projects?.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </Box>
      )}

      {/* Add Project modal */}
      <ProjectForm
        open={isFormOpen}
        onSubmit={handleCreate}
        onCancel={() => setIsFormOpen(false)}
        isPending={createProject.isPending}
        error={
          createProject.isError && createProject.error instanceof Error
            ? createProject.error.message
            : null
        }
      />
    </Box>
  );
}
