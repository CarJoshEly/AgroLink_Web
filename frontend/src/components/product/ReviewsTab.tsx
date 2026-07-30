"use client";

import { useEffect, useState } from "react";
import { fetchProductReviews, fetchProductReviewSummary } from "@/lib/api/reviews";
import type { ProductReview } from "@/lib/types";
import { ProductReviewCard } from "@/components/product/ReviewCard";
import StarRating from "@/components/ui/StarRating";

/**
 * OJO: las reseñas de PRODUCTO solo se pueden crear desde el detalle de un
 * pedido entregado (necesitan `orderItemId`, ver /pedidos/[id]). Este tab
 * es de solo lectura del listado público; por eso no hay botón "dejar
 * reseña" aquí.
 */
export default function ReviewsTab({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [summary, setSummary] = useState<{ averageRating: number | null; totalReviews: number } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchProductReviews(productId), fetchProductReviewSummary(productId)])
      .then(([list, sum]) => {
        if (cancelled) return;
        setReviews(list.reviews);
        setSummary(sum);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (loading) {
    return <p className="text-sm text-soil-400">Cargando reseñas…</p>;
  }

  const average = summary?.averageRating ?? 0;
  const total = summary?.totalReviews ?? 0;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="font-display text-2xl text-forest-800">{average.toFixed(1)}</span>
          <StarRating value={Math.round(average)} readOnly />
        </div>
        <p className="text-xs text-soil-400 mt-1">
          {total} {total === 1 ? "reseña" : "reseñas"} · solo compradores con pedido entregado
        </p>
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-soil-400">Este producto todavía no tiene reseñas.</p>
      ) : (
        <div className="space-y-5">
          {reviews.map((r) => (
            <ProductReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}
    </div>
  );
}
