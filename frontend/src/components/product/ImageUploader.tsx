"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { addProductImages, removeProductImage } from "@/lib/api/products";
import type { ProductImage } from "@/lib/types";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_PER_UPLOAD = 5; // límite del backend por llamada (FilesInterceptor('files', 5, ...))

interface ImageUploaderProps {
  productId: string;
  initialImages: ProductImage[];
  onChange?: (images: ProductImage[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
  productId,
  initialImages,
  onChange,
  maxImages = 10,
}: ImageUploaderProps) {
  const [images, setImages] = useState<ProductImage[]>(
    [...initialImages].sort((a, b) => a.order - b.order)
  );
  const [uploading, setUploading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function emit(next: ProductImage[]) {
    setImages(next);
    onChange?.(next);
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError(null);

    const files = Array.from(fileList).slice(0, Math.min(MAX_PER_UPLOAD, maxImages - images.length));

    const invalid = files.find((f) => !ALLOWED_TYPES.includes(f.type) || f.size > MAX_SIZE_BYTES);
    if (invalid) {
      setError("Solo se permiten imágenes JPG, PNG o WEBP de hasta 5MB.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setUploading(true);
    try {
      const uploaded = await addProductImages(productId, files);
      emit([...images, ...uploaded].sort((a, b) => a.order - b.order));
    } catch {
      setError("No se pudieron subir las imágenes. Intenta de nuevo.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove(imageId: string) {
    setError(null);
    setRemovingId(imageId);
    try {
      await removeProductImage(productId, imageId);
      emit(images.filter((img) => img.id !== imageId));
    } catch {
      setError("No se pudo eliminar la imagen.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((img, index) => (
          <div
            key={img.id}
            className="relative aspect-square rounded-stamp overflow-hidden border border-forest-100 group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="Imagen de producto" className="w-full h-full object-cover" />

            <button
              type="button"
              onClick={() => handleRemove(img.id)}
              disabled={removingId === img.id}
              title="Eliminar imagen"
              className="absolute top-1.5 right-1.5 bg-stone-25 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-100"
            >
              {removingId === img.id ? (
                <Loader2 size={14} className="animate-spin text-soil-500" />
              ) : (
                <X size={14} className="text-soil-600" />
              )}
            </button>

            {index === 0 && (
              <span className="absolute top-1.5 left-1.5 bg-forest-700 text-stone-25 text-[10px] px-1.5 py-0.5 rounded-stamp">
                Portada
              </span>
            )}
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-stamp border-2 border-dashed border-forest-200 flex flex-col items-center justify-center gap-1 text-forest-500 hover:border-forest-400 hover:text-forest-700 transition-colors"
          >
            {uploading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              <ImagePlus size={22} strokeWidth={1.75} />
            )}
            <span className="text-xs">{uploading ? "Subiendo…" : "Agregar imagen"}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

      <p className="text-xs text-soil-400 mt-2">
        JPG, PNG o WEBP, hasta 5MB cada una. La primera imagen que subas se usa como portada — no se
        pueden reordenar por ahora, elimínala y súbela de nuevo si quieres cambiar el orden.
      </p>
    </div>
  );
}
