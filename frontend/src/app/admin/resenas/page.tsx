"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Check, X } from "lucide-react";
import Tabs from "@/components/ui/Tabs";
import {
  fetchPendingProductReviews,
  fetchPendingSellerReviews,
  moderateProductReview,
  moderateSellerReview,
} from "@/lib/api/reviews";
import StarRating from "@/components/ui/StarRating";
import type { ProductReview, SellerReview } from "@/lib/types";

function formatDate(dateIso: string) {
  return new Date(dateIso).toLocaleDateString("es-HN", { day: "numeric", month: "short", year: "numeric" });
}

function ModerationActions({ onApprove, onReject, pending }: { onApprove: () => void; onReject: () => void; pending: boolean }) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <button
        type="button"
        onClick={onApprove}
        disabled={pending}
        aria-label="Aprobar"
        className="p-1.5 rounded-stamp border border-forest-200 text-forest-700 hover:bg-forest-50 disabled:opacity-50"
      >
        <Check className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onReject}
        disabled={pending}
        aria-label="Rechazar"
        className="p-1.5 rounded-stamp border border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-50"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function PendingProductReviews() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-pending-product-reviews"],
    queryFn: () => fetchPendingProductReviews(1, 20),
  });

  const moderate = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "APPROVED" | "REJECTED" }) =>
      moderateProductReview(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-pending-product-reviews"] }),
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
    return <p className="text-sm text-soil-400 py-10 text-center">No hay reseñas de producto pendientes.</p>;
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div key={review.id} className="flex items-start justify-between gap-4 border border-forest-100 rounded-stamp p-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-forest-800">{review.buyer?.name ?? "Comprador"}</span>
              <span className="text-xs text-soil-400">{formatDate(review.createdAt)}</span>
            </div>
            <StarRating value={review.rating} readOnly size={14} />
            {review.comment && <p className="text-sm text-forest-700 mt-1.5">{review.comment}</p>}
          </div>
          <ModerationActions
            pending={moderate.isPending}
            onApprove={() => moderate.mutate({ id: review.id, status: "APPROVED" })}
            onReject={() => moderate.mutate({ id: review.id, status: "REJECTED" })}
          />
        </div>
      ))}
    </div>
  );
}

function PendingSellerReviews() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-pending-seller-reviews"],
    queryFn: () => fetchPendingSellerReviews(1, 20),
  });

  const moderate = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "APPROVED" | "REJECTED" }) =>
      moderateSellerReview(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-pending-seller-reviews"] }),
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
    return <p className="text-sm text-soil-400 py-10 text-center">No hay reseñas de vendedor pendientes.</p>;
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
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-forest-800">{review.buyer?.name ?? "Comprador"}</span>
                <span className="text-xs text-soil-400">{formatDate(review.createdAt)}</span>
              </div>
              <p className="text-sm text-forest-700 font-medium">{overall.toFixed(1)} / 5</p>
              {review.comment && <p className="text-sm text-forest-700 mt-1.5">{review.comment}</p>}
            </div>
            <ModerationActions
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
      <p className="text-sm text-soil-500 mb-6">Cola de moderación de reseñas de producto y de vendedor.</p>

      <Tabs
        tabs={[
          { id: "product", label: "Producto", content: <PendingProductReviews /> },
          { id: "seller", label: "Vendedor", content: <PendingSellerReviews /> },
        ]}
      />
    </div>
  );
}
