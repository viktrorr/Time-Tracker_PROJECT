export function formatDurationMinutes(totalMinutes: number): string {
  const safe = Math.max(0, Math.floor(totalMinutes));
  const hours = Math.floor(safe / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (safe % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function formatDateLabel(value: string): string {
  const date = new Date(value);
  return date.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "2-digit"
  });
}

export function formatDateTimeLabel(value: string): string {
  const date = new Date(value);
  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}
