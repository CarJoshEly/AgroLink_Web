"use client";

import { useState } from "react";
import RequireRole from "@/components/auth/RequireRole";
import OrderCard from "@/components/orders/OrderCard";
import { useMyOrders } from "@/hooks/useOrders";
import { ApiError } from "@/lib/api/client";
import type { OrderStatus } from "@/lib/types";

const STATUS_FILTERS: { value: OrderStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Todos" },
  { value: "PENDING", label: "Pendientes" },
  { value: "CONFIRMED", label: "Confirmados" },
  { value: "PREPARING", label: "En preparación" },
  { value: "DELIVERED", label: "Entregados" },
  { value: "CANCELLED", label: "Cancelados" },
];

function OrdersPageContent() {
  const [status, setStatus] = useState<OrderStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useMyOrders({
    status: status === "ALL" ? undefined : status,
    page,
    limit: 10,
  });

  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-2xl text-forest-900 mb-2">Mis pedidos</h1>
      <p className="text-sm text-soil-500 mb-6">Seguimiento de tus solicitudes de compra.</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setStatus(f.value);
              setPage(1);
            }}
            className={`text-xs font-medium px-3 py-1.5 rounded-stamp border transition-colors ${
              status === f.value
                ? "bg-forest-700 text-stone-25 border-forest-700"
                : "border-forest-200 text-forest-700 hover:bg-forest-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-sm text-soil-400">Cargando pedidos…</p>}
      {error && (
        <p className="text-sm text-red-600">
          {error instanceof ApiError ? error.message : "No se pudieron cargar tus pedidos"}
        </p>
      )}

      {data && data.orders.length === 0 && (
        <div className="border border-dashed border-forest-200 rounded-stamp p-10 text-center text-soil-400 text-sm">
          No tienes pedidos {status !== "ALL" ? "con este estado" : "todavía"}.
        </div>
      )}

      {data && data.orders.length > 0 && (
        <div className="space-y-3">
          {data.orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {data && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="text-sm text-forest-700 disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-xs text-soil-400">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="text-sm text-forest-700 disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <RequireRole allow={["CUSTOMER"]}>
      <OrdersPageContent />
    </RequireRole>
  );
}
