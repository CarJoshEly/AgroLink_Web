"use client";

import { useEffect, useState } from "react";
import type { Review } from "@/lib/api/reviews";
import { fetchReviewsByProduct } from "@/lib/api/reviews";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import StarRating from "@/components/ui/StarRating";

export default function ReviewsTab({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviewsByProduct(productId).then((data) => {
      setReviews(data);
      setLoading(false);
    });
  }, [productId]);

  const average =
    reviews.length === 0
      ? 0
      : reviews.reduce(
          (sum, r) =>
            sum +
            (r.ratingQuality + r.ratingResponseTime + r.ratingFulfillment + r.ratingService + r.ratingTrust) / 5,
          0
        ) / reviews.length;

  if (loading) {
    return <p className="text-sm text-soil-400">Cargando reseñas…</p>;
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl text-forest-800">{average.toFixed(1)}</span>
            <StarRating value={Math.round(average)} readOnly />
          </div>
          <p className="text-xs text-soil-400 mt-1">
            {reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"} · solo compradores con pedido entregado
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm font-medium text-forest-700 border border-forest-200 px-3 py-1.5 rounded-stamp hover:bg-forest-50 transition-colors"
          >
            Dejar reseña
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-6">
          <ReviewForm
            productId={productId}
            orderId="o-demo"
            onSubmitted={() => setShowForm(false)}
          />
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm text-soil-400">Este producto todavía no tiene reseñas.</p>
      ) : (
        <div className="space-y-5">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}
    </div>
  );
}
