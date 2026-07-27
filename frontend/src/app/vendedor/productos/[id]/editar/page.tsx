"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import ProductForm, { type ProductFormValues } from "@/components/forms/ProductForm";
import ImageUploader from "@/components/product/ImageUploader";
import { fetchProductById, updateProduct } from "@/lib/api/products";
import { ApiError } from "@/lib/api/client";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", params.id],
    queryFn: () => fetchProductById(params.id),
  });

  async function handleSubmit(values: ProductFormValues) {
    setFormError(null);
    setSubmitting(true);
    try {
      await updateProduct(params.id, values);
      setSaved(true);
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.rawMessage.join(" ")
          : "No se pudo guardar el producto. Intenta de nuevo."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 text-forest-500 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return <p className="text-sm text-soil-400">No se encontró el producto.</p>;
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-forest-900 mb-1">Editar producto</h1>
      <p className="text-sm text-soil-500 mb-6">{product.name}</p>

      {saved && (
        <p className="text-sm text-forest-700 bg-forest-50 border border-forest-100 rounded-stamp px-4 py-2 mb-4">
          Cambios guardados.
        </p>
      )}

      <ProductForm
        onSubmit={handleSubmit}
        submitLabel="Guardar cambios"
        submitting={submitting}
        formError={formError}
        showStatus
        defaultValues={{
          categoryId: product.categoryId,
          name: product.name,
          description: product.description,
          price: product.price,
          unit: product.unit,
          stock: product.stock,
          status: product.status,
        }}
      />

      <div className="mt-10 max-w-lg">
        <h2 className="font-display text-lg text-forest-800 mb-3">Fotos</h2>
        <ImageUploader productId={product.id} initialImages={product.images ?? []} />
      </div>

      <button
        onClick={() => router.push("/vendedor/productos")}
        className="mt-8 text-sm text-forest-700 font-medium hover:underline underline-offset-2"
      >
        Volver a mis productos
      </button>
    </div>
  );
}
