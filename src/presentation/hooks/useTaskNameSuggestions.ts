"use client";

import { useQuery } from "@tanstack/react-query";
import { getTaskNames } from "@/infrastructure/client/task-names-api";
import { queryKeys } from "@/presentation/hooks/query-keys";

export function useTaskNameSuggestions(input: { query: string; limit?: number }) {
  const normalizedQuery = input.query.trim();
  const limit = input.limit ?? 8;

  return useQuery({
    queryKey: queryKeys.taskNames(normalizedQuery, limit),
    queryFn: () => getTaskNames({ q: normalizedQuery, limit }),
    enabled: normalizedQuery.length >= 1,
    staleTime: 120_000
  });
}
