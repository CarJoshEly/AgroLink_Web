import { apiFetch } from "./client";
import type { User } from "@/lib/types";

// RF-01: registro sencillo de comprador (nombre, correo, teléfono, contraseña)
export interface RegisterBuyerInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

// RF-02: registro de vendedor.
// IMPORTANTE: el número de identidad, las fotos del DNI y la "prueba de
// vida" son OPCIONALES para cualquier usuario. Si se completan, el
// backend inicia el flujo de revisión que, al ser aprobado por un
// administrador, otorga la insignia de verificación.
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

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export async function registerBuyer(input: RegisterBuyerInput): Promise<{ user: User; message: string }> {
  return apiFetch<{ user: User; message: string }>("/auth/register/buyer", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function registerSeller(input: RegisterSellerInput): Promise<{ ok: true }> {
  // El formulario actual (RegisterSellerForm) no recolecta los campos que
  // RegisterSellerDto exige (dni, departmentId, municipalityId, address,
  // latitude, longitude) — solo los campos opcionales de verificación de
  // identidad. Se conecta a la API real cuando ese formulario se reconstruya
  // con los campos de ubicación/DNI.
  const hasCompletedVerification = Boolean(
    input.identityDocumentNumber ||
      input.identityDocumentFront ||
      input.identityDocumentBack ||
      input.livenessCheck
  );

  console.info("[mock] Registro de vendedor:", {
    ...input,
    password: "***",
    identityDocumentFront: input.identityDocumentFront?.name,
    identityDocumentBack: input.identityDocumentBack?.name,
    livenessCheck: input.livenessCheck?.name,
    profileCompletionStatus: hasCompletedVerification ? "PENDING" : undefined,
  });
  return Promise.resolve({ ok: true });
}

export async function login(input: LoginInput): Promise<{ user: User } & AuthTokens> {
  return apiFetch<{ user: User } & AuthTokens>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function refresh(refreshToken: string): Promise<AuthTokens> {
  return apiFetch<AuthTokens>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function logout(refreshToken: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function me(accessToken?: string): Promise<User> {
  return apiFetch<User>("/auth/me", { authToken: accessToken });
}
