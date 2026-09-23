"use client";

import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import { useAuth } from "@/features/auth/hooks/useAuth";
import KanbanBoard from "./KanbanBoard";

interface ProjectTasksViewProps {
  view: "board" | "list";
}

export default function ProjectTasksView({ view }: ProjectTasksViewProps) {
  const params = useParams();
  const { user } = useAuth();
  const projectId = params.id as string;

  return (
    <Box sx={{ width: "100%" }}>
      <KanbanBoard
        projectId={projectId}
        userId={user?.id ?? ""}
        assignee={{
          name: user?.user_metadata?.display_name || user?.email || "You",
          avatarUrl: user?.user_metadata?.avatar_url,
        }}
        initialView={view}
        showViewToggle={false}
      />
    </Box>
  );
}
