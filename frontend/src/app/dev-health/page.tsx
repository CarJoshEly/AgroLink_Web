"use client";

/**
 * Pantalla temporal de verificación (Sprint 1): confirma que el pipeline
 * completo — .env → cliente de API → envelope → CORS de la API — funciona
 * de punta a punta antes de construir UI real. No se enlaza desde la
 * navegación; se elimina cuando ya no haga falta.
 */

import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api/client";

export default function DevHealthPage() {
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch("/health")
      .then(setResult)
      .catch((err) => setError(err instanceof ApiError ? err.message : String(err)));
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 font-mono text-sm">
      <h1 className="font-sans text-xl font-semibold mb-4">GET /health</h1>
      {error && <pre className="text-red-600 whitespace-pre-wrap">{error}</pre>}
      {!error && !result && <p>Cargando…</p>}
      {result != null && <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
