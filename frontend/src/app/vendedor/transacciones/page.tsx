"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { fetchMyTransactions, type TransactionFilters } from "@/lib/api/finance";
import { TRANSACTION_STATUS_LABELS } from "@/lib/labels";
import type { TransactionStatus } from "@/lib/types";

const STATUS_FILTERS: (TransactionStatus | "")[] = ["", "PENDING", "COMPLETED", "FAILED", "REFUNDED"];

const STATUS_STYLES: Record<TransactionStatus, string> = {
  PENDING: "bg-maize-50 text-maize-700",
  COMPLETED: "bg-forest-100 text-forest-700",
  FAILED: "bg-red-50 text-red-700",
  REFUNDED: "bg-soil-100 text-soil-500",
};

export default function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFilters>({ page: 1, limit: 15 });

  const { data, isLoading } = useQuery({
    queryKey: ["my-transactions", filters],
    queryFn: () => fetchMyTransactions(filters),
  });

  const transactions = data?.transactions ?? [];
  const meta = data?.meta;

  return (
    <div>
      <h1 className="font-display text-2xl text-forest-900 mb-6">Transacciones</h1>

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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-soil-400 border-b border-forest-100">
                <th className="py-2 pr-4 font-medium">Fecha</th>
                <th className="py-2 pr-4 font-medium">Método</th>
                <th className="py-2 pr-4 font-medium">Monto</th>
                <th className="py-2 pr-4 font-medium">Comisión</th>
                <th className="py-2 pr-4 font-medium">Neto</th>
                <th className="py-2 pr-4 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => {
                const net = Number(t.amount) - Number(t.commissionAmount);
                return (
                  <tr key={t.id} className="border-b border-forest-50">
                    <td className="py-2.5 pr-4 text-soil-500">
                      {new Date(t.createdAt).toLocaleDateString("es-HN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-2.5 pr-4 text-forest-800">{t.paymentMethod?.name ?? "—"}</td>
                    <td className="py-2.5 pr-4 text-forest-800">
                      L. {Number(t.amount).toLocaleString("es-HN")}
                    </td>
                    <td className="py-2.5 pr-4 text-soil-500">
                      L. {Number(t.commissionAmount).toLocaleString("es-HN")} (
                      {Number(t.commissionPercentage)}%)
                    </td>
                    <td className="py-2.5 pr-4 text-forest-800 font-medium">
                      L. {net.toLocaleString("es-HN")}
                    </td>
                    <td className="py-2.5 pr-4">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-stamp ${STATUS_STYLES[t.status]}`}
                      >
                        {TRANSACTION_STATUS_LABELS[t.status]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

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
      )}
    </div>
  );
}
