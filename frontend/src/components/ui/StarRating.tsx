"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
}

export default function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 18,
}: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={readOnly ? "cursor-default" : "cursor-pointer"}
          aria-label={`${star} estrellas`}
        >
          <Star
            size={size}
            strokeWidth={1.5}
            className={star <= value ? "fill-maize-500 text-maize-600" : "text-forest-600"}
          />
        </button>
      ))}
    </div>
  );
}
