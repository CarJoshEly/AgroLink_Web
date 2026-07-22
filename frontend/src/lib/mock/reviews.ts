// Tipo local del catálogo mock — ver nota en lib/mock/products.ts.

export interface MockReview {
  id: string;
  productId: string;
  sellerId: string;
  buyerId: string;
  buyerName: string;
  orderId: string;
  ratingQuality: number;
  ratingResponseTime: number;
  ratingFulfillment: number;
  ratingService: number;
  ratingTrust: number;
  comment: string;
  status: "APPROVED" | "PENDING_REVIEW" | "REJECTED";
  createdAt: string;
}

export const mockReviews: MockReview[] = [
  {
    id: "r1",
    productId: "p1",
    sellerId: "s1",
    buyerId: "b1",
    buyerName: "Carlos M.",
    orderId: "o1",
    ratingQuality: 5,
    ratingResponseTime: 4,
    ratingFulfillment: 5,
    ratingService: 5,
    ratingTrust: 5,
    comment: "Excelente calidad de café, tal como se describía. El vendedor respondió rápido.",
    status: "APPROVED",
    createdAt: "2026-07-05",
  },
  {
    id: "r2",
    productId: "p1",
    sellerId: "s1",
    buyerId: "b2",
    buyerName: "Ana R.",
    orderId: "o2",
    ratingQuality: 4,
    ratingResponseTime: 5,
    ratingFulfillment: 4,
    ratingService: 4,
    ratingTrust: 5,
    comment: "Buen producto, la entrega se coordinó sin problema.",
    status: "APPROVED",
    createdAt: "2026-07-12",
  },
];

export function getReviewsByProductId(productId: string): MockReview[] {
  return mockReviews.filter(
    (r) => r.productId === productId && r.status === "APPROVED"
  );
}
