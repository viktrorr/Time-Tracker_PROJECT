import type { ReportApiResponse } from "@/infrastructure/client/contracts";
import { ColorDot } from "@/presentation/components/ui/ColorDot";
import { formatDurationMinutes } from "@/presentation/components/reports/reports-formatters";

type ReportProjectTotalsProps = {
  rows: ReportApiResponse["rows"];
};

export function ReportProjectTotals({ rows }: ReportProjectTotalsProps): JSX.Element {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">Grouped totals by project</h3>

      {rows.length === 0 ? (
        <p className="text-sm text-slate-500">No project totals for this period.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((row) => (
            <li
              key={row.projectId ?? "none"}
              className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2"
            >
              <span className="inline-flex min-w-0 items-center gap-2">
                <ColorDot colorHex={row.colorHex} />
                <span className="truncate text-sm text-slate-700">{row.projectName}</span>
              </span>
              <span className="text-sm font-semibold tabular-nums text-slate-900">
                {formatDurationMinutes(row.durationMinutes)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
