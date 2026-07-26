import { apiFetch, apiFetchForm } from "./client";
import type { User, VerificationStatus } from "@/lib/types";

// --------------------------------------------------------------------------
// Registro de comprador
// --------------------------------------------------------------------------

export interface RegisterBuyerInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface RegisterBuyerResponse {
  user: User;
  message: string;
  /** Solo presente en NODE_ENV !== "production" (devTokenHint del backend). */
  verificationToken?: string;
}

export async function registerBuyer(input: RegisterBuyerInput): Promise<RegisterBuyerResponse> {
  return apiFetch<RegisterBuyerResponse>("/auth/register/buyer", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// --------------------------------------------------------------------------
// Registro de vendedor — Paso 1 (cuenta + negocio + ubicación)
// Los documentos de identidad (dniFront/dniBack/selfie/lifeProof) van en el
// Paso 2, autenticado, vía PUT /users/me/identity-verification.
// --------------------------------------------------------------------------

export interface RegisterSellerInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  businessName: string;
  dni: string;
  departmentId: string;
  municipalityId: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface RegisterSellerResponse {
  user: User;
  message: string;
  verificationToken?: string;
}

export async function registerSeller(input: RegisterSellerInput): Promise<RegisterSellerResponse> {
  return apiFetch<RegisterSellerResponse>("/auth/register/seller", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// --------------------------------------------------------------------------
// Login / sesión
// --------------------------------------------------------------------------

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginInput {
  email: string;
  password: string;
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

export async function logoutAll(): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/logout-all", { method: "POST" });
}

/**
 * OJO: usa /users/me (no /auth/me). /auth/me devuelve el usuario "pelado",
 * sin `sellerProfile` ni `locations` — y el resto de la app (redirect de
 * login, badge de verificación, guard de /vendedor) depende de
 * `user.sellerProfile.verificationStatus`. Confirmado en users.service.ts.
 */
export async function me(accessToken?: string): Promise<User> {
  return apiFetch<User>("/users/me", { authToken: accessToken });
}

// --------------------------------------------------------------------------
// Verificación de email
// --------------------------------------------------------------------------

export async function verifyEmail(token: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function resendVerification(email: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// --------------------------------------------------------------------------
// Recuperación / cambio de contraseña
// --------------------------------------------------------------------------

export async function forgotPassword(email: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, password: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/change-password", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

// --------------------------------------------------------------------------
// Verificación de identidad del vendedor — Paso 2 (autenticado)
// --------------------------------------------------------------------------

export interface IdentityVerificationInput {
  dniFront: File;
  dniBack: File;
  selfie: File;
  lifeProof: File;
}

export interface IdentityVerificationResponse {
  status: VerificationStatus;
  message: string;
}

export async function submitIdentityVerification(
  input: IdentityVerificationInput
): Promise<IdentityVerificationResponse> {
  const formData = new FormData();
  formData.append("dniFront", input.dniFront);
  formData.append("dniBack", input.dniBack);
  formData.append("selfie", input.selfie);
  formData.append("lifeProof", input.lifeProof);

  return apiFetchForm<IdentityVerificationResponse>("/users/me/identity-verification", {
    method: "PUT",
    body: formData,
  });
}
