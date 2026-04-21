import type { TaskName } from "@/domain/entities/task-name";
import type { TaskNameRepository } from "@/domain/repositories/task-name-repository";

export class TaskNameService {
  constructor(private readonly taskNameRepository: TaskNameRepository) {}

  async listTaskNames(params: { query?: string; limit?: number }): Promise<TaskName[]> {
    const query = params.query?.trim();
    const limit = params.limit ?? 10;

    if (query && query.length > 0) {
      return this.taskNameRepository.suggest(query, limit);
    }

    return this.taskNameRepository.listTop(limit);
  }
}
