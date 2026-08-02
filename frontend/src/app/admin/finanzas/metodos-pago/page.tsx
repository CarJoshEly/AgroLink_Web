"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, X } from "lucide-react";
import {
  fetchAllPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  type CreatePaymentMethodInput,
} from "@/lib/api/finance";
import { ApiError } from "@/lib/api/client";
import { PAYMENT_PROVIDER_LABELS } from "@/lib/labels";
import type { PaymentProvider } from "@/lib/types";

const PROVIDERS: PaymentProvider[] = ["PAYPAL", "CREDIT_CARD", "DEBIT_CARD", "OTHER"];

const EMPTY_FORM: CreatePaymentMethodInput = { name: "", provider: "PAYPAL", isActive: true };

export default function AdminMetodosPagoPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreatePaymentMethodInput>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  const { data: methods, isLoading } = useQuery({
    queryKey: ["admin-payment-methods"],
    queryFn: fetchAllPaymentMethods,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-payment-methods"] });
  const createMutation = useMutation({ mutationFn: createPaymentMethod, onSuccess: invalidate });
  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => updatePaymentMethod(id, { isActive }),
    onSuccess: invalidate,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createMutation.mutateAsync(form);
      setShowForm(false);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err instanceof ApiError ? err.rawMessage.join(" ") : "No se pudo crear el método de pago.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-2xl text-forest-900">Métodos de pago</h1>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-stamp bg-forest-700 text-stone-25 hover:bg-forest-800"
        >
          <Plus className="w-4 h-4" /> Nuevo método
        </button>
      </div>
      <p className="text-sm text-soil-500 mb-6">Activa o desactiva los proveedores de pago disponibles.</p>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setShowForm(false)}>
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-stamp shadow-xl w-full max-w-sm p-5 space-y-3"
          >
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-display text-lg text-forest-900">Nuevo método de pago</h2>
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
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="input text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-soil-500 mb-1 block">Proveedor</label>
              <select
                value={form.provider}
                onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value as PaymentProvider }))}
                className="input text-sm"
              >
                {PROVIDERS.map((p) => (
                  <option key={p} value={p}>
                    {PAYMENT_PROVIDER_LABELS[p]}
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
              Activo
            </label>

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full bg-forest-700 text-stone-25 rounded-stamp py-2 text-sm font-medium hover:bg-forest-800 disabled:opacity-50"
            >
              {createMutation.isPending ? "Guardando…" : "Guardar"}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-14">
          <Loader2 className="w-6 h-6 text-forest-500 animate-spin" />
        </div>
      ) : !methods || methods.length === 0 ? (
        <p className="text-sm text-soil-400 py-10 text-center">Todavía no hay métodos de pago configurados.</p>
      ) : (
        <div className="space-y-3">
          {methods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between gap-4 border border-forest-100 rounded-stamp p-4"
            >
              <div>
                <p className="text-sm font-medium text-forest-800">{method.name}</p>
                <p className="text-xs text-soil-400 mt-0.5">{PAYMENT_PROVIDER_LABELS[method.provider]}</p>
              </div>
              <button
                type="button"
                disabled={toggleActive.isPending}
                onClick={() => toggleActive.mutate({ id: method.id, isActive: !method.isActive })}
                className={`text-xs font-medium px-2.5 py-1 rounded-stamp shrink-0 transition-colors disabled:opacity-50 ${
                  method.isActive ? "bg-forest-100 text-forest-700" : "bg-stone-100 text-stone-600"
                }`}
              >
                {method.isActive ? "Activo" : "Inactivo"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
