"use client";

import { useState } from "react";
import { changePassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import PasswordInput from "@/components/ui/PasswordInput";
import { useAuth } from "@/hooks/useAuth";
import { PASSWORD_MIN_LENGTH, validatePassword } from "@/lib/validation/password";

export default function ChangePasswordForm() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const passwordError = validatePassword(newPassword, [user?.name, user?.email]);
    if (passwordError) {
      setError(passwordError);
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
        <PasswordInput
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="input mt-1"
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-forest-700">Nueva contraseña</span>
        <PasswordInput
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="input mt-1"
        />
        <p className="text-xs text-soil-400 mt-1">
          Mínimo {PASSWORD_MIN_LENGTH} caracteres, con mayúsculas, minúsculas, números y un símbolo.
        </p>
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
