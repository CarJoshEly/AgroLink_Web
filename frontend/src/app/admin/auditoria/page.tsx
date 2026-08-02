"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { fetchAuditLogs, type AuditLogFilters } from "@/lib/api/audit";

function formatDate(dateIso: string) {
  return new Date(dateIso).toLocaleString("es-HN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminAuditoriaPage() {
  const [filters, setFilters] = useState<AuditLogFilters>({ page: 1, limit: 20 });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-audit-logs", filters],
    queryFn: () => fetchAuditLogs(filters),
  });

  const logs = data?.logs ?? [];
  const meta = data?.meta;

  return (
    <div>
      <h1 className="font-display text-2xl text-forest-900 mb-1">Auditoría</h1>
      <p className="text-sm text-soil-500 mb-6">Historial de acciones administrativas sobre la plataforma.</p>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <input
          type="text"
          placeholder="Filtrar por tipo de entidad (ej. Category)"
          className="input text-sm max-w-xs"
          onChange={(e) => setFilters((f) => ({ ...f, entityType: e.target.value || undefined, page: 1 }))}
        />
        <input
          type="text"
          placeholder="Filtrar por acción (ej. CATEGORY_CREATED)"
          className="input text-sm max-w-xs"
          onChange={(e) => setFilters((f) => ({ ...f, action: e.target.value || undefined, page: 1 }))}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-14">
          <Loader2 className="w-6 h-6 text-forest-500 animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <p className="text-sm text-soil-400 py-10 text-center">No hay registros con este filtro.</p>
      ) : (
        <div className="border border-forest-100 rounded-stamp divide-y divide-forest-50 overflow-hidden">
          {logs.map((log) => (
            <div key={log.id} className="px-4 py-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium text-forest-800">{log.action}</span>
                <span className="text-xs text-soil-400">{formatDate(log.createdAt)}</span>
              </div>
              <p className="text-xs text-soil-500 mt-1">
                {log.entityType} · {log.entityId}
                {log.user && <> · por {log.user.name}</>}
              </p>
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
