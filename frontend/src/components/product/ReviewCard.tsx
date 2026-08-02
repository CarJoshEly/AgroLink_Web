import type { ProductReview, SellerReview } from "@/lib/types";
import StarRating from "@/components/ui/StarRating";
import ReportButton from "@/components/reports/ReportButton";

function formatDate(dateIso: string) {
  return new Date(dateIso).toLocaleDateString("es-HN", { day: "numeric", month: "short", year: "numeric" });
}

/** Reseña de producto: la API solo maneja un `rating` (1-5) simple, no el modelo de 5 puntajes. */
export function ProductReviewCard({ review }: { review: ProductReview }) {
  return (
    <div className="border-b border-forest-100 pb-5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-medium text-forest-800 text-sm">{review.buyer?.name ?? "Comprador"}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-soil-400">{formatDate(review.createdAt)}</span>
          <ReportButton targetType="PRODUCT_REVIEW" targetId={review.id} size={14} />
        </div>
      </div>
      <StarRating value={review.rating} readOnly size={15} />
      {review.comment && <p className="text-sm text-forest-700 mt-2 leading-relaxed">{review.comment}</p>}
    </div>
  );
}

/** Reseña de vendedor: sí usa el modelo de 5 puntajes (quality/responseTime/compliance/attention/trust). */
export function SellerReviewCard({ review }: { review: SellerReview }) {
  const overall =
    (review.qualityScore +
      review.responseTimeScore +
      review.complianceScore +
      review.attentionScore +
      review.trustScore) /
    5;

  return (
    <div className="border-b border-forest-100 pb-5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-medium text-forest-800 text-sm">{review.buyer?.name ?? "Comprador"}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-soil-400">{formatDate(review.createdAt)}</span>
          <ReportButton targetType="SELLER_REVIEW" targetId={review.id} size={14} />
        </div>
      </div>
      <p className="text-sm text-forest-700 font-medium">{overall.toFixed(1)} / 5</p>
      {review.comment && <p className="text-sm text-forest-700 mt-2 leading-relaxed">{review.comment}</p>}

      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-soil-500">
        <span>Calidad: {review.qualityScore}/5</span>
        <span>Respuesta: {review.responseTimeScore}/5</span>
        <span>Cumplimiento: {review.complianceScore}/5</span>
        <span>Atención: {review.attentionScore}/5</span>
        <span>Confianza: {review.trustScore}/5</span>
      </div>
    </div>
  );
}
