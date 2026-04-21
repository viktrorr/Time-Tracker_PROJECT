import type { ProjectFormValues } from "@/presentation/hooks/useProjectsManagement";
import { ProjectColorPicker } from "@/presentation/components/projects/ProjectColorPicker";

type ProjectFormProps = {
  title: string;
  values: ProjectFormValues;
  error: string | null;
  submitLabel: string;
  isSubmitting?: boolean;
  onChange: (patch: Partial<ProjectFormValues>) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  submitDisabled?: boolean;
};

export function ProjectForm({
  title,
  values,
  error,
  submitLabel,
  isSubmitting = false,
  onChange,
  onSubmit,
  onCancel,
  submitDisabled = false
}: ProjectFormProps): JSX.Element {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">{title}</h3>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Project name *</label>
          <input
            value={values.name}
            onChange={(event) => onChange({ name: event.target.value })}
            disabled={isSubmitting}
            maxLength={120}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            placeholder="e.g. Marketing Website"
            aria-label="Project name"
            aria-invalid={!!error && !values.name.trim()}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Client</label>
          <input
            value={values.client}
            onChange={(event) => onChange({ client: event.target.value })}
            disabled={isSubmitting}
            maxLength={120}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            placeholder="e.g. Acme Inc"
            aria-label="Client name"
          />
        </div>
      </div>

      <div className="mt-3">
        <ProjectColorPicker value={values.colorHex} onChange={(colorHex) => onChange({ colorHex })} />
      </div>

      {error ? (
        <p className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      ) : null}

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || submitDisabled}
          className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </section>
  );
}
