"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import ProjectCard from "../components/ProjectCard";
import ProjectForm from "../components/ProjectForm";
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "../hooks/useProjects";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { Project, ProjectStatus } from "../data/mockData";

export default function ProjectsPage() {
  const { user } = useAuth();
  const { data: projects, isLoading, isError, error, refetch } = useProjects(
    user?.id,
  );
  const createProject = useCreateProject(user?.id);
  const updateProject = useUpdateProject(user?.id);
  const deleteProject = useDeleteProject(user?.id);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(
    null,
  );

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

  const handleEdit = (values: {
    title: string;
    description: string;
    status: ProjectStatus;
    due_date: string | null;
  }) => {
    if (!editingProject) return;
    updateProject.mutate(
      {
        id: editingProject.id,
        title: values.title,
        description: values.description,
        status: values.status,
        due_date: values.due_date,
      },
      {
        onSuccess: () => setEditingProject(null),
      },
    );
  };

  const handleDelete = () => {
    if (!deletingProjectId) return;
    deleteProject.mutate(deletingProjectId, {
      onSuccess: () => setDeletingProjectId(null),
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
            <ProjectCard
              key={p.id}
              project={p}
              onEdit={(project) => setEditingProject(project)}
              onDelete={(id) => setDeletingProjectId(id)}
            />
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

      {/* Edit Project modal */}
      <ProjectForm
        open={Boolean(editingProject)}
        mode="edit"
        initialValues={
          editingProject
            ? {
                title: editingProject.name,
                description: editingProject.description,
                status: editingProject.status,
                due_date: editingProject.dueDate === "—" ? null : editingProject.dueDate,
              }
            : undefined
        }
        onSubmit={handleEdit}
        onCancel={() => setEditingProject(null)}
        isPending={updateProject.isPending}
        error={
          updateProject.isError && updateProject.error instanceof Error
            ? updateProject.error.message
            : null
        }
      />

      {/* Delete confirmation */}
      <Dialog
        open={Boolean(deletingProjectId)}
        onClose={() => setDeletingProjectId(null)}
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: 20 }}>
          Delete Project
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Are you sure you want to delete this project? This action cannot be undone.
          </Typography>
          {deleteProject.isError && deleteProject.error instanceof Error && (
            <Typography variant="body2" sx={{ color: "error.main", fontWeight: 600, mt: 1 }}>
              {deleteProject.error.message}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            onClick={() => setDeletingProjectId(null)}
            disabled={deleteProject.isPending}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDelete}
            disabled={deleteProject.isPending}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "error.main",
              boxShadow: "none",
              "&:hover": { bgcolor: "error.dark", boxShadow: "none" },
            }}
          >
            {deleteProject.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
