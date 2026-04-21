import { formatDateLabel, formatDurationMinutes } from "@/presentation/components/reports/reports-formatters";

type ReportSummaryCardsProps = {
  totalMinutes: number;
  entryCount: number;
  from: string;
  to: string;
};

export function ReportSummaryCards({
  totalMinutes,
  entryCount,
  from,
  to
}: ReportSummaryCardsProps): JSX.Element {
  return (
    <section className="grid gap-3 sm:grid-cols-3">
      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total tracked</p>
        <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900">
          {formatDurationMinutes(totalMinutes)}
        </p>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Entries</p>
        <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900">{entryCount}</p>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Date range</p>
        <p className="mt-1 text-sm font-semibold text-slate-900">
          {formatDateLabel(from)} — {formatDateLabel(to)}
        </p>
      </article>
    </section>
  );
}
