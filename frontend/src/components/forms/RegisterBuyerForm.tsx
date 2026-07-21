"use client";

import { useState } from "react";
import { registerBuyer } from "@/lib/api/auth";

export default function RegisterBuyerForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await registerBuyer(form);
      setDone(true);
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="bg-forest-50 border border-forest-100 rounded-stamp p-5 text-forest-700 text-sm">
        ¡Cuenta creada! Ya puedes explorar el catálogo y enviar solicitudes de compra.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Nombre completo" required>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="input"
        />
      </Field>
      <Field label="Correo electrónico" required>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="input"
        />
      </Field>
      <Field label="Teléfono" required>
        <input
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="input"
        />
      </Field>
      <Field label="Contraseña" required>
        <input
          type="password"
          required
          minLength={8}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="input"
        />
      </Field>

      <button
        type="submit"
        disabled={sending}
        className="w-full bg-forest-700 text-stone-25 font-medium py-2.5 rounded-stamp hover:bg-forest-800 transition-colors disabled:opacity-60"
      >
        {sending ? "Creando cuenta…" : "Crear cuenta"}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-forest-800">
        {label} {required && <span className="text-soil-400">*</span>}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
