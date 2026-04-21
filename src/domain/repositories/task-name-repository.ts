import type { TaskName } from "@/domain/entities/task-name";

export interface TaskNameRepository {
  listTop(limit?: number): Promise<TaskName[]>;
  suggest(query: string, limit?: number): Promise<TaskName[]>;
  findByNormalized(normalized: string): Promise<TaskName | null>;
  upsertFromRawName(rawName: string, usedAt: Date): Promise<TaskName>;
  incrementUsage(id: string, usedAt: Date): Promise<TaskName>;
}
