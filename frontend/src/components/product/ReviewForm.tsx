"use client";

import { useState } from "react";
import StarRating from "@/components/ui/StarRating";
import { submitReview } from "@/lib/api/reviews";

const CRITERIA: { key: keyof Ratings; label: string }[] = [
  { key: "ratingQuality", label: "Calidad del producto" },
  { key: "ratingResponseTime", label: "Tiempo de respuesta" },
  { key: "ratingFulfillment", label: "Cumplimiento" },
  { key: "ratingService", label: "Atención" },
  { key: "ratingTrust", label: "Confianza" },
];

interface Ratings {
  ratingQuality: number;
  ratingResponseTime: number;
  ratingFulfillment: number;
  ratingService: number;
  ratingTrust: number;
}

export default function ReviewForm({
  productId,
  orderId,
  onSubmitted,
}: {
  productId: string;
  orderId: string;
  onSubmitted?: () => void;
}) {
  const [ratings, setRatings] = useState<Ratings>({
    ratingQuality: 0,
    ratingResponseTime: 0,
    ratingFulfillment: 0,
    ratingService: 0,
    ratingTrust: 0,
  });
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await submitReview({ productId, orderId, comment, ...ratings });
      setSent(true);
      onSubmitted?.();
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="bg-forest-50 border border-forest-100 rounded-stamp p-4 text-sm text-forest-700">
        Gracias por tu reseña. Quedará visible una vez sea revisada por moderación.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-forest-50/60 border border-forest-100 rounded-stamp p-5">
      <h4 className="font-display text-base text-forest-800">Deja tu reseña</h4>

      {CRITERIA.map(({ key, label }) => (
        <div key={key} className="flex items-center justify-between">
          <span className="text-sm text-forest-700">{label}</span>
          <StarRating
            value={ratings[key]}
            onChange={(v) => setRatings((r) => ({ ...r, [key]: v }))}
          />
        </div>
      ))}

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Cuéntanos tu experiencia con este vendedor y producto…"
        rows={3}
        className="w-full rounded-stamp border border-forest-100 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-300"
        required
      />

      <button
        type="submit"
        disabled={sending}
        className="bg-forest-700 text-stone-25 text-sm font-medium px-4 py-2 rounded-stamp hover:bg-forest-800 transition-colors disabled:opacity-60"
      >
        {sending ? "Enviando…" : "Enviar reseña"}
      </button>
    </form>
  );
}
