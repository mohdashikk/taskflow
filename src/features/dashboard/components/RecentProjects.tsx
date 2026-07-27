"use client";

import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FolderIcon from "@mui/icons-material/Folder";

import WidgetCard from "./WidgetCard";

import type { Project } from "@/features/projects/data/mockData";

interface RecentProjectsProps {
  projects: Project[];
  delay?: number;
}

const statusConfig = {
  active: { color: "#2563eb", bgcolor: alpha("#2563eb", 0.08), label: "Active" },
  planning: { color: "#f59e0b", bgcolor: alpha("#f59e0b", 0.08), label: "Planning" },
  completed: { color: "#10b981", bgcolor: alpha("#10b981", 0.08), label: "Completed" },
  archived: { color: "#64748b", bgcolor: alpha("#64748b", 0.08), label: "Archived" },
};

export default function RecentProjects({ projects, delay = 0 }: RecentProjectsProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const router = useRouter();

  const recentProjects = projects
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 4);

  if (recentProjects.length === 0) {
    return (
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
        }}
        initial="hidden"
        animate="show"
        transition={{ delay }}
      >
        <WidgetCard title="Recent Projects" delay={delay} action={
          <Button
            size="small"
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              textTransform: "none", 
              fontSize: 12, 
              fontWeight: 600,
              color: theme.palette.primary.main,
              "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.08) }
            }}
            onClick={() => router.push("/projects")}
          >
            View All
          </Button>
        }>
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: 14 }}>
              No projects yet. Create your first project!
            </Typography>
          </Box>
        </WidgetCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
      }}
      initial="hidden"
      animate="show"
      transition={{ delay }}
    >
      <WidgetCard title="Recent Projects" delay={delay} action={
        <Button
          size="small"
          endIcon={<ArrowForwardIcon />}
          sx={{ 
            textTransform: "none", 
            fontSize: 12, 
            fontWeight: 600,
            color: theme.palette.primary.main,
            "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.08) }
          }}
          onClick={() => router.push("/projects")}
        >
          View All
        </Button>
      }>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {recentProjects.map((project) => {
            const status = statusConfig[project.status] || statusConfig.planning;
            return (
              <Box
                key={project.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: "14px",
                  bgcolor: isDark ? "#12101e" : "#F7F8FA",
                  border: `1px solid ${theme.palette.divider}`,
                  cursor: "pointer",
                  transition: "all 180ms ease",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    bgcolor: isDark ? "#1A1728" : "#F2F4F7",
                    transform: "translateX(4px)",
                  },
                }}
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: status.bgcolor,
                    color: status.color,
                    flexShrink: 0,
                  }}
                >
                  <FolderIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {project.name}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: theme.palette.text.secondary, mt: 0.25 }}>
                    {project.description.length > 40 ? `${project.description.slice(0, 40)}...` : project.description}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "8px",
                    bgcolor: status.bgcolor,
                    color: status.color,
                    fontSize: 11,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {status.label}
                </Box>
              </Box>
            );
          })}
        </Box>
      </WidgetCard>
    </motion.div>
  );
}
