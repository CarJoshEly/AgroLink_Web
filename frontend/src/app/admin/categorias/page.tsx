"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";
import {
  fetchCategories,
  buildCategoryTree,
  createCategory,
  updateCategory,
  deleteCategory,
  type CreateCategoryInput,
} from "@/lib/api/categories";
import { ApiError } from "@/lib/api/client";
import type { Category } from "@/lib/types";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface FormState {
  id: string | null;
  name: string;
  parentId: string;
  isActive: boolean;
}

const EMPTY_FORM: FormState = { id: null, name: "", parentId: "", isActive: true };

export default function AdminCategoriasPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: fetchCategories,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-categories"] });

  const createMutation = useMutation({ mutationFn: createCategory, onSuccess: invalidate });
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: CreateCategoryInput }) => updateCategory(id, input),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      invalidate();
      setCategoryToDelete(null);
    },
  });

  const tree = buildCategoryTree(categories ?? []);

  function openCreateForm(parentId?: string) {
    setForm({ ...EMPTY_FORM, parentId: parentId ?? "" });
    setError(null);
    setShowForm(true);
  }

  function openEditForm(category: Category) {
    setForm({
      id: category.id,
      name: category.name,
      parentId: category.parentId ?? "",
      isActive: category.isActive,
    });
    setError(null);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const input: CreateCategoryInput = {
      name: form.name.trim(),
      parentId: form.parentId || undefined,
      isActive: form.isActive,
    };

    try {
      if (form.id) {
        await updateMutation.mutateAsync({ id: form.id, input });
      } else {
        await createMutation.mutateAsync(input);
      }
      setShowForm(false);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err instanceof ApiError ? err.rawMessage.join(" ") : "No se pudo guardar la categoría.");
    }
  }


  const submitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-2xl text-forest-900">Categorías</h1>
        <button
          type="button"
          onClick={() => openCreateForm()}
          className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-stamp bg-forest-700 text-stone-25 hover:bg-forest-800"
        >
          <Plus className="w-4 h-4" /> Nueva categoría
        </button>
      </div>
      <p className="text-sm text-soil-500 mb-6">Organiza el catálogo en categorías y subcategorías.</p>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setShowForm(false)}>
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-stamp shadow-xl w-full max-w-sm p-5 space-y-3"
          >
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-display text-lg text-forest-900">
                {form.id ? "Editar categoría" : "Nueva categoría"}
              </h2>
              <button type="button" onClick={() => setShowForm(false)} aria-label="Cerrar">
                <X className="w-5 h-5 text-soil-400 hover:text-forest-700" />
              </button>
            </div>

            <div>
              <label className="text-xs text-soil-500 mb-1 block">Nombre</label>
              <input
                type="text"
                required
                minLength={2}
                maxLength={100}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="input text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-soil-500 mb-1 block">Categoría padre (opcional)</label>
              <select
                value={form.parentId}
                onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value }))}
                className="input text-sm"
              >
                <option value="">Ninguna (categoría raíz)</option>
                {(categories ?? [])
                  .filter((c) => c.id !== form.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm text-forest-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="accent-forest-700"
              />
              Activa
            </label>

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-forest-700 text-stone-25 rounded-stamp py-2 text-sm font-medium hover:bg-forest-800 disabled:opacity-50"
            >
              {submitting ? "Guardando…" : "Guardar"}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-14">
          <Loader2 className="w-6 h-6 text-forest-500 animate-spin" />
        </div>
      ) : tree.length === 0 ? (
        <p className="text-sm text-soil-400 py-10 text-center">Todavía no hay categorías.</p>
      ) : (
        <div className="space-y-4">
          {tree.map((parent) => (
            <div key={parent.id} className="border border-forest-100 rounded-stamp p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-forest-800">{parent.name}</span>
                  {!parent.isActive && (
                    <span className="text-[11px] text-soil-400 uppercase tracking-wide">Inactiva</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openCreateForm(parent.id)}
                    className="text-soil-400 hover:text-forest-700"
                    aria-label="Agregar subcategoría"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditForm(parent)}
                    className="text-soil-400 hover:text-forest-700"
                    aria-label="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryToDelete(parent)}
                    className="text-soil-400 hover:text-red-500"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {parent.children.length > 0 && (
                <div className="mt-3 pl-4 border-l border-forest-100 space-y-2">
                  {parent.children.map((child) => (
                    <div key={child.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-forest-700">{child.name}</span>
                        {!child.isActive && (
                          <span className="text-[11px] text-soil-400 uppercase tracking-wide">Inactiva</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(child)}
                          className="text-soil-400 hover:text-forest-700"
                          aria-label="Editar"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCategoryToDelete(child)}
                          className="text-soil-400 hover:text-red-500"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={categoryToDelete !== null}
        title="Eliminar categoría"
        message={`¿Eliminar la categoría "${categoryToDelete?.name}"?`}
        confirmLabel="Eliminar"
        danger
        loading={deleteMutation.isPending}
        onConfirm={() => categoryToDelete && deleteMutation.mutate(categoryToDelete.id)}
        onCancel={() => setCategoryToDelete(null)}
      />
    </div>
  );
}
