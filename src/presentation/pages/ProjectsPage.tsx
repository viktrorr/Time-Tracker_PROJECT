import { ProjectsSection } from "@/presentation/components/projects/ProjectsSection";
import { PageHeader } from "@/presentation/components/ui/PageHeader";

export function ProjectsPage(): JSX.Element {
  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage projects, clients, and color coding for entries."
      />
      <ProjectsSection />
    </div>
  );
}
