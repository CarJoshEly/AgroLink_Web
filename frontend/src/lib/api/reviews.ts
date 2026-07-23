import type { MockReview } from "@/lib/mock/reviews";
import { getReviewsByProductId as getMockReviewsByProductId } from "@/lib/mock/reviews";
// import { apiFetch } from "./client";

// Ver nota en lib/api/products.ts: el catálogo mock está aislado de
// `@/lib/types` hasta reconectarse a la API real.
export type Review = MockReview;

export async function fetchReviewsByProduct(productId: string): Promise<Review[]> {
  // --- MOCK (activo hoy) ---
  return Promise.resolve(getMockReviewsByProductId(productId));

  // --- API REAL ---
  // return apiFetch<Review[]>(`/api/products/${productId}/reviews`);
}

export interface NewReviewInput {
  productId: string;
  orderId: string;
  ratingQuality: number;
  ratingResponseTime: number;
  ratingFulfillment: number;
  ratingService: number;
  ratingTrust: number;
  comment: string;
}

export async function submitReview(input: NewReviewInput): Promise<{ ok: true }> {
  // --- MOCK (activo hoy) ---
  console.info("[mock] Reseña enviada, quedará en PENDING_REVIEW:", input);
  return Promise.resolve({ ok: true });

  // --- API REAL ---
  // RF-18/RF-20: el backend valida que el pedido esté DELIVERED y crea la
  // reseña con status PENDING_REVIEW hasta ser moderada.
  // return apiFetch<{ ok: true }>("/api/reviews", {
  //   method: "POST",
  //   body: JSON.stringify(input),
  // });
}
