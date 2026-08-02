import { apiFetch } from "./client";

export interface SystemConfigEntry {
  key: string;
  value: unknown;
  updatedBy: string | null;
  updatedAt: string;
}

/** GET /admin/config — listado de todas las claves (admin). */
export async function fetchAllConfig(): Promise<SystemConfigEntry[]> {
  return apiFetch<SystemConfigEntry[]>("/admin/config");
}

/** GET /admin/config/:key — valor de una clave específica (admin). */
export async function fetchConfigByKey(key: string): Promise<SystemConfigEntry> {
  return apiFetch<SystemConfigEntry>(`/admin/config/${key}`);
}

/** PUT /admin/config/:key — crea o actualiza el valor (admin). `value` debe ser serializable a JSON. */
export async function upsertConfig(key: string, value: unknown): Promise<SystemConfigEntry> {
  return apiFetch<SystemConfigEntry>(`/admin/config/${key}`, {
    method: "PUT",
    body: JSON.stringify({ value }),
  });
}
