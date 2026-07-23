"use client";

import { useState } from "react";
import { resendVerification } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export default function ResendVerificationForm() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      await resendVerification(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.rawMessage.join(" ") : "No se pudo reenviar el correo.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <p className="text-sm text-forest-700 bg-forest-50 border border-forest-100 rounded-stamp p-4">
        Si el correo existe y no ha sido verificado, te enviamos un nuevo enlace.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="text-left space-y-3">
      <label className="block">
        <span className="text-sm font-medium text-forest-800">Reenviar verificación a</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input mt-1"
          placeholder="tu@correo.com"
        />
      </label>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="w-full bg-forest-700 text-stone-25 font-medium py-2.5 rounded-stamp hover:bg-forest-800 transition-colors disabled:opacity-60"
      >
        {sending ? "Enviando…" : "Reenviar verificación"}
      </button>
    </form>
  );
}
