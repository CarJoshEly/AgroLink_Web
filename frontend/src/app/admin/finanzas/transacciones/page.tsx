"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { fetchAllTransactions, updateTransactionStatus, type AdminTransactionFilters } from "@/lib/api/finance";
import { TRANSACTION_STATUS_LABELS } from "@/lib/labels";
import type { TransactionStatus } from "@/lib/types";

const STATUS_FILTERS: (TransactionStatus | "")[] = ["", "PENDING", "COMPLETED", "FAILED", "REFUNDED"];

const STATUS_STYLES: Record<TransactionStatus, string> = {
  PENDING: "bg-stone-100 text-stone-600",
  COMPLETED: "bg-forest-100 text-forest-700",
  FAILED: "bg-red-50 text-red-700",
  REFUNDED: "bg-amber-50 text-amber-700",
};

const NEXT_STATUS_ACTIONS: Extract<TransactionStatus, "COMPLETED" | "FAILED" | "REFUNDED">[] = [
  "COMPLETED",
  "FAILED",
  "REFUNDED",
];

function formatDate(dateIso: string) {
  return new Date(dateIso).toLocaleString("es-HN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminTransaccionesPage() {
  const [filters, setFilters] = useState<AdminTransactionFilters>({ page: 1, limit: 15 });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-transactions", filters],
    queryFn: () => fetchAllTransactions(filters),
  });

  const updateStatus = useMutation({
    mutationFn: ({
      id,
      status,
      externalReference,
    }: {
      id: string;
      status: Extract<TransactionStatus, "COMPLETED" | "FAILED" | "REFUNDED">;
      externalReference?: string;
    }) => updateTransactionStatus(id, status, externalReference),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-transactions"] }),
  });

  function handleStatusChange(id: string, status: Extract<TransactionStatus, "COMPLETED" | "FAILED" | "REFUNDED">) {
    const externalReference =
      status === "COMPLETED"
        ? prompt("Referencia externa del proveedor de pago (opcional):") ?? undefined
        : undefined;
    updateStatus.mutate({ id, status, externalReference: externalReference || undefined });
  }

  const transactions = data?.transactions ?? [];
  const meta = data?.meta;

  return (
    <div>
      <h1 className="font-display text-2xl text-forest-900 mb-1">Transacciones</h1>
      <p className="text-sm text-soil-500 mb-6">Historial financiero de toda la plataforma.</p>

      <div className="flex gap-2 overflow-x-auto mb-5">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status || "all"}
            type="button"
            onClick={() => setFilters((f) => ({ ...f, status: status || undefined, page: 1 }))}
            className={`text-sm px-3 py-1.5 rounded-stamp border whitespace-nowrap transition-colors ${
              (filters.status ?? "") === status
                ? "border-forest-700 text-forest-800 bg-forest-50"
                : "border-forest-100 text-soil-500 hover:border-forest-300"
            }`}
          >
            {status ? TRANSACTION_STATUS_LABELS[status] : "Todas"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-14">
          <Loader2 className="w-6 h-6 text-forest-500 animate-spin" />
        </div>
      ) : transactions.length === 0 ? (
        <p className="text-sm text-soil-400 py-10 text-center">No hay transacciones con este filtro.</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="border border-forest-100 rounded-stamp p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-forest-800">
                    L. {Number(tx.amount).toLocaleString("es-HN")}{" "}
                    <span className="text-xs text-soil-400 font-normal">
                      (comisión L. {Number(tx.commissionAmount).toLocaleString("es-HN")})
                    </span>
                  </p>
                  <p className="text-xs text-soil-400 mt-0.5">
                    {tx.paymentMethod?.name ?? "—"} · {tx.order?.seller?.businessName ?? "—"} ·{" "}
                    {formatDate(tx.createdAt)}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-stamp shrink-0 ${STATUS_STYLES[tx.status]}`}>
                  {TRANSACTION_STATUS_LABELS[tx.status]}
                </span>
              </div>

              {tx.status === "PENDING" && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {NEXT_STATUS_ACTIONS.map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={updateStatus.isPending}
                      onClick={() => handleStatusChange(tx.id, status)}
                      className="text-xs px-2.5 py-1.5 rounded-stamp border border-forest-200 text-forest-700 hover:bg-forest-50 disabled:opacity-50"
                    >
                      Marcar como {TRANSACTION_STATUS_LABELS[status].toLowerCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8 text-sm">
          <button
            type="button"
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
            type="button"
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
