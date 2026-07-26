"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, type ProductFilters } from "@/lib/api/products";
import { fetchCategories } from "@/lib/api/categories";
import ProductCard from "@/components/product/ProductCard";
import ProductFiltersBar from "@/components/product/ProductFilters";

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({ page: 1, limit: 12 });

  const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const productsQuery = useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
  });

  const meta = productsQuery.data?.meta;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl text-forest-900 mb-6">Productos</h1>

      <ProductFiltersBar categories={categoriesQuery.data ?? []} filters={filters} onChange={setFilters} />

      {productsQuery.isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-stamp bg-forest-50 animate-pulse" />
          ))}
        </div>
      ) : productsQuery.data?.products.length === 0 ? (
        <p className="text-sm text-soil-400 py-14 text-center">
          No se encontraron productos con esos filtros.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {productsQuery.data?.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10 text-sm">
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
        </>
      )}
    </div>
  );
}
