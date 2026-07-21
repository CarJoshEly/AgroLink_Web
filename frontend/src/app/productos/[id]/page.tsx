import { notFound } from "next/navigation";
import { fetchProductById } from "@/lib/api/products";
import ProductGallery from "@/components/product/ProductGallery";
import ReviewsTab from "@/components/product/ReviewsTab";
import VerificationBadge from "@/components/ui/VerificationBadge";
import Tabs from "@/components/ui/Tabs";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await fetchProductById(params.id);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <ProductGallery images={product.images} />

        <div>
          <p className="text-xs uppercase tracking-wide text-soil-400 mb-1">{product.category}</p>
          <h1 className="font-display text-3xl text-forest-900">{product.name}</h1>

          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm text-forest-700">{product.seller?.businessName}</span>
            <VerificationBadge verified={Boolean(product.seller?.hasVerifiedBadge)} />
          </div>

          <p className="font-display text-2xl text-forest-800 mt-5">
            L. {product.price.toLocaleString("es-HN")}{" "}
            <span className="text-sm text-soil-400 font-body">/ {product.unit}</span>
          </p>
          <p className="text-sm text-soil-500 mt-1">
            {product.stock > 0 ? `${product.stock} disponibles` : "Agotado"}
          </p>

          <button className="mt-6 bg-forest-700 text-stone-25 font-medium px-5 py-2.5 rounded-stamp hover:bg-forest-800 transition-colors">
            Agregar al carrito
          </button>
        </div>
      </div>

      <div className="mt-14">
        <Tabs
          tabs={[
            {
              id: "detalle",
              label: "Detalle",
              content: (
                <div className="max-w-2xl text-sm text-forest-700 leading-relaxed space-y-3">
                  <p>{product.description}</p>
                  <dl className="grid grid-cols-2 gap-y-2 text-sm mt-4 max-w-sm">
                    <dt className="text-soil-400">Categoría</dt>
                    <dd>{product.category}</dd>
                    <dt className="text-soil-400">Departamento</dt>
                    <dd>{product.department ?? "—"}</dd>
                    <dt className="text-soil-400">Unidad</dt>
                    <dd>{product.unit}</dd>
                  </dl>
                </div>
              ),
            },
            {
              id: "resenas",
              label: "Reseñas",
              content: <ReviewsTab productId={product.id} />,
            },
          ]}
        />
      </div>
    </div>
  );
}
