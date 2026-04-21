import { ReportsSection } from "@/presentation/components/reports/ReportsSection";
import { PageHeader } from "@/presentation/components/ui/PageHeader";

export function ReportsPage(): JSX.Element {
  return (
    <div>
      <PageHeader
        title="Reports"
        description="Analyze tracked time by day, week, month and export data to CSV."
      />
      <ReportsSection />
    </div>
  );
}
