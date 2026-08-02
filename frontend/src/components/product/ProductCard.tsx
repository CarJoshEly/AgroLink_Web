"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import VerificationBadge from "@/components/ui/VerificationBadge";
import FavoriteButton from "@/components/ui/FavoriteButton";
import ReportButton from "@/components/reports/ReportButton";
import { useFavoriteProductIds } from "@/hooks/useFavorites";

export default function ProductCard({ product }: { product: Product }) {
  const cover = [...(product.images ?? [])].sort((a, b) => a.order - b.order)[0];
  const favoriteIds = useFavoriteProductIds();
  const isFavorite = favoriteIds.has(product.id);

  return (
    <Link
      href={`/productos/${product.id}`}
      className="group relative block rounded-stamp overflow-hidden border border-forest-100 hover:border-forest-300 transition-colors bg-white"
    >
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-white/90 rounded-full px-1">
        <FavoriteButton productId={product.id} isFavorite={isFavorite} size={18} />
        <ReportButton targetType="PRODUCT" targetId={product.id} size={15} className="p-1.5" />
      </div>

      <div className="aspect-square bg-forest-50 overflow-hidden">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover.url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-soil-300 text-xs">
            Sin imagen
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-soil-400 mb-1">{product.category?.name}</p>
        <h3 className="font-display text-base text-forest-800 leading-snug">{product.name}</h3>
        <p className="text-forest-700 font-medium mt-1">
          L. {Number(product.price).toLocaleString("es-HN")}{" "}
          <span className="text-xs text-soil-400">/ {product.unit}</span>
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-soil-500">{product.seller?.businessName}</span>
          <VerificationBadge verified={product.seller?.verificationStatus === "VERIFIED"} />
        </div>
      </div>
    </Link>
  );
}
