"use client";

import FavoriteButton from "@/components/ui/FavoriteButton";
import { useFavoriteProductIds } from "@/hooks/useFavorites";

export default function FavoriteHeart({ productId, className }: { productId: string; className?: string }) {
  const favoriteIds = useFavoriteProductIds();
  return <FavoriteButton productId={productId} isFavorite={favoriteIds.has(productId)} className={className} />;
}
