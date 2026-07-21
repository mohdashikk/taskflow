"use client";

import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import { useAuth } from "@/features/auth/hooks/useAuth";
import KanbanBoard from "@/features/tasks/components/KanbanBoard";

export default function ProjectTasksPage() {
  const params = useParams();
  const { user } = useAuth();
  const projectId = params.id as string;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Kanban Board */}
      <Box sx={{ px: 3, py: 3 }}>
        <Box sx={{ maxWidth: 1600, mx: "auto" }}>
          <KanbanBoard projectId={projectId} userId={user?.id ?? ""} />
        </Box>
      </Box>
    </Box>
  );
}
