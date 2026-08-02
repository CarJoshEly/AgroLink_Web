import Link from "next/link";
import { Sprout, MapPin, Heart, ArrowUpRight, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-black text-[#EDF0E8] mt-24 overflow-hidden border-t border-neutral-900">
      {/* Upper CTA Banner */}
      <div className="border-b border-neutral-900 bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-secondary shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                ¿Eres productor agricultor en Honduras?
              </h3>
              <p className="text-[#B2BAA9] text-xs sm:text-sm mt-1">
                Publica tu cosecha sin comisiones ocultas y conecta con compradores de todo el país.
              </p>
            </div>
          </div>
          <Link
            href="/registro/vendedor"
            className="btn-gold whitespace-nowrap shadow-md"
          >
            Registrarme como Vendedor
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-display text-2xl font-bold text-white group"
          >
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-inner">
              <Sprout className="w-5 h-5 text-secondary" />
            </div>
            <span>
              Agro<span className="text-secondary">Link</span>
            </span>
          </Link>
          <p className="text-[#B2BAA9] text-xs leading-relaxed max-w-md">
            Plataforma líder para la digitalización y comercialización directa del agro hondureño. Conectamos fincas, cooperativas y comerciantes locales en los 18 departamentos.
          </p>
          <div className="flex items-center gap-2 text-xs text-secondary font-medium pt-1">
            <MapPin className="w-4 h-4 text-secondary" />
            <span>Santa Rosa de Copán, Honduras</span>
          </div>
        </div>

        {/* Links Col 1: Marketplace */}
        <div>
          <h4 className="font-display font-semibold text-secondary mb-4 text-xs uppercase tracking-widest">
            Marketplace
          </h4>
          <ul className="space-y-2.5 text-xs text-[#B2BAA9]">
            <li>
              <Link href="/productos" className="hover:text-white transition-colors">
                Catálogo de Productos
              </Link>
            </li>
            <li>
              <Link href="/vendedores" className="hover:text-white transition-colors">
                Directorio de Vendedores
              </Link>
            </li>
            <li>
              <Link href="/registro/vendedor" className="hover:text-white transition-colors">
                Unirse como Productor
              </Link>
            </li>
          </ul>
        </div>

        {/* Links Col 2: Mi Cuenta */}
        <div>
          <h4 className="font-display font-semibold text-secondary mb-4 text-xs uppercase tracking-widest">
            Mi Cuenta
          </h4>
          <ul className="space-y-2.5 text-xs text-[#B2BAA9]">
            <li>
              <Link href="/login" className="hover:text-white transition-colors">
                Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link href="/favoritos" className="hover:text-white transition-colors">
                Mis Favoritos
              </Link>
            </li>
            <li>
              <Link href="/pedidos" className="hover:text-white transition-colors">
                Historial de Pedidos
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-neutral-900 bg-black py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-xs text-[#B2BAA9] flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© {new Date().getFullYear()} AgroLink Honduras. Conectando el ecosistema agrícola.</p>
          <p className="flex items-center gap-1.5 text-[#B2BAA9]">
            Hecho con <Heart className="w-3.5 h-3.5 text-status-danger fill-status-danger" /> para el campo hondureño
          </p>
        </div>
      </div>
    </footer>
  );
}
