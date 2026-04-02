import { Loader2, Star, X } from "lucide-react";
import type { CartItem } from "../../types/cart";
import { formatCurrencyVnd } from "../../utils/price.ts";

interface CartItemCardProps {
  item: CartItem;
  onRemove?: (courseId: number) => void;
  isRemoving?: boolean;
}

export default function CartItemCard({
  item,
  onRemove,
  isRemoving = false,
}: CartItemCardProps) {
  const totalPrice = item.unit_price * item.quantity;

  return (
    <article className="flex flex-col gap-4 py-4 lg:grid lg:grid-cols-[minmax(0,1fr)_160px_180px] lg:items-center lg:gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <img
          src={item.course.thumbnail_url}
          alt={item.course.title}
          className="h-28 w-full shrink-0 rounded object-cover sm:w-40"
        />

        <div className="min-w-0 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {item.course.category?.name ?? "Uncategorized"}
          </p>

          <div className="inline-flex items-center gap-1.5 text-sm">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span className="font-medium text-neutral-800">
              {item.course.average_rating}
            </span>
            <span className="text-gray-400">
              ({item.course.review_count.toLocaleString()} reviews)
            </span>
          </div>

          <h3 className="text-base font-medium leading-6 text-neutral-800">
            {item.course.title}
          </h3>

          <p className="text-sm text-gray-600">
            Course by: {item.course.instructor?.profile?.fullName ?? "Unknown"}
          </p>
          <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
        </div>
      </div>

      <div className="flex items-baseline gap-2 lg:justify-start">
        <span className="text-2xl font-semibold text-primary-500">
          {formatCurrencyVnd(totalPrice)}
        </span>
        {item.quantity > 1 ? (
          <span className="text-base text-gray-400 line-through">
            {formatCurrencyVnd(item.unit_price)}
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-2 lg:justify-end">
        <button
          type="button"
          onClick={() => onRemove?.(item.courseId)}
          disabled={isRemoving}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={`Remove ${item.course.title} from cart`}
        >
          {isRemoving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </button>
      </div>
    </article>
  );
}
