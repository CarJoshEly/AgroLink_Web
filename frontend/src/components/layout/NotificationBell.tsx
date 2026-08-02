"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  BadgeCheck,
  ShieldAlert,
  ShieldX,
  Star,
  Flag,
  CreditCard,
  Trash2,
} from "lucide-react";
import type { Notification, NotificationType } from "@/lib/types";
import { NOTIFICATION_TYPE_LABELS } from "@/lib/labels";
import {
  useUnreadNotificationsCount,
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from "@/hooks/useNotifications";

/** Ícono representativo por tipo de notificación, cubriendo los 11 valores reales. */
const NOTIFICATION_ICONS: Record<NotificationType, typeof Bell> = {
  NEW_ORDER: ShoppingBag,
  ORDER_ACCEPTED: CheckCircle2,
  ORDER_CANCELLED: XCircle,
  ORDER_PREPARING: Clock,
  ORDER_DELIVERED: Truck,
  SELLER_APPROVED: BadgeCheck,
  SELLER_REJECTED: ShieldX,
  SELLER_SUSPENDED: ShieldAlert,
  NEW_REVIEW: Star,
  REPORT_RECEIVED: Flag,
  PAYMENT_UPDATE: CreditCard,
};

function timeAgo(dateIso: string): string {
  const diffMs = Date.now() - new Date(dateIso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "ahora";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `hace ${days} d`;
}

function NotificationRow({ notification }: { notification: Notification }) {
  const markAsRead = useMarkNotificationAsRead();
  const deleteNotification = useDeleteNotification();
  const Icon = NOTIFICATION_ICONS[notification.type] ?? Bell;

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 text-sm ${
        notification.isRead ? "bg-white" : "bg-forest-50"
      }`}
    >
      <Icon className="w-4 h-4 mt-0.5 text-forest-600 shrink-0" />
      <button
        type="button"
        onClick={() => !notification.isRead && markAsRead.mutate(notification.id)}
        className="flex-1 text-left"
      >
        <p className="font-medium text-forest-800">{notification.title}</p>
        <p className="text-soil-500 text-xs mt-0.5">{notification.message}</p>
        <p className="text-soil-400 text-[11px] mt-1">{timeAgo(notification.createdAt)}</p>
      </button>
      <button
        type="button"
        onClick={() => deleteNotification.mutate(notification.id)}
        aria-label="Eliminar notificación"
        className="text-soil-300 hover:text-red-500 transition-colors shrink-0"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/** Ícono de campana con contador de no leídas y dropdown de notificaciones recientes. */
export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data: unread } = useUnreadNotificationsCount();
  const { data } = useNotifications({ page: 1, limit: 8 });
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const count = unread?.count ?? 0;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notificaciones"
        className="relative hover:text-forest-900 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-forest-700 text-stone-25 text-[10px] font-semibold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white border border-forest-100 rounded-stamp shadow-lg z-40 text-forest-800">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-forest-100">
              <span className="text-sm font-medium">Notificaciones</span>
              {count > 0 && (
                <button
                  type="button"
                  onClick={() => markAllAsRead.mutate()}
                  className="text-xs text-forest-600 hover:text-forest-800"
                >
                  Marcar todas como leídas
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-forest-50">
              {!data || data.notifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-soil-400">
                  No tienes notificaciones todavía.
                </p>
              ) : (
                data.notifications.map((n) => <NotificationRow key={n.id} notification={n} />)
              )}
            </div>

            <Link
              href="/notificaciones"
              onClick={() => setOpen(false)}
              className="block text-center text-sm text-forest-700 hover:bg-forest-50 py-2.5 border-t border-forest-100"
            >
              Ver todas
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export { NOTIFICATION_ICONS, NOTIFICATION_TYPE_LABELS };
