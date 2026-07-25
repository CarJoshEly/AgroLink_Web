import Link from "next/link";
import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="font-display text-2xl text-forest-900 mb-1">Ingresar</h1>
      <p className="text-sm text-soil-500 mb-8">Bienvenido de nuevo a AgroLink.</p>

      <LoginForm />

      <p className="text-sm text-soil-500 mt-6 text-center">
        ¿No tienes cuenta?{" "}
        <Link href="/registro/comprador" className="text-forest-700 font-medium">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
