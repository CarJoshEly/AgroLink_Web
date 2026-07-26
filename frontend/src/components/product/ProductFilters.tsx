"use client";

import type { ProductFilters } from "@/lib/api/products";
import type { Category } from "@/lib/types";

interface Props {
  categories: Category[];
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
}

export default function ProductFiltersBar({ categories, filters, onChange }: Props) {
  const sortValue = `${filters.sortBy ?? "createdAt"}_${filters.sortOrder ?? "desc"}`;

  function handleSortChange(value: string) {
    const [sortBy, sortOrder] = value.split("_") as [ProductFilters["sortBy"], ProductFilters["sortOrder"]];
    onChange({ ...filters, sortBy, sortOrder, page: 1 });
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
      <input
        placeholder="Buscar productos…"
        value={filters.search ?? ""}
        onChange={(e) => onChange({ ...filters, search: e.target.value, page: 1 })}
        className="input"
      />

      <select
        value={filters.categoryId ?? ""}
        onChange={(e) => onChange({ ...filters, categoryId: e.target.value || undefined, page: 1 })}
        className="input"
      >
        <option value="">Todas las categorías</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <select value={sortValue} onChange={(e) => handleSortChange(e.target.value)} className="input">
        <option value="createdAt_desc">Más recientes</option>
        <option value="price_asc">Precio: menor a mayor</option>
        <option value="price_desc">Precio: mayor a menor</option>
        <option value="name_asc">Nombre: A-Z</option>
      </select>
    </div>
  );
}
