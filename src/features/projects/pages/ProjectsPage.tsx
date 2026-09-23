"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const theme = useTheme();
  const { user } = useAuth();
  const { data: projects, isLoading, isError, error, refetch } = useProjects(
    user?.id,
  );
  const { data: statuses } = useProjectStatuses();

  const createProject = useCreateProject(user?.id);
  const updateProject = useUpdateProject(user?.id);
  const deleteProject = useDeleteProject(user?.id);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | ProjectStatus>("all");
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
    start_date?: string | null;
    icon: string;
  }) => {
    if (!editingProject) return;
    updateProject.mutate(
      {
        id: editingProject.id,
        title: values.title,
        description: values.description,
        status: values.status,
        due_date: values.due_date,
        start_date: values.start_date,
        icon: values.icon,
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
  const visibleProjects = filter === "all" ? projects : projects?.filter((project) => project.status === filter);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography component="h1" sx={{ fontSize:{xs:24,sm:28}, fontWeight:750, letterSpacing:"-.025em", color:"text.primary" }}>Projects</Typography>
          <Typography sx={{ mt:.5, color:"text.secondary", fontSize:14 }}>Organize work, track progress, and deliver with clarity.</Typography>
        </Box>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon fontSize="small" />}
            onClick={() => router.push("/projects/new")}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "10px",
              height: 48,
              px: 3,
              flexShrink: 0,
              bgcolor: theme.palette.primary.main,
              boxShadow: `0 4px 12px ${theme.palette.primary.main}33`,
              "&:hover": {
                boxShadow: "none",
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            Add Project
          </Button>
        </motion.div>
      </Box>

      {!isLoading && !isError && !showEmpty && (
        <Box sx={{ display:"flex", gap:1, mb:3, overflowX:"auto", pb:.5 }}>
          {(["all", "active", "planning", "completed"] as const).map((value) => (
            <Chip key={value} label={value === "all" ? `All ${projects?.length ?? 0}` : value} onClick={() => setFilter(value)} variant={filter === value ? "filled" : "outlined"} color={filter === value ? "primary" : "default"} sx={{ textTransform:"capitalize", px:.5 }} />
          ))}
        </Box>
      )}

      {/* Body */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={28} sx={{ color: "primary.main" }} />
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
              "&:hover": { borderColor: "primary.main", color: "primary.main" },
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
              onClick={() => router.push("/projects/new")}
              sx={{
                borderRadius: "14px",
                textTransform: "none",
                fontWeight: 600,
                bgcolor: "primary.main",
                boxShadow: "0 4px 12px rgba(0, 111, 153, 0.2)",
                "&:hover": { boxShadow: "none", bgcolor: "primary.dark" },
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
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" },
            gap: "30px",
            width: "100%",
          }}
        >
          <AnimatePresence>
            {visibleProjects?.map((p) => (
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
                due_date: editingProject.dueDateRaw,
                start_date: editingProject.startDate,
                icon: editingProject.icon,
              }
            : undefined
        }
        onSubmit={handleEdit}
        ownerName={user?.user_metadata?.display_name || "You"}
        ownerEmail={user?.email || ""}
        projectId={editingProject?.id}
        userId={user?.id}
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
                "&:hover": { borderColor: "primary.main", color: "primary.main" },
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
