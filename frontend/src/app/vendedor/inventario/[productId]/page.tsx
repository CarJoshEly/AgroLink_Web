"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, PackagePlus, PackageMinus } from "lucide-react";
import {
  fetchProductById,
  fetchInventoryHistory,
  registerInventoryEntry,
  registerInventoryExit,
} from "@/lib/api/products";
import { ApiError } from "@/lib/api/client";
import { INVENTORY_MOVEMENT_TYPE_LABELS } from "@/lib/labels";
import type { InventoryMovementType } from "@/lib/types";

const TYPE_STYLES: Record<InventoryMovementType, string> = {
  ENTRY: "text-forest-700",
  EXIT: "text-red-700",
  ADJUSTMENT: "text-soil-500",
};

function MovementForm({
  productId,
  mode,
  onDone,
}: {
  productId: string;
  mode: "entry" | "exit";
  onDone: () => void;
}) {
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => {
      const qty = Number(quantity);
      return mode === "entry"
        ? registerInventoryEntry(productId, qty, reason || undefined)
        : registerInventoryExit(productId, qty, reason || undefined);
    },
    onSuccess: () => {
      setQuantity("");
      setReason("");
      setError(null);
      onDone();
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.rawMessage.join(" ") : "No se pudo registrar el movimiento.");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const qty = Number(quantity);
        if (!Number.isInteger(qty) || qty < 1) {
          setError("La cantidad debe ser un entero mayor a 0.");
          return;
        }
        mutation.mutate();
      }}
      className="border border-forest-100 rounded-stamp p-4"
    >
      <div className="flex items-center gap-2 mb-3 text-sm font-medium text-forest-800">
        {mode === "entry" ? (
          <PackagePlus size={16} className="text-forest-600" />
        ) : (
          <PackageMinus size={16} className="text-red-600" />
        )}
        {mode === "entry" ? "Registrar entrada" : "Registrar salida"}
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          min={1}
          step={1}
          placeholder="Cantidad"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="input w-24"
          required
        />
        <input
          type="text"
          placeholder={mode === "entry" ? "Motivo (opcional): nueva cosecha…" : "Motivo (opcional): dañado…"}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="input flex-1"
        />
        <button
          type="submit"
          disabled={mutation.isPending}
          className={`text-sm font-medium px-4 py-2 rounded-stamp text-stone-25 transition-colors disabled:opacity-50 ${
            mode === "entry" ? "bg-forest-700 hover:bg-forest-800" : "bg-soil-500 hover:bg-soil-600"
          }`}
        >
          {mutation.isPending ? "Guardando…" : "Registrar"}
        </button>
      </div>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </form>
  );
}

export default function InventoryPage({ params }: { params: { productId: string } }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data: product } = useQuery({
    queryKey: ["product", params.productId],
    queryFn: () => fetchProductById(params.productId),
  });

  const historyQuery = useQuery({
    queryKey: ["inventory-history", params.productId, page],
    queryFn: () => fetchInventoryHistory(params.productId, page),
  });

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["inventory-history", params.productId] });
    queryClient.invalidateQueries({ queryKey: ["product", params.productId] });
    queryClient.invalidateQueries({ queryKey: ["my-products"] });
  }

  const meta = historyQuery.data?.meta;

  return (
    <div>
      <Link
        href="/vendedor/productos"
        className="inline-flex items-center gap-1.5 text-sm text-soil-500 hover:text-forest-700 mb-4"
      >
        <ArrowLeft size={14} /> Mis productos
      </Link>

      <h1 className="font-display text-2xl text-forest-900 mb-1">Inventario</h1>
      <p className="text-sm text-soil-500 mb-6">
        {product ? (
          <>
            {product.name} — <strong>{product.stock}</strong> en existencia
          </>
        ) : (
          "Cargando…"
        )}
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <MovementForm productId={params.productId} mode="entry" onDone={refresh} />
        <MovementForm productId={params.productId} mode="exit" onDone={refresh} />
      </div>

      <h2 className="font-display text-lg text-forest-800 mb-3">Historial de movimientos</h2>

      {historyQuery.isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-5 h-5 text-forest-500 animate-spin" />
        </div>
      ) : historyQuery.data?.movements.length === 0 ? (
        <p className="text-sm text-soil-400">Todavía no hay movimientos registrados.</p>
      ) : (
        <>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-soil-400 border-b border-forest-100">
                <th className="py-2 pr-4 font-medium">Fecha</th>
                <th className="py-2 pr-4 font-medium">Tipo</th>
                <th className="py-2 pr-4 font-medium">Cantidad</th>
                <th className="py-2 pr-4 font-medium">Stock (antes → después)</th>
                <th className="py-2 pr-4 font-medium">Motivo</th>
              </tr>
            </thead>
            <tbody>
              {historyQuery.data?.movements.map((m) => (
                <tr key={m.id} className="border-b border-forest-50">
                  <td className="py-2.5 pr-4 text-soil-500">
                    {new Date(m.createdAt).toLocaleString("es-HN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className={`py-2.5 pr-4 font-medium ${TYPE_STYLES[m.type]}`}>
                    {INVENTORY_MOVEMENT_TYPE_LABELS[m.type]}
                  </td>
                  <td className="py-2.5 pr-4">
                    {m.type === "EXIT" ? "-" : "+"}
                    {m.quantity}
                  </td>
                  <td className="py-2.5 pr-4 text-soil-500">
                    {m.previousStock} → {m.newStock}
                  </td>
                  <td className="py-2.5 pr-4 text-soil-500">{m.reason ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6 text-sm">
              <button
                disabled={!meta.hasPreviousPage}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-stamp border border-forest-200 disabled:opacity-40"
              >
                Anterior
              </button>
              <span className="text-soil-500">
                Página {meta.page} de {meta.totalPages}
              </span>
              <button
                disabled={!meta.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
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
