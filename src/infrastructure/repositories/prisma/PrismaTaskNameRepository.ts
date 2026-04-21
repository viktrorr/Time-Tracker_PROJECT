import type { PrismaClient } from "@prisma/client";
import type { TaskName } from "@/domain/entities/task-name";
import type { TaskNameRepository } from "@/domain/repositories/task-name-repository";
import { prisma as defaultPrisma } from "@/infrastructure/db/prisma/client";
import { mapTaskName } from "@/infrastructure/repositories/prisma/mappers";
import { normalizeTaskName } from "@/infrastructure/repositories/prisma/normalize-task-name";

export class PrismaTaskNameRepository implements TaskNameRepository {
  constructor(private readonly prisma: PrismaClient = defaultPrisma) {}

  async listTop(limit = 10): Promise<TaskName[]> {
    const records = await this.prisma.taskName.findMany({
      orderBy: [{ usageCount: "desc" }, { lastUsedAt: "desc" }],
      take: limit
    });

    return records.map(mapTaskName);
  }

  async suggest(query: string, limit = 10): Promise<TaskName[]> {
    const normalizedQuery = normalizeTaskName(query);
    const records = await this.prisma.taskName.findMany({
      where: {
        normalized: {
          contains: normalizedQuery
        }
      },
      orderBy: [{ usageCount: "desc" }, { lastUsedAt: "desc" }],
      take: limit
    });

    return records.map(mapTaskName);
  }

  async findByNormalized(normalized: string): Promise<TaskName | null> {
    const record = await this.prisma.taskName.findUnique({ where: { normalized } });
    return record ? mapTaskName(record) : null;
  }

  async upsertFromRawName(rawName: string, usedAt: Date): Promise<TaskName> {
    const cleanName = rawName.trim().replace(/\s+/g, " ");
    const normalized = normalizeTaskName(cleanName);

    const record = await this.prisma.taskName.upsert({
      where: { normalized },
      update: {
        name: cleanName,
        usageCount: { increment: 1 },
        lastUsedAt: usedAt
      },
      create: {
        name: cleanName,
        normalized,
        usageCount: 1,
        lastUsedAt: usedAt
      }
    });

    return mapTaskName(record);
  }

  async incrementUsage(id: string, usedAt: Date): Promise<TaskName> {
    const record = await this.prisma.taskName.update({
      where: { id },
      data: {
        usageCount: { increment: 1 },
        lastUsedAt: usedAt
      }
    });

    return mapTaskName(record);
  }
}
