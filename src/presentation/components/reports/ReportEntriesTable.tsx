import type { ReportApiResponse } from "@/infrastructure/client/contracts";
import { ColorDot } from "@/presentation/components/ui/ColorDot";
import {
  formatDateTimeLabel,
  formatDurationMinutes
} from "@/presentation/components/reports/reports-formatters";

type ReportEntriesTableProps = {
  entries: ReportApiResponse["entries"];
};

export function ReportEntriesTable({ entries }: ReportEntriesTableProps): JSX.Element {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">Detailed entries</h3>

      {entries.length === 0 ? (
        <p className="text-sm text-slate-500">No entries for this period.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-2 py-2">Task</th>
                <th className="px-2 py-2">Project</th>
                <th className="px-2 py-2">Started</th>
                <th className="px-2 py-2">Ended</th>
                <th className="px-2 py-2 text-right">Duration</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-slate-100">
                  <td className="px-2 py-2">
                    <span className="line-clamp-2 text-slate-900">{entry.taskName}</span>
                  </td>
                  <td className="px-2 py-2">
                    <span className="inline-flex items-center gap-2 text-slate-700">
                      <ColorDot colorHex={entry.colorHex} />
                      {entry.projectName}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-slate-600">{formatDateTimeLabel(entry.startedAt)}</td>
                  <td className="px-2 py-2 text-slate-600">
                    {entry.endedAt ? formatDateTimeLabel(entry.endedAt) : "Running"}
                  </td>
                  <td className="px-2 py-2 text-right font-semibold tabular-nums text-slate-900">
                    {entry.isRunning ? "—" : formatDurationMinutes(entry.durationMinutes)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
