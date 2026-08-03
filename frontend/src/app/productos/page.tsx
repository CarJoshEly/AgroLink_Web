"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/product/ProductCard";
import ProductFiltersBar from "@/components/product/ProductFilters";
import { fetchProducts, type ProductFilters as ProductFiltersType } from "@/lib/api/products";
import { fetchCategories } from "@/lib/api/categories";
import { ApiError } from "@/lib/api/client";

export default function ProductsCatalogPage() {
  const [filters, setFilters] = useState<ProductFiltersType>({ page: 1, limit: 12 });

  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: () => fetchCategories() });
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
  });

  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl text-forest-900 mb-6">Catálogo</h1>

      <ProductFiltersBar
        categories={categories ?? []}
        filters={filters}
        onChange={setFilters}
      />

      {isLoading && <p className="text-sm text-soil-400">Cargando productos…</p>}
      {error && (
        <p className="text-sm text-red-600">
          {error instanceof ApiError ? error.message : "No se pudieron cargar los productos"}
        </p>
      )}

      {data && data.products.length === 0 && (
        <p className="text-sm text-soil-400">No se encontraron productos con estos filtros.</p>
      )}

      {data && data.products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {data.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {data && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-10">
          <button
            onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, (f.page ?? 1) - 1) }))}
            disabled={(filters.page ?? 1) <= 1}
            className="text-sm text-forest-700 disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-xs text-soil-400">
            Página {filters.page ?? 1} de {totalPages}
          </span>
          <button
            onClick={() => setFilters((f) => ({ ...f, page: Math.min(totalPages, (f.page ?? 1) + 1) }))}
            disabled={(filters.page ?? 1) >= totalPages}
            className="text-sm text-forest-700 disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
