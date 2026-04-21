export function normalizeTaskName(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}
