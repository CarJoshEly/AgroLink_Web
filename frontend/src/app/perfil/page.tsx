"use client";

import Link from "next/link";
import { Loader2, Package, Heart, ShieldCheck, LayoutDashboard, type LucideIcon } from "lucide-react";
import RouteGuard from "@/components/auth/RouteGuard";
import { useAuth } from "@/hooks/useAuth";
import VerificationBadge from "@/components/ui/VerificationBadge";
import ChangePasswordForm from "@/components/forms/ChangePasswordForm";
import { USER_ROLE_LABELS } from "@/lib/labels";

function ProfileLink({ href, icon: Icon, label }: { href: string; icon: LucideIcon; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 border border-forest-100 rounded-stamp p-4 hover:border-forest-300 transition-colors"
    >
      <Icon className="w-5 h-5 text-forest-600" />
      <span className="text-sm font-medium text-forest-800">{label}</span>
    </Link>
  );
}

function ProfilePageContent() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 text-forest-500 animate-spin" />
      </div>
    );
  }

  const sellerProfile = user.sellerProfile;
  const isVerifiedSeller = user.role === "SELLER" && sellerProfile?.verificationStatus === "VERIFIED";

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 space-y-8">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-2xl text-forest-900">Mi perfil</h1>
        {isVerifiedSeller && <VerificationBadge verified size="md" />}
      </div>

      <div className="border border-forest-100 rounded-stamp p-5">
        <p className="text-sm text-soil-500">Nombre</p>
        <p className="text-forest-800 font-medium">{user.name}</p>
        <p className="text-sm text-soil-500 mt-3">Correo</p>
        <p className="text-forest-800 font-medium">{user.email}</p>
        <p className="text-sm text-soil-500 mt-3">Cuenta</p>
        <p className="text-forest-800 font-medium">{USER_ROLE_LABELS[user.role]}</p>
      </div>

      {user.role === "CUSTOMER" && (
        <div className="grid grid-cols-2 gap-3">
          <ProfileLink href="/pedidos" icon={Package} label="Mis pedidos" />
          <ProfileLink href="/favoritos" icon={Heart} label="Favoritos" />
        </div>
      )}

      {user.role === "SELLER" && (
        <div className="space-y-3">
          <ProfileLink href="/vendedor/dashboard" icon={LayoutDashboard} label="Panel de vendedor" />
          {!isVerifiedSeller && (
            <div className="border border-forest-100 bg-forest-50/50 rounded-stamp p-5 flex gap-3">
              <ShieldCheck className="w-5 h-5 text-forest-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-forest-800">
                  {sellerProfile?.verificationStatus === "REJECTED"
                    ? "Tu verificación fue rechazada"
                    : sellerProfile?.verificationStatus === "UNDER_REVIEW"
                      ? "Tu verificación está en revisión"
                      : "Completa tu verificación (opcional)"}
                </p>
                <p className="text-xs text-soil-500 mt-1 max-w-md">
                  Agregar tu número de identidad, fotos de tu DNI y una prueba de vida es
                  completamente opcional. Nunca es requisito para comprar o vender en AgroLink. Si
                  decides completarlo y un administrador lo aprueba, tu perfil mostrará la insignia
                  de verificación frente a otros usuarios.
                </p>
                <Link
                  href="/vendedor/verificacion"
                  className="inline-block mt-3 text-sm font-medium text-forest-700 border border-forest-300 px-3 py-1.5 rounded-stamp hover:bg-forest-100 transition-colors"
                >
                  {sellerProfile?.identityVerification ? "Ver estado" : "Completar verificación"}
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {user.role === "ADMIN" && (
        <ProfileLink href="/admin/dashboard" icon={LayoutDashboard} label="Panel de administración" />
      )}

      <div>
        <h2 className="font-display text-lg text-forest-800 mb-3">Seguridad</h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RouteGuard>
      <ProfilePageContent />
    </RouteGuard>
  );
}
