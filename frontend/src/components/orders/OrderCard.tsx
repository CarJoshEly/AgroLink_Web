import Link from "next/link";
import type { Order } from "@/lib/types";
import { ORDER_STATUS_LABELS } from "@/lib/labels";

const STATUS_STYLES: Record<Order["status"], string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  PREPARING: "bg-indigo-50 text-indigo-700",
  DELIVERED: "bg-forest-50 text-forest-700",
  CANCELLED: "bg-red-50 text-red-700",
};

export default function OrderCard({ order }: { order: Order }) {
  return (
    <Link
      href={`/pedidos/${order.id}`}
      className="flex items-center justify-between border border-forest-100 rounded-stamp p-4 bg-white hover:border-forest-300 transition-colors"
    >
      <div>
        <p className="text-sm font-medium text-forest-800">
          {order.seller?.businessName ?? "Vendedor"}
        </p>
        <p className="text-xs text-soil-400 mt-0.5">
          Pedido #{order.id.slice(0, 8)} ·{" "}
          {new Date(order.createdAt).toLocaleDateString("es-HN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
        <p className="text-xs text-soil-400">
          {order.items?.length ?? 0} {(order.items?.length ?? 0) === 1 ? "producto" : "productos"}
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm font-medium text-forest-800">
          L. {Number(order.totalAmount).toLocaleString("es-HN")}
        </p>
        <span
          className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-stamp ${STATUS_STYLES[order.status]}`}
        >
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>
    </Link>
  );
}
