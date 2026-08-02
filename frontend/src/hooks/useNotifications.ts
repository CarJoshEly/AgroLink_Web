"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as notificationsApi from "@/lib/api/notifications";
import { useAuth } from "@/hooks/useAuth";
import type { NotificationFilters } from "@/lib/api/notifications";

/**
 * Contador de no leídas para la campana del navbar. Se refresca al
 * reenfocar la pestaña (comportamiento por defecto de React Query) y además
 * cada 60s mientras la pestaña está activa.
 */
export function useUnreadNotificationsCount() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: notificationsApi.fetchUnreadCount,
    enabled: Boolean(user),
    refetchInterval: 60_000,
  });
}

export function useNotifications(filters: NotificationFilters = {}) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["notifications", "list", filters],
    queryFn: () => notificationsApi.fetchNotifications(filters),
    enabled: Boolean(user),
  });
}

function useInvalidateNotifications() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["notifications"] });
}

export function useMarkNotificationAsRead() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markNotificationAsRead(id),
    onSuccess: invalidate,
  });
}

export function useMarkAllNotificationsAsRead() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: () => notificationsApi.markAllNotificationsAsRead(),
    onSuccess: invalidate,
  });
}

export function useDeleteNotification() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.deleteNotification(id),
    onSuccess: invalidate,
  });
}
