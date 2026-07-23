/**
 * Estado de sesión compartido entre `AuthContext` (React) y `lib/api/client.ts`
 * (que no es un componente y no puede usar hooks). Existe para que el
 * interceptor de 401 en `client.ts` pueda leer/actualizar el access token y
 * notificar el cierre de sesión sin crear un import circular con `AuthContext`.
 *
 * accessToken: en memoria (módulo), se pierde al recargar la página.
 * refreshToken: cookie no-httpOnly (ver README — trade-off de seguridad
 * aceptado para el alcance de este proyecto académico).
 */

import Cookies from "js-cookie";

const REFRESH_TOKEN_COOKIE = "agrolink_refresh_token";

let accessToken: string | null = null;
type SessionExpiredListener = () => void;
const sessionExpiredListeners = new Set<SessionExpiredListener>();

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getRefreshToken(): string | undefined {
  if (typeof document === "undefined") return undefined;
  return Cookies.get(REFRESH_TOKEN_COOKIE);
}

export function setRefreshToken(token: string): void {
  Cookies.set(REFRESH_TOKEN_COOKIE, token, { expires: 7, sameSite: "lax" });
}

export function clearSession(): void {
  accessToken = null;
  Cookies.remove(REFRESH_TOKEN_COOKIE);
}

/** Se llama desde `AuthProvider` para reaccionar cuando el refresh automático falla (limpiar `user`, redirigir a /login). */
export function onSessionExpired(listener: SessionExpiredListener): () => void {
  sessionExpiredListeners.add(listener);
  return () => sessionExpiredListeners.delete(listener);
}

/** Se llama desde `client.ts` cuando un 401 no pudo resolverse ni con refresh. */
export function handleSessionExpired(): void {
  clearSession();
  sessionExpiredListeners.forEach((listener) => listener());
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}
