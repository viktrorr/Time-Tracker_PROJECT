export const queryKeys = {
  projects: ["projects"] as const,
  taskNames: (query: string, limit: number) => ["task-names", query, limit] as const,
  todayEntries: (date: string) => ["time-entries", date] as const,
  reports: (range: string, date?: string) => ["reports", range, date ?? ""] as const
};
