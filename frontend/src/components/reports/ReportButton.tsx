"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Flag, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createReport } from "@/lib/api/reports";
import type { ReportTargetType } from "@/lib/types";

const REASON_PRESETS = [
  "Contenido inapropiado o engañoso",
  "El producto no coincide con la descripción",
  "Comportamiento sospechoso o fraude",
  "Lenguaje ofensivo",
  "Otro motivo",
];

interface ReportButtonProps {
  targetType: ReportTargetType;
  targetId: string;
  /** Texto del botón disparador; por defecto solo el ícono. */
  label?: string;
  /** Clases extra para el botón disparador (p. ej. para posicionarlo dentro de una tarjeta). */
  className?: string;
  size?: number;
}

/**
 * Botón + modal de "Reportar", reutilizable desde: tarjeta de producto,
 * perfil de vendedor, y tarjeta de reseña (de producto o de vendedor).
 * El backend distingue PRODUCT_REVIEW de SELLER_REVIEW como targetType
 * separados — quien use este componente debe pasar el valor correcto
 * según el origen del reporte.
 */
export default function ReportButton({ targetType, targetId, label, className = "", size = 16 }: ReportButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openModal(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }
    setOpen(true);
  }

  function closeModal(e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    setOpen(false);
    setSent(false);
    setError(null);
    setReason("");
    setCustomReason("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const finalReason = reason === "Otro motivo" ? customReason.trim() : reason;

    if (!finalReason || finalReason.length < 5) {
      setError("Describe el motivo con al menos 5 caracteres.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await createReport({ targetType, targetId, reason: finalReason });
      setSent(true);
    } catch {
      setError("No se pudo enviar el reporte. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        aria-label="Reportar"
        className={`inline-flex items-center gap-1 text-soil-400 hover:text-red-500 transition-colors ${className}`}
      >
        <Flag size={size} strokeWidth={2} />
        {label && <span className="text-xs">{label}</span>}
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={closeModal}
          >
          <div
            className="bg-white rounded-stamp shadow-xl w-full max-w-sm p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg text-forest-900">Reportar</h2>
              <button type="button" onClick={closeModal} aria-label="Cerrar">
                <X className="w-5 h-5 text-soil-400 hover:text-forest-700" />
              </button>
            </div>

            {sent ? (
              <div className="text-center py-4">
                <p className="text-forest-800 font-medium">Gracias, tu reporte fue enviado</p>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-4 text-sm text-forest-600 hover:text-forest-800"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1.5">
                  {REASON_PRESETS.map((preset) => (
                    <label
                      key={preset}
                      className="flex items-center gap-2 text-sm text-forest-700 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={preset}
                        checked={reason === preset}
                        onChange={(e) => setReason(e.target.value)}
                        className="accent-forest-700"
                      />
                      {preset}
                    </label>
                  ))}
                </div>

                {reason === "Otro motivo" && (
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Cuéntanos qué pasó (mínimo 5 caracteres)"
                    rows={3}
                    className="w-full border border-forest-100 rounded-stamp px-3 py-2 text-sm focus:outline-none focus:border-forest-400"
                  />
                )}

                {error && <p className="text-xs text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting || !reason}
                  className="w-full bg-forest-700 text-stone-25 rounded-stamp py-2 text-sm font-medium hover:bg-forest-800 disabled:opacity-50 transition-colors"
                >
                  {submitting ? "Enviando…" : "Enviar reporte"}
                </button>
              </form>
            )}
          </div>
        </div>,
          document.body,
        )}
    </>
  );
}
