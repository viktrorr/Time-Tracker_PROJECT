import { timeEntryService } from "@/application/services/service-factory";
import { toErrorResponse } from "@/infrastructure/api/errors";
import { parseOptionalDateInput } from "@/infrastructure/api/parse-date";
import { ok } from "@/infrastructure/api/response";
import { dateQuerySchema } from "@/infrastructure/api/schemas";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = dateQuerySchema.parse({
      date: url.searchParams.get("date") ?? undefined
    });

    const date = parseOptionalDateInput(query.date, "date") ?? new Date();
    const [entries, activeEntry] = await Promise.all([
      timeEntryService.listEntriesByDate(date),
      timeEntryService.getActiveEntry()
    ]);

    return ok({
      date: date.toISOString(),
      activeEntry,
      entries
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
