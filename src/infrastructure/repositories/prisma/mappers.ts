import type { Project as PrismaProject, TaskName as PrismaTaskName, TimeEntry as PrismaTimeEntry } from "@prisma/client";
import type { Project } from "@/domain/entities/project";
import type { TaskName } from "@/domain/entities/task-name";
import type { TimeEntry } from "@/domain/entities/time-entry";

export function mapProject(record: PrismaProject): Project {
  return {
    id: record.id,
    name: record.name,
    client: record.client,
    colorHex: record.colorHex,
    archived: record.archived,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
}

export function mapTaskName(record: PrismaTaskName): TaskName {
  return {
    id: record.id,
    name: record.name,
    normalized: record.normalized,
    usageCount: record.usageCount,
    lastUsedAt: record.lastUsedAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
}

export function mapTimeEntry(record: PrismaTimeEntry): TimeEntry {
  return {
    id: record.id,
    taskName: record.taskName,
    taskNameNorm: record.taskNameNorm,
    taskNameId: record.taskNameId,
    projectId: record.projectId,
    startedAt: record.startedAt,
    endedAt: record.endedAt,
    durationMinutes: record.durationMinutes,
    isRunning: record.isRunning,
    entryDate: record.entryDate,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
}
