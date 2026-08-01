"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import PasswordInput from "@/components/ui/PasswordInput";

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).+$/;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("El enlace no incluye un token válido.");
      return;
    }
    if (password.length < 8 || !PASSWORD_REGEX.test(password)) {
      setError("La contraseña debe tener mínimo 8 caracteres, con al menos una letra y un número.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setSending(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.rawMessage.join(" ") : "No se pudo restablecer la contraseña.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-14 text-center">
        <h1 className="font-display text-2xl text-forest-900 mb-2">Contraseña actualizada</h1>
        <p className="text-sm text-soil-500 mb-6">Ya puedes iniciar sesión con tu nueva contraseña.</p>
        <button
          onClick={() => router.push("/login")}
          className="bg-forest-700 text-stone-25 font-medium px-5 py-2.5 rounded-stamp hover:bg-forest-800 transition-colors"
        >
          Ir a iniciar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="font-display text-2xl text-forest-900 mb-1">Restablecer contraseña</h1>
      <p className="text-sm text-soil-500 mb-8">Elige una nueva contraseña para tu cuenta.</p>

      {!token && (
        <p className="text-sm text-red-600 mb-4">
          Este enlace no es válido. Solicita uno nuevo desde{" "}
          <Link href="/olvide-password" className="underline font-medium">
            recuperar contraseña
          </Link>
          .
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-forest-800">Nueva contraseña</span>
          <PasswordInput
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input mt-1"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-forest-800">Confirmar contraseña</span>
          <PasswordInput
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="input mt-1"
          />
        </label>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={sending || !token}
          className="w-full bg-forest-700 text-stone-25 font-medium py-2.5 rounded-stamp hover:bg-forest-800 transition-colors disabled:opacity-60"
        >
          {sending ? "Guardando…" : "Restablecer contraseña"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={<div className="mx-auto max-w-md px-4 py-14 text-sm text-soil-400">Cargando…</div>}
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
