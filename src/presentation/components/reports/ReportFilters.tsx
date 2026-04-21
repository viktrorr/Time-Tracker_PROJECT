import type { ReportRange } from "@/infrastructure/client/contracts";

type ReportFiltersProps = {
  range: ReportRange;
  anchorDate: string;
  onChangeRange: (value: ReportRange) => void;
  onChangeAnchorDate: (value: string) => void;
};

export function ReportFilters({
  range,
  anchorDate,
  onChangeRange,
  onChangeAnchorDate
}: ReportFiltersProps): JSX.Element {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="report-range" className="mb-1 block text-sm font-medium text-slate-700">Period</label>
          <select
            id="report-range"
            value={range}
            onChange={(event) => onChangeRange(event.target.value as ReportRange)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>

        <div>
          <label htmlFor="report-date" className="mb-1 block text-sm font-medium text-slate-700">Anchor date</label>
          <input
            id="report-date"
            type="date"
            value={anchorDate}
            onChange={(event) => onChangeAnchorDate(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
        </div>
      </div>
    </section>
  );
}
