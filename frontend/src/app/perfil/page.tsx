"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import RouteGuard from "@/components/auth/RouteGuard";
import ChangePasswordForm from "@/components/forms/ChangePasswordForm";
import VerificationBadge from "@/components/ui/VerificationBadge";
import { useAuth } from "@/hooks/useAuth";

function ProfileContent() {
  const { user, logoutAllSessions } = useAuth();
  if (!user) return null;

  const isVerifiedSeller = user.role === "SELLER" && user.sellerProfile?.verificationStatus === "VERIFIED";

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 space-y-8">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-2xl text-forest-900">Mi perfil</h1>
        <VerificationBadge verified={isVerifiedSeller} size="md" />
      </div>

      <div className="border border-forest-100 rounded-stamp p-5">
        <p className="text-sm text-soil-500">Nombre</p>
        <p className="text-forest-800 font-medium">{user.name}</p>
        <p className="text-sm text-soil-500 mt-3">Correo</p>
        <p className="text-forest-800 font-medium">{user.email}</p>
        {!user.emailVerifiedAt && (
          <p className="text-xs text-red-600 mt-2">Tu correo aún no está verificado.</p>
        )}
      </div>

      {user.role === "SELLER" && user.sellerProfile?.verificationStatus !== "VERIFIED" && (
        <div className="border border-forest-100 bg-forest-50/50 rounded-stamp p-5 flex gap-3">
          <ShieldCheck className="w-5 h-5 text-forest-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-forest-800">Completa tu verificación de identidad</p>
            <p className="text-xs text-soil-500 mt-1 max-w-md">
              Sube tu DNI, selfie y prueba de vida para obtener la insignia de verificación frente a los
              compradores.
            </p>
            <Link
              href="/vendedor/verificacion"
              className="inline-block mt-3 text-sm font-medium text-forest-700 border border-forest-300 px-3 py-1.5 rounded-stamp hover:bg-forest-100 transition-colors"
            >
              Completar verificación
            </Link>
          </div>
        </div>
      )}

      <div className="border border-forest-100 rounded-stamp p-5">
        <h2 className="text-sm font-medium text-forest-800 mb-4">Cambiar contraseña</h2>
        <ChangePasswordForm />
      </div>

      <div className="border border-forest-100 rounded-stamp p-5">
        <h2 className="text-sm font-medium text-forest-800 mb-2">Sesiones</h2>
        <p className="text-xs text-soil-500 mb-3">Cierra sesión en todos los dispositivos donde hayas iniciado sesión.</p>
        <button
          onClick={() => logoutAllSessions()}
          className="text-sm font-medium text-red-700 border border-red-200 px-3 py-1.5 rounded-stamp hover:bg-red-50 transition-colors"
        >
          Cerrar todas las sesiones
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RouteGuard>
      <ProfileContent />
    </RouteGuard>
  );
}
