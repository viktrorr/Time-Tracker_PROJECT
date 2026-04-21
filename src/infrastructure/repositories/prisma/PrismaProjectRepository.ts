import type { PrismaClient } from "@prisma/client";
import type { Project } from "@/domain/entities/project";
import type { ProjectRepository } from "@/domain/repositories/project-repository";
import { prisma as defaultPrisma } from "@/infrastructure/db/prisma/client";
import { mapProject } from "@/infrastructure/repositories/prisma/mappers";

export class PrismaProjectRepository implements ProjectRepository {
  constructor(private readonly prisma: PrismaClient = defaultPrisma) {}

  async list(): Promise<Project[]> {
    const records = await this.prisma.project.findMany({
      orderBy: [{ archived: "asc" }, { name: "asc" }]
    });

    return records.map(mapProject);
  }

  async listActive(): Promise<Project[]> {
    const records = await this.prisma.project.findMany({
      where: { archived: false },
      orderBy: { name: "asc" }
    });

    return records.map(mapProject);
  }

  async findById(id: string): Promise<Project | null> {
    const record = await this.prisma.project.findUnique({ where: { id } });
    return record ? mapProject(record) : null;
  }

  async create(input: { name: string; client?: string | null; colorHex?: string }): Promise<Project> {
    const record = await this.prisma.project.create({
      data: {
        name: input.name.trim(),
        client: input.client?.trim() || null,
        colorHex: input.colorHex ?? "#64748B"
      }
    });

    return mapProject(record);
  }

  async update(
    id: string,
    input: Partial<Pick<Project, "name" | "client" | "colorHex" | "archived">>
  ): Promise<Project> {
    const record = await this.prisma.project.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name.trim() } : {}),
        ...(input.client !== undefined ? { client: input.client?.trim() || null } : {}),
        ...(input.colorHex !== undefined ? { colorHex: input.colorHex } : {}),
        ...(input.archived !== undefined ? { archived: input.archived } : {})
      }
    });

    return mapProject(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.project.delete({ where: { id } });
  }
}
