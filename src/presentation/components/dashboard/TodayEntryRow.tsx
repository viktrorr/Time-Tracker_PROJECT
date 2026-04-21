import { useState } from "react";
import type { Project } from "@/infrastructure/client/contracts";
import { EntryDurationForm } from "@/presentation/components/dashboard/EntryDurationForm";
import { entryStatusLabel, taskNameClassName } from "@/presentation/components/dashboard/dashboard-utils";
import type { EnrichedEntry } from "@/presentation/hooks/useDashboard";
import { ColorDot } from "@/presentation/components/ui/ColorDot";

type TodayEntryRowProps = {
  entry: EnrichedEntry;
  projects: Project[];
  isBusy?: boolean;
  onUpdate: (id: string, payload: { taskName?: string; projectId?: string | null; duration?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function TodayEntryRow({
  entry,
  projects,
  isBusy = false,
  onUpdate,
  onDelete
}: TodayEntryRowProps): JSX.Element {
  const [isEditing, setEditing] = useState(false);
  const [taskName, setTaskName] = useState(entry.taskName);
  const [projectId, setProjectId] = useState(entry.projectId ?? "");
  const [error, setError] = useState<string | null>(null);

  async function handleSaveMeta() {
    setError(null);
    if (!taskName.trim()) {
      setError("Task name is required.");
      return;
    }

    try {
      await onUpdate(entry.id, {
        taskName: taskName.trim(),
        projectId: projectId || null
      });
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update entry");
    }
  }

  async function handleDelete() {
    setError(null);
    const confirmed = window.confirm("Delete this entry permanently?");
    if (!confirmed) {
      return;
    }

    try {
      await onDelete(entry.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete entry");
    }
  }

  const runningStyle = entry.isRunning ? "border-emerald-300 bg-emerald-50/40" : "border-slate-200 bg-white";

  return (
    <li className={`rounded-lg border px-3 py-3 ${runningStyle}`}>
      <div className="grid grid-cols-[1fr_auto] items-start gap-3">
        <div className="min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                value={taskName}
                onChange={(event) => setTaskName(event.target.value)}
                disabled={isBusy}
                maxLength={200}
                aria-label="Edit task name"
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-slate-500"
              />
              <select
                value={projectId}
                onChange={(event) => setProjectId(event.target.value)}
                disabled={isBusy}
                aria-label="Edit entry project"
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-slate-500"
              >
                <option value="">No project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <p className={`text-sm font-medium text-slate-900 ${taskNameClassName(entry.taskName)}`}>
                {entry.taskName}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <ColorDot colorHex={entry.projectColorHex} />
                  <span>{entry.projectName}</span>
                </span>
                <span className="text-slate-300">•</span>
                <span>{entryStatusLabel(entry)}</span>
                {entry.isRunning ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                    Running
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                    Completed
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <EntryDurationForm
            valueMinutes={entry.effectiveDurationMinutes}
            disabled={entry.isRunning || isBusy}
            isSubmitting={isBusy}
            onSubmit={async (minutes) => {
              await onUpdate(entry.id, {
                duration: `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`
              });
            }}
          />

          <div className="flex items-center gap-1">
            {isEditing ? (
              <>
                <button
                  type="button"
                  disabled={isBusy || !taskName.trim()}
                  onClick={handleSaveMeta}
                  className="rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => {
                    setEditing(false);
                    setTaskName(entry.taskName);
                    setProjectId(entry.projectId ?? "");
                  }}
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => setEditing(true)}
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700"
                >
                  Edit
                </button>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={handleDelete}
                  className="rounded-md border border-rose-200 px-2 py-1 text-xs text-rose-700 disabled:opacity-50"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}
    </li>
  );
}
