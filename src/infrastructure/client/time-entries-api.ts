import type {
  ListTimeEntriesResponse,
  StartTimerInput,
  StopTimerInput,
  TimeEntry,
  UpdateTimeEntryInput
} from "@/infrastructure/client/contracts";
import { apiRequest } from "@/infrastructure/client/http-client";

export function getTimeEntries(params?: { date?: string }): Promise<ListTimeEntriesResponse> {
  const search = new URLSearchParams();
  if (params?.date) {
    search.set("date", params.date);
  }

  const query = search.toString();
  const path = query ? `/api/time-entries?${query}` : "/api/time-entries";
  return apiRequest<ListTimeEntriesResponse>(path);
}

export function startTimeEntry(input: StartTimerInput): Promise<TimeEntry> {
  return apiRequest<TimeEntry>("/api/time-entries/start", {
    method: "POST",
    body: input
  });
}

export function stopTimeEntry(input?: StopTimerInput): Promise<TimeEntry> {
  return apiRequest<TimeEntry>("/api/time-entries/stop", {
    method: "POST",
    body: input ?? {}
  });
}

export function patchTimeEntry(id: string, input: UpdateTimeEntryInput): Promise<TimeEntry> {
  return apiRequest<TimeEntry>(`/api/time-entries/${id}`, {
    method: "PATCH",
    body: input
  });
}

export function deleteTimeEntry(id: string): Promise<{ deleted: true }> {
  return apiRequest<{ deleted: true }>(`/api/time-entries/${id}`, {
    method: "DELETE"
  });
}
