import type { CartItem } from "../types/cart";
import { formatCurrencyVnd } from "../utils/price.ts";

interface OrderSummaryItemProps {
  item: CartItem;
}

export default function OrderSummaryItem({ item }: OrderSummaryItemProps) {
  const totalPrice = item.unit_price * item.quantity;

  return (
    <article className="flex items-center gap-3">
      <img
        src={item.course.thumbnail_url}
        alt={item.course.title}
        className="h-16 w-20 shrink-0 rounded object-cover"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-gray-500">
          By {item.course.instructor?.profile?.fullName ?? "Unknown"}
        </p>
        <h4 className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-neutral-800">
          {item.course.title}
        </h4>
      </div>

      <p className="shrink-0 text-sm font-semibold text-neutral-800">
        {formatCurrencyVnd(totalPrice)}
      </p>
    </article>
  );
}
