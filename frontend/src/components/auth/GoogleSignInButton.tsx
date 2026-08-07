"use client";

import { useEffect, useId, useRef, useState } from "react";

// Tipado mínimo del subset de Google Identity Services (GIS) que se usa acá
// — la librería no trae `@types`, y no vale la pena instalar un paquete
// completo (`@types/google.accounts`) solo por esto.
interface GoogleIdCredentialResponse {
  credential: string;
}

interface GoogleAccountsId {
  initialize(config: {
    client_id: string;
    callback: (response: GoogleIdCredentialResponse) => void;
  }): void;
  renderButton(
    parent: HTMLElement,
    options: {
      type?: "standard" | "icon";
      theme?: "outline" | "filled_blue" | "filled_black";
      size?: "large" | "medium" | "small";
      text?: "signin_with" | "signup_with" | "continue_with" | "signin";
      shape?: "rectangular" | "pill" | "circle" | "square";
      width?: number;
      locale?: string;
    }
  ): void;
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } };
  }
}

const GIS_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

// El script de GIS es el mismo para toda la página — cargarlo una sola vez
// aunque haya varios <GoogleSignInButton /> montados (login + modal de
// registro pueden coexistir en el árbol) evita añadir <script> duplicados.
let gisLoadPromise: Promise<void> | null = null;
function loadGoogleIdentityServices(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  if (window.google?.accounts?.id) return Promise.resolve();
  if (gisLoadPromise) return gisLoadPromise;

  gisLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("No se pudo cargar Google Identity Services")));
      return;
    }
    const script = document.createElement("script");
    script.src = GIS_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar Google Identity Services"));
    document.head.appendChild(script);
  });
  return gisLoadPromise;
}

interface GoogleSignInButtonProps {
  onIdToken: (idToken: string) => void;
  /** Texto del botón oficial de Google. "continue_with" calza con el copy del resto del flujo. */
  text?: "signin_with" | "signup_with" | "continue_with";
  className?: string;
}

/**
 * Botón oficial de Google ("Sign in with Google", renderizado por GIS, no un
 * <button> propio) — Google exige su propio diseño/copy en vez de un botón
 * genérico para poder mostrar el flujo de OAuth. Solo para COMPRADORES: el
 * backend (`POST /auth/google`) crea cuentas nuevas siempre con role
 * CUSTOMER, los vendedores necesitan el registro completo con documentos.
 */
export default function GoogleSignInButton({ onIdToken, text = "continue_with", className }: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const domId = useId();

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      // No es un error del usuario — falta configurar la env var. No lo
      // mostramos como bloqueante, el resto del formulario sigue funcionando.
      return;
    }

    let cancelled = false;
    loadGoogleIdentityServices()
      .then(() => {
        if (cancelled || !containerRef.current || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => onIdToken(response.credential),
        });
        window.google.accounts.id.renderButton(containerRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text,
          shape: "rectangular",
          width: 320,
          locale: "es",
        });
      })
      .catch(() => {
        if (!cancelled) setError("No se pudo cargar el botón de Google. Revisa tu conexión.");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return null;

  return (
    <div className={className}>
      <div id={domId} ref={containerRef} className="flex justify-center" />
      {error && <p className="text-xs text-red-600 mt-1 text-center">{error}</p>}
    </div>
  );
}
