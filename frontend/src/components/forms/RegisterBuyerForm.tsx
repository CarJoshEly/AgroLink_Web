"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerBuyer } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import PasswordInput from "@/components/ui/PasswordInput";

// Replica exacta de la regex del backend: mínimo 8 caracteres, al menos una
// letra y al menos un número.
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).+$/;

const schema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(100, "Máximo 100 caracteres"),
  email: z.string().email("Correo inválido"),
  phone: z.string().optional().or(z.literal("")),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(PASSWORD_REGEX, "Debe incluir al menos una letra y un número"),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterBuyerForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [devVerificationLink, setDevVerificationLink] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setFormError(null);
    try {
      const result = await registerBuyer({
        ...values,
        phone: values.phone || undefined,
      });
      if (process.env.NODE_ENV !== "production" && result.verificationToken) {
        setDevVerificationLink(`/verificar-email?token=${result.verificationToken}`);
      }
      setDone(true);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.rawMessage.join(" ") : "No se pudo crear la cuenta.");
    }
  }

  if (done) {
    return (
      <div className="bg-forest-50 border border-forest-100 rounded-stamp p-5 text-forest-700 text-sm space-y-3">
        <p>Revisa tu correo para activar tu cuenta.</p>
        {devVerificationLink && (
          <div className="border-t border-forest-100 pt-3">
            <p className="text-xs text-soil-500 mb-1">Modo desarrollo — enlace directo:</p>
            <Link href={devVerificationLink} className="text-forest-800 font-medium underline break-all">
              {devVerificationLink}
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {formError && (
        <div className="bg-red-50 border border-red-100 rounded-stamp p-3 text-sm text-red-700">{formError}</div>
      )}

      <Field label="Nombre completo" required error={errors.name?.message}>
        <input {...register("name")} className="input" />
      </Field>
      <Field label="Correo electrónico" required error={errors.email?.message}>
        <input type="email" {...register("email")} className="input" />
      </Field>
      <Field label="Teléfono" error={errors.phone?.message}>
        <input {...register("phone")} className="input" />
      </Field>
      <Field label="Contraseña" required error={errors.password?.message}>
        <PasswordInput {...register("password")} className="input" />
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-forest-700 text-stone-25 font-medium py-2.5 rounded-stamp hover:bg-forest-800 transition-colors disabled:opacity-60"
      >
        {isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-forest-800">
        {label} {required && <span className="text-soil-400">*</span>}
      </span>
      <div className="mt-1">{children}</div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </label>
  );
}
