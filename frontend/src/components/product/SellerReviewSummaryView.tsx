import type { SellerReviewSummary } from "@/lib/api/reviews";

const ROWS: {
  key: keyof Omit<SellerReviewSummary, "sellerId" | "averageOverall" | "totalReviews">;
  label: string;
}[] = [
  { key: "averageQuality", label: "Calidad" },
  { key: "averageResponseTime", label: "Tiempo de respuesta" },
  { key: "averageCompliance", label: "Cumplimiento" },
  { key: "averageAttention", label: "Atención" },
  { key: "averageTrust", label: "Confianza" },
];

export default function SellerReviewSummaryView({ summary }: { summary: SellerReviewSummary }) {
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-3xl text-forest-800">
          {summary.averageOverall?.toFixed(1) ?? "—"}
        </span>
        <span className="text-sm text-soil-400">
          · {summary.totalReviews} {summary.totalReviews === 1 ? "reseña" : "reseñas"}
        </span>
      </div>
      <div className="space-y-1.5 mt-3 max-w-xs">
        {ROWS.map(({ key, label }) => {
          const value = summary[key] ?? 0;
          return (
            <div key={key} className="flex items-center gap-2 text-xs">
              <span className="w-32 text-soil-500 shrink-0">{label}</span>
              <div className="flex-1 h-1.5 bg-forest-50 rounded-full overflow-hidden">
                <div className="h-full bg-maize-500 rounded-full" style={{ width: `${(value / 5) * 100}%` }} />
              </div>
              <span className="text-forest-700 w-6 text-right">{value.toFixed(1)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
