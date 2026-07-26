"use client";

import { useState } from "react";
import type { ProductImage } from "@/lib/types";

export default function ProductGallery({ images }: { images: ProductImage[] }) {
  const sorted = [...images].sort((a, b) => a.order - b.order);
  const [active, setActive] = useState(sorted[0]?.id);
  const activeImage = sorted.find((img) => img.id === active) ?? sorted[0];

  if (!sorted.length) {
    return (
      <div className="aspect-square rounded-stamp bg-forest-50 border border-forest-100 flex items-center justify-center text-soil-400 text-sm">
        Sin imágenes
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-square rounded-stamp overflow-hidden border border-forest-100 bg-forest-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={activeImage.url} alt="Imagen del producto" className="w-full h-full object-cover" />
      </div>
      {sorted.length > 1 && (
        <div className="flex gap-2 mt-3">
          {sorted.map((img) => (
            <button
              key={img.id}
              onClick={() => setActive(img.id)}
              className={`w-16 h-16 rounded-stamp overflow-hidden border-2 ${
                img.id === active ? "border-forest-600" : "border-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
