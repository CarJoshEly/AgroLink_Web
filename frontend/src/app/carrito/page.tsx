"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { ShoppingBag, CreditCard } from "lucide-react";
import RequireRole from "@/components/auth/RequireRole";
import CartItemRow from "@/components/cart/CartItemRow";
import CheckoutConfirmation from "@/components/cart/CheckoutConfirmation";
import PayPalPaymentModal from "@/components/cart/PayPalButtonModal";
import { CART_QUERY_KEY, useCart } from "@/hooks/useCart";
import { groupCartBySeller } from "@/lib/api/cart";
import { ApiError } from "@/lib/api/client";
import type { Order } from "@/lib/types";

function CartPageContent() {
  const { data: cart, isLoading, error } = useCart();
  const queryClient = useQueryClient();

  const [createdOrders, setCreatedOrders] = useState<Order[] | null>(null);
  const [showPayPalModal, setShowPayPalModal] = useState(false);

  const groups = cart ? groupCartBySeller(cart.items) : [];

  // El pago ya se confirmó (PayPalButtonModal capturó y generó los pedidos
  // en el backend) — acá solo queda invalidar las queries que dependen del
  // carrito/stock, igual que hacía `useCheckout().onSuccess`.
  function handlePaymentSuccess(orders: Order[]) {
    setShowPayPalModal(false);
    setCreatedOrders(orders);
    queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ["orders"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
    for (const order of orders) {
      for (const item of order.items ?? []) {
        queryClient.invalidateQueries({ queryKey: ["product", item.productId] });
      }
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
      <h1 className="font-display text-3xl font-bold text-app-textPrimary mb-2">Tu Carrito</h1>
      <p className="text-sm text-app-textSecondary mb-8 leading-relaxed">
        Revisa los productos en tu carrito y procesa tu pago de forma segura con PayPal o tarjeta.
      </p>

      {isLoading && <p className="text-sm text-app-textSecondary">Cargando carrito…</p>}

      {error && (
        <p className="text-sm text-status-danger">
          {error instanceof ApiError ? error.message : "No se pudo cargar el carrito"}
        </p>
      )}

      {cart && cart.items.length === 0 && (
        <div className="border border-dashed border-app-border rounded-2xl p-12 text-center text-app-textSecondary text-sm bg-white shadow-xs">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-primary/40" />
          Tu carrito está vacío.
          <div className="mt-4">
            <Link href="/productos" className="btn-primary text-xs py-2 px-4">
              Explorar catálogo
            </Link>
          </div>
        </div>
      )}

      {cart && cart.items.length > 0 && (
        <>
          {groups.length > 1 && (
            <div className="bg-status-warningContainer/60 border border-secondary/30 rounded-2xl p-4 mb-6 text-xs text-app-textPrimary leading-relaxed">
              Tu carrito contiene productos de <strong>{groups.length} vendedores distintos</strong>. Se procesará la orden agrupada por cada productor.
            </div>
          )}

          <div className="space-y-8">
            {groups.map((group) => (
              <div key={group.seller.id}>
                <p className="text-xs uppercase tracking-wider text-secondary-dark font-bold mb-2">
                  {group.seller.businessName}
                </p>
                <div className="border border-app-border rounded-2xl bg-white px-4 shadow-xs">
                  {group.items.map((item) => (
                    <CartItemRow key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Action Section */}
          <div className="mt-10 bg-white p-6 rounded-2xl border border-app-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs text-app-textSecondary">Monto Total del Carrito</p>
              <p className="font-display text-3xl font-bold text-app-textPrimary">
                L. {cart.total.toLocaleString("es-HN")}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPayPalModal(true)}
              className="btn-gold w-full sm:w-auto px-8 py-3.5 text-sm font-bold shadow-md"
            >
              <CreditCard className="w-5 h-5" />
              Pagar con PayPal / Tarjeta
            </button>
          </div>

          {/* Modal PayPal */}
          <PayPalPaymentModal
            isOpen={showPayPalModal}
            onClose={() => setShowPayPalModal(false)}
            totalHnl={cart.total}
            onPaymentSuccess={handlePaymentSuccess}
            isProcessing={false}
          />
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
