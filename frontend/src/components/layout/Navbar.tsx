"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sprout,
  Heart,
  ShoppingCart,
  User,
  ChevronDown,
  LogOut,
  Package,
  Menu,
  X,
  Store,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import NotificationBell from "@/components/layout/NotificationBell";

export default function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: cart } = useCart();
  const itemCount = cart?.items?.length ?? 0;
  const isCustomer = user?.role === "CUSTOMER";

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  async function handleLogout() {
    setMenuOpen(false);
    setMobileOpen(false);
    await logout();
    router.push("/");
  }

  return (
    <header className="border-b border-border bg-bg/95 backdrop-blur-md sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between h-16 sm:h-18">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-textPrimary group"
        >
          <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm group-hover:bg-primary-dark transition-colors">
            <Sprout className="w-5 h-5 text-secondary" strokeWidth={2.2} />
          </div>
          <span className="flex items-center gap-1">
            Agro<span className="text-primary">Link</span>
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-body font-semibold text-secondary-dark tracking-wider uppercase bg-status-warningContainer px-2 py-0.5 rounded-full border border-secondary/30">
            <Sparkles className="w-2.5 h-2.5 text-secondary-dark" />
            Honduras
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-textSecondary">
          <Link
            href="/"
            className={`px-3.5 py-2 rounded-xl transition-all ${
              pathname === "/"
                ? "text-textPrimary bg-surfaceVariant font-semibold"
                : "hover:text-textPrimary hover:bg-surfaceVariant/60"
            }`}
          >
            Inicio
          </Link>
          <Link
            href="/productos"
            className={`px-3.5 py-2 rounded-xl transition-all ${
              pathname.startsWith("/productos")
                ? "text-textPrimary bg-surfaceVariant font-semibold"
                : "hover:text-textPrimary hover:bg-surfaceVariant/60"
            }`}
          >
            Catálogo
          </Link>
          <Link
            href="/vendedores"
            className={`px-3.5 py-2 rounded-xl transition-all ${
              pathname.startsWith("/vendedores")
                ? "text-textPrimary bg-surfaceVariant font-semibold"
                : "hover:text-textPrimary hover:bg-surfaceVariant/60"
            }`}
          >
            Vendedores
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {isCustomer && (
            <>
              <Link
                href="/favoritos"
                className="p-2 rounded-xl hover:bg-surfaceVariant text-textSecondary hover:text-textPrimary transition-colors"
                title="Mis favoritos"
              >
                <Heart className="w-5 h-5" />
              </Link>
              <Link
                href="/pedidos"
                className="p-2 rounded-xl hover:bg-surfaceVariant text-textSecondary hover:text-textPrimary transition-colors"
                title="Mis pedidos"
              >
                <Package className="w-5 h-5" />
              </Link>
              <Link
                href="/carrito"
                className="relative p-2 rounded-xl hover:bg-surfaceVariant text-textSecondary hover:text-textPrimary transition-colors"
                title="Carrito"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center min-w-[18px] h-[18px] shadow-sm">
                    {itemCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {!isLoading && user && <NotificationBell />}

          {isLoading ? null : user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surfaceVariant text-textPrimary transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-sm font-medium">
                  {user.name.split(" ")[0]}
                </span>
                <ChevronDown className="w-4 h-4 text-textSecondary" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-border rounded-2xl shadow-lg py-2 text-textPrimary z-50 animate-slideDown">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-semibold text-textPrimary">{user.name}</p>
                    <p className="text-xs text-textSecondary truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/perfil"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-surfaceVariant text-textSecondary hover:text-textPrimary transition-colors"
                  >
                    <User className="w-4 h-4" /> Mi perfil
                  </Link>
                  {user.role === "CUSTOMER" && (
                    <Link
                      href="/pedidos"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-surfaceVariant text-textSecondary hover:text-textPrimary transition-colors"
                    >
                      <Package className="w-4 h-4" /> Mis pedidos
                    </Link>
                  )}
                  {user.role === "SELLER" && (
                    <Link
                      href="/vendedor/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-surfaceVariant text-textSecondary hover:text-textPrimary transition-colors"
                    >
                      <Store className="w-4 h-4" /> Panel de vendedor
                    </Link>
                  )}
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-surfaceVariant text-textSecondary hover:text-textPrimary transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Panel admin
                    </Link>
                  )}
                  <div className="border-t border-border mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-status-danger hover:bg-status-dangerContainer text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-textSecondary hover:text-textPrimary hover:bg-surfaceVariant rounded-xl transition-all"
              >
                Ingresar
              </Link>
              <Link
                href="/registro/vendedor"
                className="btn-gold shadow-sm text-xs sm:text-sm py-2 px-4"
              >
                <Store className="w-4 h-4" />
                <span>Vender</span>
              </Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 text-textSecondary hover:bg-surfaceVariant rounded-xl"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-4 space-y-2 animate-slideDown shadow-md">
          <Link
            href="/"
            className="block px-3 py-2 rounded-xl text-sm font-medium text-textPrimary hover:bg-surfaceVariant"
          >
            Inicio
          </Link>
          <Link
            href="/productos"
            className="block px-3 py-2 rounded-xl text-sm font-medium text-textPrimary hover:bg-surfaceVariant"
          >
            Catálogo de Productos
          </Link>
          <Link
            href="/vendedores"
            className="block px-3 py-2 rounded-xl text-sm font-medium text-textPrimary hover:bg-surfaceVariant"
          >
            Directorio de Vendedores
          </Link>
          {!user && (
            <Link
              href="/login"
              className="block px-3 py-2 rounded-xl text-sm font-medium text-textPrimary hover:bg-surfaceVariant sm:hidden"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
