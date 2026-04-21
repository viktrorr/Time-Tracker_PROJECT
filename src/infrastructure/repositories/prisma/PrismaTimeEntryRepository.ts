import type { Prisma, PrismaClient } from "@prisma/client";
import type { TimeEntry } from "@/domain/entities/time-entry";
import type { TimeEntryRepository } from "@/domain/repositories/time-entry-repository";
import { prisma as defaultPrisma } from "@/infrastructure/db/prisma/client";
import { mapTimeEntry } from "@/infrastructure/repositories/prisma/mappers";
import { normalizeTaskName } from "@/infrastructure/repositories/prisma/normalize-task-name";
import { AppError } from "@/shared/errors/AppError";

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

export class PrismaTimeEntryRepository implements TimeEntryRepository {
  constructor(private readonly prisma: PrismaClient = defaultPrisma) {}

  async listByDate(date: Date): Promise<TimeEntry[]> {
    const records = await this.prisma.timeEntry.findMany({
      where: {
        entryDate: {
          gte: startOfDay(date),
          lte: endOfDay(date)
        }
      },
      orderBy: [{ startedAt: "desc" }]
    });

    return records.map(mapTimeEntry);
  }

  async listByRange(params: { from: Date; to: Date; projectId?: string }): Promise<TimeEntry[]> {
    const records = await this.prisma.timeEntry.findMany({
      where: {
        entryDate: {
          gte: params.from,
          lte: params.to
        },
        ...(params.projectId ? { projectId: params.projectId } : {})
      },
      orderBy: [{ entryDate: "asc" }, { startedAt: "asc" }]
    });

    return records.map(mapTimeEntry);
  }

  async aggregateDurationByProject(params: { from: Date; to: Date }): Promise<Array<{ projectId: string | null; durationMinutes: number }>> {
    const grouped = await this.prisma.timeEntry.groupBy({
      by: ["projectId"],
      where: {
        isRunning: false,
        entryDate: {
          gte: params.from,
          lte: params.to
        }
      },
      _sum: {
        durationMinutes: true
      }
    });

    return grouped.map((item) => ({
      projectId: item.projectId,
      durationMinutes: item._sum.durationMinutes ?? 0
    }));
  }

  async findActive(): Promise<TimeEntry | null> {
    const record = await this.prisma.timeEntry.findFirst({
      where: { isRunning: true },
      orderBy: { startedAt: "desc" }
    });

    return record ? mapTimeEntry(record) : null;
  }

  async findById(id: string): Promise<TimeEntry | null> {
    const record = await this.prisma.timeEntry.findUnique({ where: { id } });
    return record ? mapTimeEntry(record) : null;
  }

  async start(input: {
    taskName: string;
    projectId?: string | null;
    startedAt: Date;
    entryDate: Date;
  }): Promise<TimeEntry> {
    const cleanTaskName = input.taskName.trim().replace(/\s+/g, " ");
    const normalized = normalizeTaskName(cleanTaskName);

    const entry = await this.prisma.$transaction(async (tx) => {
      const active = await tx.timeEntry.findFirst({ where: { isRunning: true } });
      if (active) {
        throw new AppError(409, "ACTIVE_TIMER_EXISTS", "A timer is already running");
      }

      const taskNameRecord = await tx.taskName.upsert({
        where: { normalized },
        update: {
          name: cleanTaskName,
          usageCount: { increment: 1 },
          lastUsedAt: input.startedAt
        },
        create: {
          name: cleanTaskName,
          normalized,
          usageCount: 1,
          lastUsedAt: input.startedAt
        }
      });

      return tx.timeEntry.create({
        data: {
          taskName: cleanTaskName,
          taskNameNorm: normalized,
          taskNameId: taskNameRecord.id,
          projectId: input.projectId ?? null,
          startedAt: input.startedAt,
          endedAt: null,
          durationMinutes: 0,
          isRunning: true,
          entryDate: startOfDay(input.entryDate)
        }
      });
    });

    return mapTimeEntry(entry);
  }

  async stop(input: { id: string; endedAt: Date }): Promise<TimeEntry> {
    const stopped = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.timeEntry.findUnique({ where: { id: input.id } });
      if (!existing) {
        throw new AppError(404, "TIME_ENTRY_NOT_FOUND", "Time entry not found");
      }

      const diffMs = input.endedAt.getTime() - existing.startedAt.getTime();
      const durationMinutes = Math.max(0, Math.round(diffMs / 60000));

      return tx.timeEntry.update({
        where: { id: input.id },
        data: {
          endedAt: input.endedAt,
          durationMinutes,
          isRunning: false
        }
      });
    });

    return mapTimeEntry(stopped);
  }

  async updateDuration(input: { id: string; durationMinutes: number }): Promise<TimeEntry> {
    const record = await this.prisma.timeEntry.update({
      where: { id: input.id },
      data: {
        durationMinutes: Math.max(0, input.durationMinutes),
        isRunning: false
      }
    });

    return mapTimeEntry(record);
  }

  async updateDetails(input: {
    id: string;
    taskName?: string;
    projectId?: string | null;
  }): Promise<TimeEntry> {
    const data: Prisma.TimeEntryUpdateInput = {};

    if (input.taskName !== undefined) {
      const cleanTaskName = input.taskName.trim().replace(/\s+/g, " ");
      const normalized = normalizeTaskName(cleanTaskName);

      const taskNameRecord = await this.prisma.taskName.upsert({
        where: { normalized },
        update: {
          name: cleanTaskName,
          usageCount: { increment: 1 },
          lastUsedAt: new Date()
        },
        create: {
          name: cleanTaskName,
          normalized,
          usageCount: 1,
          lastUsedAt: new Date()
        }
      });

      data.taskName = cleanTaskName;
      data.taskNameNorm = normalized;
      data.taskNameRef = { connect: { id: taskNameRecord.id } };
    }

    if (input.projectId !== undefined) {
      data.project = input.projectId ? { connect: { id: input.projectId } } : { disconnect: true };
    }

    const record = await this.prisma.timeEntry.update({
      where: { id: input.id },
      data
    });

    return mapTimeEntry(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.timeEntry.delete({ where: { id } });
  }
}
