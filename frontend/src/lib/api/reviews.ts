import { apiFetch, apiFetchPaginated, type PaginationMeta } from "./client";
import type { ProductReview, SellerReview } from "@/lib/types";

/** Shape real de reviews.service.ts#getProductSummary (producto usa `rating` simple, no 5 scores). */
export interface ProductReviewSummary {
  productId: string;
  averageRating: number | null;
  totalReviews: number;
}

/** Shape real de reviews.service.ts#getSellerSummary. */
export interface SellerReviewSummary {
  sellerId: string;
  averageQuality: number | null;
  averageResponseTime: number | null;
  averageCompliance: number | null;
  averageAttention: number | null;
  averageTrust: number | null;
  averageOverall: number | null;
  totalReviews: number;
}

export async function fetchProductReviews(
  productId: string,
  page = 1,
  limit = 10
): Promise<{ reviews: ProductReview[]; meta: PaginationMeta | undefined }> {
  const { data, meta } = await apiFetchPaginated<ProductReview[]>(
    `/reviews/products?productId=${productId}&page=${page}&limit=${limit}`
  );
  return { reviews: data, meta };
}

export async function fetchProductReviewSummary(productId: string): Promise<ProductReviewSummary> {
  return apiFetch<ProductReviewSummary>(`/reviews/products/${productId}/summary`);
}

export async function fetchSellerReviews(
  sellerId: string,
  page = 1,
  limit = 10
): Promise<{ reviews: SellerReview[]; meta: PaginationMeta | undefined }> {
  const { data, meta } = await apiFetchPaginated<SellerReview[]>(
    `/reviews/sellers?sellerId=${sellerId}&page=${page}&limit=${limit}`
  );
  return { reviews: data, meta };
}

export async function fetchSellerReviewSummary(sellerId: string): Promise<SellerReviewSummary> {
  return apiFetch<SellerReviewSummary>(`/reviews/sellers/${sellerId}/summary`);
}
