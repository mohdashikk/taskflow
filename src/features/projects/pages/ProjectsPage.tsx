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
import { motion, AnimatePresence } from "framer-motion";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";

import ProjectCard from "../components/ProjectCard";
import ProjectForm from "../components/ProjectForm";
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "../hooks/useProjects";
import { useProjectStatuses } from "../hooks/useProjectStatuses";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { Project, ProjectStatus } from "../data/mockData";

export default function ProjectsPage() {
  const { user } = useAuth();
  const { data: projects, isLoading, isError, error, refetch } = useProjects(
    user?.id,
  );
  const { data: statuses } = useProjectStatuses();

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
    <Box sx={{ maxWidth: 1440, mx: "auto" }}>
      {/* Breadcrumb */}
      <Breadcrumbs
        separator={<NavigateNextRoundedIcon fontSize="small" sx={{ color: "#D1D5DB" }} />}
        sx={{ mb: 3, "& .MuiBreadcrumbs-li": { fontSize: 13, fontWeight: 600 } }}
      >
        <Link
          underline="hover"
          color="#6B7280"
          href="/"
          sx={{ cursor: "pointer", "&:hover": { color: "#006F99" } }}
        >
          Workspace
        </Link>
        <Typography color="#111827" sx={{ fontSize: 13, fontWeight: 700 }}>
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
          <Typography
            sx={{
              fontSize: { xs: 26, sm: 30 },
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              color: "#111827",
            }}
          >
            Projects
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#6B7280",
              mt: 0.5,
              fontSize: 15,
              lineHeight: 1.5,
            }}
          >
            Manage your projects and monitor overall progress.
          </Typography>
        </Box>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon fontSize="small" />}
            onClick={() => setIsFormOpen(true)}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "14px",
              height: 48,
              px: 3,
              flexShrink: 0,
              bgcolor: "#006F99",
              boxShadow: "0 4px 12px rgba(0, 111, 153, 0.2)",
              "&:hover": {
                boxShadow: "none",
                bgcolor: "#005670",
              },
            }}
          >
            Add Project
          </Button>
        </motion.div>
      </Box>

      {/* Body */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={28} sx={{ color: "#006F99" }} />
        </Box>
      ) : isError ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            py: 8,
            textAlign: "center",
          }}
        >
          <ErrorOutlineOutlinedIcon sx={{ fontSize: 48, color: "#EF4444" }} />
          <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>
            Couldn&apos;t load projects
          </Typography>
          <Typography sx={{ color: "#6B7280", fontSize: 14, maxWidth: 360, lineHeight: 1.5 }}>
            {error instanceof Error ? error.message : "Something went wrong. Please try again."}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => refetch()}
            sx={{
              borderRadius: "14px",
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#E6E8EB",
              color: "#6B7280",
              "&:hover": { borderColor: "#006F99", color: "#006F99" },
            }}
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
            gap: 2,
            py: 8,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              bgcolor: "#F2F4F7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FolderOutlinedIcon sx={{ fontSize: 28, color: "#9CA3AF" }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>
            No Projects
          </Typography>
          <Typography sx={{ color: "#6B7280", fontSize: 14, maxWidth: 360, lineHeight: 1.5 }}>
            Create your first project to start managing tasks.
          </Typography>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon fontSize="small" />}
              onClick={() => setIsFormOpen(true)}
              sx={{
                borderRadius: "14px",
                textTransform: "none",
                fontWeight: 600,
                bgcolor: "#006F99",
                boxShadow: "0 4px 12px rgba(0, 111, 153, 0.2)",
                "&:hover": { boxShadow: "none", bgcolor: "#005670" },
              }}
            >
              Create Project
            </Button>
          </motion.div>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
              xl: "repeat(4, 1fr)",
            },
            alignItems: "stretch",
          }}
        >
          <AnimatePresence>
            {projects?.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
              >
                <ProjectCard
                  project={p}
                  statuses={statuses}
                  onEdit={(project) => setEditingProject(project)}
                  onDelete={(id) => setDeletingProjectId(id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
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
        statuses={statuses}
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
        statuses={statuses}
      />

      {/* Delete confirmation */}
      <Dialog
        open={Boolean(deletingProjectId)}
        onClose={() => setDeletingProjectId(null)}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "24px",
            border: "1px solid #E6E8EB",
            boxShadow: "0 24px 64px rgba(15, 23, 42, 0.12)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 22, color: "#111827", letterSpacing: "-0.01em" }}>
          Delete Project
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 15, color: "#6B7280", lineHeight: 1.6 }}>
            Are you sure you want to delete this project? This action cannot be undone.
          </Typography>
          {deleteProject.isError && deleteProject.error instanceof Error && (
            <Typography sx={{ color: "#EF4444", fontWeight: 600, mt: 2, fontSize: 14 }}>
              {deleteProject.error.message}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, justifyContent: "flex-end", gap: 1 }}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
            <Button
              variant="outlined"
              onClick={() => setDeletingProjectId(null)}
              disabled={deleteProject.isPending}
              sx={{
                borderRadius: "14px",
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#E6E8EB",
                color: "#6B7280",
                "&:hover": { borderColor: "#006F99", color: "#006F99" },
              }}
            >
              Cancel
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
            <Button
              variant="contained"
              onClick={handleDelete}
              disabled={deleteProject.isPending}
              sx={{
                borderRadius: "14px",
                textTransform: "none",
                fontWeight: 600,
                bgcolor: "#EF4444",
                boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)",
                "&:hover": { boxShadow: "none", bgcolor: "#DC2626" },
              }}
            >
              {deleteProject.isPending ? "Deleting..." : "Delete"}
            </Button>
          </motion.div>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
