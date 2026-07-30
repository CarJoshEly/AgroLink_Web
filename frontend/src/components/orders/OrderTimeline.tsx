import { CheckCircle2 } from "lucide-react";
import type { OrderStatusHistory } from "@/lib/types";
import { ORDER_STATUS_LABELS } from "@/lib/labels";

export default function OrderTimeline({ history }: { history: OrderStatusHistory[] }) {
  if (history.length === 0) {
    return <p className="text-sm text-soil-400">Sin historial todavía.</p>;
  }

  return (
    <ol className="space-y-4">
      {history.map((entry, i) => (
        <li key={entry.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <CheckCircle2
              className={`w-5 h-5 shrink-0 ${i === history.length - 1 ? "text-forest-600" : "text-forest-300"}`}
            />
            {i < history.length - 1 && <div className="w-px flex-1 bg-forest-100 mt-1" />}
          </div>
          <div className="pb-4">
            <p className="text-sm font-medium text-forest-800">
              {ORDER_STATUS_LABELS[entry.toStatus]}
            </p>
            <p className="text-xs text-soil-400">
              {new Date(entry.createdAt).toLocaleString("es-HN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {entry.note && <p className="text-xs text-soil-500 mt-1">{entry.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
