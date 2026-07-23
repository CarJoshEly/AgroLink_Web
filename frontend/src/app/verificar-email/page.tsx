"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { verifyEmail } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import ResendVerificationForm from "@/components/forms/ResendVerificationForm";

type Status = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("El enlace no incluye un token de verificación.");
      return;
    }
    verifyEmail(token)
      .then((res) => {
        setStatus("success");
        setMessage(res.message ?? "Tu correo fue verificado correctamente.");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err instanceof ApiError ? err.rawMessage.join(" ") : "No se pudo verificar el correo.");
      });
  }, [token]);

  return (
    <div className="mx-auto max-w-md px-4 py-14 text-center">
      {status === "loading" && (
        <>
          <Loader2 className="w-10 h-10 text-forest-500 animate-spin mx-auto mb-4" />
          <p className="text-forest-700">Verificando tu correo…</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle2 className="w-12 h-12 text-forest-600 mx-auto mb-4" />
          <h1 className="font-display text-xl text-forest-900 mb-2">¡Correo verificado!</h1>
          <p className="text-sm text-soil-500 mb-6">{message}</p>
          <Link
            href="/login"
            className="inline-block bg-forest-700 text-stone-25 font-medium px-5 py-2.5 rounded-stamp hover:bg-forest-800 transition-colors"
          >
            Ir a iniciar sesión
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="font-display text-xl text-forest-900 mb-2">No pudimos verificar tu correo</h1>
          <p className="text-sm text-soil-500 mb-6">{message}</p>
          <ResendVerificationForm />
        </>
      )}
    </div>
  );
}
