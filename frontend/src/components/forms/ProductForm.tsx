"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api/categories";
import { PRODUCT_UNIT_LABELS, PRODUCT_STATUS_LABELS } from "@/lib/labels";
import type { ProductUnit, ProductStatus } from "@/lib/types";

// Coincide con CreateProductDto/UpdateProductDto del backend.
const UNIT_VALUES = Object.keys(PRODUCT_UNIT_LABELS) as [ProductUnit, ...ProductUnit[]];
const STATUS_VALUES = Object.keys(PRODUCT_STATUS_LABELS) as [ProductStatus, ...ProductStatus[]];

const schema = z.object({
  categoryId: z.string().uuid({ message: "Selecciona una categoría" }),
  name: z.string().min(3, "Mínimo 3 caracteres"),
  description: z.string().min(10, "Mínimo 10 caracteres"),
  price: z.coerce.number().min(0, "Debe ser mayor o igual a 0"),
  unit: z.enum(UNIT_VALUES, { message: "Selecciona una unidad" }),
  stock: z.coerce.number().int("Debe ser un número entero").min(0, "Debe ser mayor o igual a 0"),
  status: z.enum(STATUS_VALUES).optional(),
});

// z.coerce.number() tiene tipo de entrada distinto al de salida (string -> number
// en un <input>), así que tipamos el formulario con la entrada "cruda" y dejamos
// que el resolver la transforme a la salida validada.
type FormInput = z.input<typeof schema>;
export type ProductFormValues = z.output<typeof schema>;

interface ProductFormProps {
  defaultValues?: Partial<FormInput>;
  onSubmit: SubmitHandler<ProductFormValues>;
  submitLabel: string;
  submitting?: boolean;
  formError?: string | null;
  /** Si true, muestra el select de estado (solo aplica al editar). */
  showStatus?: boolean;
}

export default function ProductForm({
  defaultValues,
  onSubmit,
  submitLabel,
  submitting,
  formError,
  showStatus = false,
}: ProductFormProps) {
  const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: () => fetchCategories() });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput, unknown, ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <label className="block">
        <span className="text-sm font-medium text-forest-800">Nombre</span>
        <input {...register("name")} className="input mt-1" placeholder="Maíz Amarillo de Primera" />
        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
      </label>

      <label className="block">
        <span className="text-sm font-medium text-forest-800">Descripción</span>
        <textarea
          {...register("description")}
          rows={4}
          className="input mt-1"
          placeholder="Describe el producto: origen, calidad, presentación…"
        />
        {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>}
      </label>

      <label className="block">
        <span className="text-sm font-medium text-forest-800">Categoría</span>
        <select {...register("categoryId")} className="input mt-1">
          <option value="">Selecciona una categoría</option>
          {categoriesQuery.data?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <p className="text-xs text-red-600 mt-1">{errors.categoryId.message}</p>}
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-medium text-forest-800">Precio (L.)</span>
          <input {...register("price")} type="number" step="0.01" min={0} className="input mt-1" />
          {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price.message}</p>}
        </label>

        <label className="block">
          <span className="text-sm font-medium text-forest-800">Unidad</span>
          <select {...register("unit")} className="input mt-1">
            {UNIT_VALUES.map((u) => (
              <option key={u} value={u}>
                {PRODUCT_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
          {errors.unit && <p className="text-xs text-red-600 mt-1">{errors.unit.message}</p>}
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-medium text-forest-800">Stock</span>
          <input {...register("stock")} type="number" min={0} step={1} className="input mt-1" />
          {errors.stock && <p className="text-xs text-red-600 mt-1">{errors.stock.message}</p>}
        </label>

        {showStatus && (
          <label className="block">
            <span className="text-sm font-medium text-forest-800">Estado</span>
            <select {...register("status")} className="input mt-1">
              {STATUS_VALUES.map((s) => (
                <option key={s} value={s}>
                  {PRODUCT_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-forest-700 text-stone-25 text-sm font-medium px-5 py-2.5 rounded-stamp hover:bg-forest-800 transition-colors disabled:opacity-50"
      >
        {submitting ? "Guardando…" : submitLabel}
      </button>
    </form>
  );
}
