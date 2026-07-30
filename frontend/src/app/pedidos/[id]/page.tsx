"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import RequireRole from "@/components/auth/RequireRole";
import OrderTimeline from "@/components/orders/OrderTimeline";
import ProductReviewForm from "@/components/orders/ProductReviewForm";
import SellerReviewForm from "@/components/orders/SellerReviewForm";
import { useOrder, useOrderHistory } from "@/hooks/useOrders";
import { deleteProductReview, deleteSellerReview } from "@/lib/api/reviews";
import { ApiError } from "@/lib/api/client";
import { ORDER_STATUS_LABELS } from "@/lib/labels";

function OrderDetailContent() {
  const params = useParams<{ id: string }>();
  const orderId = params.id;
  const queryClient = useQueryClient();

  const [openForm, setOpenForm] = useState<string | null>(null); // "seller" | orderItemId | null

  const orderQuery = useOrder(orderId);
  const historyQuery = useOrderHistory(orderId);

  async function refetchOrder() {
    await queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
    setOpenForm(null);
  }

  async function handleDeleteProductReview(reviewId: string) {
    if (!confirm("¿Eliminar esta reseña?")) return;
    await deleteProductReview(reviewId);
    await refetchOrder();
  }

  async function handleDeleteSellerReview(reviewId: string) {
    if (!confirm("¿Eliminar esta reseña de vendedor?")) return;
    await deleteSellerReview(reviewId);
    await refetchOrder();
  }

  if (orderQuery.isLoading) {
    return <div className="mx-auto max-w-2xl px-4 py-14 text-sm text-soil-400">Cargando pedido…</div>;
  }

  if (orderQuery.error || !orderQuery.data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 text-sm text-red-600">
        {orderQuery.error instanceof ApiError ? orderQuery.error.message : "No se pudo cargar el pedido"}
      </div>
    );
  }

  const order = orderQuery.data;
  const isDelivered = order.status === "DELIVERED";

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-2xl text-forest-900">Pedido #{order.id.slice(0, 8)}</h1>
        <span className="text-xs font-medium px-2 py-0.5 rounded-stamp bg-forest-50 text-forest-700">
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>
      <p className="text-sm text-soil-500 mb-8">{order.seller?.businessName}</p>

      {/* --- Ítems del pedido --- */}
      <div className="border border-forest-100 rounded-stamp divide-y divide-forest-100 mb-8">
        {order.items?.map((item) => (
          <div key={item.id} className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-forest-800">{item.product?.name}</span>
              <span className="text-sm text-soil-500">
                {item.quantity} × L. {Number(item.unitPrice).toLocaleString("es-HN")}
              </span>
            </div>

            {isDelivered && (
              <div className="mt-3">
                {item.review ? (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-forest-600">
                      Ya reseñaste este producto ({item.review.rating}/5)
                    </span>
                    <button
                      onClick={() => setOpenForm(item.id)}
                      className="text-xs font-medium text-forest-700 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProductReview(item.review!.id)}
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                ) : (
                  openForm !== item.id && (
                    <button
                      onClick={() => setOpenForm(item.id)}
                      className="text-xs font-medium text-forest-700 border border-forest-200 px-3 py-1.5 rounded-stamp hover:bg-forest-50 transition-colors"
                    >
                      Dejar reseña
                    </button>
                  )
                )}

                {openForm === item.id && (
                  <div className="mt-3">
                    <ProductReviewForm
                      orderItemId={item.id}
                      orderId={order.id}
                      productName={item.product?.name ?? "Producto"}
                      existingReview={item.review}
                      onSaved={refetchOrder}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm mb-8">
        <span className="text-soil-500">Total</span>
        <span className="font-display text-xl text-forest-800">
          L. {Number(order.totalAmount).toLocaleString("es-HN")}
        </span>
      </div>

      {/* --- Reseña de vendedor (ligada al Order completo) --- */}
      {isDelivered && (
        <div className="mb-8">
          {order.sellerReview && openForm !== "seller" ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-forest-600">Ya reseñaste a este vendedor</span>
              <button onClick={() => setOpenForm("seller")} className="text-sm font-medium text-forest-700 hover:underline">
                Editar
              </button>
              <button
                onClick={() => handleDeleteSellerReview(order.sellerReview!.id)}
                className="text-sm font-medium text-red-600 hover:underline"
              >
                Eliminar
              </button>
            </div>
          ) : openForm === "seller" ? (
            <SellerReviewForm
              orderId={order.id}
              sellerName={order.seller?.businessName ?? "el vendedor"}
              existingReview={order.sellerReview}
              onSaved={refetchOrder}
            />
          ) : (
            <button
              onClick={() => setOpenForm("seller")}
              className="text-sm font-medium text-forest-700 border border-forest-200 px-4 py-2 rounded-stamp hover:bg-forest-50 transition-colors"
            >
              Dejar reseña al vendedor
            </button>
          )}
        </div>
      )}

      {/* --- Línea de tiempo --- */}
      <div>
        <h2 className="font-display text-lg text-forest-900 mb-4">Seguimiento</h2>
        {historyQuery.isLoading && <p className="text-sm text-soil-400">Cargando historial…</p>}
        {historyQuery.data && <OrderTimeline history={historyQuery.data} />}
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <RequireRole allow={["CUSTOMER"]}>
      <OrderDetailContent />
    </RequireRole>
  );
}
