"use client";

import { useMemo, useState } from "react";
import type { ReportRange } from "@/infrastructure/client/contracts";
import { useReports } from "@/presentation/hooks/useReports";

function todayInputValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function useReportsPage() {
  const [range, setRange] = useState<ReportRange>("week");
  const [anchorDate, setAnchorDate] = useState<string>(todayInputValue());

  const filters = useMemo(
    () => ({
      range,
      ...(anchorDate ? { date: anchorDate } : {})
    }),
    [range, anchorDate]
  );

  const report = useReports(filters);
  const canExportCsv = (report.data?.rows.length ?? 0) > 0;

  return {
    range,
    setRange,
    anchorDate,
    setAnchorDate,
    report,
    canExportCsv
  };
}
