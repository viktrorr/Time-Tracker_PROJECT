import type { Project, TaskName } from "@/infrastructure/client/contracts";

type TimerFormProps = {
  taskName: string;
  projectId: string;
  projects: Project[];
  hasProjects: boolean;
  isRunning: boolean;
  isStarting: boolean;
  isStopping: boolean;
  canStart: boolean;
  canStop: boolean;
  suggestions: TaskName[];
  isTaskFocused: boolean;
  isLoadingSuggestions: boolean;
  validationError: string | null;
  actionError: string | null;
  onTaskNameChange: (value: string) => void;
  onProjectChange: (value: string) => void;
  onTaskFocusChange: (focused: boolean) => void;
  onPickSuggestion: (value: string) => void;
  onStart: () => void;
  onStop: () => void;
};

export function TimerForm({
  taskName,
  projectId,
  projects,
  hasProjects,
  isRunning,
  isStarting,
  isStopping,
  canStart,
  canStop,
  suggestions,
  isTaskFocused,
  isLoadingSuggestions,
  validationError,
  actionError,
  onTaskNameChange,
  onProjectChange,
  onTaskFocusChange,
  onPickSuggestion,
  onStart,
  onStop
}: TimerFormProps): JSX.Element {
  const showSuggestions = isTaskFocused && taskName.trim().length > 0;
  const isFormBusy = isStarting || isStopping;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Track time</h2>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${isRunning ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"}`}
        >
          {isRunning ? "Running" : "Idle"}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px_auto] md:items-start">
        <div className="relative">
          <label htmlFor="task-name" className="mb-1 block text-sm font-medium text-slate-700">
            Task name
          </label>
          <input
            id="task-name"
            type="text"
            value={taskName}
            onChange={(event) => onTaskNameChange(event.target.value)}
            onFocus={() => onTaskFocusChange(true)}
            onBlur={() => setTimeout(() => onTaskFocusChange(false), 120)}
            maxLength={200}
            placeholder="e.g. Implement dashboard timer"
            disabled={isFormBusy}
            aria-invalid={!!validationError}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />

          {showSuggestions ? (
            <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
              {isLoadingSuggestions ? (
                <p className="px-3 py-2 text-sm text-slate-500">Loading suggestions...</p>
              ) : suggestions.length > 0 ? (
                suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      onPickSuggestion(suggestion.name);
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <span className="truncate">{suggestion.name}</span>
                    <span className="ml-3 text-xs text-slate-400">{suggestion.usageCount}x</span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-2 text-sm text-slate-500">No suggestions found</p>
              )}
            </div>
          ) : null}
        </div>

        <div>
          <label htmlFor="project-id" className="mb-1 block text-sm font-medium text-slate-700">
            Project
          </label>
          <select
            id="project-id"
            value={projectId}
            onChange={(event) => onProjectChange(event.target.value)}
            disabled={!hasProjects || isFormBusy}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="">No project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {!hasProjects ? (
            <p className="mt-1 text-xs text-slate-500">Create a project first on Projects page.</p>
          ) : null}
        </div>

        <div className="flex gap-2 md:pt-6">
          <button
            type="button"
            onClick={onStart}
            disabled={!canStart}
            className="inline-flex min-w-[88px] items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isStarting ? "Starting..." : "Start"}
          </button>
          <button
            type="button"
            onClick={onStop}
            disabled={!canStop}
            className="inline-flex min-w-[88px] items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isStopping ? "Stopping..." : "Stop"}
          </button>
        </div>
      </div>

      {validationError ? (
        <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700" role="alert">
          {validationError}
        </p>
      ) : null}

      {actionError ? (
        <p className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">
          {actionError}
        </p>
      ) : null}
    </section>
  );
}
