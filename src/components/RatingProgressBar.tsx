import { Star } from "lucide-react";

export interface RatingProgressBarProps {
  star: number;
  percentage: number;
  count: number;
}

export default function RatingProgressBar({
  star,
  percentage,
  count,
}: RatingProgressBarProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex min-w-40 items-center gap-1.5">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              className={
                index < star
                  ? "h-4 w-4 fill-warning-500 text-warning-500"
                  : "h-4 w-4 text-amber-200"
              }
            />
          ))}
        </div>
        <span className="w-20 text-right text-sm font-normal text-gray-500">
          {star} Star Rating
        </span>
      </div>

      <div className="flex flex-1 items-center gap-4">
        <div className="h-2 flex-1 rounded-full bg-orange-50">
          <div
            className="h-2 rounded-full bg-warning-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="w-12 text-right text-sm font-medium text-neutral-800">
          {percentage}%
        </span>
        <span className="w-16 text-right text-xs text-gray-500">
          ({count.toLocaleString()})
        </span>
      </div>
    </div>
  );
}
