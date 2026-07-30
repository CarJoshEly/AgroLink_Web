import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { Order } from "@/lib/types";
import { ORDER_STATUS_LABELS } from "@/lib/labels";

/**
 * Pantalla de confirmación de checkout.
 *
 * El backend agrupa el carrito por vendedor y crea UN PEDIDO POR VENDEDOR,
 * todos en PENDING. Por eso siempre mostramos una lista (aunque tenga un
 * único elemento), para que el comprador entienda que puede recibir más de
 * una "solicitud de compra" a raíz de una sola compra.
 */
export default function CheckoutConfirmation({ orders }: { orders: Order[] }) {
  const isMultiSeller = orders.length > 1;

  return (
    <div className="border border-forest-100 rounded-stamp p-6 bg-forest-50/40">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle2 className="w-6 h-6 text-forest-600" />
        <h2 className="font-display text-xl text-forest-900">
          {isMultiSeller
            ? `Se generaron ${orders.length} solicitudes de compra`
            : "Solicitud de compra enviada"}
        </h2>
      </div>
      <p className="text-sm text-soil-500 mb-6">
        {isMultiSeller
          ? "Tu carrito incluía productos de varios vendedores, así que cada uno recibió su propia solicitud y deberá aceptarla o rechazarla por separado."
          : "El vendedor debe aceptar o rechazar tu solicitud antes de que se prepare el pedido."}
      </p>

      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/pedidos/${order.id}`}
            className="flex items-center justify-between border border-forest-100 bg-white rounded-stamp p-4 hover:border-forest-300 transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-forest-800">
                {order.seller?.businessName ?? "Vendedor"}
              </p>
              <p className="text-xs text-soil-400">Pedido #{order.id.slice(0, 8)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-forest-800">
                L. {Number(order.totalAmount).toLocaleString("es-HN")}
              </p>
              <span className="text-xs font-medium text-amber-600">
                {ORDER_STATUS_LABELS[order.status]}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/pedidos"
        className="inline-block mt-6 text-sm font-medium text-forest-700 hover:text-forest-900"
      >
        Ver todos mis pedidos →
      </Link>
    </div>
  );
}
