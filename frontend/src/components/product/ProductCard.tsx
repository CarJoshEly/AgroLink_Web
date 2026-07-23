import Link from "next/link";
import type { Product } from "@/lib/api/products";
import VerificationBadge from "@/components/ui/VerificationBadge";

export default function ProductCard({ product }: { product: Product }) {
  const cover = product.images.find((i) => i.isCover) ?? product.images[0];

  return (
    <Link
      href={`/productos/${product.id}`}
      className="group block rounded-stamp overflow-hidden border border-forest-100 hover:border-forest-300 transition-colors bg-white"
    >
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
        <p className="text-xs uppercase tracking-wide text-soil-400 mb-1">{product.category}</p>
        <h3 className="font-display text-base text-forest-800 leading-snug">{product.name}</h3>
        <p className="text-forest-700 font-medium mt-1">
          L. {product.price.toLocaleString("es-HN")} <span className="text-xs text-soil-400">/ {product.unit}</span>
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-soil-500">{product.seller?.businessName}</span>
          <VerificationBadge verified={Boolean(product.seller?.hasVerifiedBadge)} />
        </div>
      </div>
    </Link>
  );
}
