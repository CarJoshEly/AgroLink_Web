"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api/client";
import PasswordInput from "@/components/ui/PasswordInput";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import type { User } from "@/lib/types";

const schema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  // Cuando RequireRole redirige aquí (p. ej. desde /carrito sin sesión),
  // manda `?redirect=<ruta original>` para volver ahí tras iniciar sesión.
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { login, loginWithGoogle } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function goToDestination(user: User) {
    if (redirect) {
      router.push(redirect);
    } else if (user.role === "ADMIN") {
      router.push("/admin/dashboard");
    } else if (user.role === "SELLER") {
      router.push(user.sellerProfile ? "/vendedor/dashboard" : "/");
    } else {
      router.push("/");
    }
    router.refresh();
  }

  async function onSubmit(values: FormValues) {
    setFormError(null);
    try {
      const user = await login(values.email, values.password);
      goToDestination(user);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 429) {
          setFormError("Demasiados intentos, espera un momento.");
        } else if (err.status === 401) {
          setFormError("Correo o contraseña incorrectos.");
        } else {
          setFormError(err.message);
        }
      } else {
        setFormError("Ocurrió un error inesperado. Intenta de nuevo.");
      }
    }
  }

  async function onGoogleIdToken(idToken: string) {
    setFormError(null);
    setIsGoogleLoading(true);
    try {
      const user = await loginWithGoogle(idToken);
      goToDestination(user);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "No se pudo iniciar sesión con Google.");
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {formError && (
        <div className="bg-red-50 border border-red-100 rounded-stamp p-3 text-sm text-red-700">{formError}</div>
      )}

      <label className="block">
        <span className="text-sm font-medium text-forest-800">Correo electrónico</span>
        <input type="email" className="input mt-1" {...register("email")} />
        {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
      </label>

      <label className="block">
        <span className="text-sm font-medium text-forest-800">Contraseña</span>
        <PasswordInput className="input mt-1" {...register("password")} />
        {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
      </label>

      <div className="flex justify-end text-sm">
        <Link href="/olvide-password" className="text-forest-700 font-medium">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-forest-700 text-stone-25 font-medium py-2.5 rounded-stamp hover:bg-forest-800 transition-colors disabled:opacity-60"
      >
        {isSubmitting ? "Ingresando…" : "Ingresar"}
      </button>

      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-soil-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-soil-400">o</span>
        </div>
      </div>

      <GoogleSignInButton onIdToken={onGoogleIdToken} text="signin_with" />
      {isGoogleLoading && <p className="text-xs text-soil-500 text-center">Iniciando sesión con Google…</p>}
    </form>
  );
}
