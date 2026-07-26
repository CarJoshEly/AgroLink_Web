import { apiFetch, apiFetchPaginated, type PaginationMeta } from "./client";
import type { Product } from "@/lib/types";

export type { Product };

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  sellerId?: string;
  minPrice?: number;
  maxPrice?: number;
  /** Solo tiene efecto en /products/mine — el marketplace público siempre fuerza ACTIVE. */
  status?: "ACTIVE" | "OUT_OF_STOCK" | "INACTIVE";
  /** Coincide con ListProductsQueryDto: solo price | createdAt | name */
  sortBy?: "price" | "createdAt" | "name";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

function buildQuery(filters: ProductFilters): string {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.sellerId) params.set("sellerId", filters.sellerId);
  if (filters.status) params.set("status", filters.status);
  if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
  params.set("sortBy", filters.sortBy ?? "createdAt");
  params.set("sortOrder", filters.sortOrder ?? "desc");
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 12));
  return params.toString();
}

/** GET /products — marketplace público (siempre ACTIVE + vendedor verificado, filtrado en el backend). */
export async function fetchProducts(
  filters: ProductFilters = {}
): Promise<{ products: Product[]; meta: PaginationMeta | undefined }> {
  const { data, meta } = await apiFetchPaginated<Product[]>(`/products?${buildQuery(filters)}`);
  return { products: data, meta };
}

export async function fetchProductById(id: string): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`);
}

/** GET /products/mine — requiere sesión SELLER. Sin filtro forzado de status/verificación (a diferencia del marketplace). */
export async function fetchMyProducts(
  filters: ProductFilters = {}
): Promise<{ products: Product[]; meta: PaginationMeta | undefined }> {
  const { data, meta } = await apiFetchPaginated<Product[]>(`/products/mine?${buildQuery(filters)}`);
  return { products: data, meta };
}

/** PATCH /products/:id/stock — `stock` es el valor absoluto nuevo, no un delta. */
export async function updateProductStock(id: string, stock: number): Promise<Product> {
  return apiFetch<Product>(`/products/${id}/stock`, {
    method: "PATCH",
    body: JSON.stringify({ stock }),
  });
}

/** DELETE /products/:id — soft delete en el backend. */
export async function deleteProduct(id: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/products/${id}`, { method: "DELETE" });
}
