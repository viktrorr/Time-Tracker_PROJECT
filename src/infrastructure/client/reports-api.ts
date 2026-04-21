import type { ReportApiResponse, ReportQuery } from "@/infrastructure/client/contracts";
import { apiRequest } from "@/infrastructure/client/http-client";

function buildReportQuery(params: ReportQuery): string {
  const search = new URLSearchParams();
  search.set("range", params.range);
  if (params.date) {
    search.set("date", params.date);
  }
  return search.toString();
}

export function getReport(params: ReportQuery): Promise<ReportApiResponse> {
  return apiRequest<ReportApiResponse>(`/api/reports?${buildReportQuery(params)}`);
}

export function getReportExportUrl(params: ReportQuery): string {
  return `/api/reports/export?${buildReportQuery(params)}`;
}
