"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import RouteGuard from "@/components/auth/RouteGuard";
import { useAuth } from "@/hooks/useAuth";

const NAV_ITEMS = [
  { href: "/vendedor/dashboard", label: "Dashboard" },
  { href: "/vendedor/productos", label: "Productos" },
  { href: "/vendedor/pedidos", label: "Pedidos" },
  { href: "/vendedor/transacciones", label: "Transacciones" },
];

function SellerNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 border-b border-forest-100 mb-8 overflow-x-auto">
      {NAV_ITEMS.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              active
                ? "border-forest-700 text-forest-800"
                : "border-transparent text-soil-400 hover:text-forest-700"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * A diferencia de antes, ya NO bloquea el panel — un vendedor sin verificar
 * puede publicar productos y recibir pedidos igual (modelo estilo eBay).
 * Este banner es solo un recordatorio persistente, no un candado: se
 * muestra en todas las páginas del panel (menos la de verificación en sí).
 */
function VerificationReminderBanner() {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-stamp border border-maize-300 bg-maize-100 px-4 py-3">
      <ShieldAlert className="w-5 h-5 text-maize-600 shrink-0 mt-0.5" strokeWidth={1.5} />
      <div className="flex-1 text-sm text-soil-600">
        <p>
          Todavía no verificas tu identidad. Puedes publicar productos y vender igual, pero tus
          compradores verán que tu cuenta <strong>no está verificada</strong>. Verifícate para ganar
          más confianza.
        </p>
        <Link
          href="/vendedor/verificacion"
          className="inline-block mt-2 text-forest-700 font-medium hover:underline"
        >
          Completar verificación →
        </Link>
      </div>
    </div>
  );
}

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  // La propia página de verificación no necesita repetirse el recordatorio.
  const isVerificationPage = pathname === "/vendedor/verificacion";
  const isVerified = user?.sellerProfile?.verificationStatus === "VERIFIED";

  return (
    <RouteGuard allowedRoles={["SELLER"]}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        {!isVerificationPage && <SellerNav />}
        {!isVerified && !isVerificationPage && <VerificationReminderBanner />}
        {children}
      </div>
    </RouteGuard>
  );
}
