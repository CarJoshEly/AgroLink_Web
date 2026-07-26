import Link from "next/link";
import { fetchProducts } from "@/lib/api/products";
import ProductCard from "@/components/product/ProductCard";

export default async function HomePage() {
  const { products } = await fetchProducts({ limit: 8, sortBy: "createdAt", sortOrder: "desc" });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-maize-600 font-medium mb-2">
          Marketplace agrícola
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-forest-900 max-w-xl">
          Del campo hondureño directo a tu mesa.
        </h1>
        <p className="text-forest-700 mt-3 max-w-lg">
          Explora productos publicados por productores y proveedores de todo el país.
        </p>
        <Link
          href="/productos"
          className="inline-block mt-5 text-sm font-medium text-forest-700 border border-forest-300 px-4 py-2 rounded-stamp hover:bg-forest-50 transition-colors"
        >
          Ver catálogo completo
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-soil-400">Todavía no hay productos publicados.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
