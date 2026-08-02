"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { fetchUsers, type UserFilters } from "@/lib/api/users";
import { USER_ROLE_LABELS } from "@/lib/labels";
import type { UserRole } from "@/lib/types";

const ROLE_FILTERS: (UserRole | "")[] = ["", "ADMIN", "SELLER", "CUSTOMER"];

export default function AdminUsuariosPage() {
  const [filters, setFilters] = useState<UserFilters>({ page: 1, limit: 15 });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", filters],
    queryFn: () => fetchUsers(filters),
  });

  const users = data?.users ?? [];
  const meta = data?.meta;

  return (
    <div>
      <h1 className="font-display text-2xl text-forest-900 mb-1">Usuarios</h1>
      <p className="text-sm text-soil-500 mb-6">Administra cuentas de todos los roles de la plataforma.</p>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex gap-2 overflow-x-auto">
          {ROLE_FILTERS.map((role) => (
            <button
              key={role || "all"}
              type="button"
              onClick={() => setFilters((f) => ({ ...f, role: role || undefined, page: 1 }))}
              className={`text-sm px-3 py-1.5 rounded-stamp border whitespace-nowrap transition-colors ${
                (filters.role ?? "") === role
                  ? "border-forest-700 text-forest-800 bg-forest-50"
                  : "border-forest-100 text-soil-500 hover:border-forest-300"
              }`}
            >
              {role ? USER_ROLE_LABELS[role] : "Todos"}
            </button>
          ))}
        </div>
        <select
          className="input text-sm max-w-[10rem]"
          value={filters.isActive === undefined ? "" : String(filters.isActive)}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              isActive: e.target.value === "" ? undefined : e.target.value === "true",
              page: 1,
            }))
          }
        >
          <option value="">Activos e inactivos</option>
          <option value="true">Solo activos</option>
          <option value="false">Solo inactivos</option>
        </select>
        <input
          type="search"
          placeholder="Buscar por nombre o correo..."
          className="input text-sm ml-auto max-w-xs"
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value || undefined, page: 1 }))}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-14">
          <Loader2 className="w-6 h-6 text-forest-500 animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <p className="text-sm text-soil-400 py-10 text-center">No hay usuarios con este filtro.</p>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <Link
              key={user.id}
              href={`/admin/usuarios/${user.id}`}
              className="flex items-center justify-between gap-4 border border-forest-100 rounded-stamp p-4 hover:border-forest-300 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-forest-800">{user.name}</p>
                <p className="text-xs text-soil-400 mt-0.5">
                  {user.email} · {USER_ROLE_LABELS[user.role]}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-stamp shrink-0 ${
                  user.isActive ? "bg-forest-100 text-forest-700" : "bg-red-50 text-red-700"
                }`}
              >
                {user.isActive ? "Activo" : "Inactivo"}
              </span>
            </Link>
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8 text-sm">
          <button
            type="button"
            disabled={!meta.hasPreviousPage}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
            className="px-3 py-1.5 rounded-stamp border border-forest-200 disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-soil-500">
            Página {meta.page} de {meta.totalPages}
          </span>
          <button
            type="button"
            disabled={!meta.hasNextPage}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
            className="px-3 py-1.5 rounded-stamp border border-forest-200 disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
