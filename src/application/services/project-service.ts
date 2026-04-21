import type { Project } from "@/domain/entities/project";
import type { ProjectRepository } from "@/domain/repositories/project-repository";
import { AppError } from "@/shared/errors/AppError";

export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async listProjects(): Promise<Project[]> {
    return this.projectRepository.list();
  }

  async createProject(input: { name: string; client?: string | null; colorHex?: string }): Promise<Project> {
    return this.projectRepository.create(input);
  }

  async updateProject(
    id: string,
    input: Partial<Pick<Project, "name" | "client" | "colorHex" | "archived">>
  ): Promise<Project> {
    const existing = await this.projectRepository.findById(id);
    if (!existing) {
      throw new AppError(404, "PROJECT_NOT_FOUND", "Project not found");
    }

    return this.projectRepository.update(id, input);
  }
}
