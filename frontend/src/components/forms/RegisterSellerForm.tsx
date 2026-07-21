"use client";

import { useState } from "react";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { registerSeller } from "@/lib/api/auth";

export default function RegisterSellerForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    businessName: "",
    department: "",
    identityDocumentNumber: "",
  });
  const [front, setFront] = useState<File | null>(null);
  const [back, setBack] = useState<File | null>(null);
  const [liveness, setLiveness] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const wantsVerification = Boolean(
    form.identityDocumentNumber || front || back || liveness
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await registerSeller({
        ...form,
        identityDocumentFront: front,
        identityDocumentBack: back,
        livenessCheck: liveness,
      });
      setDone(true);
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="bg-forest-50 border border-forest-100 rounded-stamp p-5 text-forest-700 text-sm space-y-1">
        <p className="font-medium">¡Cuenta de vendedor creada!</p>
        <p>
          {wantsVerification
            ? "Tu documentación quedó en revisión. Cuando el administrador la apruebe, tu perfil mostrará la insignia de verificación."
            : "Ya puedes publicar productos. Si más adelante quieres obtener la insignia de verificación, puedes completar tu perfil desde tu cuenta."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Nombre completo" required>
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
      </Field>
      <Field label="Nombre del negocio / finca" required>
        <input
          required
          value={form.businessName}
          onChange={(e) => setForm({ ...form, businessName: e.target.value })}
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
        <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" />
      </Field>
      <Field label="Departamento">
        <input
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
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

      {/* Sección de verificación opcional */}
      <div className="border border-forest-100 rounded-stamp p-4 bg-forest-50/50 space-y-4">
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-5 h-5 text-forest-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-forest-800">Verificación de perfil (opcional)</p>
            <p className="text-xs text-soil-500 mt-0.5">
              Ninguno de estos datos es obligatorio para registrarte ni para vender. Si decides
              completarlos y un administrador los aprueba, tu perfil mostrará la insignia{" "}
              <span className="inline-flex items-center gap-0.5 text-forest-700 font-medium">
                <BadgeCheck className="w-3.5 h-3.5" /> Verificado
              </span>{" "}
              frente a los compradores.
            </p>
          </div>
        </div>

        <Field label="Número de identidad">
          <input
            value={form.identityDocumentNumber}
            onChange={(e) => setForm({ ...form, identityDocumentNumber: e.target.value })}
            className="input"
            placeholder="Opcional"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <FileField label="Foto DNI (frontal)" file={front} onChange={setFront} />
          <FileField label="Foto DNI (posterior)" file={back} onChange={setBack} />
        </div>
        <FileField label="Prueba de vida (selfie)" file={liveness} onChange={setLiveness} />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="w-full bg-forest-700 text-stone-25 font-medium py-2.5 rounded-stamp hover:bg-forest-800 transition-colors disabled:opacity-60"
      >
        {sending ? "Creando cuenta…" : "Crear cuenta de vendedor"}
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
        {!required && <span className="text-soil-400 font-normal"> (opcional)</span>}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function FileField({
  label,
  file,
  onChange,
}: {
  label: string;
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-forest-700">{label}</span>
      <div className="mt-1 border border-dashed border-forest-200 rounded-stamp px-3 py-2 text-xs text-soil-500 hover:border-forest-400 transition-colors cursor-pointer bg-white">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
        {file ? file.name : "Subir archivo (opcional)"}
      </div>
    </label>
  );
}
