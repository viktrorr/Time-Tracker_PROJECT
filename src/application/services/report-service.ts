import type { ProjectRepository } from "@/domain/repositories/project-repository";
import type { TimeEntryRepository } from "@/domain/repositories/time-entry-repository";
import { resolveRangeBounds, type ReportRange } from "@/shared/utils/date-range";

export type ProjectReportRow = {
  projectId: string | null;
  projectName: string;
  colorHex: string | null;
  durationMinutes: number;
};

export type ReportResult = {
  range: ReportRange;
  from: string;
  to: string;
  totalMinutes: number;
  rows: ProjectReportRow[];
};

export type ReportEntryRow = {
  id: string;
  taskName: string;
  projectId: string | null;
  projectName: string;
  colorHex: string | null;
  startedAt: string;
  endedAt: string | null;
  durationMinutes: number;
  isRunning: boolean;
};

export type ReportDetailsResult = {
  range: ReportRange;
  from: string;
  to: string;
  totalMinutes: number;
  entryCount: number;
  entries: ReportEntryRow[];
};

export class ReportService {
  constructor(
    private readonly timeEntryRepository: TimeEntryRepository,
    private readonly projectRepository: ProjectRepository
  ) {}

  async getProjectReport(input: { range: ReportRange; date?: Date }): Promise<ReportResult> {
    const { from, to } = resolveRangeBounds(input.range, input.date ?? new Date());
    const [aggregated, projects] = await Promise.all([
      this.timeEntryRepository.aggregateDurationByProject({ from, to }),
      this.projectRepository.list()
    ]);

    const projectMap = new Map(projects.map((project) => [project.id, project]));
    const rows: ProjectReportRow[] = aggregated
      .map((item) => {
        const project = item.projectId ? projectMap.get(item.projectId) : null;
        return {
          projectId: item.projectId,
          projectName: project?.name ?? "No Project",
          colorHex: project?.colorHex ?? null,
          durationMinutes: item.durationMinutes
        };
      })
      .sort((a, b) => b.durationMinutes - a.durationMinutes);

    const totalMinutes = rows.reduce((sum, row) => sum + row.durationMinutes, 0);

    return {
      range: input.range,
      from: from.toISOString(),
      to: to.toISOString(),
      totalMinutes,
      rows
    };
  }

  async exportProjectReportCsv(input: { range: ReportRange; date?: Date }): Promise<string> {
    const report = await this.getProjectReport(input);
    const header = "projectId,projectName,colorHex,durationMinutes";
    const lines = report.rows.map((row) => {
      const safeName = `"${row.projectName.replaceAll('"', '""')}"`;
      return `${row.projectId ?? ""},${safeName},${row.colorHex ?? ""},${row.durationMinutes}`;
    });
    return [header, ...lines].join("\n");
  }

  async getDetailedReport(input: { range: ReportRange; date?: Date }): Promise<ReportDetailsResult> {
    const { from, to } = resolveRangeBounds(input.range, input.date ?? new Date());
    const [entries, projects] = await Promise.all([
      this.timeEntryRepository.listByRange({ from, to }),
      this.projectRepository.list()
    ]);

    const projectMap = new Map(projects.map((project) => [project.id, project]));
    const rows: ReportEntryRow[] = entries
      .map((entry) => {
        const project = entry.projectId ? projectMap.get(entry.projectId) : null;
        return {
          id: entry.id,
          taskName: entry.taskName,
          projectId: entry.projectId,
          projectName: project?.name ?? "No Project",
          colorHex: project?.colorHex ?? null,
          startedAt: entry.startedAt.toISOString(),
          endedAt: entry.endedAt ? entry.endedAt.toISOString() : null,
          durationMinutes: entry.durationMinutes,
          isRunning: entry.isRunning
        };
      })
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt));

    const totalMinutes = rows.reduce((sum, row) => sum + row.durationMinutes, 0);

    return {
      range: input.range,
      from: from.toISOString(),
      to: to.toISOString(),
      totalMinutes,
      entryCount: rows.length,
      entries: rows
    };
  }
}
