import { useQuery } from "@tanstack/react-query";
import { fetchProjectStatuses } from "../services/projectStatusesService";
import type { ProjectStatusRow } from "../data/mockData";

export const useProjectStatuses = (projectId?: string) => {
  return useQuery<ProjectStatusRow[]>({
    queryKey: ["projectStatuses", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      return fetchProjectStatuses(projectId);
    },
    enabled: Boolean(projectId),
  });
};

export const useProjectStatusMap = (projectId?: string) => {
  const { data: statuses } = useProjectStatuses(projectId);

  const map = new Map<string, ProjectStatusRow>();
  if (statuses) {
    for (const s of statuses) {
      map.set(s.id, s);
      map.set(s.name, s);
    }
  }

  return {
    statuses: statuses ?? [],
    statusMap: map,
  };
};
