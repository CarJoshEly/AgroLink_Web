"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProductReviews, fetchProductReviewSummary } from "@/lib/api/reviews";
import { ProductReviewCard } from "./ReviewCard";
import ProductReviewSummaryView from "./ProductReviewSummaryView";

export default function ReviewsTab({ productId }: { productId: string }) {
  const summaryQuery = useQuery({
    queryKey: ["product-review-summary", productId],
    queryFn: () => fetchProductReviewSummary(productId),
  });

  const reviewsQuery = useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: () => fetchProductReviews(productId),
  });

  if (summaryQuery.isLoading || reviewsQuery.isLoading) {
    return <p className="text-sm text-soil-400">Cargando reseñas…</p>;
  }

  const reviews = reviewsQuery.data?.reviews ?? [];

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        {summaryQuery.data && summaryQuery.data.totalReviews > 0 ? (
          <ProductReviewSummaryView summary={summaryQuery.data} />
        ) : (
          <p className="text-sm text-soil-400">Este producto todavía no tiene reseñas.</p>
        )}
      </div>

      {reviews.length > 0 && (
        <div className="space-y-5">
          {reviews.map((r) => (
            <ProductReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}
    </div>
  );
}
