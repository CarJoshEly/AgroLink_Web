import { notFound } from "next/navigation";
import { fetchSellerProfile } from "@/lib/api/sellers";
import { fetchSellerReviewSummary } from "@/lib/api/reviews";
import ProductCard from "@/components/product/ProductCard";
import VerificationBadge from "@/components/ui/VerificationBadge";
import SellerReviewSummaryView from "@/components/product/SellerReviewSummaryView";
import ReportButton from "@/components/reports/ReportButton";

export default async function SellerProfilePage({ params }: { params: { id: string } }) {
  const { seller, products } = await fetchSellerProfile(params.id);
  const reviewSummary = await fetchSellerReviewSummary(params.id).catch(() => null);

  // Sin GET /sellers/:id público, si el vendedor no tiene productos ni reseñas
  // no tenemos ningún dato suyo que mostrar.
  if (!seller && (!reviewSummary || reviewSummary.totalReviews === 0)) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="font-display text-3xl text-forest-900">
          {seller?.businessName ?? "Perfil de vendedor"}
        </h1>
        <VerificationBadge verified={seller?.verificationStatus === "VERIFIED"} size="md" />
        {seller && <ReportButton targetType="SELLER" targetId={seller.id} label="Reportar" size={16} />}
      </div>

      {reviewSummary && reviewSummary.totalReviews > 0 && (
        <div className="mt-6">
          <SellerReviewSummaryView summary={reviewSummary} />
        </div>
      )}

      <h2 className="font-display text-xl text-forest-800 mt-12 mb-5">Productos activos</h2>
      {products.length === 0 ? (
        <p className="text-sm text-soil-400">Este vendedor todavía no tiene productos publicados.</p>
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
