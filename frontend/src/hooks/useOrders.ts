"use client";

import { useQuery } from "@tanstack/react-query";
import * as ordersApi from "@/lib/api/orders";
import type { ListMyOrdersParams } from "@/lib/api/orders";

export function useMyOrders(params: ListMyOrdersParams) {
  return useQuery({
    queryKey: ["orders", "mine", params],
    queryFn: () => ordersApi.fetchMyOrders(params),
  });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => ordersApi.fetchOrderById(id as string),
    enabled: Boolean(id),
  });
}

export function useOrderHistory(id: string | undefined) {
  return useQuery({
    queryKey: ["orders", id, "history"],
    queryFn: () => ordersApi.fetchOrderHistory(id as string),
    enabled: Boolean(id),
  });
}
