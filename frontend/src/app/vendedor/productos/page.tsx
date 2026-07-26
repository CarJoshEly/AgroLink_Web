"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Eye } from "lucide-react";
import { fetchMyProducts, updateProductStock, deleteProduct, type ProductFilters } from "@/lib/api/products";
import { PRODUCT_STATUS_LABELS, PRODUCT_UNIT_LABELS } from "@/lib/labels";
import type { Product, ProductStatus } from "@/lib/types";

const STATUS_STYLES: Record<ProductStatus, string> = {
  ACTIVE: "bg-forest-100 text-forest-700",
  OUT_OF_STOCK: "bg-red-50 text-red-700",
  INACTIVE: "bg-soil-100 text-soil-500",
};

function StockCell({ product }: { product: Product }) {
  const queryClient = useQueryClient();
  const [value, setValue] = useState(String(product.stock));
  const [editing, setEditing] = useState(false);

  const mutation = useMutation({
    mutationFn: (stock: number) => updateProductStock(product.id, stock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-products"] });
      setEditing(false);
    },
  });

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-sm text-forest-700 hover:underline underline-offset-2"
        title="Ajustar stock"
      >
        {product.stock}
      </button>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const parsed = Number(value);
        if (Number.isInteger(parsed) && parsed >= 0) mutation.mutate(parsed);
      }}
      className="flex items-center gap-1.5"
    >
      <input
        type="number"
        min={0}
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setEditing(false)}
        className="w-16 rounded-stamp border border-forest-200 px-2 py-1 text-sm"
        disabled={mutation.isPending}
      />
      <button
        type="submit"
        disabled={mutation.isPending}
        className="text-xs text-forest-700 font-medium disabled:opacity-50"
      >
        Guardar
      </button>
    </form>
  );
}

function DeleteButton({ product }: { product: Product }) {
  const queryClient = useQueryClient();
  const [confirming, setConfirming] = useState(false);

  const mutation = useMutation({
    mutationFn: () => deleteProduct(product.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-products"] });
    },
  });

  if (confirming) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="text-soil-500">¿Eliminar?</span>
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="text-red-700 font-medium"
        >
          Sí
        </button>
        <button onClick={() => setConfirming(false)} className="text-soil-400">
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title="Eliminar producto"
      className="text-soil-400 hover:text-red-700 transition-colors"
    >
      <Trash2 size={16} />
    </button>
  );
}

export default function SellerProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({ page: 1, limit: 20 });

  const { data, isLoading } = useQuery({
    queryKey: ["my-products", filters],
    queryFn: () => fetchMyProducts(filters),
  });

  const products = data?.products ?? [];
  const meta = data?.meta;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-forest-900">Mis productos</h1>
        <Link
          href="/vendedor/productos/nuevo"
          className="bg-forest-700 text-stone-25 text-sm font-medium px-4 py-2 rounded-stamp hover:bg-forest-800 transition-colors"
        >
          Publicar producto
        </Link>
      </div>

      <div className="flex gap-3 mb-5">
        {(["", "ACTIVE", "OUT_OF_STOCK", "INACTIVE"] as const).map((status) => (
          <button
            key={status || "all"}
            onClick={() => setFilters((f) => ({ ...f, status: status || undefined, page: 1 }))}
            className={`text-sm px-3 py-1.5 rounded-stamp border transition-colors ${
              (filters.status ?? "") === status
                ? "border-forest-700 text-forest-800 bg-forest-50"
                : "border-forest-100 text-soil-500 hover:border-forest-300"
            }`}
          >
            {status ? PRODUCT_STATUS_LABELS[status] : "Todos"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-soil-400">Cargando…</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-soil-400 py-10 text-center">Todavía no has publicado productos.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-soil-400 border-b border-forest-100">
                <th className="py-2 pr-4 font-medium">Producto</th>
                <th className="py-2 pr-4 font-medium">Precio</th>
                <th className="py-2 pr-4 font-medium">Stock</th>
                <th className="py-2 pr-4 font-medium">Estado</th>
                <th className="py-2 pr-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const cover = [...(product.images ?? [])].sort((a, b) => a.order - b.order)[0];
                return (
                  <tr key={product.id} className="border-b border-forest-50">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-stamp bg-forest-50 overflow-hidden shrink-0">
                          {cover && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={cover.url} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-forest-800">{product.name}</p>
                          <p className="text-xs text-soil-400">{product.category?.name ?? "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-forest-700">
                      L. {Number(product.price).toLocaleString("es-HN")}
                      <span className="text-xs text-soil-400"> /{PRODUCT_UNIT_LABELS[product.unit]}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <StockCell product={product} />
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-stamp ${STATUS_STYLES[product.status]}`}>
                        {PRODUCT_STATUS_LABELS[product.status]}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/productos/${product.id}`} title="Ver" className="text-soil-400 hover:text-forest-700">
                          <Eye size={16} />
                        </Link>
                        <Link
                          href={`/vendedor/productos/${product.id}/editar`}
                          title="Editar"
                          className="text-soil-400 hover:text-forest-700"
                        >
                          <Pencil size={16} />
                        </Link>
                        <DeleteButton product={product} />
                      </div>
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
