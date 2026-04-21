import type { EnrichedEntry } from "@/presentation/hooks/useDashboard";

export function formatMinutes(value: number): string {
  const total = Math.max(0, Math.floor(value));
  const hours = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (total % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function formatDateTime(value: string | Date): string {
  const date = new Date(value);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function taskNameClassName(taskName: string): string {
  if (taskName.length > 70) {
    return "whitespace-normal break-words";
  }
  return "truncate";
}

export function entryStatusLabel(entry: EnrichedEntry): string {
  if (entry.isRunning) {
    return "Running";
  }

  return `${formatDateTime(entry.startedAt)} - ${entry.endedAt ? formatDateTime(entry.endedAt) : "--"}`;
}
