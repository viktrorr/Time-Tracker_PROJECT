import { AppError } from "@/shared/errors/AppError";

export function parseOptionalDateInput(value: string | undefined, fieldName: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (
      Number.isNaN(date.getTime()) ||
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      throw new AppError(400, "INVALID_DATE", `Invalid ${fieldName}`);
    }
    return date;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    throw new AppError(400, "INVALID_DATE", `Invalid ${fieldName}`);
  }

  return parsed;
}
