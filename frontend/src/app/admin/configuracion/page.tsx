"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, X } from "lucide-react";
import { fetchAllConfig, upsertConfig, type SystemConfigEntry } from "@/lib/api/config";
import { ApiError } from "@/lib/api/client";

function ConfigEditor({
  entry,
  onClose,
}: {
  entry: { key: string; value: unknown } | { key: ""; value: undefined };
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [key, setKey] = useState(entry.key);
  const [rawValue, setRawValue] = useState(entry.value !== undefined ? JSON.stringify(entry.value, null, 2) : "");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: unknown }) => upsertConfig(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-config"] });
      onClose();
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!key.trim()) {
      setError("La clave es obligatoria.");
      return;
    }

    let parsedValue: unknown;
    try {
      parsedValue = rawValue.trim() ? JSON.parse(rawValue) : null;
    } catch {
      setError("El valor debe ser JSON válido (ej. \"texto\", 123, true, {\"a\":1}).");
      return;
    }

    try {
      await mutation.mutateAsync({ key: key.trim(), value: parsedValue });
    } catch (err) {
      setError(err instanceof ApiError ? err.rawMessage.join(" ") : "No se pudo guardar la configuración.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-stamp shadow-xl w-full max-w-md p-5 space-y-3"
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display text-lg text-forest-900">{entry.key ? "Editar clave" : "Nueva clave"}</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <X className="w-5 h-5 text-soil-400 hover:text-forest-700" />
          </button>
        </div>

        <div>
          <label className="text-xs text-soil-500 mb-1 block">Clave</label>
          <input
            type="text"
            required
            disabled={Boolean(entry.key)}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="input text-sm disabled:opacity-60"
          />
        </div>

        <div>
          <label className="text-xs text-soil-500 mb-1 block">
            Valor (JSON: texto entre comillas, número, booleano u objeto)
          </label>
          <textarea
            value={rawValue}
            onChange={(e) => setRawValue(e.target.value)}
            rows={5}
            className="w-full border border-forest-100 rounded-stamp px-3 py-2 text-sm font-mono focus:outline-none focus:border-forest-400"
          />
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-forest-700 text-stone-25 rounded-stamp py-2 text-sm font-medium hover:bg-forest-800 disabled:opacity-50"
        >
          {mutation.isPending ? "Guardando…" : "Guardar"}
        </button>
      </form>
    </div>
  );
}

export default function AdminConfiguracionPage() {
  const [editing, setEditing] = useState<{ key: string; value: unknown } | { key: ""; value: undefined } | null>(
    null
  );

  const { data: entries, isLoading } = useQuery({
    queryKey: ["admin-config"],
    queryFn: fetchAllConfig,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-2xl text-forest-900">Configuración</h1>
        <button
          type="button"
          onClick={() => setEditing({ key: "", value: undefined })}
          className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-stamp bg-forest-700 text-stone-25 hover:bg-forest-800"
        >
          <Plus className="w-4 h-4" /> Nueva clave
        </button>
      </div>
      <p className="text-sm text-soil-500 mb-6">Valores individuales de SystemConfig usados por la plataforma.</p>

      {editing && <ConfigEditor entry={editing} onClose={() => setEditing(null)} />}

      {isLoading ? (
        <div className="flex justify-center py-14">
          <Loader2 className="w-6 h-6 text-forest-500 animate-spin" />
        </div>
      ) : !entries || entries.length === 0 ? (
        <p className="text-sm text-soil-400 py-10 text-center">Todavía no hay configuración registrada.</p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry: SystemConfigEntry) => (
            <div
              key={entry.key}
              className="flex items-center justify-between gap-4 border border-forest-100 rounded-stamp p-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-forest-800">{entry.key}</p>
                <p className="text-xs text-soil-400 mt-0.5 truncate font-mono">{JSON.stringify(entry.value)}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditing({ key: entry.key, value: entry.value })}
                className="text-soil-400 hover:text-forest-700 shrink-0"
                aria-label="Editar"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
