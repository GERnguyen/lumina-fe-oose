import type { OrderSummaryCourse } from "../data/checkout.mock";

interface OrderSummaryItemProps {
  item: OrderSummaryCourse;
}

export default function OrderSummaryItem({ item }: OrderSummaryItemProps) {
  return (
    <article className="flex items-center gap-3">
      <img
        src={item.imageUrl}
        alt={item.title}
        className="h-16 w-20 shrink-0 rounded object-cover"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-gray-500">By {item.author}</p>
        <h4 className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-neutral-800">
          {item.title}
        </h4>
      </div>

      <p className="shrink-0 text-sm font-semibold text-neutral-800">
        ${item.price.toFixed(2)}
      </p>
    </article>
  );
}
