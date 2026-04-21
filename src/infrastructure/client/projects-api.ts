import type {
  CreateProjectInput,
  Project,
  UpdateProjectInput
} from "@/infrastructure/client/contracts";
import { apiRequest } from "@/infrastructure/client/http-client";

export function getProjects(): Promise<Project[]> {
  return apiRequest<Project[]>("/api/projects");
}

export function createProject(input: CreateProjectInput): Promise<Project> {
  return apiRequest<Project>("/api/projects", {
    method: "POST",
    body: input
  });
}

export function updateProject(id: string, input: UpdateProjectInput): Promise<Project> {
  return apiRequest<Project>(`/api/projects/${id}`, {
    method: "PUT",
    body: input
  });
}
