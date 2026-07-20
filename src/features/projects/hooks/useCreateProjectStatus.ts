import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProjectStatus } from "../services/projectStatusesService";

export const useCreateProjectStatus = (projectId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, color }: { name: string; color: string }) =>
      createProjectStatus(projectId ?? "", name, color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectStatuses", projectId] });
    },
  });
};
