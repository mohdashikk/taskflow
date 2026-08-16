import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTask,
  fetchTasksByProject,
  type CreateTaskInput,
} from "../services/tasksService";

export const useTasks = (projectId: string | undefined, userId: string | undefined) => {
  return useQuery({
    queryKey: ["tasks", projectId, userId],
    queryFn: async () => {
      if (!projectId || !userId) return [];
      return fetchTasksByProject(projectId, userId);
    },
    enabled: Boolean(projectId && userId),
    staleTime: 30_000,
  });
};

export const useCreateTask = (projectId: string | undefined, userId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Omit<CreateTaskInput, "project_id" | "user_id">) =>
      createTask({
        ...input,
        project_id: projectId ?? "",
        user_id: userId ?? "",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId, userId] });
      queryClient.invalidateQueries({ queryKey: ["projects", userId] });
    },
  });
};
