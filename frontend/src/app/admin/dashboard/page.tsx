"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { fetchAdminDashboard } from "@/lib/api/admin";
import {
  ORDER_STATUS_LABELS,
  USER_ROLE_LABELS,
  VERIFICATION_STATUS_LABELS,
  PRODUCT_STATUS_LABELS,
  REPORT_STATUS_LABELS,
} from "@/lib/labels";
import type { OrderStatus, ProductStatus, ReportStatus, UserRole, VerificationStatus } from "@/lib/types";

function formatCurrency(amount: number) {
  return `L. ${amount.toLocaleString("es-HN", { maximumFractionDigits: 2 })}`;
}

function MetricCard({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) {
  return (
    <div className="border border-forest-100 rounded-stamp p-4 bg-white">
      <p className="text-xs uppercase tracking-wide text-soil-400">{title}</p>
      <p className="font-display text-2xl text-forest-900 mt-1">{value}</p>
      {subtitle && <p className="text-xs text-soil-400 mt-1">{subtitle}</p>}
    </div>
  );
}

function BreakdownList<T extends string>({
  title,
  data,
  labels,
}: {
  title: string;
  data: Record<T, number>;
  labels: Record<T, string>;
}) {
  return (
    <div className="border border-forest-100 rounded-stamp p-4 bg-white">
      <p className="text-sm font-medium text-forest-800 mb-3">{title}</p>
      <div className="space-y-1.5">
        {(Object.keys(data) as T[]).map((key) => (
          <div key={key} className="flex items-center justify-between text-sm">
            <span className="text-soil-500">{labels[key]}</span>
            <span className="font-medium text-forest-800">{data[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: fetchAdminDashboard,
  });

  if (isLoading || !data) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-6 h-6 text-forest-500 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-forest-900 mb-1">Dashboard</h1>
      <p className="text-sm text-soil-500 mb-6">Métricas generales de la plataforma.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Usuarios" value={data.users.total} subtitle={`${data.users.active} activos`} />
        <MetricCard title="Vendedores" value={data.sellers.total} />
        <MetricCard title="Productos" value={data.products.total} />
        <MetricCard title="Pedidos" value={data.orders.total} />
        <MetricCard title="Ingresos entregados" value={formatCurrency(data.orders.totalDeliveredRevenue)} />
        <MetricCard title="Volumen transaccionado" value={formatCurrency(data.finance.totalVolume)} />
        <MetricCard title="Comisión cobrada" value={formatCurrency(data.finance.totalCommissionCollected)} />
        <MetricCard title="Reportes" value={data.reports.total} />
        <MetricCard
          title="Reseñas"
          value={data.reviews.totalProductReviews + data.reviews.totalSellerReviews}
          subtitle={`${data.reviews.totalProductReviews} producto · ${data.reviews.totalSellerReviews} vendedor`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BreakdownList<UserRole> title="Usuarios por rol" data={data.users.byRole} labels={USER_ROLE_LABELS} />
        <BreakdownList<VerificationStatus>
          title="Vendedores por estado"
          data={data.sellers.byVerificationStatus}
          labels={VERIFICATION_STATUS_LABELS}
        />
        <BreakdownList<ProductStatus>
          title="Productos por estado"
          data={data.products.byStatus}
          labels={PRODUCT_STATUS_LABELS}
        />
        <BreakdownList<OrderStatus>
          title="Pedidos por estado"
          data={data.orders.byStatus}
          labels={ORDER_STATUS_LABELS}
        />
        <BreakdownList<ReportStatus>
          title="Reportes por estado"
          data={data.reports.byStatus}
          labels={REPORT_STATUS_LABELS}
        />
      </div>
    </div>
  );
}
