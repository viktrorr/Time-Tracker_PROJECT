export type TimeEntry = {
  id: string;
  taskName: string;
  taskNameNorm: string;
  taskNameId: string | null;
  projectId: string | null;
  startedAt: Date;
  endedAt: Date | null;
  durationMinutes: number;
  isRunning: boolean;
  entryDate: Date;
  createdAt: Date;
  updatedAt: Date;
};
