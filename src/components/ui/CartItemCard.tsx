import { Star, X } from "lucide-react";
import type { CartCourseItem } from "../../data/cart.mock";
import Button from "./Button";

interface CartItemCardProps {
  course: CartCourseItem;
}

export default function CartItemCard({ course }: CartItemCardProps) {
  return (
    <article className="flex flex-col gap-4 py-4 lg:grid lg:grid-cols-[minmax(0,1fr)_160px_180px] lg:items-center lg:gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="h-28 w-full shrink-0 rounded object-cover sm:w-40"
        />

        <div className="min-w-0 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {course.category}
          </p>

          <div className="inline-flex items-center gap-1.5 text-sm">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span className="font-medium text-neutral-800">
              {course.rating}
            </span>
            <span className="text-gray-400">
              ({course.reviewCount.toLocaleString()} reviews)
            </span>
          </div>

          <h3 className="text-base font-medium leading-6 text-neutral-800">
            {course.title}
          </h3>

          <p className="text-sm text-gray-600">
            Course by: {course.instructors.join(" • ")}
          </p>
        </div>
      </div>

      <div className="flex items-baseline gap-2 lg:justify-start">
        <span className="text-2xl font-semibold text-primary-500">
          ${course.salePrice.toFixed(2)}
        </span>
        {course.originalPrice ? (
          <span className="text-base text-gray-400 line-through">
            ${course.originalPrice.toFixed(2)}
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-2 lg:justify-end">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-neutral-800"
          aria-label={`Remove ${course.title} from cart`}
        >
          <X className="h-4 w-4" />
        </button>

        <Button variant="ghost" colorScheme="primary" size="sm">
          Move to Wishlist
        </Button>
      </div>
    </article>
  );
}
