import { ShieldCheck } from "lucide-react";
import VerificationBadge from "@/components/ui/VerificationBadge";

// Placeholder de sesión — cuando exista auth real, esto vendrá de la API/sesión.
const mockCurrentUser = {
  name: "Usuario Demo",
  email: "demo@agrolink.hn",
  hasVerifiedBadge: false,
};

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="font-display text-2xl text-forest-900">Mi perfil</h1>
        <VerificationBadge verified={mockCurrentUser.hasVerifiedBadge} size="md" />
      </div>

      <div className="border border-forest-100 rounded-stamp p-5 mb-6">
        <p className="text-sm text-soil-500">Nombre</p>
        <p className="text-forest-800 font-medium">{mockCurrentUser.name}</p>
        <p className="text-sm text-soil-500 mt-3">Correo</p>
        <p className="text-forest-800 font-medium">{mockCurrentUser.email}</p>
      </div>

      {!mockCurrentUser.hasVerifiedBadge && (
        <div className="border border-forest-100 bg-forest-50/50 rounded-stamp p-5 flex gap-3">
          <ShieldCheck className="w-5 h-5 text-forest-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-forest-800">Completa tu perfil (opcional)</p>
            <p className="text-xs text-soil-500 mt-1 max-w-md">
              Agregar tu número de identidad, fotos de tu DNI y una prueba de vida es completamente
              opcional. Nunca es requisito para comprar o vender en AgroLink. Si decides
              completarlo y un administrador lo aprueba, tu perfil mostrará la insignia de
              verificación frente a otros usuarios.
            </p>
            <button className="mt-3 text-sm font-medium text-forest-700 border border-forest-300 px-3 py-1.5 rounded-stamp hover:bg-forest-100 transition-colors">
              Completar verificación
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
