"use client";

import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import PeopleIcon from "@mui/icons-material/People";
import Avatar from "@mui/material/Avatar";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import WidgetCard from "./WidgetCard";

interface TeamCollaborationProps {
  members?: Array<{
    id: string;
    name: string;
    avatar?: string;
    tasksCompleted: number;
    lastActive: string;
  }>;
  recentAssignments?: Array<{
    id: string;
    taskTitle: string;
    assignedTo: string;
    time: string;
  }>;
  delay?: number;
}

export default function TeamCollaboration({ members = [], recentAssignments = [], delay = 0 }: TeamCollaborationProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (members.length === 0 && recentAssignments.length === 0) return null;

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
      <WidgetCard title="Team Collaboration" delay={delay} icon={<PeopleIcon sx={{ fontSize: 18 }} />}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {members.length > 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Active Members
              </Typography>
              {members.slice(0, 3).map((member) => (
                <Box
                  key={member.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: "12px",
                    bgcolor: isDark ? "#12101e" : "#F7F8FA",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: theme.palette.primary.main,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {member.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: theme.palette.text.primary }}>
                      {member.name}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: theme.palette.text.secondary }}>
                      {member.tasksCompleted} tasks completed
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 12, color: theme.palette.text.secondary }} />
                    <Typography sx={{ fontSize: 11, color: theme.palette.text.secondary }}>
                      {member.lastActive}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
          {recentAssignments.length > 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Recently Assigned
              </Typography>
              {recentAssignments.slice(0, 2).map((assignment) => (
                <Box
                  key={assignment.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: "12px",
                    bgcolor: isDark ? "#12101e" : "#F7F8FA",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
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
                      {assignment.taskTitle}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: theme.palette.text.secondary, mt: 0.25 }}>
                      Assigned to {assignment.assignedTo}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: 11, color: theme.palette.text.secondary, flexShrink: 0 }}>
                    {assignment.time}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </WidgetCard>
    </motion.div>
  );
}
