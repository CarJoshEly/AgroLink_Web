"use client";

import { useState } from "react";
import { submitIdentityVerification } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/hooks/useAuth";
import type { VerificationStatus } from "@/lib/types";

// Replica de las constantes del backend (ALLOWED_IMAGE_MIMES / MAX_IMAGE_SIZE)
// para dar feedback inmediato sin esperar el rechazo del servidor.
const ALLOWED_IMAGE_MIMES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const STATUS_STYLES: Record<VerificationStatus, string> = {
  PENDING: "bg-stone-100 text-stone-600",
  UNDER_REVIEW: "bg-blue-50 text-blue-700",
  VERIFIED: "bg-forest-100 text-forest-700",
  REJECTED: "bg-red-50 text-red-700",
  SUSPENDED: "bg-red-900/10 text-red-900",
};

const STATUS_LABELS: Record<VerificationStatus, string> = {
  PENDING: "Pendiente",
  UNDER_REVIEW: "En revisión",
  VERIFIED: "Verificado",
  REJECTED: "Rechazado",
  SUSPENDED: "Suspendido",
};

type FileKey = "dniFront" | "dniBack" | "selfie" | "lifeProof";
const FILE_KEYS: FileKey[] = ["dniFront", "dniBack", "selfie", "lifeProof"];

const FILE_LABELS: Record<FileKey, string> = {
  dniFront: "DNI (frontal)",
  dniBack: "DNI (posterior)",
  selfie: "Selfie",
  lifeProof: "Prueba de vida",
};

const URL_FIELD: Record<FileKey, "dniFrontUrl" | "dniBackUrl" | "selfieUrl" | "lifeProofUrl"> = {
  dniFront: "dniFrontUrl",
  dniBack: "dniBackUrl",
  selfie: "selfieUrl",
  lifeProof: "lifeProofUrl",
};

export default function IdentityVerificationForm() {
  const { user, setUser } = useAuth();
  const status = user?.sellerProfile?.verificationStatus ?? "PENDING";
  const identityVerification = user?.sellerProfile?.identityVerification;
  // El motivo de rechazo lo guarda el backend en identityVerification.notes,
  // no en sellerProfile.suspendedReason (ese campo es solo para SUSPENDED).
  const rejectionReason = identityVerification?.notes;
  const suspendedReason = user?.sellerProfile?.suspendedReason;
  // Reenvío = ya existe un registro previo -> el backend permite mandar solo
  // las fotos que cambiaron y conserva el resto (uploadOrKeep).
  const isResubmission = Boolean(identityVerification);

  const [files, setFiles] = useState<Record<FileKey, File | null>>({
    dniFront: null,
    dniBack: null,
    selfie: null,
    lifeProof: null,
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FileKey, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  function validateFile(file: File): string | null {
    if (!ALLOWED_IMAGE_MIMES.includes(file.type)) return "Formato no permitido (usa JPEG, PNG o WebP)";
    if (file.size > MAX_IMAGE_SIZE) return "El archivo supera el tamaño máximo (5MB)";
    return null;
  }

  function handleFileChange(key: FileKey, file: File | null) {
    setFiles((prev) => ({ ...prev, [key]: file }));
    if (file) {
      const error = validateFile(file);
      setFieldErrors((prev) => ({ ...prev, [key]: error ?? undefined }));
    } else {
      setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  const selectedCount = FILE_KEYS.filter((k) => files[k]).length;
  const allSelected = selectedCount === FILE_KEYS.length;
  // Primer envío: las 4 fotos son obligatorias. Reenvío: basta con la(s)
  // que se esté reemplazando.
  const canSubmit = isResubmission ? selectedCount > 0 : allSelected;
  const hasErrors = Object.values(fieldErrors).some(Boolean);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || hasErrors) return;
    setSending(true);
    setFormError(null);
    try {
      const response = await submitIdentityVerification({
        dniFront: files.dniFront ?? undefined,
        dniBack: files.dniBack ?? undefined,
        selfie: files.selfie ?? undefined,
        lifeProof: files.lifeProof ?? undefined,
      });
      setFiles({ dniFront: null, dniBack: null, selfie: null, lifeProof: null });
      if (user?.sellerProfile) {
        setUser({
          ...user,
          sellerProfile: {
            ...user.sellerProfile,
            verificationStatus: response.status,
            identityVerification: response,
          },
        });
      }
    } catch (err) {
      setFormError(err instanceof ApiError ? err.rawMessage.join(" ") : "No se pudo enviar la verificación.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium px-2.5 py-1 rounded-stamp ${STATUS_STYLES[status]}`}>
          {STATUS_LABELS[status]}
        </span>
        {status === "REJECTED" && rejectionReason && (
          <span className="text-xs text-soil-500">Motivo: {rejectionReason}</span>
        )}
      </div>

      {status === "VERIFIED" ? (
        <p className="text-sm text-forest-700 bg-forest-50 border border-forest-100 rounded-stamp p-4">
          Tu identidad ya fue verificada. No necesitas hacer nada más.
        </p>
      ) : status === "SUSPENDED" ? (
        <p className="text-sm text-red-900 bg-red-900/5 border border-red-900/10 rounded-stamp p-4">
          Tu cuenta de vendedor está suspendida
          {suspendedReason ? `: ${suspendedReason}` : "."} Contacta a soporte para más información — no
          puedes reenviar documentación mientras la suspensión siga activa.
        </p>
      ) : status === "UNDER_REVIEW" ? (
        <p className="text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-stamp p-4">
          Tu documentación está en revisión. Te notificaremos cuando un administrador la evalúe.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {isResubmission && (
            <p className="text-xs text-soil-500">
              Ya tienes documentación enviada — solo necesitas volver a subir la(s) foto(s) que quieras
              corregir, el resto se conserva.
            </p>
          )}
          {formError && (
            <div className="bg-red-50 border border-red-100 rounded-stamp p-3 text-sm text-red-700">
              {formError}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            {FILE_KEYS.map((key) => (
              <FileField
                key={key}
                label={FILE_LABELS[key]}
                file={files[key]}
                error={fieldErrors[key]}
                existingUrl={identityVerification?.[URL_FIELD[key]]}
                onChange={(f) => handleFileChange(key, f)}
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={!canSubmit || hasErrors || sending}
            className="w-full bg-forest-700 text-stone-25 font-medium py-2.5 rounded-stamp hover:bg-forest-800 transition-colors disabled:opacity-60"
          >
            {sending ? "Enviando…" : "Enviar verificación"}
          </button>
        </form>
      )}
    </div>
  );
}

function FileField({
  label,
  file,
  error,
  existingUrl,
  onChange,
}: {
  label: string;
  file: File | null;
  error?: string;
  existingUrl?: string;
  onChange: (f: File | null) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-forest-700">{label}</span>
      <div
        className={`mt-1 border border-dashed rounded-stamp px-3 py-2 text-xs text-soil-500 hover:border-forest-400 transition-colors cursor-pointer bg-white ${
          error ? "border-red-300" : "border-forest-200"
        }`}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
        {file ? (
          file.name
        ) : existingUrl ? (
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={existingUrl} alt="" className="w-6 h-6 rounded object-cover shrink-0" />
            <span>Ya enviada — toca para reemplazar</span>
          </div>
        ) : (
          "Subir archivo"
        )}
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </label>
  );
}
