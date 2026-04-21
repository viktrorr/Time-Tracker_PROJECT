import { projectService } from "@/application/services/service-factory";
import { toErrorResponse } from "@/infrastructure/api/errors";
import { ok } from "@/infrastructure/api/response";
import { projectUpdateSchema } from "@/infrastructure/api/schemas";
import { parseJsonBody } from "@/infrastructure/api/request";

type Context = {
  params: {
    id: string;
  };
};

export async function PUT(request: Request, context: Context) {
  try {
    const body = await parseJsonBody(request, projectUpdateSchema);
    const project = await projectService.updateProject(context.params.id, body);
    return ok(project);
  } catch (error) {
    return toErrorResponse(error);
  }
}
