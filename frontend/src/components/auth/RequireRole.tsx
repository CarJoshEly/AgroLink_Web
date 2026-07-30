"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/lib/types";

/**
 * Envuelve páginas que solo deben ser visibles/accesibles para ciertos
 * roles (p. ej. carrito/pedidos/favoritos → solo CUSTOMER).
 *
 * - Mientras `isLoading` (rehidratando sesión con el refresh token) muestra
 *   un estado neutro para evitar parpadeos de "acceso denegado".
 * - Sin usuario autenticado → redirige a /login?redirect=<ruta actual>.
 * - Usuario autenticado pero con rol distinto → mensaje de acceso restringido
 *   en vez de redirigir a ciegas, para no ocultar por qué no puede entrar.
 */
export default function RequireRole({
  allow,
  children,
}: {
  allow: UserRole[];
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, user, router, pathname]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 text-sm text-soil-400">Cargando…</div>
    );
  }

  if (!user) return null;

  if (!allow.includes(user.role)) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14">
        <div className="border border-dashed border-forest-200 rounded-stamp p-10 text-center text-soil-400 text-sm">
          Esta sección está disponible solo para cuentas de comprador.
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
