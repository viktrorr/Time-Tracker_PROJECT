import { reportService } from "@/application/services/service-factory";
import { toErrorResponse } from "@/infrastructure/api/errors";
import { parseOptionalDateInput } from "@/infrastructure/api/parse-date";
import { reportQuerySchema } from "@/infrastructure/api/schemas";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = reportQuerySchema.parse({
      range: url.searchParams.get("range") ?? undefined,
      date: url.searchParams.get("date") ?? undefined
    });

    const date = parseOptionalDateInput(query.date, "date");
    const csv = await reportService.exportProjectReportCsv({
      range: query.range,
      ...(date ? { date } : {})
    });

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="time-report-${query.range}.csv"`
      }
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
