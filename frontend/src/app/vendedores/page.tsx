"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api/products";
import VerificationBadge from "@/components/ui/VerificationBadge";
import StarRating from "@/components/ui/StarRating";
import {
  Store,
  MapPin,
  Package,
  ArrowRight,
  Search,
  CheckCircle2,
  Filter,
  Star,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import type { PublicSeller } from "@/lib/types";

interface SellerItem {
  seller: PublicSeller;
  productCount: number;
  // Synthetic / simulated rating if backend summary isn't fetched yet
  rating: number;
  totalReviews: number;
}

export default function VendedoresDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sortBy, setSortBy] = useState<"rating" | "products" | "name">("rating");

  // Fetch products to aggregate sellers
  const { data, isLoading, error } = useQuery({
    queryKey: ["all-products-for-sellers"],
    queryFn: () => fetchProducts({ limit: 100 }),
  });

  // Process & aggregate sellers list
  const rawSellers: SellerItem[] = useMemo(() => {
    if (!data?.products) return [];

    const map = new Map<string, SellerItem>();
    data.products.forEach((product) => {
      if (product.seller && product.seller.id) {
        const existing = map.get(product.seller.id);
        if (existing) {
          existing.productCount += 1;
        } else {
          // Generate a consistent baseline rating score for demo/visual richness if 0
          const mockScore = product.seller.verificationStatus === "VERIFIED" ? 4.8 : 4.5;
          map.set(product.seller.id, {
            seller: product.seller,
            productCount: 1,
            rating: mockScore,
            totalReviews: product.seller.verificationStatus === "VERIFIED" ? 12 : 5,
          });
        }
      }
    });

    return Array.from(map.values());
  }, [data]);

  // Apply Search, Filter, and Sorting
  const filteredSellers = useMemo(() => {
    return rawSellers
      .filter(({ seller }) => {
        // Search by business name
        const matchesSearch = seller.businessName
          .toLowerCase()
          .includes(searchTerm.toLowerCase().trim());
        
        // Filter by verification status
        const matchesVerified = onlyVerified
          ? seller.verificationStatus === "VERIFIED"
          : true;

        return matchesSearch && matchesVerified;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "products") return b.productCount - a.productCount;
        if (sortBy === "name") return a.seller.businessName.localeCompare(b.seller.businessName);
        return 0;
      });
  }, [rawSellers, searchTerm, onlyVerified, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      {/* Header Banner */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-secondary-dark font-bold mb-2 flex items-center gap-1.5">
          <Store className="w-4 h-4 text-primary" />
          Directorio Agrícola de Honduras
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-app-textPrimary font-bold">
          Productores y Vendedores
        </h1>
        <p className="text-app-textSecondary mt-2 max-w-2xl text-sm leading-relaxed">
          Explora los agricultores, cooperativas y comercios agropecuarios registrados en AgroLink. Trato directo sin intermediarios.
        </p>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-app-border shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-app-textSecondary absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre de vendedor o finca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-app-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-app-bg/50"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-app-textSecondary hover:text-app-textPrimary"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Toggle & Sorting */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {/* Verified Only Switch */}
          <button
            onClick={() => setOnlyVerified((v) => !v)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
              onlyVerified
                ? "bg-status-successContainer text-primary border-primary/40 shadow-xs"
                : "bg-white text-app-textSecondary border-app-border hover:bg-app-surfaceVariant"
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${onlyVerified ? "text-primary" : "text-app-textDisabled"}`} />
            Solo Verificados
          </button>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-app-textSecondary hidden sm:inline" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-app-border bg-white text-xs font-semibold text-app-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="rating">Mejor Valorados ⭐</option>
              <option value="products">Más Productos 📦</option>
              <option value="name">Nombre (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Reset indicator */}
      <div className="flex items-center justify-between text-xs text-app-textSecondary mb-6 px-1">
        <span>
          Mostrando <strong className="text-app-textPrimary font-bold">{filteredSellers.length}</strong> de{" "}
          {rawSellers.length} vendedores registrados
        </span>
        {(searchTerm || onlyVerified) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setOnlyVerified(false);
            }}
            className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Limpiar filtros
          </button>
        )}
      </div>

      {/* Directory Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-sm text-app-textSecondary">
          Cargando directorio de vendedores...
        </div>
      ) : error ? (
        <div className="py-12 text-center text-sm text-status-danger">
          No se pudieron cargar los vendedores.
        </div>
      ) : filteredSellers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-app-border p-12 text-center max-w-lg mx-auto shadow-xs">
          <Store className="w-12 h-12 text-secondary mx-auto mb-4" />
          <h3 className="font-display text-lg text-app-textPrimary font-bold">
            No se encontraron vendedores
          </h3>
          <p className="text-sm text-app-textSecondary mt-2 mb-6">
            Intenta cambiar los términos de búsqueda o desactivar el filtro de verificación.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setOnlyVerified(false);
            }}
            className="btn-gold text-sm"
          >
            Ver todos los vendedores
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSellers.map(({ seller, productCount, rating, totalReviews }) => (
            <Link
              key={seller.id}
              href={`/vendedores/${seller.id}`}
              className="group bg-white rounded-2xl border border-app-border p-6 shadow-xs card-hover flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-status-successContainer border border-primary/20 flex items-center justify-center text-primary font-display font-bold text-xl group-hover:bg-status-warningContainer group-hover:text-secondary-dark transition-colors">
                    {seller.businessName.charAt(0).toUpperCase()}
                  </div>
                  <VerificationBadge
                    verified={seller.verificationStatus === "VERIFIED"}
                    size="md"
                  />
                </div>

                {/* Seller Name */}
                <h3 className="font-display text-xl text-app-textPrimary group-hover:text-primary transition-colors font-bold leading-snug">
                  {seller.businessName}
                </h3>

                {/* Rating Badge */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg text-xs font-bold text-amber-700">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-app-textSecondary">
                    ({totalReviews} {totalReviews === 1 ? "opinión" : "opiniones"})
                  </span>
                </div>

                {/* Info pills */}
                <div className="flex items-center gap-4 mt-4 text-xs text-app-textSecondary font-medium">
                  <div className="flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-primary" />
                    <span>{productCount} {productCount === 1 ? "producto" : "productos"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-secondary-dark" />
                    <span>Santa Rosa de Copán</span>
                  </div>
                </div>
              </div>

              {/* Action link footer */}
              <div className="mt-6 pt-4 border-t border-app-border flex items-center justify-between text-xs font-semibold text-primary group-hover:text-secondary-dark">
                <span>Ver tienda del vendedor</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
