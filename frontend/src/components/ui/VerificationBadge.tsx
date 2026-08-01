import { BadgeCheck, ShieldQuestion } from "lucide-react";

interface VerificationBadgeProps {
  verified: boolean;
  size?: "sm" | "md";
}

/**
 * Insignia de verificación.
 *
 * Se otorga únicamente cuando el usuario, de forma OPCIONAL, completó su
 * perfil (número de identidad, fotos de DNI y prueba de vida) y un
 * administrador aprobó la revisión. Ningún usuario está obligado a
 * verificarse para vender (modelo estilo eBay) — pero si no lo está, el
 * comprador debe poder verlo con la misma claridad que vería el sello
 * "Verificado", no solo inferirlo por su ausencia.
 */
export default function VerificationBadge({ verified, size = "sm" }: VerificationBadgeProps) {
  const dims = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const text = size === "sm" ? "text-xs" : "text-sm";

  if (!verified) {
    return (
      <span
        className={`inline-flex items-center gap-1 ${text} font-medium text-soil-600 bg-soil-100 px-2 py-0.5 rounded-stamp`}
        title="Este vendedor todavía no fue verificado por AgroLink"
      >
        <ShieldQuestion className={dims} strokeWidth={2.2} />
        Sin verificar
      </span>
    );
  }

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
