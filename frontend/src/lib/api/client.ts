/**
 * Cliente central de API — habla con la API REST real (NestJS).
 *
 * `NEXT_PUBLIC_API_URL` debe incluir el prefijo completo, p. ej.
 * `http://localhost:3000/api/v1` (ver .env.example).
 *
 * Todas las respuestas exitosas de la API vienen envueltas en
 * `ApiEnvelope<T>`; los errores, en `ApiErrorBody`. `apiFetch` desenvuelve
 * lo primero y lanza `ApiError` a partir de lo segundo.
 */

import { getAccessToken, getRefreshToken, handleSessionExpired, setAccessToken, setRefreshToken } from "../auth/authStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
  timestamp: string;
}

export interface ApiErrorBody {
  success: false;
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

export class ApiError extends Error {
  status: number;
  /** Array completo de mensajes de validación (uno por campo), para pintar errores campo a campo. */
  rawMessage: string[];

  constructor(body: ApiErrorBody, status: number) {
    const rawMessage = Array.isArray(body.message) ? body.message : [body.message];
    super(rawMessage[0] ?? "Ocurrió un error inesperado");
    this.status = status;
    this.rawMessage = rawMessage;
  }
}

interface ApiFetchOptions extends RequestInit {
  authToken?: string;
  /** Uso interno: evita reintentos infinitos cuando ya se está reintentando tras un refresh. */
  _isRetry?: boolean;
}

async function parseErrorBody(response: Response): Promise<ApiErrorBody> {
  try {
    return (await response.json()) as ApiErrorBody;
  } catch {
    return {
      success: false,
      statusCode: response.status,
      message: response.statusText || "Error de red",
      error: "UnknownError",
      timestamp: new Date().toISOString(),
      path: response.url,
    };
  }
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL no está configurada. Define la URL completa de la API (incluyendo /api/v1) en .env.local."
    );
  }

  const { authToken, headers, _isRetry, ...rest } = options;
  const token = authToken ?? getAccessToken() ?? undefined;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (response.status === 401 && !_isRetry) {
    const refreshed = await tryRefreshAccessToken();
    if (refreshed) {
      return apiFetch<T>(path, { ...options, authToken: refreshed, _isRetry: true });
    }
    handleSessionExpired();
    const body = await parseErrorBody(response);
    throw new ApiError(body, response.status);
  }

  if (!response.ok) {
    const body = await parseErrorBody(response);
    throw new ApiError(body, response.status);
  }

  if (response.status === 204) return undefined as T;

  const envelope = (await response.json()) as ApiEnvelope<T>;
  return envelope.data;
}

/** Intenta renovar el access token con el refresh token guardado. Devuelve el nuevo token, o null si no fue posible. */
async function tryRefreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) return null;

    const envelope = (await response.json()) as ApiEnvelope<{ accessToken: string; refreshToken: string }>;
    setAccessToken(envelope.data.accessToken);
    setRefreshToken(envelope.data.refreshToken);
    return envelope.data.accessToken;
  } catch {
    return null;
  }
}
