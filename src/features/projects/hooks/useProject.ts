import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProject } from "../services/projectsService";
import type { ProjectRow } from "../data/mockData";

export const useProject = (
  projectId: string | undefined,
  userId: string | undefined,
) => {
  return useQuery<ProjectRow>({
    queryKey: ["project", projectId],
    queryFn: async () => {
      if (!projectId || !userId) {
        throw new Error("Missing projectId or userId");
      }
      return fetchProject(projectId, userId);
    },
    enabled: Boolean(projectId && userId),
  });
};
