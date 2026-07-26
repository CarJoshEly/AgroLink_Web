import type { ProductReviewSummary } from "@/lib/api/reviews";
import StarRating from "@/components/ui/StarRating";

export default function ProductReviewSummaryView({ summary }: { summary: ProductReviewSummary }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-display text-2xl text-forest-800">{summary.averageRating?.toFixed(1) ?? "—"}</span>
      <StarRating value={Math.round(summary.averageRating ?? 0)} readOnly />
      <span className="text-xs text-soil-400">
        {summary.totalReviews} {summary.totalReviews === 1 ? "reseña" : "reseñas"}
      </span>
    </div>
  );
}
