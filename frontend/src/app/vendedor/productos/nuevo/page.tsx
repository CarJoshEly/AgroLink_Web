"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import ProductForm, { type ProductFormValues } from "@/components/forms/ProductForm";
import ImageUploader from "@/components/product/ImageUploader";
import { createProduct } from "@/lib/api/products";
import { ApiError } from "@/lib/api/client";
import type { Product } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";

export default function NewProductPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isVerified = user?.sellerProfile?.verificationStatus === "VERIFIED";
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [created, setCreated] = useState<Product | null>(null);

  async function handleSubmit(values: ProductFormValues) {
    setFormError(null);
    setSubmitting(true);
    try {
      const product = await createProduct(values);
      setCreated(product);
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.rawMessage.join(" ") : "No se pudo crear el producto. Intenta de nuevo."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (created) {
    return (
      <div className="max-w-lg">
        <div className="flex items-center gap-2 text-forest-700 mb-1">
          <CheckCircle2 size={20} />
          <h1 className="font-display text-2xl text-forest-900">¡Producto creado!</h1>
        </div>
        <p className="text-sm text-soil-500 mb-6">
          Ahora agrega fotos de <strong>{created.name}</strong> (opcional, pero los productos con fotos
          se venden mejor).
        </p>

        <ImageUploader productId={created.id} initialImages={[]} />

        <button
          onClick={() => router.push("/vendedor/productos")}
          className="mt-6 bg-forest-700 text-stone-25 text-sm font-medium px-5 py-2.5 rounded-stamp hover:bg-forest-800 transition-colors"
        >
          Terminar
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-forest-900 mb-6">Publicar producto</h1>
      {!isVerified && (
        <div className="max-w-lg mb-4 flex items-start gap-2 rounded-stamp border border-maize-300 bg-maize-100 px-3 py-2.5 text-sm text-soil-600">
          <ShieldAlert className="w-4 h-4 text-maize-600 shrink-0 mt-0.5" strokeWidth={1.5} />
          <span>
            Vas a publicar este producto sin el sello de <strong>verificado</strong> — los
            compradores lo verán, pero sabrán que tu cuenta aún no fue validada.
          </span>
        </div>
      )}
      <ProductForm
        onSubmit={handleSubmit}
        submitLabel="Crear producto"
        submitting={submitting}
        formError={formError}
        defaultValues={{ unit: "UNIT" }}
      />
    </div>
  );
}
