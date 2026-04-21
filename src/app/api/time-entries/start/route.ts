import { timeEntryService } from "@/application/services/service-factory";
import { toErrorResponse } from "@/infrastructure/api/errors";
import { parseJsonBody } from "@/infrastructure/api/request";
import { ok } from "@/infrastructure/api/response";
import { startTimerSchema } from "@/infrastructure/api/schemas";

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody(request, startTimerSchema);

    const entry = await timeEntryService.startTimer({
      taskName: body.taskName,
      projectId: body.projectId,
      startedAt: body.startedAt ? new Date(body.startedAt) : undefined
    });

    return ok(entry, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
