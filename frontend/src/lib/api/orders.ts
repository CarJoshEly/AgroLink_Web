import { apiFetch, apiFetchPaginated, type PaginationMeta } from "./client";
import type { Order, OrderStatus, OrderStatusHistory } from "@/lib/types";

export interface OrderFilters {
  status?: OrderStatus;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

function buildQuery(filters: OrderFilters): string {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 10));
  return params.toString();
}

/** GET /orders/received — requiere sesión SELLER. */
export async function fetchReceivedOrders(
  filters: OrderFilters = {}
): Promise<{ orders: Order[]; meta: PaginationMeta | undefined }> {
  const { data, meta } = await apiFetchPaginated<Order[]>(`/orders/received?${buildQuery(filters)}`);
  return { orders: data, meta };
}

export async function fetchOrderById(id: string): Promise<Order> {
  return apiFetch<Order>(`/orders/${id}`);
}

export async function fetchOrderHistory(id: string): Promise<OrderStatusHistory[]> {
  return apiFetch<OrderStatusHistory[]>(`/orders/${id}/history`);
}

/** Solo válido si el pedido está PENDING. Descuenta stock y crea movimientos de inventario en el backend. */
export async function acceptOrder(id: string): Promise<Order> {
  return apiFetch<Order>(`/orders/${id}/accept`, { method: "PATCH" });
}

/** Solo válido si el pedido está PENDING. */
export async function rejectOrder(id: string, reason?: string): Promise<Order> {
  return apiFetch<Order>(`/orders/${id}/reject`, { method: "PATCH", body: JSON.stringify({ reason }) });
}

/** Solo válido si el pedido está CONFIRMED. */
export async function prepareOrder(id: string): Promise<Order> {
  return apiFetch<Order>(`/orders/${id}/prepare`, { method: "PATCH" });
}

/** Solo válido si el pedido está PREPARING. */
export async function deliverOrder(id: string): Promise<Order> {
  return apiFetch<Order>(`/orders/${id}/deliver`, { method: "PATCH" });
}

/** Solo válido si el pedido está CONFIRMED o PREPARING (para PENDING usa rejectOrder). */
export async function cancelOrder(id: string, reason?: string): Promise<Order> {
  return apiFetch<Order>(`/orders/${id}/cancel`, { method: "PATCH", body: JSON.stringify({ reason }) });
}
