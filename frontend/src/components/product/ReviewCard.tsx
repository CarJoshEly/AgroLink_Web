import type { Review } from "@/lib/api/reviews";
import StarRating from "@/components/ui/StarRating";

export default function ReviewCard({ review }: { review: Review }) {
  const overall =
    (review.ratingQuality +
      review.ratingResponseTime +
      review.ratingFulfillment +
      review.ratingService +
      review.ratingTrust) /
    5;

  return (
    <div className="border-b border-forest-100 pb-5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-medium text-forest-800 text-sm">{review.buyerName}</span>
        <span className="text-xs text-soil-400">
          {new Date(review.createdAt).toLocaleDateString("es-HN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
      <StarRating value={Math.round(overall)} readOnly size={15} />
      <p className="text-sm text-forest-700 mt-2 leading-relaxed">{review.comment}</p>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-soil-500">
        <span>Calidad: {review.ratingQuality}/5</span>
        <span>Respuesta: {review.ratingResponseTime}/5</span>
        <span>Cumplimiento: {review.ratingFulfillment}/5</span>
        <span>Atención: {review.ratingService}/5</span>
        <span>Confianza: {review.ratingTrust}/5</span>
      </div>
    </div>
  );
}
