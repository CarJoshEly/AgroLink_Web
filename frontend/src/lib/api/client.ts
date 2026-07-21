/**
 * Cliente central de API.
 *
 * HOY: el backend (carpeta /backend) todavía está vacío, así que las
 * funciones en lib/api/*.ts (products.ts, reviews.ts, auth.ts) devuelven
 * datos mock desde lib/mock/*.ts.
 *
 * CUANDO LA API EXISTA (interna en NestJS o una API externa cualquiera):
 * 1. Define NEXT_PUBLIC_API_URL en .env.local (ver .env.example).
 * 2. Reemplaza el cuerpo de las funciones mock en products.ts / reviews.ts /
 *    auth.ts por llamadas a `apiFetch(...)`, tal como se muestra comentado
 *    en cada archivo.
 * 3. No debería ser necesario tocar los componentes de UI: todos consumen
 *    las funciones de lib/api/*.ts, nunca fetch() directamente.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface ApiFetchOptions extends RequestInit {
  authToken?: string;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL no está configurada todavía. " +
        "Mientras el backend no exista, usa las funciones mock en lib/mock/."
    );
  }

  const { authToken, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new ApiError(body || response.statusText, response.status);
  }

  // Algunos endpoints (204) no devuelven cuerpo
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
