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

// --------------------------------------------------------------------------
// Escritura de reseñas
//
// OJO: producto y vendedor NO comparten forma. La reseña de producto usa un
// solo `rating` (1-5) ligado a un `orderItemId` puntual; la de vendedor usa
// las 5 dimensiones (quality/responseTime/compliance/attention/trust)
// ligadas al `orderId` completo. El backend no tiene ventana de tiempo
// límite para editar/eliminar — solo valida que la reseña sea del usuario
// autenticado.
// --------------------------------------------------------------------------

export interface CreateProductReviewInput {
  orderItemId: string;
  rating: number;
  comment?: string;
}

export interface UpdateProductReviewInput {
  rating?: number;
  comment?: string;
}

export async function createProductReview(input: CreateProductReviewInput): Promise<ProductReview> {
  return apiFetch<ProductReview>("/reviews/products", { method: "POST", body: JSON.stringify(input) });
}

export async function updateProductReview(
  id: string,
  input: UpdateProductReviewInput
): Promise<ProductReview> {
  return apiFetch<ProductReview>(`/reviews/products/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}

export async function deleteProductReview(id: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/reviews/products/${id}`, { method: "DELETE" });
}

export interface CreateSellerReviewInput {
  orderId: string;
  qualityScore: number;
  responseTimeScore: number;
  complianceScore: number;
  attentionScore: number;
  trustScore: number;
  comment?: string;
}

export type UpdateSellerReviewInput = Partial<Omit<CreateSellerReviewInput, "orderId">>;

export async function createSellerReview(input: CreateSellerReviewInput): Promise<SellerReview> {
  return apiFetch<SellerReview>("/reviews/sellers", { method: "POST", body: JSON.stringify(input) });
}

export async function updateSellerReview(id: string, input: UpdateSellerReviewInput): Promise<SellerReview> {
  return apiFetch<SellerReview>(`/reviews/sellers/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}

export async function deleteSellerReview(id: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/reviews/sellers/${id}`, { method: "DELETE" });
}
