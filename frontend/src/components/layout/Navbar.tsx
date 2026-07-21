import Link from "next/link";
import { Sprout, Heart, ShoppingCart, User } from "lucide-react";

export default function Navbar() {
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
          <Link
            href="/registro/comprador"
            className="hidden sm:block hover:text-forest-900 transition-colors"
          >
            Ingresar
          </Link>
          <Link
            href="/registro/vendedor"
            className="bg-forest-700 text-stone-25 px-3 py-1.5 rounded-stamp hover:bg-forest-800 transition-colors"
          >
            Vender
          </Link>
          <Link href="/perfil" className="hover:text-forest-900 transition-colors">
            <User className="w-5 h-5" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
