"use client";

import { useQuery } from "@tanstack/react-query";
import { getReport, getReportExportUrl } from "@/infrastructure/client/reports-api";
import type { ReportQuery } from "@/infrastructure/client/contracts";
import { queryKeys } from "@/presentation/hooks/query-keys";

export function useReports(input: ReportQuery) {
  const query = useQuery({
    queryKey: queryKeys.reports(input.range, input.date),
    queryFn: () => getReport(input)
  });

  return {
    ...query,
    exportUrl: getReportExportUrl(input),
    filters: input
  };
}
