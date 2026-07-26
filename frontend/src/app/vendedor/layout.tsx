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

function VerificationRequiredNotice() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <ShieldAlert className="w-10 h-10 text-maize-600 mx-auto mb-4" strokeWidth={1.5} />
      <h1 className="font-display text-xl text-forest-900 mb-2">Verifica tu identidad primero</h1>
      <p className="text-sm text-soil-500 mb-6">
        Para publicar productos y gestionar tu tienda en AgroLink, un administrador debe validar tu
        identidad. Completa ese paso para desbloquear el panel de vendedor.
      </p>
      <Link
        href="/vendedor/verificacion"
        className="inline-block bg-forest-700 text-stone-25 text-sm font-medium px-5 py-2.5 rounded-stamp hover:bg-forest-800 transition-colors"
      >
        Completar verificación
      </Link>
    </div>
  );
}

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  // La propia página de verificación debe quedar accesible aunque el
  // vendedor todavía no esté VERIFIED — es literalmente el paso para llegar
  // a estarlo.
  const isVerificationPage = pathname === "/vendedor/verificacion";
  const isVerified = user?.sellerProfile?.verificationStatus === "VERIFIED";

  return (
    <RouteGuard allowedRoles={["SELLER"]}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        {!isVerificationPage && <SellerNav />}
        {!isVerified && !isVerificationPage ? <VerificationRequiredNotice /> : children}
      </div>
    </RouteGuard>
  );
}
