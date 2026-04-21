import { ProjectService } from "@/application/services/project-service";
import { ReportService } from "@/application/services/report-service";
import { TaskNameService } from "@/application/services/task-name-service";
import { TimeEntryService } from "@/application/services/time-entry-service";
import { PrismaProjectRepository } from "@/infrastructure/repositories/prisma/PrismaProjectRepository";
import { PrismaTaskNameRepository } from "@/infrastructure/repositories/prisma/PrismaTaskNameRepository";
import { PrismaTimeEntryRepository } from "@/infrastructure/repositories/prisma/PrismaTimeEntryRepository";

const projectRepository = new PrismaProjectRepository();
const taskNameRepository = new PrismaTaskNameRepository();
const timeEntryRepository = new PrismaTimeEntryRepository();

export const projectService = new ProjectService(projectRepository);
export const taskNameService = new TaskNameService(taskNameRepository);
export const timeEntryService = new TimeEntryService(timeEntryRepository);
export const reportService = new ReportService(timeEntryRepository, projectRepository);
