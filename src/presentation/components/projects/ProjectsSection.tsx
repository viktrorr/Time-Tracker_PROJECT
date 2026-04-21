"use client";

import { ProjectForm } from "@/presentation/components/projects/ProjectForm";
import { ProjectListItem } from "@/presentation/components/projects/ProjectListItem";
import { useProjectsManagement } from "@/presentation/hooks/useProjectsManagement";

export function ProjectsSection(): JSX.Element {
  const projects = useProjectsManagement();

  const editingProject =
    projects.editingId && projects.editValues
      ? projects.projects.find((project) => project.id === projects.editingId) ?? null
      : null;

  return (
    <div className="grid gap-4">
      <ProjectForm
        title="Create project"
        values={projects.createValues}
        error={projects.createError}
        submitLabel="Create project"
        isSubmitting={projects.isCreating}
        submitDisabled={!projects.createValues.name.trim()}
        onChange={(patch) => projects.setCreateValues((prev) => ({ ...prev, ...patch }))}
        onSubmit={projects.submitCreate}
      />

      {projects.loadError ? (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {projects.loadError}
        </p>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Existing projects</h3>
          <span className="text-xs text-slate-500">{projects.projects.length} total</span>
        </div>

        {projects.isLoading ? (
          <p className="text-sm text-slate-500">Loading projects...</p>
        ) : projects.projects.length === 0 ? (
          <p className="text-sm text-slate-500">No projects yet. Create your first project above.</p>
        ) : (
          <ul className="space-y-2">
            {projects.projects.map((project) => (
              <ProjectListItem key={project.id} project={project} onEdit={projects.startEdit} />
            ))}
          </ul>
        )}
      </section>

      {editingProject && projects.editValues ? (
        <ProjectForm
          title={`Edit project: ${editingProject.name}`}
          values={projects.editValues}
          error={projects.editError}
          submitLabel="Save changes"
          isSubmitting={projects.isUpdating}
          submitDisabled={!projects.editValues.name.trim()}
          onChange={(patch) => projects.setEditValues((prev) => (prev ? { ...prev, ...patch } : prev))}
          onSubmit={projects.submitEdit}
          onCancel={projects.cancelEdit}
        />
      ) : null}
    </div>
  );
}
