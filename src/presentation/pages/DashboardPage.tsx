"use client";

import { ActiveTimerBar } from "@/presentation/components/dashboard/ActiveTimerBar";
import { ProjectTotalsSection } from "@/presentation/components/dashboard/ProjectTotalsSection";
import { TimerForm } from "@/presentation/components/dashboard/TimerForm";
import { TodayEntriesSection } from "@/presentation/components/dashboard/TodayEntriesSection";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { useDashboard } from "@/presentation/hooks/useDashboard";

export function DashboardPage(): JSX.Element {
  const dashboard = useDashboard();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Track active time and manage today’s entries in one place."
      />

      <ActiveTimerBar
        isRunning={!!dashboard.activeEntry}
        taskName={dashboard.activeEntry?.taskName}
        projectName={dashboard.entries.find((entry) => entry.id === dashboard.activeEntry?.id)?.projectName}
        projectColorHex={
          dashboard.entries.find((entry) => entry.id === dashboard.activeEntry?.id)?.projectColorHex ?? null
        }
        formattedElapsed={dashboard.formattedElapsed}
        isBusy={dashboard.isStarting || dashboard.isStopping}
      />

      {dashboard.loadErrorMessage ? (
        <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {dashboard.loadErrorMessage}
        </p>
      ) : null}

      <div className="grid gap-4">
        <TimerForm
          taskName={dashboard.taskName}
          projectId={dashboard.projectId}
          projects={dashboard.projects}
          hasProjects={dashboard.hasProjects}
          isRunning={!!dashboard.activeEntry}
          isStarting={dashboard.isStarting}
          isStopping={dashboard.isStopping}
          canStart={dashboard.canStart}
          canStop={dashboard.canStop}
          suggestions={dashboard.suggestions}
          isTaskFocused={dashboard.isTaskFocused}
          isLoadingSuggestions={dashboard.isLoadingSuggestions}
          validationError={dashboard.validationError}
          actionError={dashboard.actionError}
          onTaskNameChange={dashboard.setTaskName}
          onProjectChange={dashboard.setProjectId}
          onTaskFocusChange={dashboard.setTaskFocused}
          onPickSuggestion={dashboard.pickTaskSuggestion}
          onStart={dashboard.handleStart}
          onStop={dashboard.handleStop}
        />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <TodayEntriesSection
            entries={dashboard.entries}
            projects={dashboard.projects}
            busyEntryId={dashboard.entryBusyId}
            isLoading={dashboard.isLoadingData}
            onUpdateEntry={dashboard.updateEntry}
            onDeleteEntry={dashboard.deleteEntry}
          />
          <ProjectTotalsSection totals={dashboard.totalsByProject} />
        </div>
      </div>
    </div>
  );
}
