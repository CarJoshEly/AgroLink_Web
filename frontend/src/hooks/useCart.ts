"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as cartApi from "@/lib/api/cart";
import { useAuth } from "@/hooks/useAuth";

export const CART_QUERY_KEY = ["cart"] as const;

export function useCart() {
  const { user } = useAuth();
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: cartApi.getCart,
    enabled: Boolean(user) && user?.role === "CUSTOMER",
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartApi.addCartItem(productId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY }),
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateCartItemQuantity(itemId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY }),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeCartItem(itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY }),
  });
}

export function useCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cartApi.checkoutCart(),
    onSuccess: (orders) => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      // El checkout descuenta stock de inmediato (ver orders.service.ts) —
      // sin esto, el catálogo y la ficha de producto muestran existencias
      // desactualizadas hasta que el comprador refresque a mano.
      queryClient.invalidateQueries({ queryKey: ["products"] });
      for (const order of orders) {
        for (const item of order.items ?? []) {
          queryClient.invalidateQueries({ queryKey: ["product", item.productId] });
        }
      }
    },
  });
}
