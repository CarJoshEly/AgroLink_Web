import { BadgeCheck } from "lucide-react";

interface VerificationBadgeProps {
  verified: boolean;
  size?: "sm" | "md";
}

/**
 * Insignia de verificación.
 *
 * Se otorga únicamente cuando el usuario, de forma OPCIONAL, completó su
 * perfil (número de identidad, fotos de DNI y prueba de vida) y un
 * administrador aprobó la revisión. Ningún usuario está obligado a mostrar
 * este sello para operar en la plataforma.
 */
export default function VerificationBadge({ verified, size = "sm" }: VerificationBadgeProps) {
  if (!verified) return null;

  const dims = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const text = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1 ${text} font-medium text-forest-700 bg-forest-100 px-2 py-0.5 rounded-stamp`}
      title="Perfil verificado por AgroLink"
    >
      <BadgeCheck className={dims} strokeWidth={2.2} />
      Verificado
    </span>
  );
}
