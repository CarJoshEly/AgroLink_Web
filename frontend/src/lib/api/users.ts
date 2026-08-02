import { apiFetch, apiFetchPaginated, type PaginationMeta } from "./client";
import type { User, UserRole } from "@/lib/types";

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
}

function buildQuery(filters: UserFilters): string {
  const params = new URLSearchParams();
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 10));
  if (filters.search) params.set("search", filters.search);
  if (filters.role) params.set("role", filters.role);
  if (filters.isActive !== undefined) params.set("isActive", String(filters.isActive));
  return params.toString();
}

/** GET /users — listar usuarios de todos los roles (admin). */
export async function fetchUsers(
  filters: UserFilters = {}
): Promise<{ users: User[]; meta: PaginationMeta | undefined }> {
  const { data, meta } = await apiFetchPaginated<User[]>(`/users?${buildQuery(filters)}`);
  return { users: data, meta };
}

/** GET /users/:id — detalle (admin). Incluye ubicaciones y perfil de vendedor con verificación. */
export async function fetchUserById(id: string): Promise<User> {
  return apiFetch<User>(`/users/${id}`);
}

/** PATCH /users/:id/activate */
export async function activateUser(id: string): Promise<User> {
  return apiFetch<User>(`/users/${id}/activate`, { method: "PATCH" });
}

/** PATCH /users/:id/deactivate */
export async function deactivateUser(id: string): Promise<User> {
  return apiFetch<User>(`/users/${id}/deactivate`, { method: "PATCH" });
}

/** DELETE /users/:id — soft delete en el backend, pero irreversible desde la UI. */
export async function deleteUser(id: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/users/${id}`, { method: "DELETE" });
}
