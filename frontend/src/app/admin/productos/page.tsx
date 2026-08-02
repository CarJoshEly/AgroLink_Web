"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { fetchAdminProducts, type AdminProductFilters } from "@/lib/api/admin";
import { PRODUCT_STATUS_LABELS, PRODUCT_UNIT_LABELS } from "@/lib/labels";
import type { ProductStatus } from "@/lib/types";

const STATUS_FILTERS: (ProductStatus | "")[] = ["", "ACTIVE", "OUT_OF_STOCK", "INACTIVE"];

const STATUS_STYLES: Record<ProductStatus, string> = {
  ACTIVE: "bg-forest-100 text-forest-700",
  OUT_OF_STOCK: "bg-amber-50 text-amber-700",
  INACTIVE: "bg-stone-100 text-stone-600",
};

export default function AdminProductosPage() {
  const [filters, setFilters] = useState<AdminProductFilters>({ page: 1, limit: 15 });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products", filters],
    queryFn: () => fetchAdminProducts(filters),
  });

  const products = data?.products ?? [];
  const meta = data?.meta;

  return (
    <div>
      <h1 className="font-display text-2xl text-forest-900 mb-1">Productos</h1>
      <p className="text-sm text-soil-500 mb-6">Vista general del catálogo de toda la plataforma.</p>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex gap-2 overflow-x-auto">
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
              {status ? PRODUCT_STATUS_LABELS[status] : "Todos"}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Buscar por nombre o descripción..."
          className="input text-sm ml-auto max-w-xs"
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value || undefined, page: 1 }))}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-14">
          <Loader2 className="w-6 h-6 text-forest-500 animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-sm text-soil-400 py-10 text-center">No hay productos con este filtro.</p>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/productos/${product.id}`}
              target="_blank"
              className="flex items-center justify-between gap-4 border border-forest-100 rounded-stamp p-4 hover:border-forest-300 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-forest-800">{product.name}</p>
                <p className="text-xs text-soil-400 mt-0.5">
                  {product.seller?.businessName ?? "—"} · {product.category?.name ?? "sin categoría"} · L.{" "}
                  {Number(product.price).toLocaleString("es-HN")} / {PRODUCT_UNIT_LABELS[product.unit]} ·{" "}
                  stock {product.stock}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-stamp shrink-0 ${STATUS_STYLES[product.status]}`}
              >
                {PRODUCT_STATUS_LABELS[product.status]}
              </span>
            </Link>
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
