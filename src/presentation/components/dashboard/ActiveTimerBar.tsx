import { ColorDot } from "@/presentation/components/ui/ColorDot";

type ActiveTimerBarProps = {
  isRunning: boolean;
  taskName?: string;
  projectName?: string;
  projectColorHex?: string | null;
  formattedElapsed: string;
  isBusy?: boolean;
};

export function ActiveTimerBar({
  isRunning,
  taskName,
  projectName,
  projectColorHex,
  formattedElapsed,
  isBusy = false
}: ActiveTimerBarProps): JSX.Element {
  return (
    <section className="sticky top-16 z-30 mb-5 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur sm:top-14">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex h-2.5 w-2.5 rounded-full ${isRunning ? "animate-pulse bg-emerald-500" : "bg-slate-300"}`}
            />
            <p className="text-sm font-medium text-slate-700">
              {isRunning ? "Timer running" : "No active timer"}
            </p>
          </div>
          {isRunning ? (
            <p className="mt-1 truncate text-sm text-slate-600">
              <span className="font-medium text-slate-900">{taskName}</span>
              {projectName ? (
                <>
                  <span className="mx-2 text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <ColorDot colorHex={projectColorHex ?? "#94A3B8"} />
                    <span>{projectName}</span>
                  </span>
                </>
              ) : null}
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-500">Start tracking to see elapsed time here.</p>
          )}
        </div>
        <div className="flex items-end gap-2 self-start sm:self-auto">
          <span className="text-xs uppercase tracking-wide text-slate-500">Elapsed</span>
          <strong className="text-2xl font-semibold tabular-nums text-slate-900">{formattedElapsed}</strong>
          {isBusy ? <span className="text-xs text-slate-500">Updating…</span> : null}
        </div>
      </div>
    </section>
  );
}
