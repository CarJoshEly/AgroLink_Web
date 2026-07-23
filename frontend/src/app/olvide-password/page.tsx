"use client";

import { useState } from "react";
import { forgotPassword } from "@/lib/api/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      // Siempre mostramos el mismo mensaje genérico, independientemente de
      // la respuesta real de la API — así se comporta intencionalmente el
      // backend para no revelar si un correo existe.
      await forgotPassword(email).catch(() => undefined);
    } finally {
      setSending(false);
      setSent(true);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="font-display text-2xl text-forest-900 mb-1">Recuperar contraseña</h1>
      <p className="text-sm text-soil-500 mb-8">
        Ingresa tu correo y te enviaremos instrucciones para restablecer tu contraseña.
      </p>

      {sent ? (
        <div className="bg-forest-50 border border-forest-100 rounded-stamp p-5 text-forest-700 text-sm">
          Si el correo existe, recibirás instrucciones.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-forest-800">Correo electrónico</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input mt-1"
            />
          </label>
          <button
            type="submit"
            disabled={sending}
            className="w-full bg-forest-700 text-stone-25 font-medium py-2.5 rounded-stamp hover:bg-forest-800 transition-colors disabled:opacity-60"
          >
            {sending ? "Enviando…" : "Enviar instrucciones"}
          </button>
        </form>
      )}
    </div>
  );
}
