import { notFound } from "next/navigation";
import { fetchProductById } from "@/lib/api/products";
import { ApiError } from "@/lib/api/client";
import ProductGallery from "@/components/product/ProductGallery";
import ReviewsTab from "@/components/product/ReviewsTab";
import VerificationBadge from "@/components/ui/VerificationBadge";
import Tabs from "@/components/ui/Tabs";
import AddToCartButton from "@/components/product/AddToCartButton";
import FavoriteHeart from "@/components/product/FavoriteHeart";
import { PRODUCT_UNIT_LABELS } from "@/lib/labels";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  let product;
  try {
    product = await fetchProductById(params.id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <ProductGallery images={product.images ?? []} />

        <div>
          <p className="text-xs uppercase tracking-wide text-soil-400 mb-1">{product.category?.name}</p>
          <h1 className="font-display text-3xl text-forest-900">{product.name}</h1>

          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm text-forest-700">{product.seller?.businessName}</span>
            <VerificationBadge verified={product.seller?.verificationStatus === "VERIFIED"} />
            <FavoriteHeart productId={product.id} className="ml-auto" />
          </div>

          <p className="font-display text-2xl text-forest-800 mt-5">
            L. {Number(product.price).toLocaleString("es-HN")}{" "}
            <span className="text-sm text-soil-400 font-body">/ {PRODUCT_UNIT_LABELS[product.unit]}</span>
          </p>
          <p className="text-sm text-soil-500 mt-1">
            {product.stock > 0 ? `${product.stock} disponibles` : "Agotado"}
          </p>

          <AddToCartButton productId={product.id} stock={product.stock} />
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
                    <dd>{product.category?.name ?? "—"}</dd>
                    <dt className="text-soil-400">Unidad</dt>
                    <dd>{PRODUCT_UNIT_LABELS[product.unit]}</dd>
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
