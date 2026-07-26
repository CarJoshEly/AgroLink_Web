import { apiFetch } from "./client";
import type { Category } from "@/lib/types";

export async function fetchCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/categories");
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
