import type { Project } from "@/domain/entities/project";
import type { TaskName } from "@/domain/entities/task-name";
import type { TimeEntry } from "@/domain/entities/time-entry";
import type { ReportDetailsResult, ReportResult } from "@/application/services/report-service";

export type ListTimeEntriesResponse = {
  date: string;
  activeEntry: TimeEntry | null;
  entries: TimeEntry[];
};

export type StartTimerInput = {
  taskName: string;
  projectId?: string | null;
  startedAt?: string;
};

export type StopTimerInput = {
  id?: string;
  endedAt?: string;
};

export type UpdateTimeEntryInput = {
  taskName?: string;
  projectId?: string | null;
  duration?: string;
};

export type CreateProjectInput = {
  name: string;
  client?: string | null;
  colorHex?: string;
};

export type UpdateProjectInput = Partial<
  Pick<Project, "name" | "client" | "colorHex" | "archived">
>;

export type ReportRange = "day" | "week" | "month";

export type ReportQuery = {
  range: ReportRange;
  date?: string;
};

export type ReportApiResponse = ReportResult & Pick<ReportDetailsResult, "entryCount" | "entries">;

export type { Project, TaskName, TimeEntry, ReportResult };
