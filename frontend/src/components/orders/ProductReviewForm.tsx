"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import StarRating from "@/components/ui/StarRating";
import { createProductReview, updateProductReview } from "@/lib/api/reviews";
import { ApiError } from "@/lib/api/client";

/**
 * La reseña de PRODUCTO usa un solo `rating` (1-5) ligado a un `orderItemId`
 * puntual (no al pedido completo) — así el backend sabe exactamente qué
 * producto de un pedido con varios ítems se está calificando.
 */
export default function ProductReviewForm({
  orderItemId,
  orderId,
  productName,
  existingReview,
  onSaved,
}: {
  orderItemId: string;
  orderId: string;
  productName: string;
  existingReview?: { id: string; rating: number; comment?: string | null } | null;
  onSaved: () => void;
}) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [comment, setComment] = useState(existingReview?.comment ?? "");
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      setErrorMessage("Selecciona una calificación de 1 a 5 estrellas");
      return;
    }
    setSending(true);
    setErrorMessage(null);
    try {
      if (existingReview) {
        await updateProductReview(existingReview.id, { rating, comment: comment || undefined });
      } else {
        await createProductReview({ orderItemId, rating, comment: comment || undefined });
      }
      await queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
      onSaved();
    } catch (err) {
      setErrorMessage(err instanceof ApiError ? err.message : "No se pudo guardar la reseña");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-forest-50/60 border border-forest-100 rounded-stamp p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-forest-800">{productName}</p>
        <StarRating value={rating} onChange={setRating} />
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="¿Qué te pareció el producto? (opcional)"
        rows={2}
        className="w-full rounded-stamp border border-forest-100 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-300"
      />
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      <button
        type="submit"
        disabled={sending}
        className="bg-forest-700 text-stone-25 text-sm font-medium px-4 py-2 rounded-stamp hover:bg-forest-800 transition-colors disabled:opacity-60"
      >
        {sending ? "Guardando…" : existingReview ? "Actualizar reseña" : "Enviar reseña"}
      </button>
    </form>
  );
}
