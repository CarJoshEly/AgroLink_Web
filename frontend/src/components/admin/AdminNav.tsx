"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/vendedores", label: "Vendedores" },
  { href: "/admin/usuarios", label: "Usuarios" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/resenas", label: "Reseñas" },
  { href: "/admin/reportes", label: "Reportes" },
  { href: "/admin/finanzas/transacciones", label: "Transacciones" },
  { href: "/admin/finanzas/comision", label: "Comisión" },
  { href: "/admin/finanzas/metodos-pago", label: "Métodos de pago" },
  { href: "/admin/auditoria", label: "Auditoría" },
  { href: "/admin/configuracion", label: "Configuración" },
];

/** Navegación por tabs, compartida por todas las páginas de /admin/*. */
export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto pb-2 mb-8 border-b border-forest-100 -mx-1 px-1">
      {LINKS.map((link) => {
        const active = pathname === link.href || pathname?.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`whitespace-nowrap text-sm px-3 py-2 rounded-t-stamp transition-colors border-b-2 ${
              active
                ? "border-forest-700 text-forest-800 font-medium"
                : "border-transparent text-soil-500 hover:text-forest-700"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
