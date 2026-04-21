"use client";

import { ReportEntriesTable } from "@/presentation/components/reports/ReportEntriesTable";
import { ReportFilters } from "@/presentation/components/reports/ReportFilters";
import { ReportProjectTotals } from "@/presentation/components/reports/ReportProjectTotals";
import { ReportSummaryCards } from "@/presentation/components/reports/ReportSummaryCards";
import { useReportsPage } from "@/presentation/hooks/useReportsPage";

export function ReportsSection(): JSX.Element {
  const reports = useReportsPage();
  const data = reports.report.data;

  const loading = reports.report.isLoading;
  const error = reports.report.error;

  return (
    <div className="grid gap-4">
      <ReportFilters
        range={reports.range}
        anchorDate={reports.anchorDate}
        onChangeRange={reports.setRange}
        onChangeAnchorDate={reports.setAnchorDate}
      />

      <div className="flex items-center justify-end">
        <a
          href={reports.report.exportUrl}
          aria-disabled={!reports.canExportCsv}
          onClick={(event) => {
            if (!reports.canExportCsv) {
              event.preventDefault();
            }
          }}
          className={`rounded-md border px-3 py-2 text-sm font-medium ${
            reports.canExportCsv
              ? "border-slate-300 text-slate-700 hover:bg-slate-50"
              : "cursor-not-allowed border-slate-200 text-slate-400"
          }`}
        >
          Export CSV
        </a>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500" aria-live="polite">
          Loading report...
        </p>
      ) : null}

      {error ? (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error instanceof Error ? error.message : "Failed to load report"}
        </p>
      ) : null}

      {data ? (
        <>
          <ReportSummaryCards
            totalMinutes={data.totalMinutes}
            entryCount={data.entryCount}
            from={data.from}
            to={data.to}
          />
          <ReportProjectTotals rows={data.rows} />
          <ReportEntriesTable entries={data.entries} />
          {!reports.canExportCsv ? (
            <p className="text-xs text-slate-500">No grouped totals available for CSV export in this period.</p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
