"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import RequireRole from "@/components/auth/RequireRole";
import CartItemRow from "@/components/cart/CartItemRow";
import CheckoutConfirmation from "@/components/cart/CheckoutConfirmation";
import { useCart, useCheckout } from "@/hooks/useCart";
import { groupCartBySeller } from "@/lib/api/cart";
import { ApiError } from "@/lib/api/client";
import type { Order } from "@/lib/types";

function CartPageContent() {
  const { data: cart, isLoading, error } = useCart();
  const checkoutMutation = useCheckout();

  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [createdOrders, setCreatedOrders] = useState<Order[] | null>(null);

  const groups = cart ? groupCartBySeller(cart.items) : [];

  async function handleCheckout() {
    setCheckoutError(null);
    try {
      const orders = await checkoutMutation.mutateAsync();
      setCreatedOrders(orders);
    } catch (err) {
      setCheckoutError(err instanceof ApiError ? err.message : "No se pudo generar la solicitud de compra");
    }
  }

  if (createdOrders) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14">
        <CheckoutConfirmation orders={createdOrders} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-2xl text-forest-900 mb-2">Tu carrito</h1>
      <p className="text-sm text-soil-500 mb-8">
        Al enviar, se genera una Solicitud de Compra por cada vendedor que el vendedor debe aceptar o
        rechazar (aún no se procesa pago en el MVP).
      </p>

      {isLoading && <p className="text-sm text-soil-400">Cargando carrito…</p>}

      {error && (
        <p className="text-sm text-red-600">
          {error instanceof ApiError ? error.message : "No se pudo cargar el carrito"}
        </p>
      )}

      {cart && cart.items.length === 0 && (
        <div className="border border-dashed border-forest-200 rounded-stamp p-10 text-center text-soil-400 text-sm">
          <ShoppingBag className="w-8 h-8 mx-auto mb-3 text-forest-200" />
          Tu carrito está vacío.
          <div className="mt-4">
            <Link href="/" className="text-forest-700 font-medium hover:underline">
              Explorar catálogo
            </Link>
          </div>
        </div>
      )}

      {cart && cart.items.length > 0 && (
        <>
          {groups.length > 1 && (
            <div className="bg-maize-50 border border-maize-200 rounded-stamp p-3 mb-6 text-xs text-maize-800">
              Tu carrito tiene productos de <strong>{groups.length} vendedores</strong>. Al finalizar,
              recibirás {groups.length} solicitudes de compra separadas, una por cada vendedor.
            </div>
          )}

          <div className="space-y-8">
            {groups.map((group) => (
              <div key={group.seller.id}>
                <p className="text-xs uppercase tracking-wide text-soil-400 mb-2">{group.seller.businessName}</p>
                <div className="border border-forest-100 rounded-stamp px-4">
                  {group.items.map((item) => (
                    <CartItemRow key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-forest-100 pt-6">
            <div>
              <p className="text-sm text-soil-500">Total</p>
              <p className="font-display text-2xl text-forest-800">L. {cart.total.toLocaleString("es-HN")}</p>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkoutMutation.isPending}
              className="bg-forest-700 text-stone-25 font-medium px-6 py-3 rounded-stamp hover:bg-forest-800 transition-colors disabled:opacity-60"
            >
              {checkoutMutation.isPending ? "Enviando…" : "Enviar solicitud de compra"}
            </button>
          </div>
          {checkoutError && <p className="text-sm text-red-600 mt-3 text-right">{checkoutError}</p>}
        </>
      )}
    </div>
  );
}

export default function CartPage() {
  return (
    <RequireRole allow={["CUSTOMER"]}>
      <CartPageContent />
    </RequireRole>
  );
}
