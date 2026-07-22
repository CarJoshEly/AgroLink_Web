// Diccionarios de traducción español para cada enum de lib/types — evita
// hardcodear strings de UI en cada componente que necesite mostrar un
// estado/tipo legible.

import type {
  CartStatus,
  InventoryMovementType,
  NotificationType,
  OrderStatus,
  PaymentProvider,
  ProductStatus,
  ProductUnit,
  ReportStatus,
  ReportTargetType,
  ReviewModerationStatus,
  TransactionStatus,
  UserRole,
  VerificationStatus,
} from "./types";

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrador",
  SELLER: "Vendedor",
  CUSTOMER: "Comprador",
};

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  PENDING: "Pendiente",
  UNDER_REVIEW: "En revisión",
  VERIFIED: "Verificado",
  REJECTED: "Rechazado",
  SUSPENDED: "Suspendido",
};

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  ACTIVE: "Activo",
  OUT_OF_STOCK: "Agotado",
  INACTIVE: "Inactivo",
};

export const PRODUCT_UNIT_LABELS: Record<ProductUnit, string> = {
  UNIT: "Unidad",
  LB: "Libra",
  KG: "Kilogramo",
  QQ: "Quintal",
  BOX: "Caja",
  BAG: "Saco",
  LITER: "Litro",
};

export const CART_STATUS_LABELS: Record<CartStatus, string> = {
  ACTIVE: "Activo",
  CONVERTED: "Convertido en pedido",
  ABANDONED: "Abandonado",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  PREPARING: "En preparación",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

export const REVIEW_MODERATION_STATUS_LABELS: Record<ReviewModerationStatus, string> = {
  APPROVED: "Aprobada",
  PENDING_REVIEW: "Pendiente de moderación",
  REJECTED: "Rechazada",
};

export const REPORT_TARGET_TYPE_LABELS: Record<ReportTargetType, string> = {
  PRODUCT: "Producto",
  SELLER: "Vendedor",
  REVIEW: "Reseña",
  PRODUCT_REVIEW: "Reseña de producto",
  SELLER_REVIEW: "Reseña de vendedor",
};

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  PENDING: "Pendiente",
  REVIEWED: "Revisado",
  RESOLVED: "Resuelto",
  DISMISSED: "Descartado",
};

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  NEW_ORDER: "Nuevo pedido",
  ORDER_ACCEPTED: "Pedido aceptado",
  ORDER_CANCELLED: "Pedido cancelado",
  ORDER_PREPARING: "Pedido en preparación",
  ORDER_DELIVERED: "Pedido entregado",
  SELLER_APPROVED: "Vendedor aprobado",
  SELLER_REJECTED: "Vendedor rechazado",
  SELLER_SUSPENDED: "Vendedor suspendido",
  NEW_REVIEW: "Nueva reseña",
  REPORT_RECEIVED: "Reporte recibido",
  PAYMENT_UPDATE: "Actualización de pago",
};

export const PAYMENT_PROVIDER_LABELS: Record<PaymentProvider, string> = {
  PAYPAL: "PayPal",
  CREDIT_CARD: "Tarjeta de crédito",
  DEBIT_CARD: "Tarjeta de débito",
  OTHER: "Otro",
};

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  PENDING: "Pendiente",
  COMPLETED: "Completada",
  FAILED: "Fallida",
  REFUNDED: "Reembolsada",
};

export const INVENTORY_MOVEMENT_TYPE_LABELS: Record<InventoryMovementType, string> = {
  ENTRY: "Entrada",
  EXIT: "Salida",
  ADJUSTMENT: "Ajuste",
};
