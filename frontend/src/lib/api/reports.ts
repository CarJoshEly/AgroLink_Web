import { apiFetch, apiFetchPaginated, type PaginationMeta } from "./client";
import type { Report, ReportStatus, ReportTargetType } from "@/lib/types";

export interface CreateReportInput {
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
}

/** POST /reports — reportar un producto, vendedor o reseña. */
export async function createReport(input: CreateReportInput): Promise<Report> {
  return apiFetch<Report>("/reports", { method: "POST", body: JSON.stringify(input) });
}

export interface ReportFilters {
  page?: number;
  limit?: number;
  targetType?: ReportTargetType;
  status?: ReportStatus;
}

function buildQuery(filters: ReportFilters): string {
  const params = new URLSearchParams();
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 10));
  if (filters.targetType) params.set("targetType", filters.targetType);
  if (filters.status) params.set("status", filters.status);
  return params.toString();
}

/** GET /reports — listado (requiere rol ADMIN). */
export async function fetchReports(
  filters: ReportFilters = {}
): Promise<{ reports: Report[]; meta: PaginationMeta | undefined }> {
  const { data, meta } = await apiFetchPaginated<Report[]>(`/reports?${buildQuery(filters)}`);
  return { reports: data, meta };
}

/** PATCH /reports/:id/status — requiere rol ADMIN. */
export async function updateReportStatus(id: string, status: ReportStatus): Promise<Report> {
  return apiFetch<Report>(`/reports/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
}
