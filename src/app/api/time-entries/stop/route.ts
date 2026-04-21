import { timeEntryService } from "@/application/services/service-factory";
import { toErrorResponse } from "@/infrastructure/api/errors";
import { parseJsonBody } from "@/infrastructure/api/request";
import { ok } from "@/infrastructure/api/response";
import { stopTimerSchema } from "@/infrastructure/api/schemas";

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody(request, stopTimerSchema);

    const entry = await timeEntryService.stopTimer({
      id: body.id,
      endedAt: body.endedAt ? new Date(body.endedAt) : undefined
    });

    return ok(entry);
  } catch (error) {
    return toErrorResponse(error);
  }
}
