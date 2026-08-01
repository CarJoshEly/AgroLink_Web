"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { fetchSellers, type SellerFilters } from "@/lib/api/admin";
import { VERIFICATION_STATUS_LABELS } from "@/lib/labels";
import type { VerificationStatus } from "@/lib/types";

const STATUS_STYLES: Record<VerificationStatus, string> = {
  PENDING: "bg-stone-100 text-stone-600",
  UNDER_REVIEW: "bg-blue-50 text-blue-700",
  VERIFIED: "bg-forest-100 text-forest-700",
  REJECTED: "bg-red-50 text-red-700",
  SUSPENDED: "bg-red-900/10 text-red-900",
};

const STATUS_FILTERS: (VerificationStatus | "")[] = [
  "",
  "PENDING",
  "UNDER_REVIEW",
  "VERIFIED",
  "REJECTED",
  "SUSPENDED",
];

export default function AdminDashboardPage() {
  const [filters, setFilters] = useState<SellerFilters>({ page: 1, limit: 10 });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-sellers", filters],
    queryFn: () => fetchSellers(filters),
  });

  const sellers = data?.sellers ?? [];
  const meta = data?.meta;

  return (
    <div>
      <h1 className="font-display text-2xl text-forest-900 mb-1">Verificación de vendedores</h1>
      <p className="text-sm text-soil-500 mb-6">
        Revisa el DNI, la selfie y la prueba de vida que cada vendedor envió, y aprueba o rechaza su
        cuenta.
      </p>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex gap-2 overflow-x-auto">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status || "all"}
              onClick={() => setFilters((f) => ({ ...f, verificationStatus: status || undefined, page: 1 }))}
              className={`text-sm px-3 py-1.5 rounded-stamp border whitespace-nowrap transition-colors ${
                (filters.verificationStatus ?? "") === status
                  ? "border-forest-700 text-forest-800 bg-forest-50"
                  : "border-forest-100 text-soil-500 hover:border-forest-300"
              }`}
            >
              {status ? VERIFICATION_STATUS_LABELS[status] : "Todos"}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Buscar por negocio o DNI..."
          className="input text-sm ml-auto max-w-xs"
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value || undefined, page: 1 }))}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-14">
          <Loader2 className="w-6 h-6 text-forest-500 animate-spin" />
        </div>
      ) : sellers.length === 0 ? (
        <p className="text-sm text-soil-400 py-10 text-center">No hay vendedores con este filtro.</p>
      ) : (
        <div className="space-y-3">
          {sellers.map((seller) => (
            <Link
              key={seller.id}
              href={`/admin/vendedores/${seller.id}`}
              className="flex items-center justify-between gap-4 border border-forest-100 rounded-stamp p-4 hover:border-forest-300 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-forest-800">{seller.businessName}</p>
                <p className="text-xs text-soil-400 mt-0.5">
                  {seller.user?.name ?? "—"} · DNI {seller.dni} ·{" "}
                  {new Date(seller.createdAt).toLocaleDateString("es-HN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-stamp shrink-0 ${STATUS_STYLES[seller.verificationStatus]}`}
              >
                {VERIFICATION_STATUS_LABELS[seller.verificationStatus]}
              </span>
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
