import { projectService } from "@/application/services/service-factory";
import { toErrorResponse } from "@/infrastructure/api/errors";
import { ok } from "@/infrastructure/api/response";
import { projectCreateSchema } from "@/infrastructure/api/schemas";
import { parseJsonBody } from "@/infrastructure/api/request";

export async function GET() {
  try {
    const projects = await projectService.listProjects();
    return ok(projects);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody(request, projectCreateSchema);
    const project = await projectService.createProject(body);
    return ok(project, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
