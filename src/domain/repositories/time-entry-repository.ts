import type { TimeEntry } from "@/domain/entities/time-entry";

export interface TimeEntryRepository {
  listByDate(date: Date): Promise<TimeEntry[]>;
  listByRange(params: {
    from: Date;
    to: Date;
    projectId?: string;
  }): Promise<TimeEntry[]>;
  aggregateDurationByProject(params: {
    from: Date;
    to: Date;
  }): Promise<Array<{ projectId: string | null; durationMinutes: number }>>;
  findActive(): Promise<TimeEntry | null>;
  findById(id: string): Promise<TimeEntry | null>;
  start(input: {
    taskName: string;
    projectId?: string | null;
    startedAt: Date;
    entryDate: Date;
  }): Promise<TimeEntry>;
  stop(input: { id: string; endedAt: Date }): Promise<TimeEntry>;
  updateDuration(input: { id: string; durationMinutes: number }): Promise<TimeEntry>;
  updateDetails(input: {
    id: string;
    taskName?: string;
    projectId?: string | null;
  }): Promise<TimeEntry>;
  delete(id: string): Promise<void>;
}
