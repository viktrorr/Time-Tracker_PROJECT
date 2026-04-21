import type { Project } from "@/infrastructure/client/contracts";
import { TodayEntryRow } from "@/presentation/components/dashboard/TodayEntryRow";
import type { EnrichedEntry } from "@/presentation/hooks/useDashboard";

type TodayEntriesSectionProps = {
  entries: EnrichedEntry[];
  projects: Project[];
  isLoading?: boolean;
  busyEntryId?: string | null;
  onUpdateEntry: (id: string, payload: { taskName?: string; projectId?: string | null; duration?: string }) => Promise<void>;
  onDeleteEntry: (id: string) => Promise<void>;
};

export function TodayEntriesSection({
  entries,
  projects,
  isLoading = false,
  busyEntryId = null,
  onUpdateEntry,
  onDeleteEntry
}: TodayEntriesSectionProps): JSX.Element {
  if (isLoading) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Today entries</h2>
        <p className="mt-2 text-sm text-slate-500" aria-live="polite">Loading today’s entries...</p>
      </section>
    );
  }

  if (entries.length === 0) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Today entries</h2>
        <p className="mt-2 text-sm text-slate-500">No entries yet. Start your first timer above.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-base font-semibold text-slate-900">Today entries</h2>
      <ul className="space-y-2" aria-live="polite">
        {entries.map((entry) => (
          <TodayEntryRow
            key={entry.id}
            entry={entry}
            projects={projects}
            isBusy={busyEntryId === entry.id}
            onUpdate={onUpdateEntry}
            onDelete={onDeleteEntry}
          />
        ))}
      </ul>
    </section>
  );
}
