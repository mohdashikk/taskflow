"use client";

import { useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { StatusBadge } from "./StatusBadge";
import ProjectForm from "./ProjectForm";
import { useProject } from "../hooks/useProject";
import { useUpdateProject } from "../hooks/useProjects";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { normalizeStatus, type ProjectStatus, type ProjectRow } from "../data/mockData";
import type { UpdateProjectInput } from "../services/projectsService";

const TABS = [
  { label: "Overview", path: "/overview" },
  { label: "Plan", path: "/plan" },
  { label: "Tasks", path: "/tasks" },
  { label: "Docs", path: "/docs" },
] as const;

export default function ProjectWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const projectId = params.id as string;

  const { data: project, isLoading, isError, error } = useProject(
    projectId,
    user?.id,
  );

  const updateProject = useUpdateProject(user?.id);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectRow | null>(null);

  const tabValue = TABS.findIndex((tab) => pathname.includes(tab.path));
  const currentTab = TABS[tabValue >= 0 ? tabValue : 0];

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    router.push(`/projects/${projectId}${TABS[newValue].path}`);
  };

  const handleEditOpen = () => {
    if (!project) return;
    setEditingProject(project);
    setIsEditOpen(true);
  };

  const handleEditSubmit = (values: {
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
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["project", projectId] });
          setIsEditOpen(false);
          setEditingProject(null);
        },
      },
    );
  };

  const handleEditCancel = () => {
    setIsEditOpen(false);
    setEditingProject(null);
  };

  return (
    <Box>
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={28} sx={{ color: theme.palette.primary.main }} />
        </Box>
      )}

      {isError && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography sx={{ fontWeight: 600, color: "#EF4444" }}>
            {error instanceof Error ? error.message : "Failed to load project"}
          </Typography>
          <Button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["project", projectId] })
            }
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Box>
      )}

      {project && !isLoading && !isError && (
        <>
          <Box sx={{ mb: 3 }}>
            <Button
              startIcon={<ArrowBackOutlinedIcon />}
              onClick={() => router.push("/projects")}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                color: theme.palette.text.secondary,
                "&:hover": { color: theme.palette.primary.main },
                mb: 2,
              }}
            >
              Projects
            </Button>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: 24, sm: 28 },
                  lineHeight: 1.2,
                  letterSpacing: "-0.01em",
                  color: theme.palette.text.primary,
                  flexGrow: 1,
                }}
              >
                {project.title}
              </Typography>

              <StatusBadge status={normalizeStatus(project.status)} />

              <Button
                startIcon={<EditOutlinedIcon />}
                onClick={handleEditOpen}
                variant="outlined"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "12px",
                  borderColor: isDark ? "rgba(255,255,255,0.12)" : "#E6E8EB",
                  color: theme.palette.text.secondary,
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                  },
                }}
              >
                Edit Project
              </Button>
            </Box>

            {project.description && (
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: 15,
                  lineHeight: 1.6,
                  mt: 1,
                  maxWidth: 720,
                }}
              >
                {project.description}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              borderBottom: 1,
              borderColor: isDark ? "rgba(255,255,255,0.06)" : "divider",
              mb: 3,
            }}
          >
            <Tabs
              value={tabValue >= 0 ? tabValue : 0}
              onChange={handleTabChange}
            >
              {TABS.map((tab) => (
                <Tab
                  key={tab.path}
                  label={tab.label}
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: 14,
                    "&.Mui-selected": {
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                    },
                  }}
                />
              ))}
            </Tabs>
          </Box>

          <Box>{children}</Box>
        </>
      )}

      <ProjectForm
        open={isEditOpen}
        mode="edit"
        initialValues={
          editingProject
            ? {
                title: editingProject.title,
                description: editingProject.description ?? "",
                status: normalizeStatus(editingProject.status),
                due_date: editingProject.due_date,
              }
            : undefined
        }
        onSubmit={handleEditSubmit}
        onCancel={handleEditCancel}
        isPending={updateProject.isPending}
        error={
          updateProject.isError && updateProject.error instanceof Error
            ? updateProject.error.message
            : null
        }
      />
    </Box>
  );
}
