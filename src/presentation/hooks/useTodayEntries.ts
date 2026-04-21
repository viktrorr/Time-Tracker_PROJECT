"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteTimeEntry,
  getTimeEntries,
  patchTimeEntry,
  startTimeEntry,
  stopTimeEntry
} from "@/infrastructure/client/time-entries-api";
import type { StartTimerInput, StopTimerInput, UpdateTimeEntryInput } from "@/infrastructure/client/contracts";
import { queryKeys } from "@/presentation/hooks/query-keys";

function resolveDateInput(date?: Date): string {
  const target = date ?? new Date();
  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, "0");
  const day = String(target.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function useTodayEntries(input?: { date?: Date }) {
  const queryClient = useQueryClient();
  const date = resolveDateInput(input?.date);

  const entriesQuery = useQuery({
    queryKey: queryKeys.todayEntries(date),
    queryFn: () => getTimeEntries({ date })
  });

  const invalidateEntries = async () => {
    await queryClient.invalidateQueries({ queryKey: ["time-entries"] });
    await queryClient.invalidateQueries({ queryKey: ["task-names"] });
    await queryClient.invalidateQueries({ queryKey: ["reports"] });
  };

  const startTimerMutation = useMutation({
    mutationFn: (payload: StartTimerInput) => startTimeEntry(payload),
    onSuccess: invalidateEntries
  });

  const stopTimerMutation = useMutation({
    mutationFn: (payload?: StopTimerInput) => stopTimeEntry(payload),
    onSuccess: invalidateEntries
  });

  const updateEntryMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTimeEntryInput }) =>
      patchTimeEntry(id, payload),
    onSuccess: invalidateEntries
  });

  const deleteEntryMutation = useMutation({
    mutationFn: (id: string) => deleteTimeEntry(id),
    onSuccess: invalidateEntries
  });

  return {
    ...entriesQuery,
    date,
    startTimer: startTimerMutation.mutateAsync,
    stopTimer: stopTimerMutation.mutateAsync,
    updateEntry: updateEntryMutation.mutateAsync,
    deleteEntry: deleteEntryMutation.mutateAsync,
    isStartingTimer: startTimerMutation.isPending,
    isStoppingTimer: stopTimerMutation.isPending,
    isUpdatingEntry: updateEntryMutation.isPending,
    isDeletingEntry: deleteEntryMutation.isPending
  };
}
