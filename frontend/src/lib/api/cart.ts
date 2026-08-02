/**
 * Carrito y checkout — API real (NestJS).
 *
 * Importante (ver PRD Sprint 5): `Order.sellerId` es único por pedido, así
 * que si el carrito mezcla productos de varios vendedores, `POST /cart/checkout`
 * genera UN PEDIDO POR VENDEDOR (confirmado contra `orders.service.ts`:
 * agrupa los ítems por `product.sellerId` y crea un `Order` PENDING por
 * cada grupo, dentro de una sola transacción). Por eso `checkout()` siempre
 * devuelve un ARRAY de pedidos, aunque haya un solo vendedor.
 */

import { apiFetch } from "./client";
import type { Cart, CartItem, Order, PublicSeller, SellerProfile } from "@/lib/types";

// El backend añade `seller` al producto de cada ítem del carrito
// (id, businessName, verificationStatus) para poder agrupar por vendedor.
export type CartItemWithSeller = CartItem & {
  subtotal: number;
  product: NonNullable<CartItem["product"]> & {
    seller?: PublicSeller;
  };
};

export type CartWithTotals = Cart & {
  items: CartItemWithSeller[];
  total: number;
};

export async function getCart(): Promise<CartWithTotals> {
  return apiFetch<CartWithTotals>("/cart");
}

export async function addCartItem(productId: string, quantity: number): Promise<CartItem> {
  return apiFetch<CartItem>("/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function updateCartItemQuantity(itemId: string, quantity: number): Promise<CartItem> {
  return apiFetch<CartItem>(`/cart/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItem(itemId: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/cart/items/${itemId}`, { method: "DELETE" });
}

/** Genera una o más solicitudes de compra (una por vendedor) a partir del carrito activo. */
export async function checkoutCart(): Promise<Order[]> {
  return apiFetch<Order[]>("/cart/checkout", { method: "POST" });
}

/** Agrupa los ítems del carrito por vendedor para la UI (RF: agrupación visual antes del checkout). */
export function groupCartBySeller(items: CartItemWithSeller[]) {
  const groups = new Map<
    string,
    {
      seller: PublicSeller;
      items: CartItemWithSeller[];
    }
  >();

  for (const item of items) {
    if (!item || !item.product) continue;

    const sellerId = item.product.seller?.id || item.product.sellerId || "vendedor-agrolink";
    const sellerObj: PublicSeller = item.product.seller ?? {
      id: sellerId,
      businessName: "Productor / Vendedor AgroLink",
      verificationStatus: "PENDING",
    };

    const group = groups.get(sellerId);
    if (group) {
      group.items.push(item);
    } else {
      groups.set(sellerId, { seller: sellerObj, items: [item] });
    }
  }

  return Array.from(groups.values());
}
