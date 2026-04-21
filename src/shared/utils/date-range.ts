export type ReportRange = "day" | "week" | "month";

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + mondayOffset);
  return d;
}

function endOfWeek(date: Date): Date {
  const start = startOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

export function resolveRangeBounds(range: ReportRange, anchorDate = new Date()): { from: Date; to: Date } {
  if (range === "day") {
    return { from: startOfDay(anchorDate), to: endOfDay(anchorDate) };
  }

  if (range === "week") {
    return { from: startOfWeek(anchorDate), to: endOfWeek(anchorDate) };
  }

  return { from: startOfMonth(anchorDate), to: endOfMonth(anchorDate) };
}
