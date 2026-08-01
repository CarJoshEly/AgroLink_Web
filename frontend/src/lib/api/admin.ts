import { apiFetch, apiFetchPaginated, type PaginationMeta } from "./client";
import type { SellerProfile, VerificationStatus } from "@/lib/types";

export interface SellerFilters {
  verificationStatus?: VerificationStatus;
  search?: string;
  page?: number;
  limit?: number;
}

function buildQuery(filters: SellerFilters): string {
  const params = new URLSearchParams();
  if (filters.verificationStatus) params.set("verificationStatus", filters.verificationStatus);
  if (filters.search) params.set("search", filters.search);
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 10));
  return params.toString();
}

/** GET /admin/sellers — requiere sesión ADMIN. */
export async function fetchSellers(
  filters: SellerFilters = {}
): Promise<{ sellers: SellerProfile[]; meta: PaginationMeta | undefined }> {
  const { data, meta } = await apiFetchPaginated<SellerProfile[]>(`/admin/sellers?${buildQuery(filters)}`);
  return { sellers: data, meta };
}

/** GET /admin/sellers/:id — incluye los documentos de identidad. */
export async function fetchSellerById(id: string): Promise<SellerProfile> {
  return apiFetch<SellerProfile>(`/admin/sellers/${id}`);
}

export async function markSellerUnderReview(id: string): Promise<SellerProfile> {
  return apiFetch<SellerProfile>(`/admin/sellers/${id}/review`, { method: "PATCH" });
}

export async function approveSeller(id: string): Promise<SellerProfile> {
  return apiFetch<SellerProfile>(`/admin/sellers/${id}/approve`, { method: "PATCH" });
}

/** `reason` es obligatorio en el backend (mínimo 5 caracteres). */
export async function rejectSeller(id: string, reason: string): Promise<SellerProfile> {
  return apiFetch<SellerProfile>(`/admin/sellers/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  });
}

/** `reason` es obligatorio en el backend (mínimo 5 caracteres). */
export async function suspendSeller(id: string, reason: string): Promise<SellerProfile> {
  return apiFetch<SellerProfile>(`/admin/sellers/${id}/suspend`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  });
}
