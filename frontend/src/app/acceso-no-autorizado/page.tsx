import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <ShieldAlert className="w-12 h-12 text-soil-400 mx-auto mb-4" />
      <h1 className="font-display text-2xl text-forest-900 mb-2">Acceso no autorizado</h1>
      <p className="text-sm text-soil-500 mb-6">No tienes permisos para ver esta página.</p>
      <Link
        href="/"
        className="inline-block bg-forest-700 text-stone-25 font-medium px-5 py-2.5 rounded-stamp hover:bg-forest-800 transition-colors"
      >
        Volver al catálogo
      </Link>
    </div>
  );
}
