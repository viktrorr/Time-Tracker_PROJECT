import type { TimeEntry } from "@/domain/entities/time-entry";
import type { TimeEntryRepository } from "@/domain/repositories/time-entry-repository";
import { AppError } from "@/shared/errors/AppError";

type StartTimerInput = {
  taskName: string;
  projectId?: string | null;
  startedAt?: Date;
};

type StopTimerInput = {
  id?: string;
  endedAt?: Date;
};

type UpdateEntryInput = {
  taskName?: string;
  projectId?: string | null;
  durationMinutes?: number;
};

export class TimeEntryService {
  constructor(private readonly timeEntryRepository: TimeEntryRepository) {}

  async getActiveEntry(): Promise<TimeEntry | null> {
    return this.timeEntryRepository.findActive();
  }

  async listEntriesByDate(date: Date): Promise<TimeEntry[]> {
    return this.timeEntryRepository.listByDate(date);
  }

  async startTimer(input: StartTimerInput): Promise<TimeEntry> {
    const active = await this.timeEntryRepository.findActive();
    if (active) {
      throw new AppError(409, "ACTIVE_TIMER_EXISTS", "A timer is already running");
    }

    const startedAt = input.startedAt ?? new Date();
    return this.timeEntryRepository.start({
      taskName: input.taskName,
      projectId: input.projectId,
      startedAt,
      entryDate: startedAt
    });
  }

  async stopTimer(input: StopTimerInput): Promise<TimeEntry> {
    const endedAt = input.endedAt ?? new Date();

    const targetEntry = input.id
      ? await this.timeEntryRepository.findById(input.id)
      : await this.timeEntryRepository.findActive();

    if (!targetEntry) {
      throw new AppError(404, "TIME_ENTRY_NOT_FOUND", "Time entry not found");
    }

    if (!targetEntry.isRunning) {
      throw new AppError(400, "TIME_ENTRY_NOT_RUNNING", "Time entry is already stopped");
    }

    return this.timeEntryRepository.stop({ id: targetEntry.id, endedAt });
  }

  async updateEntry(id: string, input: UpdateEntryInput): Promise<TimeEntry> {
    const existing = await this.timeEntryRepository.findById(id);
    if (!existing) {
      throw new AppError(404, "TIME_ENTRY_NOT_FOUND", "Time entry not found");
    }

    let updated = existing;

    if (input.taskName !== undefined || input.projectId !== undefined) {
      updated = await this.timeEntryRepository.updateDetails({
        id,
        ...(input.taskName !== undefined ? { taskName: input.taskName } : {}),
        ...(input.projectId !== undefined ? { projectId: input.projectId } : {})
      });
    }

    if (input.durationMinutes !== undefined) {
      if (existing.isRunning) {
        throw new AppError(
          400,
          "RUNNING_ENTRY_DURATION_FORBIDDEN",
          "Manual duration correction is allowed only for completed entries"
        );
      }

      if (input.durationMinutes <= 0) {
        throw new AppError(400, "INVALID_DURATION", "Duration must be greater than 00:00");
      }

      updated = await this.timeEntryRepository.updateDuration({
        id,
        durationMinutes: input.durationMinutes
      });
    }

    return updated;
  }

  async deleteEntry(id: string): Promise<void> {
    const existing = await this.timeEntryRepository.findById(id);
    if (!existing) {
      throw new AppError(404, "TIME_ENTRY_NOT_FOUND", "Time entry not found");
    }

    await this.timeEntryRepository.delete(id);
  }
}
