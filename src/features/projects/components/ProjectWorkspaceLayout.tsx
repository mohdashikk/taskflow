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
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { StatusBadge } from "./StatusBadge";
import ProjectForm from "./ProjectForm";
import { useProject } from "../hooks/useProject";
import { useUpdateProject } from "../hooks/useProjects";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { normalizeStatus, type ProjectStatus, type ProjectRow } from "../data/mockData";
import type { UpdateProjectInput } from "../services/projectsService";
import { getProjectIconColor } from "./ProjectIconPicker";

const TABS = [
  { label: "Overview", path: "/overview", icon: <DashboardOutlinedIcon /> },
  { label: "Plan", path: "/plan", icon: <AccountTreeOutlinedIcon /> },
  { label: "List", path: "/list", icon: <ViewListOutlinedIcon /> },
  { label: "Kanban", path: "/kanban", icon: <ViewKanbanOutlinedIcon /> },
  { label: "Docs", path: "/docs", icon: <DescriptionOutlinedIcon /> },
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

  const tabValue = TABS.findIndex(
    (tab) => pathname.endsWith(tab.path) || (tab.path === "/kanban" && pathname.endsWith("/tasks")),
  );
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
          <Box sx={{ mb: "30px" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0, flexGrow: 1 }}>
                <Box
                  component="span"
                  aria-hidden="true"
                  sx={{
                    width: 40,
                    height: 40,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    borderRadius: "11px",
                    bgcolor: getProjectIconColor(project.icon ?? "📁"),
                    fontSize: 23,
                    lineHeight: 1,
                    boxShadow: "inset 0 0 0 1px rgba(0,0,0,.05), 0 3px 8px rgba(15,23,42,.10)",
                  }}
                >
                  {project.icon ?? "📁"}
                </Box>
                <Typography
                  sx={{
                    fontWeight: 650,
                    fontSize: { xs: 24, sm: 28 },
                    lineHeight: 1.2,
                    letterSpacing: "normal",
                    color: theme.palette.text.primary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {project.title}
                </Typography>
              </Box>

              <StatusBadge status={normalizeStatus(project.status)} />

              <Button
                startIcon={<EditOutlinedIcon />}
                onClick={handleEditOpen}
                variant="outlined"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "20px",
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
          </Box>

          <Box
            sx={{
              borderBottom: 1,
              borderColor: isDark ? "rgba(255,255,255,0.06)" : "divider",
              mb: "30px",
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
                  icon={tab.icon}
                  iconPosition="start"
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: 14,
                    minHeight: 52,
                    minWidth: "auto",
                    px: { xs: 1.25, sm: 2 },
                    gap: 0.75,
                    "& .MuiSvgIcon-root": { fontSize: 19 },
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
                start_date: editingProject.start_date ?? null,
                icon: editingProject.icon,
              }
            : undefined
        }
        onSubmit={handleEditSubmit}
        ownerName={user?.user_metadata?.display_name || "You"}
        ownerEmail={user?.email || ""}
        projectId={editingProject?.id}
        userId={user?.id}
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
