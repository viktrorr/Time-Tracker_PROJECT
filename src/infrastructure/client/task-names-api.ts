import type { TaskName } from "@/infrastructure/client/contracts";
import { apiRequest } from "@/infrastructure/client/http-client";

export function getTaskNames(params?: { q?: string; limit?: number }): Promise<TaskName[]> {
  const search = new URLSearchParams();
  if (params?.q) {
    search.set("q", params.q);
  }
  if (params?.limit !== undefined) {
    search.set("limit", String(params.limit));
  }

  const query = search.toString();
  const path = query ? `/api/task-names?${query}` : "/api/task-names";
  return apiRequest<TaskName[]>(path);
}
