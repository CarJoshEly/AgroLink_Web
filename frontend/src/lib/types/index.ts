// Tipos centrales de AgroLink, calcados 1:1 del schema.prisma real de la API
// (API REST/prisma/schema.prisma). Mantener en sincronía con ese archivo.
//
// Nota sobre campos numéricos: los campos `Decimal` de Prisma (price,
// totalAmount, unitPrice, subtotal, amount, commissionAmount,
// commissionPercentage, latitude, longitude) se serializan como `string` en
// JSON (comportamiento por defecto de decimal.js — la API no los convierte a
// number). Hay que usar `Number(...)` antes de operar con ellos.
//
// Este archivo NO es usado por el catálogo mock (lib/mock/, componentes de
// producto/reseñas): ese catálogo tiene sus propios tipos locales hasta que
// se reconecte a la API real.

// --------------------------------------------------------------------------
// ENUMS
// --------------------------------------------------------------------------

export type UserRole = "ADMIN" | "SELLER" | "CUSTOMER";

export type VerificationStatus = "PENDING" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED" | "SUSPENDED";

export type ProductStatus = "ACTIVE" | "OUT_OF_STOCK" | "INACTIVE";

export type ProductUnit = "UNIT" | "LB" | "KG" | "QQ" | "BOX" | "BAG" | "LITER";

export type CartStatus = "ACTIVE" | "CONVERTED" | "ABANDONED";

export type OrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "DELIVERED" | "CANCELLED";

export type ReviewModerationStatus = "APPROVED" | "PENDING_REVIEW" | "REJECTED";

export type ReportTargetType = "PRODUCT" | "SELLER" | "REVIEW" | "PRODUCT_REVIEW" | "SELLER_REVIEW";

export type ReportStatus = "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";

export type NotificationType =
  | "NEW_ORDER"
  | "ORDER_ACCEPTED"
  | "ORDER_CANCELLED"
  | "ORDER_PREPARING"
  | "ORDER_DELIVERED"
  | "SELLER_APPROVED"
  | "SELLER_REJECTED"
  | "SELLER_SUSPENDED"
  | "NEW_REVIEW"
  | "REPORT_RECEIVED"
  | "PAYMENT_UPDATE";

export type PaymentProvider = "PAYPAL" | "CREDIT_CARD" | "DEBIT_CARD" | "OTHER";

export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export type InventoryMovementType = "ENTRY" | "EXIT" | "ADJUSTMENT";

// --------------------------------------------------------------------------
// CATÁLOGOS GEOGRÁFICOS
// --------------------------------------------------------------------------

export interface Department {
  id: string;
  name: string;
  code: string;
  createdAt: string;
}

export interface Municipality {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  department?: Department;
  createdAt: string;
}

export interface Location {
  id: string;
  userId: string;
  departmentId: string;
  department?: Department;
  municipalityId: string;
  municipality?: Municipality;
  address: string;
  latitude: string;
  longitude: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

// --------------------------------------------------------------------------
// USUARIOS E IDENTIDAD
// --------------------------------------------------------------------------

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  emailVerifiedAt: string | null;

  sellerProfile?: SellerProfile;
  locations?: Location[];
}

export interface SellerProfile {
  id: string;
  userId: string;
  user?: User;
  businessName: string;
  dni: string;
  verificationStatus: VerificationStatus;
  verifiedAt: string | null;
  verifiedBy: string | null;
  suspendedReason: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  identityVerification?: IdentityVerification;
}

export interface IdentityVerification {
  id: string;
  sellerProfileId: string;
  dniFrontUrl: string;
  dniBackUrl: string;
  selfieUrl: string;
  lifeProofUrl: string;
  status: VerificationStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  notes: string | null;
  createdAt: string;
}

// --------------------------------------------------------------------------
// CATÁLOGO Y PRODUCTOS
// --------------------------------------------------------------------------

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  parent?: Category;
  children?: Category[];
  isActive: boolean;
}

/** Lo único que el backend expone públicamente del vendedor dentro de un producto (PUBLIC_SELLER_SELECT). */
export type PublicSeller = Pick<SellerProfile, "id" | "businessName" | "verificationStatus">;

export interface Product {
  id: string;
  sellerId: string;
  seller?: PublicSeller;
  categoryId: string;
  category?: Category;
  name: string;
  description: string;
  price: string;
  unit: ProductUnit;
  stock: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  order: number;
  createdAt: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  type: InventoryMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string | null;
  createdBy: string;
  createdAt: string;
}

// --------------------------------------------------------------------------
// CARRITO Y FAVORITOS
// --------------------------------------------------------------------------

export interface Cart {
  id: string;
  userId: string;
  status: CartStatus;
  createdAt: string;
  updatedAt: string;
  items?: CartItem[];
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product?: Product;
  quantity: number;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  productId: string | null;
  product?: Product;
  sellerId: string | null;
  seller?: SellerProfile;
  createdAt: string;
}

// --------------------------------------------------------------------------
// PEDIDOS
// --------------------------------------------------------------------------

export interface Order {
  id: string;
  buyerId: string;
  buyer?: User;
  sellerId: string;
  seller?: SellerProfile;
  status: OrderStatus;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;

  items?: OrderItem[];
  statusHistory?: OrderStatusHistory[];
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  changedBy: string;
  note: string | null;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: string;
  subtotal: string;
}

// --------------------------------------------------------------------------
// REVIEWS Y REPUTACIÓN
// --------------------------------------------------------------------------

export interface ProductReview {
  id: string;
  orderId: string;
  orderItemId: string;
  productId: string;
  buyerId: string;
  buyer?: User;
  rating: number;
  comment: string | null;
  moderationStatus: ReviewModerationStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface SellerReview {
  id: string;
  orderId: string;
  sellerId: string;
  buyerId: string;
  buyer?: User;
  qualityScore: number;
  responseTimeScore: number;
  complianceScore: number;
  attentionScore: number;
  trustScore: number;
  comment: string | null;
  moderationStatus: ReviewModerationStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// --------------------------------------------------------------------------
// REPORTES
// --------------------------------------------------------------------------

export interface Report {
  id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
  resolvedAt: string | null;
  resolvedBy: string | null;
}

// --------------------------------------------------------------------------
// NOTIFICACIONES
// --------------------------------------------------------------------------

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// --------------------------------------------------------------------------
// PAGOS
// --------------------------------------------------------------------------

export interface PaymentMethod {
  id: string;
  name: string;
  provider: PaymentProvider;
  isActive: boolean;
  config: Record<string, unknown> | null;
  createdAt: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  paymentMethodId: string;
  amount: string;
  commissionAmount: string;
  commissionPercentage: string;
  status: TransactionStatus;
  externalReference: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface CommissionConfig {
  id: string;
  percentage: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  isActive: boolean;
  createdBy: string;
}
