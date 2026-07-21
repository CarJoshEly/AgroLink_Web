// import { apiFetch } from "./client";

// RF-01: registro sencillo de comprador (nombre, correo, teléfono, contraseña)
export interface RegisterBuyerInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

// RF-02: registro de vendedor.
// IMPORTANTE: el número de identidad, las fotos del DNI y la "prueba de
// vida" son OPCIONALES para cualquier usuario. Si se completan, el
// backend inicia el flujo de revisión (profileCompletionStatus) que,
// al ser aprobado por un administrador, otorga `hasVerifiedBadge: true`.
export interface RegisterSellerInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  businessName: string;
  department?: string;

  // Campos opcionales de verificación de perfil:
  identityDocumentNumber?: string;
  identityDocumentFront?: File | null;
  identityDocumentBack?: File | null;
  livenessCheck?: File | null;
}

export async function registerBuyer(input: RegisterBuyerInput): Promise<{ ok: true }> {
  // --- MOCK (activo hoy) ---
  console.info("[mock] Registro de comprador:", { ...input, password: "***" });
  return Promise.resolve({ ok: true });

  // --- API REAL ---
  // return apiFetch<{ ok: true }>("/api/auth/register/buyer", {
  //   method: "POST",
  //   body: JSON.stringify(input),
  // });
}

export async function registerSeller(input: RegisterSellerInput): Promise<{ ok: true }> {
  const hasCompletedVerification = Boolean(
    input.identityDocumentNumber ||
      input.identityDocumentFront ||
      input.identityDocumentBack ||
      input.livenessCheck
  );

  // --- MOCK (activo hoy) ---
  console.info("[mock] Registro de vendedor:", {
    ...input,
    password: "***",
    identityDocumentFront: input.identityDocumentFront?.name,
    identityDocumentBack: input.identityDocumentBack?.name,
    livenessCheck: input.livenessCheck?.name,
    profileCompletionStatus: hasCompletedVerification ? "PENDING" : undefined,
  });
  return Promise.resolve({ ok: true });

  // --- API REAL ---
  // Se debe enviar como multipart/form-data cuando incluya archivos.
  // const formData = new FormData();
  // Object.entries(input).forEach(([key, value]) => {
  //   if (value !== undefined && value !== null) formData.append(key, value as any);
  // });
  // return apiFetch<{ ok: true }>("/api/auth/register/seller", {
  //   method: "POST",
  //   body: formData,
  //   headers: {},
  // });
}
