import type { Project } from "@/domain/entities/project";

export interface ProjectRepository {
  list(): Promise<Project[]>;
  listActive(): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  create(input: { name: string; client?: string | null; colorHex?: string }): Promise<Project>;
  update(
    id: string,
    input: Partial<Pick<Project, "name" | "client" | "colorHex" | "archived">>
  ): Promise<Project>;
  delete(id: string): Promise<void>;
}
