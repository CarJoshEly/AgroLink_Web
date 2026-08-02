import { apiFetch, apiFetchPaginated, type PaginationMeta } from "./client";
import type { Notification, NotificationType } from "@/lib/types";

export interface NotificationFilters {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: NotificationType;
}

function buildQuery(filters: NotificationFilters): string {
  const params = new URLSearchParams();
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 10));
  if (filters.isRead !== undefined) params.set("isRead", String(filters.isRead));
  if (filters.type) params.set("type", filters.type);
  return params.toString();
}

/** GET /notifications — mi centro de notificaciones, paginado. */
export async function fetchNotifications(
  filters: NotificationFilters = {}
): Promise<{ notifications: Notification[]; meta: PaginationMeta | undefined }> {
  const { data, meta } = await apiFetchPaginated<Notification[]>(`/notifications?${buildQuery(filters)}`);
  return { notifications: data, meta };
}

/** GET /notifications/unread-count — para el contador de la campana. */
export async function fetchUnreadCount(): Promise<{ count: number }> {
  return apiFetch<{ count: number }>("/notifications/unread-count");
}

/** PATCH /notifications/:id/read */
export async function markNotificationAsRead(id: string): Promise<Notification> {
  return apiFetch<Notification>(`/notifications/${id}/read`, { method: "PATCH" });
}

/** PATCH /notifications/read-all */
export async function markAllNotificationsAsRead(): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/notifications/read-all", { method: "PATCH" });
}

/** DELETE /notifications/:id */
export async function deleteNotification(id: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/notifications/${id}`, { method: "DELETE" });
}
