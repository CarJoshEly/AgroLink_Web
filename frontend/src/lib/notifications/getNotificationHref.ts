import type { Notification, UserRole } from "@/lib/types";

/**
 * A dónde navegar al hacer clic en una notificación — mismo criterio que
 * `_navigateToTarget` en AgroLink_MOVIL (`notifications_screen.dart`), para
 * que el comportamiento sea idéntico en ambas plataformas. `null` cuando la
 * notificación no tiene destino navegable (p. ej. SELLER_APPROVED) — en ese
 * caso tocarla solo debe marcarla como leída.
 *
 * `REPORT` es el único caso sin `/lib/types` 1:1 con la entidad reportada:
 * un reporte sobre una reseña no tiene página propia a la que saltar, así
 * que siempre lleva al panel de moderación de reportes, no al `targetId`.
 */
export function getNotificationHref(
  notification: Pick<Notification, "targetType" | "targetId">,
  currentUserRole: UserRole | undefined
): string | null {
  const { targetType, targetId } = notification;
  if (!targetType || !targetId) return null;

  switch (targetType) {
    case "ORDER":
      if (currentUserRole === "SELLER") return `/vendedor/pedidos/${targetId}`;
      if (currentUserRole === "CUSTOMER") return `/pedidos/${targetId}`;
      return null;
    case "PRODUCT":
      return `/productos/${targetId}`;
    case "SELLER":
      return `/vendedores/${targetId}`;
    case "REPORT":
      return `/admin/reportes`;
  }
}
