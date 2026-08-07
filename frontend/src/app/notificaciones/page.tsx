"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import type { Notification, NotificationType } from "@/lib/types";
import { NOTIFICATION_TYPE_LABELS } from "@/lib/labels";
import { NOTIFICATION_ICONS } from "@/components/layout/NotificationBell";
import { getNotificationHref } from "@/lib/notifications/getNotificationHref";
import { useAuth } from "@/hooks/useAuth";
import {
  useNotifications,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useDeleteNotification,
} from "@/hooks/useNotifications";

const FILTERS: { label: string; value: "all" | "unread" | "read" }[] = [
  { label: "Todas", value: "all" },
  { label: "No leídas", value: "unread" },
  { label: "Leídas", value: "read" },
];

function formatDate(dateIso: string) {
  return new Date(dateIso).toLocaleString("es-HN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function NotificacionesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [page, setPage] = useState(1);
  const isRead = filter === "all" ? undefined : filter === "read";

  const { data, isLoading } = useNotifications({ page, limit: 15, isRead });
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotification = useDeleteNotification();

  const notifications = data?.notifications ?? [];
  const meta = data?.meta;

  function handleClick(n: Notification) {
    if (!n.isRead) markAsRead.mutate(n.id);
    const href = getNotificationHref(n, user?.role);
    if (href) router.push(href);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-forest-900">Notificaciones</h1>
        <button
          type="button"
          onClick={() => markAllAsRead.mutate()}
          className="text-sm text-forest-600 hover:text-forest-800"
        >
          Marcar todas como leídas
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => {
              setFilter(f.value);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-stamp text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-forest-700 text-stone-25"
                : "bg-forest-50 text-forest-700 hover:bg-forest-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-soil-400">Cargando notificaciones…</p>
      ) : notifications.length === 0 ? (
        <p className="text-sm text-soil-400">No hay notificaciones para mostrar.</p>
      ) : (
        <div className="border border-forest-100 rounded-stamp divide-y divide-forest-50 overflow-hidden">
          {notifications.map((n) => {
            const Icon = NOTIFICATION_ICONS[n.type as NotificationType] ?? null;
            return (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-4 py-4 ${n.isRead ? "bg-white" : "bg-forest-50"}`}
              >
                {Icon && <Icon className="w-5 h-5 mt-0.5 text-forest-600 shrink-0" />}
                <button type="button" onClick={() => handleClick(n)} className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-forest-800 text-sm">{n.title}</p>
                    <span className="text-[11px] text-soil-400 uppercase tracking-wide">
                      {NOTIFICATION_TYPE_LABELS[n.type as NotificationType]}
                    </span>
                  </div>
                  <p className="text-sm text-forest-700 mt-1">{n.message}</p>
                  <p className="text-xs text-soil-400 mt-1.5">{formatDate(n.createdAt)}</p>
                </button>
                <button
                  type="button"
                  onClick={() => deleteNotification.mutate(n.id)}
                  aria-label="Eliminar notificación"
                  className="text-soil-300 hover:text-red-500 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6 text-sm">
          <button
            type="button"
            disabled={!meta.hasPreviousPage}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 rounded-stamp border border-forest-100 disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-soil-500">
            Página {meta.page} de {meta.totalPages}
          </span>
          <button
            type="button"
            disabled={!meta.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-stamp border border-forest-100 disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
