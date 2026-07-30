"use client";

import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItemWithSeller } from "@/lib/api/cart";
import { useRemoveCartItem, useUpdateCartItem } from "@/hooks/useCart";
import { PRODUCT_UNIT_LABELS } from "@/lib/labels";

export default function CartItemRow({ item }: { item: CartItemWithSeller }) {
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const [quantity, setQuantity] = useState(item.quantity);

  const stock = item.product.stock;
  const price = Number(item.product.price);

  function commitQuantity(next: number) {
    const clamped = Math.min(Math.max(1, next), stock);
    setQuantity(clamped);
    if (clamped !== item.quantity) {
      updateItem.mutate({ itemId: item.id, quantity: clamped });
    }
  }

  const cover = item.product.images?.[0]?.url;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-forest-50 last:border-b-0">
      <div className="w-16 h-16 rounded-stamp bg-forest-50 overflow-hidden shrink-0">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={item.product.name} className="w-full h-full object-cover" />
        ) : null}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-forest-800 truncate">{item.product.name}</p>
        <p className="text-xs text-soil-400">
          L. {price.toLocaleString("es-HN")} / {PRODUCT_UNIT_LABELS[item.product.unit]}
        </p>
        {quantity >= stock && (
          <p className="text-xs text-amber-600 mt-0.5">Máximo disponible: {stock}</p>
        )}
      </div>

      <div className="flex items-center border border-forest-100 rounded-stamp">
        <button
          type="button"
          onClick={() => commitQuantity(quantity - 1)}
          disabled={updateItem.isPending}
          className="p-1.5 text-forest-600 hover:bg-forest-50 disabled:opacity-40"
          aria-label="Disminuir cantidad"
        >
          <Minus size={14} />
        </button>
        <span className="w-8 text-center text-sm">{quantity}</span>
        <button
          type="button"
          onClick={() => commitQuantity(quantity + 1)}
          disabled={updateItem.isPending || quantity >= stock}
          className="p-1.5 text-forest-600 hover:bg-forest-50 disabled:opacity-40"
          aria-label="Aumentar cantidad"
        >
          <Plus size={14} />
        </button>
      </div>

      <p className="w-24 text-right text-sm font-medium text-forest-800">
        L. {item.subtotal.toLocaleString("es-HN")}
      </p>

      <button
        type="button"
        onClick={() => removeItem.mutate(item.id)}
        disabled={removeItem.isPending}
        className="text-soil-400 hover:text-red-500 transition-colors disabled:opacity-40"
        aria-label="Eliminar del carrito"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
