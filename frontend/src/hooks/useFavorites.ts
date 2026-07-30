"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as favoritesApi from "@/lib/api/favorites";
import { useAuth } from "@/hooks/useAuth";
import type { Favorite } from "@/lib/types";

export function useFavoriteProducts(page = 1, limit = 12) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["favorites", "products", page, limit],
    queryFn: () => favoritesApi.fetchFavoriteProducts(page, limit),
    enabled: Boolean(user) && user?.role === "CUSTOMER",
  });
}

/**
 * Set con los productId ya favoritos del usuario actual, para pintar el
 * corazón relleno en tarjetas de catálogo/detalle. Trae hasta 100 favoritos
 * (suficiente para un MVP; si crece, se puede paginar).
 */
export function useFavoriteProductIds() {
  const { data } = useFavoriteProducts(1, 100);
  const ids = new Set((data?.favorites ?? []).map((f) => f.productId).filter(Boolean) as string[]);
  return ids;
}

export function useFavoriteSellers(page = 1, limit = 12) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["favorites", "sellers", page, limit],
    queryFn: () => favoritesApi.fetchFavoriteSellers(page, limit),
    enabled: Boolean(user) && user?.role === "CUSTOMER",
  });
}

/** Alterna favorito de producto (POST si no existe, DELETE si ya existe). `isFavorite` viene de tu propio estado local. */
export function useToggleProductFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      isFavorite,
    }: {
      productId: string;
      isFavorite: boolean;
    }): Promise<Favorite | { message: string }> =>
      isFavorite ? favoritesApi.removeFavoriteProduct(productId) : favoritesApi.addFavoriteProduct(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites", "products"] }),
  });
}

export function useToggleSellerFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      sellerId,
      isFavorite,
    }: {
      sellerId: string;
      isFavorite: boolean;
    }): Promise<Favorite | { message: string }> =>
      isFavorite ? favoritesApi.removeFavoriteSeller(sellerId) : favoritesApi.addFavoriteSeller(sellerId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites", "sellers"] }),
  });
}
