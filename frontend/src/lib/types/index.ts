// Tipos centrales de AgroLink, derivados de los Requerimientos Funcionales (RF)
// del documento "Fase 1 — Análisis y Diseño".
// Cuando el backend (NestJS + Prisma) esté disponible, estos tipos deben
// mantenerse en sincronía con el schema.prisma real (Fase 2).

export type UserRole = "COMPRADOR" | "VENDEDOR" | "ADMIN";

// RF-05: estados de verificación del vendedor
export type VerificationStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "REJECTED"
  | "SUSPENDED";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;

  // --- Perfil extendido / verificación (OPCIONAL para cualquier usuario) ---
  // Importante: ningún dato de esta sección es obligatorio en el registro.
  // Un usuario (comprador o vendedor) puede operar en la plataforma sin
  // completar nada de esto. Si decide completarlo, obtiene `hasVerifiedBadge: true`
  // una vez que el administrador aprueba la revisión.
  identityDocumentNumber?: string; // número de identidad (opcional)
  identityDocumentFrontUrl?: string; // foto DNI frontal (opcional)
  identityDocumentBackUrl?: string; // foto DNI posterior (opcional)
  livenessCheckUrl?: string; // "prueba de vida" (opcional)
  profileCompletionStatus?: VerificationStatus; // solo aplica si decidió completar el perfil
  hasVerifiedBadge: boolean; // insignia de verificación (derivada, no editable directamente)
}

export interface Seller extends User {
  role: "VENDEDOR";
  businessName: string;
  description?: string;
  locationLat?: number;
  locationLng?: number;
  department?: string;
  reputationAverage?: number; // promedio de reviews
  reputationCount?: number;
}

export type ProductStatus = "ACTIVE" | "OUT_OF_STOCK" | "INACTIVE";

export interface ProductImage {
  id: string;
  url: string;
  isCover: boolean;
}

// RF-08: nombre, descripción, categoría, precio, unidad de medida, stock, imágenes, estado
export interface Product {
  id: string;
  sellerId: string;
  seller?: Pick<Seller, "id" | "businessName" | "hasVerifiedBadge" | "reputationAverage">;
  name: string;
  description: string;
  category: string;
  price: number; // Lempiras (L.)
  unit: "qq" | "lb" | "kg" | "unidad" | "caja";
  stock: number;
  status: ProductStatus;
  images: ProductImage[]; // al menos permite 1 imagen de portada
  department?: string;
  createdAt: string;
}

// RF-18 / RF-19 / RF-20: reviews solo de compras completadas, calificación
// multidimensional y moderación
export type ReviewModerationStatus = "APPROVED" | "PENDING_REVIEW" | "REJECTED";

export interface Review {
  id: string;
  productId: string;
  sellerId: string;
  buyerId: string;
  buyerName: string;
  orderId: string; // referencia al pedido DELIVERED que habilita la reseña
  ratingQuality: number; // calidad del producto (1-5)
  ratingResponseTime: number; // tiempo de respuesta (1-5)
  ratingFulfillment: number; // cumplimiento (1-5)
  ratingService: number; // atención (1-5)
  ratingTrust: number; // confianza (1-5)
  comment: string;
  status: ReviewModerationStatus;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export type PurchaseRequestStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "DELIVERED"
  | "CANCELLED";
