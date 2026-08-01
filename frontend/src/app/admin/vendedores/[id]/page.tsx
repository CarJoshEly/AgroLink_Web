"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Check } from "lucide-react";
import {
  fetchSellerById,
  markSellerUnderReview,
  approveSeller,
  rejectSeller,
  suspendSeller,
} from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";
import { VERIFICATION_STATUS_LABELS } from "@/lib/labels";
import type { VerificationStatus } from "@/lib/types";

const STATUS_STYLES: Record<VerificationStatus, string> = {
  PENDING: "bg-stone-100 text-stone-600",
  UNDER_REVIEW: "bg-blue-50 text-blue-700",
  VERIFIED: "bg-forest-100 text-forest-700",
  REJECTED: "bg-red-50 text-red-700",
  SUSPENDED: "bg-red-900/10 text-red-900",
};

const DOCUMENT_LABELS = {
  dniFrontUrl: "DNI (frontal)",
  dniBackUrl: "DNI (posterior)",
  selfieUrl: "Selfie",
  lifeProofUrl: "Prueba de vida",
} as const;

/** Rechazar/suspender exigen un motivo (mínimo 5 caracteres, igual que el backend) — a
 * diferencia de rechazar/cancelar un pedido, aquí no hay opción de dejarlo vacío. */
function RequiredReasonAction({
  label,
  confirmLabel,
  onConfirm,
}: {
  label: string;
  confirmLabel: string;
  onConfirm: (reason: string) => Promise<unknown>;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const reasonValid = reason.trim().length >= 5;

  async function handleConfirm() {
    if (!reasonValid) return;
    setPending(true);
    setError(null);
    try {
      await onConfirm(reason.trim());
      setOpen(false);
      setReason("");
    } catch (err) {
      setError(err instanceof ApiError ? err.rawMessage.join(" ") : "No se pudo completar la acción.");
    } finally {
      setPending(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm font-medium px-4 py-2 rounded-stamp border border-red-300 text-red-700 hover:bg-red-50 transition-colors"
      >
        {label}
      </button>
    );
  }

  return (
    <div className="border border-forest-100 rounded-stamp p-3 max-w-sm w-full">
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Motivo (obligatorio, mínimo 5 caracteres)"
        rows={2}
        autoFocus
        className="input text-sm w-full"
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleConfirm}
          disabled={pending || !reasonValid}
          className="text-xs font-medium px-3 py-1.5 rounded-stamp text-stone-25 bg-red-600 hover:bg-red-700 disabled:opacity-50"
        >
          {pending ? "Guardando…" : confirmLabel}
        </button>
        <button
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          className="text-xs text-soil-400"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default function AdminSellerDetailPage({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient();

  const sellerQuery = useQuery({
    queryKey: ["admin-seller", params.id],
    queryFn: () => fetchSellerById(params.id),
  });

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["admin-seller", params.id] });
    queryClient.invalidateQueries({ queryKey: ["admin-sellers"] });
  }

  const reviewMutation = useMutation({
    mutationFn: () => markSellerUnderReview(params.id),
    onSuccess: refresh,
  });
  const approveMutation = useMutation({
    mutationFn: () => approveSeller(params.id),
    onSuccess: refresh,
  });

  const seller = sellerQuery.data;

  if (sellerQuery.isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 text-forest-500 animate-spin" />
      </div>
    );
  }

  if (!seller) {
    return <p className="text-sm text-soil-400">No se encontró este vendedor.</p>;
  }

  const docs = seller.identityVerification;

  return (
    <div>
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-soil-500 hover:text-forest-700 mb-4"
      >
        <ArrowLeft size={14} /> Verificación de vendedores
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-forest-900">{seller.businessName}</h1>
          <p className="text-sm text-soil-500 mt-1">
            {seller.user?.name ?? "—"} · {seller.user?.email ?? "—"} · DNI {seller.dni}
          </p>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-stamp shrink-0 ${STATUS_STYLES[seller.verificationStatus]}`}
        >
          {VERIFICATION_STATUS_LABELS[seller.verificationStatus]}
        </span>
      </div>

      {seller.verificationStatus === "REJECTED" && docs?.notes && (
        <div className="bg-red-50 border border-red-100 rounded-stamp p-3 mb-6 text-sm text-red-700">
          Motivo del rechazo: {docs.notes}
        </div>
      )}
      {seller.verificationStatus === "SUSPENDED" && seller.suspendedReason && (
        <div className="bg-red-50 border border-red-100 rounded-stamp p-3 mb-6 text-sm text-red-700">
          Motivo de la suspensión: {seller.suspendedReason}
        </div>
      )}

      <h2 className="font-display text-lg text-forest-800 mb-3">Documentos</h2>
      {!docs ? (
        <p className="text-sm text-soil-400 mb-8">Este vendedor todavía no ha enviado documentos.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {(Object.keys(DOCUMENT_LABELS) as Array<keyof typeof DOCUMENT_LABELS>).map((key) => (
            <a
              key={key}
              href={docs[key]}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-forest-100 rounded-stamp overflow-hidden hover:border-forest-300 transition-colors"
            >
              <div className="aspect-square bg-forest-50">
                <img src={docs[key]} alt={DOCUMENT_LABELS[key]} className="w-full h-full object-cover" />
              </div>
              <p className="text-xs text-center text-soil-500 py-1.5">{DOCUMENT_LABELS[key]}</p>
            </a>
          ))}
        </div>
      )}

      <h2 className="font-display text-lg text-forest-800 mb-3">Acciones</h2>
      <div className="flex flex-wrap items-start gap-3">
        {(seller.verificationStatus === "PENDING" || seller.verificationStatus === "UNDER_REVIEW") && (
          <>
            {seller.verificationStatus === "PENDING" && (
              <button
                onClick={() => reviewMutation.mutate()}
                disabled={reviewMutation.isPending}
                className="text-sm font-medium px-4 py-2 rounded-stamp border border-forest-300 text-forest-700 hover:bg-forest-50 disabled:opacity-50"
              >
                {reviewMutation.isPending ? "Actualizando…" : "Marcar en revisión"}
              </button>
            )}
            <button
              onClick={() => approveMutation.mutate()}
              disabled={approveMutation.isPending}
              className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-stamp bg-forest-700 text-stone-25 hover:bg-forest-800 disabled:opacity-50"
            >
              <Check size={15} /> {approveMutation.isPending ? "Aprobando…" : "Aprobar"}
            </button>
            <RequiredReasonAction
              label="Rechazar"
              confirmLabel="Confirmar rechazo"
              onConfirm={(reason) => rejectSeller(params.id, reason).then(refresh)}
            />
          </>
        )}

        {seller.verificationStatus === "VERIFIED" && (
          <RequiredReasonAction
            label="Suspender cuenta"
            confirmLabel="Confirmar suspensión"
            onConfirm={(reason) => suspendSeller(params.id, reason).then(refresh)}
          />
        )}

        {seller.verificationStatus === "REJECTED" && (
          <p className="text-sm text-soil-400">
            En espera de que el vendedor reenvíe sus documentos corregidos.
          </p>
        )}
        {seller.verificationStatus === "SUSPENDED" && (
          <p className="text-sm text-soil-400">
            Esta cuenta está suspendida. No hay una acción para reactivarla desde este panel.
          </p>
        )}
      </div>
    </div>
  );
}
