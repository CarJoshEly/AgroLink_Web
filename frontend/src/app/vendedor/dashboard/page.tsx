"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { fetchOrdersDashboard } from "@/lib/api/orders";
import { fetchSellerFinanceDashboard } from "@/lib/api/finance";
import { ORDER_STATUS_LABELS, TRANSACTION_STATUS_LABELS } from "@/lib/labels";
import type { OrderStatus } from "@/lib/types";

const STATUS_ORDER: OrderStatus[] = ["PENDING", "CONFIRMED", "PREPARING", "DELIVERED", "CANCELLED"];

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-forest-100 rounded-stamp p-4">
      <p className="text-xs uppercase tracking-wide text-soil-400 mb-1">{label}</p>
      <p className="font-display text-2xl text-forest-800">{value}</p>
    </div>
  );
}

export default function SellerDashboardPage() {
  const ordersQuery = useQuery({ queryKey: ["orders-dashboard"], queryFn: fetchOrdersDashboard });
  const financeQuery = useQuery({ queryKey: ["finance-dashboard"], queryFn: fetchSellerFinanceDashboard });

  if (ordersQuery.isLoading || financeQuery.isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 text-forest-500 animate-spin" />
      </div>
    );
  }

  const orders = ordersQuery.data;
  const finance = financeQuery.data;
  const maxCount = orders ? Math.max(1, ...STATUS_ORDER.map((s) => orders.byStatus[s])) : 1;

  return (
    <div>
      <h1 className="font-display text-2xl text-forest-900 mb-6">Panel de vendedor</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Pedidos totales" value={String(orders?.totalOrders ?? 0)} />
        <StatCard label="Pendientes" value={String(orders?.pendingCount ?? 0)} />
        <StatCard
          label="Ingresos entregados"
          value={`L. ${(orders?.totalRevenue ?? 0).toLocaleString("es-HN")}`}
        />
        <StatCard
          label="Ganancia neta"
          value={`L. ${(finance?.totalEarnings ?? 0).toLocaleString("es-HN")}`}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        <div>
          <h2 className="font-display text-lg text-forest-800 mb-3">Pedidos por estado</h2>
          <div className="space-y-2">
            {STATUS_ORDER.map((status) => {
              const count = orders?.byStatus[status] ?? 0;
              return (
                <div key={status} className="flex items-center gap-3 text-sm">
                  <span className="w-28 text-soil-500 shrink-0">{ORDER_STATUS_LABELS[status]}</span>
                  <div className="flex-1 h-2 bg-forest-50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-forest-500 rounded-full"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-forest-700">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg text-forest-800 mb-3">Resumen financiero</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-soil-500">Volumen total (completadas)</dt>
              <dd className="text-forest-800">L. {(finance?.totalVolume ?? 0).toLocaleString("es-HN")}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-soil-500">Comisión pagada</dt>
              <dd className="text-forest-800">
                L. {(finance?.totalCommissionPaid ?? 0).toLocaleString("es-HN")}
              </dd>
            </div>
            <div className="flex justify-between font-medium">
              <dt className="text-forest-700">Ganancia neta</dt>
              <dd className="text-forest-800">L. {(finance?.totalEarnings ?? 0).toLocaleString("es-HN")}</dd>
            </div>
          </dl>
          <Link
            href="/vendedor/transacciones"
            className="inline-block mt-4 text-sm font-medium text-forest-700 hover:underline underline-offset-2"
          >
            Ver todas las transacciones →
          </Link>
        </div>
      </div>

      <h2 className="font-display text-lg text-forest-800 mb-3">Pedidos recientes</h2>
      {orders?.recentOrders.length === 0 ? (
        <p className="text-sm text-soil-400 mb-8">Todavía no tienes pedidos.</p>
      ) : (
        <div className="space-y-2 mb-8">
          {orders?.recentOrders.map((order) => (
            <Link
              key={order.id}
              href={`/vendedor/pedidos/${order.id}`}
              className="flex items-center justify-between text-sm border border-forest-50 rounded-stamp px-4 py-2.5 hover:border-forest-200 transition-colors"
            >
              <span className="text-forest-800">{order.buyer?.name ?? "Comprador"}</span>
              <span className="text-soil-500">L. {Number(order.totalAmount).toLocaleString("es-HN")}</span>
              <span className="text-xs text-soil-400">{ORDER_STATUS_LABELS[order.status]}</span>
            </Link>
          ))}
        </div>
      )}

      <h2 className="font-display text-lg text-forest-800 mb-3">Transacciones recientes</h2>
      {finance?.recentTransactions.length === 0 ? (
        <p className="text-sm text-soil-400">Todavía no tienes transacciones.</p>
      ) : (
        <div className="space-y-2">
          {finance?.recentTransactions.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between text-sm border border-forest-50 rounded-stamp px-4 py-2.5"
            >
              <span className="text-forest-800">{t.paymentMethod?.name ?? "—"}</span>
              <span className="text-soil-500">L. {Number(t.amount).toLocaleString("es-HN")}</span>
              <span className="text-xs text-soil-400">{TRANSACTION_STATUS_LABELS[t.status]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
