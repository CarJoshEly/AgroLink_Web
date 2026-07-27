"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { fetchReceivedOrders, acceptOrder, type OrderFilters } from "@/lib/api/orders";
import { ORDER_STATUS_LABELS } from "@/lib/labels";
import type { Order, OrderStatus } from "@/lib/types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-maize-50 text-maize-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  PREPARING: "bg-blue-50 text-blue-700",
  DELIVERED: "bg-forest-100 text-forest-700",
  CANCELLED: "bg-soil-100 text-soil-500",
};

const STATUS_FILTERS: (OrderStatus | "")[] = ["", "PENDING", "CONFIRMED", "PREPARING", "DELIVERED", "CANCELLED"];

function AcceptButton({ order }: { order: Order }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => acceptOrder(order.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["received-orders"] }),
  });

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
      disabled={mutation.isPending}
      className="text-xs font-medium text-forest-700 border border-forest-300 px-3 py-1 rounded-stamp hover:bg-forest-50 disabled:opacity-50"
    >
      {mutation.isPending ? "Aceptando…" : "Aceptar"}
    </button>
  );
}

export default function ReceivedOrdersPage() {
  const [filters, setFilters] = useState<OrderFilters>({ page: 1, limit: 10 });

  const { data, isLoading } = useQuery({
    queryKey: ["received-orders", filters],
    queryFn: () => fetchReceivedOrders(filters),
  });

  const orders = data?.orders ?? [];
  const meta = data?.meta;

  return (
    <div>
      <h1 className="font-display text-2xl text-forest-900 mb-6">Pedidos recibidos</h1>

      <div className="flex gap-2 mb-5 overflow-x-auto">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status || "all"}
            onClick={() => setFilters((f) => ({ ...f, status: status || undefined, page: 1 }))}
            className={`text-sm px-3 py-1.5 rounded-stamp border whitespace-nowrap transition-colors ${
              (filters.status ?? "") === status
                ? "border-forest-700 text-forest-800 bg-forest-50"
                : "border-forest-100 text-soil-500 hover:border-forest-300"
            }`}
          >
            {status ? ORDER_STATUS_LABELS[status] : "Todos"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-14">
          <Loader2 className="w-6 h-6 text-forest-500 animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-sm text-soil-400 py-10 text-center">No hay pedidos con este filtro.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/vendedor/pedidos/${order.id}`}
              className="block border border-forest-100 rounded-stamp p-4 hover:border-forest-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-forest-800">{order.buyer?.name ?? "Comprador"}</p>
                  <p className="text-xs text-soil-400 mt-0.5">
                    {order.items?.length ?? 0} producto(s) —{" "}
                    {new Date(order.createdAt).toLocaleDateString("es-HN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-forest-800">
                    L. {Number(order.totalAmount).toLocaleString("es-HN")}
                  </p>
                  <span
                    className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-stamp ${STATUS_STYLES[order.status]}`}
                  >
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>
              </div>

              {order.status === "PENDING" && (
                <div className="mt-3 pt-3 border-t border-forest-50">
                  <AcceptButton order={order} />
                  <span className="text-xs text-soil-400 ml-3">
                    o abre el pedido para rechazarlo
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8 text-sm">
          <button
            disabled={!meta.hasPreviousPage}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
            className="px-3 py-1.5 rounded-stamp border border-forest-200 disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-soil-500">
            Página {meta.page} de {meta.totalPages}
          </span>
          <button
            disabled={!meta.hasNextPage}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
            className="px-3 py-1.5 rounded-stamp border border-forest-200 disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
