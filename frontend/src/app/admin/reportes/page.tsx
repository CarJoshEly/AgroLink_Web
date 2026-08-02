"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { fetchReports, updateReportStatus, type ReportFilters } from "@/lib/api/reports";
import { REPORT_STATUS_LABELS, REPORT_TARGET_TYPE_LABELS } from "@/lib/labels";
import type { ReportStatus } from "@/lib/types";

const STATUS_FILTERS: (ReportStatus | "")[] = ["", "PENDING", "REVIEWED", "RESOLVED", "DISMISSED"];

const STATUS_STYLES: Record<ReportStatus, string> = {
  PENDING: "bg-stone-100 text-stone-600",
  REVIEWED: "bg-blue-50 text-blue-700",
  RESOLVED: "bg-forest-100 text-forest-700",
  DISMISSED: "bg-red-50 text-red-700",
};

const NEXT_STATUS_ACTIONS: { label: string; status: Extract<ReportStatus, "REVIEWED" | "RESOLVED" | "DISMISSED"> }[] = [
  { label: "Marcar en revisión", status: "REVIEWED" },
  { label: "Resolver", status: "RESOLVED" },
  { label: "Descartar", status: "DISMISSED" },
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

export default function AdminReportesPage() {
  const [filters, setFilters] = useState<ReportFilters>({ page: 1, limit: 15 });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-reports", filters],
    queryFn: () => fetchReports(filters),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Extract<ReportStatus, "REVIEWED" | "RESOLVED" | "DISMISSED"> }) =>
      updateReportStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-reports"] }),
  });

  const reports = data?.reports ?? [];
  const meta = data?.meta;

  return (
    <div>
      <h1 className="font-display text-2xl text-forest-900 mb-1">Reportes</h1>
      <p className="text-sm text-soil-500 mb-6">Contenido reportado por productos, vendedores y reseñas.</p>

      <div className="flex gap-2 overflow-x-auto mb-5">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status || "all"}
            type="button"
            onClick={() => setFilters((f) => ({ ...f, status: status || undefined, page: 1 }))}
            className={`text-sm px-3 py-1.5 rounded-stamp border whitespace-nowrap transition-colors ${
              (filters.status ?? "") === status
                ? "border-forest-700 text-forest-800 bg-forest-50"
                : "border-forest-100 text-soil-500 hover:border-forest-300"
            }`}
          >
            {status ? REPORT_STATUS_LABELS[status] : "Todos"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-14">
          <Loader2 className="w-6 h-6 text-forest-500 animate-spin" />
        </div>
      ) : reports.length === 0 ? (
        <p className="text-sm text-soil-400 py-10 text-center">No hay reportes con este filtro.</p>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="border border-forest-100 rounded-stamp p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-forest-700 uppercase tracking-wide">
                      {REPORT_TARGET_TYPE_LABELS[report.targetType]}
                    </span>
                    <span className="text-xs text-soil-400">{formatDate(report.createdAt)}</span>
                  </div>
                  <p className="text-sm text-forest-800">{report.reason}</p>
                  <p className="text-xs text-soil-400 mt-1">ID reportado: {report.targetId}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-stamp shrink-0 ${STATUS_STYLES[report.status]}`}>
                  {REPORT_STATUS_LABELS[report.status]}
                </span>
              </div>

              {report.status !== "RESOLVED" && report.status !== "DISMISSED" && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {NEXT_STATUS_ACTIONS.filter((action) => action.status !== report.status).map((action) => (
                    <button
                      key={action.status}
                      type="button"
                      disabled={updateStatus.isPending}
                      onClick={() => updateStatus.mutate({ id: report.id, status: action.status })}
                      className="text-xs px-2.5 py-1.5 rounded-stamp border border-forest-200 text-forest-700 hover:bg-forest-50 disabled:opacity-50"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8 text-sm">
          <button
            type="button"
            disabled={!meta.hasPreviousPage}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
            className="px-3 py-1.5 rounded-stamp border border-forest-200 disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-soil-500">
            Página {meta.page} de {meta.totalPages}
          </span>
          <button
            type="button"
            disabled={!meta.hasNextPage}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
            className="px-3 py-1.5 rounded-stamp border border-forest-200 disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
