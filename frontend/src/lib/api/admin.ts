import { apiFetch, apiFetchPaginated, type PaginationMeta } from "./client";
import type {
  OrderStatus,
  Product,
  ProductStatus,
  ProductUnit,
  ReportStatus,
  SellerProfile,
  UserRole,
  VerificationStatus,
} from "@/lib/types";

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

// --------------------------------------------------------------------------
// Dashboard general — GET /admin/dashboard
// --------------------------------------------------------------------------

export interface AdminDashboard {
  users: { total: number; byRole: Record<UserRole, number>; active: number; inactive: number };
  sellers: { total: number; byVerificationStatus: Record<VerificationStatus, number> };
  products: { total: number; byStatus: Record<ProductStatus, number> };
  orders: {
    total: number;
    byStatus: Record<OrderStatus, number>;
    totalDeliveredRevenue: number;
  };
  reviews: { pendingProductReviews: number; pendingSellerReviews: number };
  reports: { total: number; byStatus: Record<ReportStatus, number> };
  finance: {
    totalVolume: number;
    totalCommissionCollected: number;
    currentCommissionPercentage: number | null;
    byStatus: { status: string; count: number; amount: number; commissionAmount: number }[];
    recentTransactions: unknown[];
  };
}

export async function fetchAdminDashboard(): Promise<AdminDashboard> {
  return apiFetch<AdminDashboard>("/admin/dashboard");
}

// --------------------------------------------------------------------------
// Productos (moderación/vista general) — GET /admin/products
// --------------------------------------------------------------------------

export interface AdminProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  sellerId?: string;
  unit?: ProductUnit;
  status?: ProductStatus;
  sortBy?: "price" | "createdAt" | "name";
  sortOrder?: "asc" | "desc";
}

function buildProductQuery(filters: AdminProductFilters): string {
  const params = new URLSearchParams();
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 10));
  if (filters.search) params.set("search", filters.search);
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.sellerId) params.set("sellerId", filters.sellerId);
  if (filters.unit) params.set("unit", filters.unit);
  if (filters.status) params.set("status", filters.status);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
  return params.toString();
}

/** GET /admin/products — catálogo completo sin restricciones (admin). */
export async function fetchAdminProducts(
  filters: AdminProductFilters = {}
): Promise<{ products: Product[]; meta: PaginationMeta | undefined }> {
  const { data, meta } = await apiFetchPaginated<Product[]>(`/admin/products?${buildProductQuery(filters)}`);
  return { products: data, meta };
}
