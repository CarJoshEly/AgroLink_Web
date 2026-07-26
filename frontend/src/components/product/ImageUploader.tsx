"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Star } from "lucide-react";

/**
 * Imagen "de trabajo" mientras se arma el formulario de publicación de
 * producto (Sprint 4). No es el `ProductImage` real de `lib/types`: la API
 * no tiene `isCover`, usa `order: number` (ver ProductGallery.tsx). Cuando
 * se conecte, este componente debe llamar a
 * `POST /products/:id/images` (multipart, campo "files", hasta 5) —
 * confirmado en products.controller.ts — y mapear el resultado real.
 */
export interface DraftProductImage {
  id: string;
  url: string;
  isCover: boolean;
}

/** Mock temporal: genera un object URL local en vez de subir a Supabase Storage. */
async function uploadProductImageMock(_productId: string, file: File): Promise<{ url: string }> {
  return { url: URL.createObjectURL(file) };
}

interface ImageUploaderProps {
  productId: string;
  initialImages?: DraftProductImage[];
  onChange?: (images: DraftProductImage[]) => void;
  maxImages?: number;
}
export default function ImageUploader({
  productId,
  initialImages = [],
  onChange,
  maxImages = 6,
}: ImageUploaderProps) {
  const [images, setImages] = useState<DraftProductImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function emit(next: DraftProductImage[]) {
    setImages(next);
    onChange?.(next);
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    try {
      const files = Array.from(fileList).slice(0, maxImages - images.length);
      const uploaded: DraftProductImage[] = [];

      for (const file of files) {
        const { url } = await uploadProductImageMock(productId, file);
        uploaded.push({
          id: `${Date.now()}-${file.name}`,
          url,
          isCover: images.length === 0 && uploaded.length === 0,
        });
      }

      emit([...images, ...uploaded]);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage(id: string) {
    const next = images.filter((img) => img.id !== id);
    if (next.length > 0 && !next.some((img) => img.isCover)) {
      next[0].isCover = true;
    }
    emit(next);
  }

  function setCover(id: string) {
    emit(images.map((img) => ({ ...img, isCover: img.id === id })));
  }

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative aspect-square rounded-stamp overflow-hidden border border-forest-100 group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="Imagen de producto" className="w-full h-full object-cover" />

            <div className="absolute inset-0 bg-forest-900/0 group-hover:bg-forest-900/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => setCover(img.id)}
                title="Marcar como portada"
                className="bg-stone-25 rounded-full p-1.5"
              >
                <Star
                  size={14}
                  className={img.isCover ? "fill-maize-500 text-maize-600" : "text-forest-700"}
                />
              </button>
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                title="Eliminar imagen"
                className="bg-stone-25 rounded-full p-1.5"
              >
                <X size={14} className="text-soil-600" />
              </button>
            </div>

            {img.isCover && (
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
            <ImagePlus size={22} strokeWidth={1.75} />
            <span className="text-xs">{uploading ? "Subiendo…" : "Agregar imagen"}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <p className="text-xs text-soil-400 mt-2">
        Hasta {maxImages} imágenes. Formatos JPG o PNG. La imagen marcada con la estrella se usa como portada del producto.
      </p>
    </div>
  );
}
