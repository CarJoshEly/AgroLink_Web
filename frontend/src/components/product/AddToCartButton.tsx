"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAddToCart } from "@/hooks/useCart";
import { ApiError } from "@/lib/api/client";

export default function AddToCartButton({ productId, stock }: { productId: string; stock: number }) {
  const { user } = useAuth();
  const router = useRouter();
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<string | null>(null);

  const isSoldOut = stock <= 0;
  const canBuy = !user || user.role === "CUSTOMER";

  async function handleAdd() {
    setFeedback(null);

    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "CUSTOMER") return;

    try {
      await addToCart.mutateAsync({ productId, quantity });
      setFeedback("¡Agregado al carrito!");
    } catch (err) {
      setFeedback(err instanceof ApiError ? err.message : "No se pudo agregar el producto");
    }
  }

  if (!canBuy) return null;

  return (
    <div className="mt-6 space-y-2">
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-forest-100 rounded-stamp">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={isSoldOut}
            className="p-2 text-forest-600 hover:bg-forest-50 disabled:opacity-40"
            aria-label="Disminuir cantidad"
          >
            <Minus size={16} />
          </button>
          <span className="w-10 text-center text-sm font-medium">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
            disabled={isSoldOut}
            className="p-2 text-forest-600 hover:bg-forest-50 disabled:opacity-40"
            aria-label="Aumentar cantidad"
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={isSoldOut || addToCart.isPending}
          className="bg-forest-700 text-stone-25 font-medium px-5 py-2.5 rounded-stamp hover:bg-forest-800 transition-colors disabled:opacity-60"
        >
          {isSoldOut ? "Agotado" : addToCart.isPending ? "Agregando…" : "Agregar al carrito"}
        </button>
      </div>

      {feedback && <p className="text-sm text-forest-600">{feedback}</p>}
    </div>
  );
}
