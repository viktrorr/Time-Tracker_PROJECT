import type { ProjectGroupingSummary } from "@/presentation/components/dashboard/project-grouping";
import { ColorDot } from "@/presentation/components/ui/ColorDot";
import { formatMinutes } from "@/presentation/components/dashboard/dashboard-utils";

type ProjectTotalsSectionProps = {
  totals: ProjectGroupingSummary[];
  showEntryCount?: boolean;
};

export function ProjectTotalsSection({
  totals,
  showEntryCount = true
}: ProjectTotalsSectionProps): JSX.Element {
  const grandTotal = totals.reduce((sum, item) => sum + item.totalMinutes, 0);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Totals by project</h2>
        <span className="text-sm font-semibold tabular-nums text-slate-900">
          {formatMinutes(grandTotal)}
        </span>
      </div>

      {totals.length === 0 ? (
        <p className="text-sm text-slate-500">No tracked time yet today.</p>
      ) : (
        <ul className="space-y-2">
          {totals.map((total) => (
            <li
              key={total.projectId ?? "none"}
              className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2"
            >
              <div className="min-w-0">
                <span className="inline-flex min-w-0 items-center gap-2">
                  <ColorDot colorHex={total.colorHex} />
                  <span className="truncate text-sm text-slate-700">{total.projectName || "No Project"}</span>
                </span>
                {showEntryCount ? (
                  <p className="mt-0.5 text-xs text-slate-500">
                    {total.entryCount} {total.entryCount === 1 ? "entry" : "entries"}
                  </p>
                ) : null}
              </div>
              <span className="text-sm font-semibold tabular-nums text-slate-900">
                {formatMinutes(total.totalMinutes)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
