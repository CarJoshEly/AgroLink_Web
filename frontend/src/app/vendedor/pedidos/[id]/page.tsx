"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Check } from "lucide-react";
import {
  fetchOrderById,
  fetchOrderHistory,
  acceptOrder,
  rejectOrder,
  prepareOrder,
  deliverOrder,
  cancelOrder,
} from "@/lib/api/orders";
import { ApiError } from "@/lib/api/client";
import { ORDER_STATUS_LABELS, USER_ROLE_LABELS } from "@/lib/labels";
import type { OrderStatus } from "@/lib/types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-maize-50 text-maize-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  PREPARING: "bg-blue-50 text-blue-700",
  DELIVERED: "bg-forest-100 text-forest-700",
  CANCELLED: "bg-soil-100 text-soil-500",
};

function ReasonAction({
  label,
  confirmLabel,
  action,
  variant = "default",
}: {
  label: string;
  confirmLabel: string;
  action: (reason?: string) => Promise<unknown>;
  variant?: "default" | "danger";
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleConfirm() {
    setPending(true);
    setError(null);
    try {
      await action(reason || undefined);
    } catch (err) {
      setError(err instanceof ApiError ? err.rawMessage.join(" ") : "No se pudo completar la acción.");
    } finally {
      setPending(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={`text-sm font-medium px-4 py-2 rounded-stamp border transition-colors ${
          variant === "danger"
            ? "border-red-300 text-red-700 hover:bg-red-50"
            : "border-forest-300 text-forest-700 hover:bg-forest-50"
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="border border-forest-100 rounded-stamp p-3 max-w-sm">
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Motivo (opcional)"
        rows={2}
        className="input text-sm w-full"
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleConfirm}
          disabled={pending}
          className={`text-xs font-medium px-3 py-1.5 rounded-stamp text-stone-25 disabled:opacity-50 ${
            variant === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-forest-700 hover:bg-forest-800"
          }`}
        >
          {pending ? "Guardando…" : confirmLabel}
        </button>
        <button onClick={() => setOpen(false)} className="text-xs text-soil-400">
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient();

  const orderQuery = useQuery({
    queryKey: ["order", params.id],
    queryFn: () => fetchOrderById(params.id),
  });

  const historyQuery = useQuery({
    queryKey: ["order-history", params.id],
    queryFn: () => fetchOrderHistory(params.id),
  });

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["order", params.id] });
    queryClient.invalidateQueries({ queryKey: ["order-history", params.id] });
    queryClient.invalidateQueries({ queryKey: ["received-orders"] });
  }

  // Aceptar (a diferencia de rechazar/preparar/entregar/cancelar) descuenta
  // stock en el backend — sin invalidar estas dos, "Mis productos" e
  // inventario se quedan con el stock viejo en caché.
  function refreshAfterAccept() {
    refresh();
    queryClient.invalidateQueries({ queryKey: ["my-products"] });
    for (const item of order?.items ?? []) {
      queryClient.invalidateQueries({ queryKey: ["product", item.productId] });
      queryClient.invalidateQueries({ queryKey: ["inventory-history", item.productId] });
    }
  }

  const acceptMutation = useMutation({
    mutationFn: () => acceptOrder(params.id),
    onSuccess: refreshAfterAccept,
  });
  const prepareMutation = useMutation({
    mutationFn: () => prepareOrder(params.id),
    onSuccess: refresh,
  });
  const deliverMutation = useMutation({
    mutationFn: () => deliverOrder(params.id),
    onSuccess: refresh,
  });

  const order = orderQuery.data;

  if (orderQuery.isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 text-forest-500 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return <p className="text-sm text-soil-400">No se encontró el pedido.</p>;
  }

  return (
    <div>
      <Link
        href="/vendedor/pedidos"
        className="inline-flex items-center gap-1.5 text-sm text-soil-500 hover:text-forest-700 mb-4"
      >
        <ArrowLeft size={14} /> Pedidos recibidos
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-forest-900">Pedido de {order.buyer?.name ?? "comprador"}</h1>
          <p className="text-sm text-soil-500 mt-1">
            {new Date(order.createdAt).toLocaleString("es-HN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-stamp ${STATUS_STYLES[order.status]}`}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      <h2 className="font-display text-lg text-forest-800 mb-3">Productos</h2>
      <div className="border border-forest-100 rounded-stamp divide-y divide-forest-50 mb-6">
        {order.items?.map((item) => (
          <div key={item.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <span className="text-forest-800">
              {item.quantity}x {item.product?.name ?? "Producto"}
            </span>
            <span className="text-soil-500">L. {Number(item.subtotal).toLocaleString("es-HN")}</span>
          </div>
        ))}
        <div className="flex items-center justify-between px-4 py-3 text-sm font-medium">
          <span className="text-forest-800">Total</span>
          <span className="text-forest-800">L. {Number(order.totalAmount).toLocaleString("es-HN")}</span>
        </div>
      </div>

      <h2 className="font-display text-lg text-forest-800 mb-3">Acciones</h2>
      <div className="flex flex-wrap gap-3 mb-8">
        {order.status === "PENDING" && (
          <>
            <button
              onClick={() => acceptMutation.mutate()}
              disabled={acceptMutation.isPending}
              className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-stamp bg-forest-700 text-stone-25 hover:bg-forest-800 disabled:opacity-50"
            >
              <Check size={15} /> {acceptMutation.isPending ? "Aceptando…" : "Aceptar pedido"}
            </button>
            {acceptMutation.isError && (
              <p className="text-xs text-red-600 w-full">
                {acceptMutation.error instanceof ApiError
                  ? acceptMutation.error.rawMessage.join(" ")
                  : "No se pudo aceptar el pedido."}
              </p>
            )}
            <ReasonAction
              label="Rechazar"
              confirmLabel="Confirmar rechazo"
              variant="danger"
              action={(reason) => rejectOrder(params.id, reason).then(refresh)}
            />
          </>
        )}

        {order.status === "CONFIRMED" && (
          <>
            <button
              onClick={() => prepareMutation.mutate()}
              disabled={prepareMutation.isPending}
              className="text-sm font-medium px-4 py-2 rounded-stamp bg-forest-700 text-stone-25 hover:bg-forest-800 disabled:opacity-50"
            >
              {prepareMutation.isPending ? "Actualizando…" : "Marcar en preparación"}
            </button>
            <ReasonAction
              label="Cancelar pedido"
              confirmLabel="Confirmar cancelación"
              variant="danger"
              action={(reason) => cancelOrder(params.id, reason).then(refresh)}
            />
          </>
        )}

        {order.status === "PREPARING" && (
          <>
            <button
              onClick={() => deliverMutation.mutate()}
              disabled={deliverMutation.isPending}
              className="text-sm font-medium px-4 py-2 rounded-stamp bg-forest-700 text-stone-25 hover:bg-forest-800 disabled:opacity-50"
            >
              {deliverMutation.isPending ? "Actualizando…" : "Marcar como entregado"}
            </button>
            <ReasonAction
              label="Cancelar pedido"
              confirmLabel="Confirmar cancelación"
              variant="danger"
              action={(reason) => cancelOrder(params.id, reason).then(refresh)}
            />
          </>
        )}

        {(order.status === "DELIVERED" || order.status === "CANCELLED") && (
          <p className="text-sm text-soil-400">Este pedido ya está en un estado final.</p>
        )}
      </div>

      <h2 className="font-display text-lg text-forest-800 mb-3">Historial</h2>
      {historyQuery.isLoading ? (
        <p className="text-sm text-soil-400">Cargando…</p>
      ) : (
        <ol className="space-y-3">
          {historyQuery.data?.map((h) => (
            <li key={h.id} className="text-sm border-l-2 border-forest-100 pl-3">
              <p className="text-forest-800">
                {h.fromStatus ? `${ORDER_STATUS_LABELS[h.fromStatus]} → ` : ""}
                {ORDER_STATUS_LABELS[h.toStatus]}
              </p>
              <p className="text-xs text-soil-400">
                {h.user?.name ?? "Sistema"}
                {h.user?.role ? ` (${USER_ROLE_LABELS[h.user.role]})` : ""} —{" "}
                {new Date(h.createdAt).toLocaleString("es-HN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {h.note && <p className="text-xs text-soil-500 mt-0.5">"{h.note}"</p>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
