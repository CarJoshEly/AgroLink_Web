import { apiFetchPaginated, type PaginationMeta } from "./client";

/** Incluye el `user` que realizó la acción (id, name, email), vía `include` en el backend. */
export interface AuditLog {
  id: string;
  userId: string | null;
  user?: { id: string; name: string; email: string } | null;
  action: string;
  entityType: string;
  entityId: string;
  oldValue: unknown;
  newValue: unknown;
  createdAt: string;
}

export interface AuditLogFilters {
  page?: number;
  limit?: number;
  entityType?: string;
  action?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
}

function buildQuery(filters: AuditLogFilters): string {
  const params = new URLSearchParams();
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 20));
  if (filters.entityType) params.set("entityType", filters.entityType);
  if (filters.action) params.set("action", filters.action);
  if (filters.userId) params.set("userId", filters.userId);
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  return params.toString();
}

/** GET /admin/audit-logs — historial de auditoría, paginado (admin). */
export async function fetchAuditLogs(
  filters: AuditLogFilters = {}
): Promise<{ logs: AuditLog[]; meta: PaginationMeta | undefined }> {
  const { data, meta } = await apiFetchPaginated<AuditLog[]>(`/admin/audit-logs?${buildQuery(filters)}`);
  return { logs: data, meta };
}
