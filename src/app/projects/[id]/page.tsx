"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { StatusBadge } from "@/features/projects/components/StatusBadge";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { Project } from "@/features/projects/data/mockData";
import { fetchUserProjects } from "@/features/projects/services/projectsService";
import KanbanBoard from "@/features/tasks/components/KanbanBoard";

export default function ProjectTasksPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.id || !projectId) return;

    let cancelled = false;

    const loadProject = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        setError(null);
        const rows = await fetchUserProjects(user.id);
        const found = rows.find((r) => r.id === projectId) ?? null;
        if (!cancelled) {
          setProject(
            found
              ? {
                  id: found.id,
                  name: found.title,
                  description: found.description ?? "",
                  status: found.status as Project["status"],
                  dueDate: found.due_date
                    ? new Date(found.due_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—",
                  tasksDone: 0,
                  tasksTotal: 0,
                }
              : null,
          );
        }
      } catch (err) {
        if (!cancelled) {
          setIsError(true);
          setError(
            err instanceof Error ? err : new Error("Failed to load project"),
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadProject();

    return () => {
      cancelled = true;
    };
  }, [user?.id, projectId]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (isError || !project) {
    return (
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
          {!project ? "Project not found" : "Couldn't load project"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
          {error instanceof Error ? error.message : "Something went wrong. Please try again."}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => router.push("/projects")}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
        >
          Back to Projects
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F8FAFC",
      }}
    >
      {/* Sticky Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          bgcolor: "#F8FAFC",
          borderBottom: "1px solid #E2E8F0",
          px: 3,
          py: 2,
        }}
      >
        <Box sx={{ maxWidth: 1600, mx: "auto" }}>
          <Breadcrumbs
            separator={<NavigateNextRoundedIcon fontSize="small" sx={{ color: "#94A3B8" }} />}
            sx={{ mb: 1, "& .MuiBreadcrumbs-li": { fontSize: 12, fontWeight: 600 } }}
          >
            <Link underline="hover" color="#64748B" href="/" sx={{ cursor: "pointer", fontSize: 12 }}>
              Workspace
            </Link>
            <Link underline="hover" color="#64748B" href="/projects" sx={{ cursor: "pointer", fontSize: 12 }}>
              Projects
            </Link>
            <Typography color="#1E293B" sx={{ fontSize: 12, fontWeight: 700 }}>
              {project.name}
            </Typography>
          </Breadcrumbs>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: "#0F172A",
                  fontSize: 20,
                  letterSpacing: -0.3,
                  lineHeight: 1.3,
                }}
              >
                {project.name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 0.5 }}>
                <StatusBadge status={project.status} />
                <Typography variant="caption" sx={{ color: "#64748B", fontSize: 12 }}>
                  Due {project.dueDate}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Kanban Board */}
      <Box sx={{ px: 3, py: 3 }}>
        <Box sx={{ maxWidth: 1600, mx: "auto" }}>
          <KanbanBoard projectId={projectId} userId={user?.id ?? ""} />
        </Box>
      </Box>
    </Box>
  );
}
