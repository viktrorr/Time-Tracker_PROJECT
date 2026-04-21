import { reportService } from "@/application/services/service-factory";
import { toErrorResponse } from "@/infrastructure/api/errors";
import { parseOptionalDateInput } from "@/infrastructure/api/parse-date";
import { ok } from "@/infrastructure/api/response";
import { reportQuerySchema } from "@/infrastructure/api/schemas";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = reportQuerySchema.parse({
      range: url.searchParams.get("range") ?? undefined,
      date: url.searchParams.get("date") ?? undefined
    });

    const date = parseOptionalDateInput(query.date, "date");
    const [summary, details] = await Promise.all([
      reportService.getProjectReport({
        range: query.range,
        ...(date ? { date } : {})
      }),
      reportService.getDetailedReport({
        range: query.range,
        ...(date ? { date } : {})
      })
    ]);

    return ok({
      ...summary,
      entryCount: details.entryCount,
      entries: details.entries
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
