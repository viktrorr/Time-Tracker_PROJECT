"use client";

import { useMemo, useState } from "react";
import type { Project, TimeEntry } from "@/infrastructure/client/contracts";
import { ApiClientError } from "@/infrastructure/client/api-types";
import {
  buildProjectGroupingSummary,
  type ProjectGroupingSummary
} from "@/presentation/components/dashboard/project-grouping";
import { useActiveTimer } from "@/presentation/hooks/useActiveTimer";
import { useProjects } from "@/presentation/hooks/useProjects";
import { useTaskNameSuggestions } from "@/presentation/hooks/useTaskNameSuggestions";

export type EnrichedEntry = TimeEntry & {
  projectName: string;
  projectColorHex: string | null;
  effectiveDurationMinutes: number;
};

function toErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}

function mapEntries(
  entries: TimeEntry[],
  projects: Project[],
  activeEntryId: string | null,
  elapsedSeconds: number
): EnrichedEntry[] {
  const projectMap = new Map(projects.map((project) => [project.id, project]));

  return entries.map((entry) => {
    const project = entry.projectId ? projectMap.get(entry.projectId) : undefined;
    const effectiveDurationMinutes =
      entry.isRunning && entry.id === activeEntryId
        ? Math.max(0, Math.floor(elapsedSeconds / 60))
        : entry.durationMinutes;

    return {
      ...entry,
      projectName: project?.name ?? "No Project",
      projectColorHex: project?.colorHex ?? null,
      effectiveDurationMinutes
    };
  });
}

export function useDashboard() {
  const activeTimer = useActiveTimer();
  const projects = useProjects();
  const [taskName, setTaskName] = useState("");
  const [projectId, setProjectId] = useState<string>("");
  const [isTaskFocused, setTaskFocused] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [entryBusyId, setEntryBusyId] = useState<string | null>(null);
  const [isSubmittingStart, setSubmittingStart] = useState(false);
  const [isSubmittingStop, setSubmittingStop] = useState(false);

  const suggestions = useTaskNameSuggestions({ query: taskName, limit: 8 });

  const projectList = projects.data ?? [];
  const rawEntries = activeTimer.data?.entries ?? [];
  const activeEntryId = activeTimer.activeEntry?.id ?? null;

  const entries = useMemo(
    () => mapEntries(rawEntries, projectList, activeEntryId, activeTimer.elapsedSeconds),
    [rawEntries, projectList, activeEntryId, activeTimer.elapsedSeconds]
  );

  const totalsByProject = useMemo<ProjectGroupingSummary[]>(() => buildProjectGroupingSummary(entries), [entries]);

  const canStart =
    !activeTimer.activeEntry &&
    taskName.trim().length > 0 &&
    !activeTimer.isStartingTimer &&
    !activeTimer.isStoppingTimer &&
    !isSubmittingStart;

  const canStop = !!activeTimer.activeEntry && !activeTimer.isStoppingTimer && !isSubmittingStop;

  async function handleStart(): Promise<void> {
    setActionError(null);
    setValidationError(null);

    if (!taskName.trim()) {
      setValidationError("Task name is required.");
      return;
    }

    try {
      setSubmittingStart(true);
      await activeTimer.startTimer({
        taskName: taskName.trim(),
        projectId: projectId || null
      });
      setTaskName("");
      setValidationError(null);
    } catch (error) {
      setActionError(toErrorMessage(error));
    } finally {
      setSubmittingStart(false);
    }
  }

  async function handleStop(): Promise<void> {
    setActionError(null);
    setValidationError(null);

    try {
      setSubmittingStop(true);
      await activeTimer.stopTimer(undefined);
    } catch (error) {
      setActionError(toErrorMessage(error));
    } finally {
      setSubmittingStop(false);
    }
  }

  const loadError = activeTimer.error ?? projects.error;

  async function updateEntry(
    id: string,
    payload: { taskName?: string; projectId?: string | null; duration?: string }
  ): Promise<void> {
    setEntryBusyId(id);
    setActionError(null);
    try {
      await activeTimer.updateEntry({ id, payload });
    } catch (error) {
      setActionError(toErrorMessage(error));
      throw error;
    } finally {
      setEntryBusyId(null);
    }
  }

  async function deleteEntry(id: string): Promise<void> {
    setEntryBusyId(id);
    setActionError(null);
    try {
      await activeTimer.deleteEntry(id);
    } catch (error) {
      setActionError(toErrorMessage(error));
      throw error;
    } finally {
      setEntryBusyId(null);
    }
  }

  return {
    taskName,
    setTaskName,
    projectId,
    setProjectId,
    isTaskFocused,
    setTaskFocused,
    suggestions: suggestions.data ?? [],
    isLoadingSuggestions: suggestions.isLoading,
    projects: projectList,
    hasProjects: projectList.length > 0,
    entries,
    totalsByProject,
    activeEntry: activeTimer.activeEntry,
    formattedElapsed: activeTimer.formattedElapsed,
    canStart,
    canStop,
    isStarting: activeTimer.isStartingTimer || isSubmittingStart,
    isStopping: activeTimer.isStoppingTimer || isSubmittingStop,
    isLoadingData: activeTimer.isLoading || projects.isLoading,
    entryBusyId,
    actionError,
    validationError,
    loadErrorMessage: loadError ? toErrorMessage(loadError) : null,
    handleStart,
    handleStop,
    pickTaskSuggestion(value: string) {
      setTaskName(value);
      setTaskFocused(false);
      setValidationError(null);
    },
    updateEntry,
    deleteEntry,
    isMutatingEntry: activeTimer.isUpdatingEntry || activeTimer.isDeletingEntry
    
  };
}
