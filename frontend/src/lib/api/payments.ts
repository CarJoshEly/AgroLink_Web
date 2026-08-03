/**
 * Pago con PayPal — el backend crea/captura la orden en la API real de
 * PayPal (Orders v2) y, solo si la captura resulta COMPLETED, genera la(s)
 * solicitud(es) de compra. A diferencia del flujo viejo, el monto SIEMPRE
 * lo calcula el backend a partir del carrito real, nunca el cliente.
 */

import { apiFetch } from "./client";
import type { Order } from "@/lib/types";

export interface PaypalOrderCreated {
  paypalOrderId: string;
  approveUrl: string;
  totalHnl: number;
  totalUsd: number;
}

export async function createPaypalOrder(): Promise<PaypalOrderCreated> {
  return apiFetch<PaypalOrderCreated>("/payments/paypal/orders", { method: "POST" });
}

export async function capturePaypalOrder(paypalOrderId: string): Promise<Order[]> {
  return apiFetch<Order[]>(`/payments/paypal/orders/${paypalOrderId}/capture`, { method: "POST" });
}
