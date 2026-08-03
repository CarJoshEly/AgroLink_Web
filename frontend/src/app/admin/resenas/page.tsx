"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Check, X } from "lucide-react";
import Tabs from "@/components/ui/Tabs";
import {
  fetchProductReviewsForAdmin,
  fetchSellerReviewsForAdmin,
  moderateProductReview,
  moderateSellerReview,
} from "@/lib/api/reviews";
import StarRating from "@/components/ui/StarRating";
import type { ProductReview, SellerReview } from "@/lib/types";

function formatDate(dateIso: string) {
  return new Date(dateIso).toLocaleDateString("es-HN", { day: "numeric", month: "short", year: "numeric" });
}

const STATUS_STYLES: Record<string, string> = {
  APPROVED: "bg-forest-100 text-forest-700",
  REJECTED: "bg-red-50 text-red-700",
  PENDING_REVIEW: "bg-maize-50 text-maize-700",
};

const STATUS_LABELS: Record<string, string> = {
  APPROVED: "Publicada",
  REJECTED: "Retirada",
  PENDING_REVIEW: "Pendiente",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-stamp ${STATUS_STYLES[status] ?? ""}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function ModerationActions({
  status,
  onApprove,
  onReject,
  pending,
}: {
  status: string;
  onApprove: () => void;
  onReject: () => void;
  pending: boolean;
}) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      {status !== "APPROVED" && (
        <button
          type="button"
          onClick={onApprove}
          disabled={pending}
          aria-label="Restaurar"
          title="Restaurar (publicar de nuevo)"
          className="p-1.5 rounded-stamp border border-forest-200 text-forest-700 hover:bg-forest-50 disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
        </button>
      )}
      {status !== "REJECTED" && (
        <button
          type="button"
          onClick={onReject}
          disabled={pending}
          aria-label="Retirar"
          title="Retirar (ocultar del producto/vendedor)"
          className="p-1.5 rounded-stamp border border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function AllProductReviews() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-product-reviews"],
    queryFn: () => fetchProductReviewsForAdmin(1, 20),
  });

  const moderate = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "APPROVED" | "REJECTED" }) =>
      moderateProductReview(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-product-reviews"] }),
  });

  const reviews: ProductReview[] = data?.reviews ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-14">
        <Loader2 className="w-6 h-6 text-forest-500 animate-spin" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return <p className="text-sm text-soil-400 py-10 text-center">Todavía no hay reseñas de producto.</p>;
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div key={review.id} className="flex items-start justify-between gap-4 border border-forest-100 rounded-stamp p-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-sm font-medium text-forest-800">{review.buyer?.name ?? "Comprador"}</span>
              <span className="text-xs text-soil-400">
                sobre {review.product?.name ?? "un producto"} · {formatDate(review.createdAt)}
              </span>
              <StatusBadge status={review.moderationStatus} />
            </div>
            <StarRating value={review.rating} readOnly size={14} />
            {review.comment && <p className="text-sm text-forest-700 mt-1.5">{review.comment}</p>}
          </div>
          <ModerationActions
            status={review.moderationStatus}
            pending={moderate.isPending}
            onApprove={() => moderate.mutate({ id: review.id, status: "APPROVED" })}
            onReject={() => moderate.mutate({ id: review.id, status: "REJECTED" })}
          />
        </div>
      ))}
    </div>
  );
}

function AllSellerReviews() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-seller-reviews"],
    queryFn: () => fetchSellerReviewsForAdmin(1, 20),
  });

  const moderate = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "APPROVED" | "REJECTED" }) =>
      moderateSellerReview(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-seller-reviews"] }),
  });

  const reviews: SellerReview[] = data?.reviews ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-14">
        <Loader2 className="w-6 h-6 text-forest-500 animate-spin" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return <p className="text-sm text-soil-400 py-10 text-center">Todavía no hay reseñas de vendedor.</p>;
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => {
        const overall =
          (review.qualityScore +
            review.responseTimeScore +
            review.complianceScore +
            review.attentionScore +
            review.trustScore) /
          5;
        return (
          <div key={review.id} className="flex items-start justify-between gap-4 border border-forest-100 rounded-stamp p-4">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-sm font-medium text-forest-800">{review.buyer?.name ?? "Comprador"}</span>
                <span className="text-xs text-soil-400">
                  sobre {review.seller?.businessName ?? "un vendedor"} · {formatDate(review.createdAt)}
                </span>
                <StatusBadge status={review.moderationStatus} />
              </div>
              <p className="text-sm text-forest-700 font-medium">{overall.toFixed(1)} / 5</p>
              {review.comment && <p className="text-sm text-forest-700 mt-1.5">{review.comment}</p>}
            </div>
            <ModerationActions
              status={review.moderationStatus}
              pending={moderate.isPending}
              onApprove={() => moderate.mutate({ id: review.id, status: "APPROVED" })}
              onReject={() => moderate.mutate({ id: review.id, status: "REJECTED" })}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function AdminResenasPage() {
  return (
    <div>
      <h1 className="font-display text-2xl text-forest-900 mb-1">Reseñas</h1>
      <p className="text-sm text-soil-500 mb-6">
        Las reseñas se publican automáticamente al enviarse. Desde aquí puedes retirar una que incumpla las
        normas, o restaurarla.
      </p>

      <Tabs
        tabs={[
          { id: "product", label: "Producto", content: <AllProductReviews /> },
          { id: "seller", label: "Vendedor", content: <AllSellerReviews /> },
        ]}
      />
    </div>
  );
}
