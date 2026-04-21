import { AppError } from "@/shared/errors/AppError";

export function parseDurationHHMM(value: string): number {
  const match = /^(\d{1,3}):(\d{2})$/.exec(value.trim());
  if (!match) {
    throw new AppError(400, "INVALID_DURATION", "Duration must be in hh:mm format");
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (!Number.isInteger(hours) || !Number.isInteger(minutes) || minutes < 0 || minutes > 59) {
    throw new AppError(400, "INVALID_DURATION", "Duration must be in hh:mm format");
  }

  const totalMinutes = hours * 60 + minutes;
  if (totalMinutes <= 0) {
    throw new AppError(400, "INVALID_DURATION", "Duration must be greater than 00:00");
  }

  return totalMinutes;
}

export function formatDurationHHMM(totalMinutes: number): string {
  const safe = Math.max(0, Math.floor(totalMinutes));
  const hours = Math.floor(safe / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (safe % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}
