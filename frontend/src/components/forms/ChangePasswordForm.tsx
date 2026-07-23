"use client";

import { useState } from "react";
import { changePassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).+$/;

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword.length < 8 || !PASSWORD_REGEX.test(newPassword)) {
      setError("La nueva contraseña debe tener mínimo 8 caracteres, con al menos una letra y un número.");
      return;
    }

    setSending(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err instanceof ApiError ? err.rawMessage.join(" ") : "No se pudo cambiar la contraseña.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block">
        <span className="text-xs font-medium text-forest-700">Contraseña actual</span>
        <input
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="input mt-1"
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-forest-700">Nueva contraseña</span>
        <input
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="input mt-1"
        />
      </label>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {success && <p className="text-xs text-forest-700">Contraseña actualizada correctamente.</p>}
      <button
        type="submit"
        disabled={sending}
        className="text-sm font-medium text-forest-700 border border-forest-300 px-3 py-1.5 rounded-stamp hover:bg-forest-100 transition-colors disabled:opacity-60"
      >
        {sending ? "Guardando…" : "Cambiar contraseña"}
      </button>
    </form>
  );
}
