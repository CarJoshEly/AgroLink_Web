"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import StarRating from "@/components/ui/StarRating";
import { createSellerReview, updateSellerReview } from "@/lib/api/reviews";
import { ApiError } from "@/lib/api/client";
import type { SellerReview } from "@/lib/types";

const CRITERIA: { key: keyof Scores; label: string }[] = [
  { key: "qualityScore", label: "Calidad del producto" },
  { key: "responseTimeScore", label: "Tiempo de respuesta" },
  { key: "complianceScore", label: "Cumplimiento del pedido" },
  { key: "attentionScore", label: "Atención al cliente" },
  { key: "trustScore", label: "Confianza / seriedad" },
];

interface Scores {
  qualityScore: number;
  responseTimeScore: number;
  complianceScore: number;
  attentionScore: number;
  trustScore: number;
}

/** La reseña de VENDEDOR sí usa las 5 dimensiones, ligada al `orderId` completo. */
export default function SellerReviewForm({
  orderId,
  sellerName,
  existingReview,
  onSaved,
}: {
  orderId: string;
  sellerName: string;
  existingReview?: SellerReview | null;
  onSaved: () => void;
}) {
  const queryClient = useQueryClient();
  const [scores, setScores] = useState<Scores>({
    qualityScore: existingReview?.qualityScore ?? 0,
    responseTimeScore: existingReview?.responseTimeScore ?? 0,
    complianceScore: existingReview?.complianceScore ?? 0,
    attentionScore: existingReview?.attentionScore ?? 0,
    trustScore: existingReview?.trustScore ?? 0,
  });
  const [comment, setComment] = useState(existingReview?.comment ?? "");
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (Object.values(scores).some((v) => v < 1)) {
      setErrorMessage("Califica las 5 dimensiones antes de enviar");
      return;
    }
    setSending(true);
    setErrorMessage(null);
    try {
      if (existingReview) {
        await updateSellerReview(existingReview.id, { ...scores, comment: comment || undefined });
      } else {
        await createSellerReview({ orderId, ...scores, comment: comment || undefined });
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
    <form onSubmit={handleSubmit} className="space-y-4 bg-forest-50/60 border border-forest-100 rounded-stamp p-5">
      <h4 className="font-display text-base text-forest-800">Reseña para {sellerName}</h4>

      {CRITERIA.map(({ key, label }) => (
        <div key={key} className="flex items-center justify-between">
          <span className="text-sm text-forest-700">{label}</span>
          <StarRating value={scores[key]} onChange={(v) => setScores((s) => ({ ...s, [key]: v }))} />
        </div>
      ))}

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Cuéntanos tu experiencia con este vendedor (opcional)"
        rows={3}
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
