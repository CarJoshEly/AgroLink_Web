"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Loader2, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Estilo rojo para acciones destructivas (eliminar, suspender). */
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Reemplazo de `window.confirm()` para acciones destructivas del panel
 * admin — el diálogo nativo del navegador no se puede estilizar, bloquea
 * el hilo principal, y en algunos navegadores puede desactivarse por
 * completo (ej. "no permitir más mensajes de esta página").
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-sm rounded-stamp shadow-xl p-5 animate-slideDown"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-2.5">
            {danger && (
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <h2 id="confirm-dialog-title" className="font-display text-lg text-forest-900">
              {title}
            </h2>
          </div>
          <button type="button" onClick={onCancel} aria-label="Cerrar" className="shrink-0">
            <X className="w-5 h-5 text-soil-400 hover:text-forest-700" />
          </button>
        </div>

        <p className="text-sm text-soil-600 mb-5">{message}</p>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="text-sm px-3.5 py-2 rounded-stamp border border-forest-200 text-forest-700 hover:bg-forest-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-stamp font-medium disabled:opacity-50 ${
              danger
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-forest-700 text-stone-25 hover:bg-forest-800"
            }`}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
