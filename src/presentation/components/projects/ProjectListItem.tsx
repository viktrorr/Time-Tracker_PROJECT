import type { Project } from "@/infrastructure/client/contracts";
import { ColorDot } from "@/presentation/components/ui/ColorDot";

type ProjectListItemProps = {
  project: Project;
  onEdit: (id: string) => void;
};

export function ProjectListItem({ project, onEdit }: ProjectListItemProps): JSX.Element {
  return (
    <li className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
      <div className="min-w-0">
        <p className="inline-flex items-center gap-2 truncate text-sm font-medium text-slate-900">
          <ColorDot colorHex={project.colorHex} />
          {project.name}
        </p>
        <p className="truncate text-xs text-slate-500">{project.client || "No client"}</p>
      </div>
      <button
        type="button"
        onClick={() => onEdit(project.id)}
        className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700"
      >
        Edit
      </button>
    </li>
  );
}
