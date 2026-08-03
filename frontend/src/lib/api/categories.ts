import { apiFetch } from "./client";
import type { Category } from "@/lib/types";

export interface CreateCategoryInput {
  name: string;
  parentId?: string;
  isActive?: boolean;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

/** POST /categories — requiere rol ADMIN. */
export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  return apiFetch<Category>("/categories", { method: "POST", body: JSON.stringify(input) });
}

/** PATCH /categories/:id — requiere rol ADMIN. */
export async function updateCategory(id: string, input: UpdateCategoryInput): Promise<Category> {
  return apiFetch<Category>(`/categories/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}

/** DELETE /categories/:id — requiere rol ADMIN. */
export async function deleteCategory(id: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/categories/${id}`, { method: "DELETE" });
}

/**
 * `includeInactive` solo lo debe usar el panel admin — el catálogo público y
 * el formulario de producto necesitan ver únicamente categorías activas.
 */
export async function fetchCategories(includeInactive = false): Promise<Category[]> {
  return apiFetch<Category[]>(`/categories${includeInactive ? "?includeInactive=true" : ""}`);
}

/**
 * `GET /categories` devuelve la lista plana (padres + hijos mezclados).
 * Esta función arma el árbol en el cliente agrupando por `parentId`.
 */
export function buildCategoryTree(categories: Category[]): (Category & { children: Category[] })[] {
  const byId = new Map(categories.map((c) => [c.id, { ...c, children: [] as Category[] }]));
  const roots: (Category & { children: Category[] })[] = [];

  for (const category of byId.values()) {
    if (category.parentId) {
      const parent = byId.get(category.parentId);
      if (parent) {
        parent.children.push(category);
        continue;
      }
    }
    roots.push(category);
  }

  return roots;
}
