"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { registerSeller } from "@/lib/api/auth";
import { fetchDepartments, fetchMunicipalities } from "@/lib/api/locations";
import { ApiError } from "@/lib/api/client";
import type { Department, Municipality } from "@/lib/types";

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).+$/;
// Formato hondureño: XXXX-XXXX-XXXXX
const DNI_REGEX = /^\d{4}-\d{4}-\d{5}$/;

const schema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(100, "Máximo 100 caracteres"),
  email: z.string().email("Correo inválido"),
  phone: z.string().min(1, "El teléfono es obligatorio para vendedores"),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(PASSWORD_REGEX, "Debe incluir al menos una letra y un número"),
  businessName: z.string().min(2, "Mínimo 2 caracteres").max(150, "Máximo 150 caracteres"),
  dni: z.string().regex(DNI_REGEX, "Formato esperado: 0801-1990-12345"),
  departmentId: z.string().min(1, "Selecciona un departamento"),
  municipalityId: z.string().min(1, "Selecciona un municipio"),
  address: z.string().min(5, "Mínimo 5 caracteres"),
  latitude: z.coerce.number({ message: "Ingresa un número válido" }).min(-90).max(90),
  longitude: z.coerce.number({ message: "Ingresa un número válido" }).min(-180).max(180),
});

type FormValues = z.infer<typeof schema>;

function formatDni(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 13);
  const p1 = digits.slice(0, 4);
  const p2 = digits.slice(4, 8);
  const p3 = digits.slice(8, 13);
  return [p1, p2, p3].filter(Boolean).join("-");
}

export default function RegisterSellerForm() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [devVerificationLink, setDevVerificationLink] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const departmentId = watch("departmentId");

  useEffect(() => {
    fetchDepartments()
      .then(setDepartments)
      .catch(() => setFormError("No se pudieron cargar los departamentos. Intenta recargar la página."));
  }, []);

  useEffect(() => {
    if (!departmentId) {
      setMunicipalities([]);
      return;
    }
    setLoadingMunicipalities(true);
    resetField("municipalityId");
    fetchMunicipalities(departmentId)
      .then(setMunicipalities)
      .catch(() => setFormError("No se pudieron cargar los municipios."))
      .finally(() => setLoadingMunicipalities(false));
  }, [departmentId, resetField]);

  async function onSubmit(values: FormValues) {
    setFormError(null);
    try {
      const result = await registerSeller(values);
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
        <p>
          Revisa tu correo para activar tu cuenta. Luego inicia sesión para completar tu verificación de
          identidad.
        </p>
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
      <Field label="Teléfono" required error={errors.phone?.message}>
        <input {...register("phone")} className="input" />
      </Field>
      <Field label="Contraseña" required error={errors.password?.message}>
        <input type="password" {...register("password")} className="input" />
      </Field>

      <Field label="Nombre del negocio / finca" required error={errors.businessName?.message}>
        <input {...register("businessName")} className="input" />
      </Field>

      <Field label="Número de identidad (DNI)" required error={errors.dni?.message}>
        <Controller
          control={control}
          name="dni"
          render={({ field }) => (
            <input
              {...field}
              placeholder="0801-1990-12345"
              className="input"
              onChange={(e) => setValue("dni", formatDni(e.target.value), { shouldValidate: true })}
            />
          )}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Departamento" required error={errors.departmentId?.message}>
          <select {...register("departmentId")} className="input">
            <option value="">Selecciona…</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Municipio" required error={errors.municipalityId?.message}>
          <select {...register("municipalityId")} className="input" disabled={!departmentId || loadingMunicipalities}>
            <option value="">{loadingMunicipalities ? "Cargando…" : "Selecciona…"}</option>
            {municipalities.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Dirección" required error={errors.address?.message}>
        <input {...register("address")} className="input" placeholder="Punto de referencia, calle, aldea…" />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Latitud" required error={errors.latitude?.message}>
          <input type="number" step="any" {...register("latitude")} className="input" />
        </Field>
        <Field label="Longitud" required error={errors.longitude?.message}>
          <input type="number" step="any" {...register("longitude")} className="input" />
        </Field>
      </div>
      <p className="text-xs text-soil-500 -mt-2">
        Tip: puedes obtener tu latitud/longitud abriendo tu ubicación en Google Maps y copiando las
        coordenadas. El selector visual en mapa llega en el próximo sprint.
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-forest-700 text-stone-25 font-medium py-2.5 rounded-stamp hover:bg-forest-800 transition-colors disabled:opacity-60"
      >
        {isSubmitting ? "Creando cuenta…" : "Crear cuenta de vendedor"}
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
