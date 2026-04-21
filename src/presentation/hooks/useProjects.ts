"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProject, getProjects, updateProject } from "@/infrastructure/client/projects-api";
import type { CreateProjectInput, UpdateProjectInput } from "@/infrastructure/client/contracts";
import { queryKeys } from "@/presentation/hooks/query-keys";

export function useProjects() {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: queryKeys.projects,
    queryFn: () => getProjects()
  });

  const createProjectMutation = useMutation({
    mutationFn: (input: CreateProjectInput) => createProject(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProjectInput }) => updateProject(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      await queryClient.invalidateQueries({ queryKey: ["time-entries"] });
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
    }
  });

  return {
    ...projectsQuery,
    createProject: createProjectMutation.mutateAsync,
    updateProject: updateProjectMutation.mutateAsync,
    isCreatingProject: createProjectMutation.isPending,
    isUpdatingProject: updateProjectMutation.isPending
  };
}
