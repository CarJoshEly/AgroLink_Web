"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToggleProductFavorite, useToggleSellerFavorite } from "@/hooks/useFavorites";

interface FavoriteButtonProps {
  /** Pasa productId O sellerId, no ambos. */
  productId?: string;
  sellerId?: string;
  isFavorite: boolean;
  size?: number;
  className?: string;
}

/**
 * Corazón reutilizable, usado en tarjetas de producto y en el perfil de
 * vendedor. Solo compradores autenticados pueden marcar favoritos; si no hay
 * sesión, redirige a /login.
 */
export default function FavoriteButton({
  productId,
  sellerId,
  isFavorite,
  size = 20,
  className = "",
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const toggleProduct = useToggleProductFavorite();
  const toggleSeller = useToggleSellerFavorite();

  const pending = toggleProduct.isPending || toggleSeller.isPending;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "CUSTOMER") return;

    if (productId) {
      toggleProduct.mutate({ productId, isFavorite });
    } else if (sellerId) {
      toggleSeller.mutate({ sellerId, isFavorite });
    }
  }

  // Solo compradores ven el corazón activo/interactivo; el resto lo ve deshabilitado.
  if (user && user.role !== "CUSTOMER") return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      aria-pressed={isFavorite}
      className={`inline-flex items-center justify-center rounded-full p-1.5 transition-colors disabled:opacity-50 ${className}`}
    >
      <Heart
        size={size}
        strokeWidth={2}
        className={isFavorite ? "fill-red-500 text-red-500" : "text-forest-400 hover:text-red-400"}
      />
    </button>
  );
}
