import RegisterBuyerForm from "@/components/forms/RegisterBuyerForm";
import Link from "next/link";

export default function RegisterBuyerPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="font-display text-2xl text-forest-900 mb-1">Crear cuenta de comprador</h1>
      <p className="text-sm text-soil-500 mb-8">Registro rápido, solo lo esencial.</p>

      <RegisterBuyerForm />

      <p className="text-sm text-soil-500 mt-6 text-center">
        ¿Quieres vender en AgroLink?{" "}
        <Link href="/registro/vendedor" className="text-forest-700 font-medium">
          Regístrate como vendedor
        </Link>
      </p>
    </div>
  );
}
