import { taskNameService } from "@/application/services/service-factory";
import { toErrorResponse } from "@/infrastructure/api/errors";
import { ok } from "@/infrastructure/api/response";
import { taskNamesQuerySchema } from "@/infrastructure/api/schemas";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = taskNamesQuerySchema.parse({
      q: url.searchParams.get("q") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined
    });

    const taskNames = await taskNameService.listTaskNames({
      query: query.q,
      limit: query.limit
    });

    return ok(taskNames);
  } catch (error) {
    return toErrorResponse(error);
  }
}
