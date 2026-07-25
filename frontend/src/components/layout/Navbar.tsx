"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sprout, Heart, ShoppingCart, User, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    router.push("/");
  }

  return (
    <header className="border-b border-forest-100 bg-stone-25/95 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold text-forest-800">
          <Sprout className="w-6 h-6 text-forest-600" strokeWidth={2} />
          AgroLink
          <span className="hidden sm:inline text-xs font-body font-normal text-soil-400 tracking-wide uppercase ml-1">
            Honduras
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm font-medium text-forest-700">
          <Link href="/" className="hover:text-forest-900 transition-colors">
            Catálogo
          </Link>
          <Link href="/favoritos" className="hover:text-forest-900 transition-colors">
            <Heart className="w-5 h-5" />
          </Link>
          <Link href="/carrito" className="hover:text-forest-900 transition-colors">
            <ShoppingCart className="w-5 h-5" />
          </Link>

          {isLoading ? null : user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 hover:text-forest-900 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-forest-100 rounded-stamp shadow-lg py-1 text-forest-800">
                  <Link
                    href="/perfil"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-forest-50"
                  >
                    Mi perfil
                  </Link>
                  {user.role === "CUSTOMER" && (
                    <Link
                      href="/pedidos"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-forest-50"
                    >
                      Mis pedidos
                    </Link>
                  )}
                  {user.role === "SELLER" && (
                    <Link
                      href="/vendedor/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-forest-50"
                    >
                      Mi panel de vendedor
                    </Link>
                  )}
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-forest-50"
                    >
                      Panel admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block hover:text-forest-900 transition-colors">
                Ingresar
              </Link>
              <Link
                href="/registro/vendedor"
                className="bg-forest-700 text-stone-25 px-3 py-1.5 rounded-stamp hover:bg-forest-800 transition-colors"
              >
                Vender
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
