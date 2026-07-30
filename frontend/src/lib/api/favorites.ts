import { apiFetch, apiFetchPaginated, type PaginationMeta } from "./client";
import type { Favorite } from "@/lib/types";

export async function fetchFavoriteProducts(
  page = 1,
  limit = 12
): Promise<{ favorites: Favorite[]; meta: PaginationMeta | undefined }> {
  const { data, meta } = await apiFetchPaginated<Favorite[]>(`/favorites/products?page=${page}&limit=${limit}`);
  return { favorites: data, meta };
}

export async function fetchFavoriteSellers(
  page = 1,
  limit = 12
): Promise<{ favorites: Favorite[]; meta: PaginationMeta | undefined }> {
  const { data, meta } = await apiFetchPaginated<Favorite[]>(`/favorites/sellers?page=${page}&limit=${limit}`);
  return { favorites: data, meta };
}

export async function addFavoriteProduct(productId: string): Promise<Favorite> {
  return apiFetch<Favorite>(`/favorites/products/${productId}`, { method: "POST" });
}

export async function removeFavoriteProduct(productId: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/favorites/products/${productId}`, { method: "DELETE" });
}

export async function addFavoriteSeller(sellerId: string): Promise<Favorite> {
  return apiFetch<Favorite>(`/favorites/sellers/${sellerId}`, { method: "POST" });
}

export async function removeFavoriteSeller(sellerId: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/favorites/sellers/${sellerId}`, { method: "DELETE" });
}
