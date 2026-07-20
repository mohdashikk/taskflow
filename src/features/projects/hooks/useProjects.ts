import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserProjects,
  createProject,
  updateProject,
  deleteProject,
  type CreateProjectInput,
  type UpdateProjectInput,
} from "../services/projectsService";
import { toProject, type Project } from "../data/mockData";

export const useProjects = (userId: string | undefined) => {
  return useQuery<Project[]>({
    queryKey: ["projects", userId],
    queryFn: async () => {
      if (!userId) return [];
      const rows = await fetchUserProjects(userId);
      return rows.map(toProject);
    },
    enabled: Boolean(userId),
  });
};

export const useCreateProject = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Omit<CreateProjectInput, "user_id">) =>
      createProject({ ...input, user_id: userId ?? "" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", userId] });
    },
  });
};

export const useUpdateProject = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProjectInput) => updateProject(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", userId] });
    },
  });
};

export const useDeleteProject = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", userId] });
    },
  });
};
