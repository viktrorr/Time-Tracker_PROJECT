import type { EnrichedEntry } from "@/presentation/hooks/useDashboard";

export type ProjectGroupingSummary = {
  projectId: string | null;
  projectName: string;
  colorHex: string | null;
  totalMinutes: number;
  entryCount: number;
};

export function buildProjectGroupingSummary(entries: EnrichedEntry[]): ProjectGroupingSummary[] {
  const grouped = new Map<string, ProjectGroupingSummary>();

  for (const entry of entries) {
    const key = entry.projectId ?? "__no_project__";
    const existing = grouped.get(key);

    if (existing) {
      existing.totalMinutes += entry.effectiveDurationMinutes;
      existing.entryCount += 1;
      continue;
    }

    grouped.set(key, {
      projectId: entry.projectId,
      projectName: entry.projectName || "No Project",
      colorHex: entry.projectColorHex,
      totalMinutes: entry.effectiveDurationMinutes,
      entryCount: 1
    });
  }

  return [...grouped.values()].sort((a, b) => b.totalMinutes - a.totalMinutes);
}
