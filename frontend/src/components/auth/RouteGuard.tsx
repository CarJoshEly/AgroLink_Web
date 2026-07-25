"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/lib/types";

interface RouteGuardProps {
  children: React.ReactNode;
  /** Si se omite, solo exige sesión iniciada (cualquier rol). */
  allowedRoles?: UserRole[];
}

/**
 * Envuelve páginas que requieren sesión (y opcionalmente un rol específico).
 * - Sin sesión → redirige a /login
 * - Rol no permitido → redirige a /acceso-no-autorizado
 */
export default function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace("/acceso-no-autorizado");
    }
  }, [user, isLoading, allowedRoles, router]);

  if (isLoading || !user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 text-forest-500 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
