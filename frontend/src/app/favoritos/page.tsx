"use client";

import Link from "next/link";
import RequireRole from "@/components/auth/RequireRole";
import Tabs from "@/components/ui/Tabs";
import VerificationBadge from "@/components/ui/VerificationBadge";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { useFavoriteProducts, useFavoriteSellers } from "@/hooks/useFavorites";
import { ApiError } from "@/lib/api/client";

function FavoriteProductsTab() {
  const { data, isLoading, error } = useFavoriteProducts();

  if (isLoading) return <p className="text-sm text-soil-400">Cargando…</p>;
  if (error) {
    return (
      <p className="text-sm text-red-600">
        {error instanceof ApiError ? error.message : "No se pudieron cargar tus productos favoritos"}
      </p>
    );
  }
  if (!data || data.favorites.length === 0) {
    return (
      <div className="border border-dashed border-forest-200 rounded-stamp p-10 text-center text-soil-400 text-sm">
        Aún no tienes productos favoritos.
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {data.favorites.map((fav) => {
        const product = fav.product;
        if (!product) return null;
        const image = product.images?.[0]?.url;
        return (
          <div key={fav.id} className="relative border border-forest-100 rounded-stamp overflow-hidden bg-white">
            <Link href={`/productos/${product.id}`} className="block">
              <div className="aspect-square bg-forest-50">
                {image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt={product.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-forest-800 truncate">{product.name}</h3>
                <p className="text-sm text-forest-700 mt-1">
                  L. {Number(product.price).toLocaleString("es-HN")}
                  <span className="text-xs text-soil-400"> / {product.unit}</span>
                </p>
              </div>
            </Link>
            <div className="absolute top-2 right-2 bg-white/90 rounded-full">
              <FavoriteButton productId={product.id} isFavorite />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FavoriteSellersTab() {
  const { data, isLoading, error } = useFavoriteSellers();

  if (isLoading) return <p className="text-sm text-soil-400">Cargando…</p>;
  if (error) {
    return (
      <p className="text-sm text-red-600">
        {error instanceof ApiError ? error.message : "No se pudieron cargar tus vendedores favoritos"}
      </p>
    );
  }
  if (!data || data.favorites.length === 0) {
    return (
      <div className="border border-dashed border-forest-200 rounded-stamp p-10 text-center text-soil-400 text-sm">
        Aún no tienes vendedores favoritos.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.favorites.map((fav) => {
        const seller = fav.seller;
        if (!seller) return null;
        return (
          <div
            key={fav.id}
            className="flex items-center justify-between border border-forest-100 rounded-stamp p-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-forest-800">{seller.businessName}</span>
              <VerificationBadge verified={seller.verificationStatus === "VERIFIED"} />
            </div>
            <FavoriteButton sellerId={seller.id} isFavorite />
          </div>
        );
      })}
    </div>
  );
}

function FavoritesPageContent() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-2xl text-forest-900 mb-2">Favoritos</h1>
      <p className="text-sm text-soil-500 mb-8">Productos y vendedores que has guardado.</p>

      <Tabs
        tabs={[
          { id: "productos", label: "Productos", content: <FavoriteProductsTab /> },
          { id: "vendedores", label: "Vendedores", content: <FavoriteSellersTab /> },
        ]}
      />
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <RequireRole allow={["CUSTOMER"]}>
      <FavoritesPageContent />
    </RequireRole>
  );
}
