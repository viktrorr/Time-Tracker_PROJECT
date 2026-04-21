import { timeEntryService } from "@/application/services/service-factory";
import { toErrorResponse } from "@/infrastructure/api/errors";
import { parseJsonBody } from "@/infrastructure/api/request";
import { ok } from "@/infrastructure/api/response";
import { patchTimeEntrySchema } from "@/infrastructure/api/schemas";
import { parseDurationHHMM } from "@/shared/utils/duration";

type Context = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, context: Context) {
  try {
    const body = await parseJsonBody(request, patchTimeEntrySchema);

    const entry = await timeEntryService.updateEntry(context.params.id, {
      ...(body.taskName !== undefined ? { taskName: body.taskName } : {}),
      ...(body.projectId !== undefined ? { projectId: body.projectId } : {}),
      ...(body.duration !== undefined ? { durationMinutes: parseDurationHHMM(body.duration) } : {})
    });

    return ok(entry);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    await timeEntryService.deleteEntry(context.params.id);
    return ok({ deleted: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
