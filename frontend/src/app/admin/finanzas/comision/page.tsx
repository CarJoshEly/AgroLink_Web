"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { fetchCommissionHistory, createCommissionConfig } from "@/lib/api/finance";
import { ApiError } from "@/lib/api/client";

function formatDate(dateIso: string) {
  return new Date(dateIso).toLocaleDateString("es-HN", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminComisionPage() {
  const queryClient = useQueryClient();
  const [percentage, setPercentage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-commission-history"],
    queryFn: () => fetchCommissionHistory(1, 20),
  });

  const create = useMutation({
    mutationFn: (value: number) => createCommissionConfig(value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-commission-history"] });
      setPercentage("");
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const value = Number(percentage);
    if (Number.isNaN(value) || value < 0 || value > 100) {
      setError("Ingresa un porcentaje válido entre 0 y 100.");
      return;
    }
    try {
      await create.mutateAsync(value);
    } catch (err) {
      setError(err instanceof ApiError ? err.rawMessage.join(" ") : "No se pudo crear la nueva comisión.");
    }
  }

  const history = data?.history ?? [];
  const current = history.find((c) => c.isActive) ?? history[0];

  return (
    <div>
      <h1 className="font-display text-2xl text-forest-900 mb-1">Comisión de la plataforma</h1>
      <p className="text-sm text-soil-500 mb-6">
        Cada nueva vigencia queda registrada con la fecha desde la que aplica; las anteriores se conservan como
        historial.
      </p>

      {current && (
        <div className="border border-forest-100 rounded-stamp p-4 mb-6 bg-forest-50">
          <p className="text-xs uppercase tracking-wide text-soil-400">Comisión vigente</p>
          <p className="font-display text-2xl text-forest-900 mt-1">{Number(current.percentage)}%</p>
          <p className="text-xs text-soil-400 mt-1">Desde {formatDate(current.effectiveFrom)}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-3 mb-8">
        <div>
          <label className="text-xs text-soil-500 mb-1 block">Nueva comisión (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            step={0.01}
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            className="input text-sm max-w-[10rem]"
            placeholder="ej. 7.5"
          />
        </div>
        <button
          type="submit"
          disabled={create.isPending || !percentage}
          className="text-sm px-4 py-2 rounded-stamp bg-forest-700 text-stone-25 hover:bg-forest-800 disabled:opacity-50"
        >
          {create.isPending ? "Guardando…" : "Configurar nueva vigencia"}
        </button>
      </form>
      {error && <p className="text-xs text-red-600 -mt-6 mb-6">{error}</p>}

      <h2 className="font-display text-lg text-forest-800 mb-3">Historial</h2>
      {isLoading ? (
        <div className="flex justify-center py-14">
          <Loader2 className="w-6 h-6 text-forest-500 animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <p className="text-sm text-soil-400 py-10 text-center">Todavía no se ha configurado ninguna comisión.</p>
      ) : (
        <div className="space-y-2">
          {history.map((config) => (
            <div
              key={config.id}
              className="flex items-center justify-between border border-forest-100 rounded-stamp p-3 text-sm"
            >
              <span className="font-medium text-forest-800">{Number(config.percentage)}%</span>
              <span className="text-soil-400 text-xs">
                {formatDate(config.effectiveFrom)}
                {config.effectiveTo ? ` – ${formatDate(config.effectiveTo)}` : " – actualidad"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
