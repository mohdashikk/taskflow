"use client";

import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CodeIcon from "@mui/icons-material/Code";
import CommitIcon from "@mui/icons-material/Commit";
import MergeTypeIcon from "@mui/icons-material/MergeType";
import BugReportIcon from "@mui/icons-material/BugReport";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import WidgetCard from "./WidgetCard";

interface GitHubIntegrationProps {
  data?: {
    branch: string;
    latestCommit: string;
    lastCommitTime: string;
    openPullRequests: number;
    openIssues: number;
    repoStatus: "healthy" | "warning" | "error";
    deploymentStatus: "deployed" | "pending" | "failed";
    repoUrl: string;
  };
  delay?: number;
}

const statusConfig = {
  healthy: { color: "#22C55E", label: "Healthy", icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> },
  warning: { color: "#F59E0B", label: "Warning", icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> },
  error: { color: "#EF4444", label: "Error", icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> },
};

const deploymentConfig = {
  deployed: { color: "#22C55E", label: "Deployed" },
  pending: { color: "#F59E0B", label: "Pending" },
  failed: { color: "#EF4444", label: "Failed" },
};

export default function GitHubIntegration({ data, delay = 0 }: GitHubIntegrationProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (!data) return null;

  const repoStatus = statusConfig[data.repoStatus];
  const deployment = deploymentConfig[data.deploymentStatus];

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
      <WidgetCard
        title="GitHub Integration"
        delay={delay}
        icon={<CodeIcon sx={{ fontSize: 18 }} />}
        action={
          <Button
            size="small"
            href={data.repoUrl}
            target="_blank"
            endIcon={<OpenInNewIcon />}
            sx={{ 
              textTransform: "none", 
              fontSize: 12, 
              fontWeight: 600,
              color: theme.palette.primary.main,
              "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.08) }
            }}
          >
            View
          </Button>
        }
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: "8px",
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.main,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {data.branch}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: "auto" }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: repoStatus.color,
                }}
              />
              <Typography sx={{ fontSize: 12, color: theme.palette.text.secondary }}>
                {repoStatus.label}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <CommitIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {data.latestCommit}
                </Typography>
                <Typography sx={{ fontSize: 11, color: theme.palette.text.secondary }}>
                  {data.lastCommitTime}
                </Typography>
              </Box>
            </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <MergeTypeIcon sx={{ fontSize: 14, color: theme.palette.primary.main }} />
                  <Typography sx={{ fontSize: 12, color: theme.palette.text.secondary }}>
                    {data.openPullRequests} PRs
                  </Typography>
                </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <BugReportIcon sx={{ fontSize: 14, color: theme.palette.warning.main }} />
                <Typography sx={{ fontSize: 12, color: theme.palette.text.secondary }}>
                  {data.openIssues} Issues
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CloudUploadIcon sx={{ fontSize: 14, color: deployment.color }} />
              <Typography sx={{ fontSize: 12, color: theme.palette.text.secondary }}>
                Deployment:{" "}
                <Box component="span" sx={{ fontWeight: 600, color: deployment.color }}>
                  {deployment.label}
                </Box>
              </Typography>
            </Box>
          </Box>
        </Box>
      </WidgetCard>
    </motion.div>
  );
}
