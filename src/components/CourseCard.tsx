import { Star, Users } from "lucide-react";
import Button from "./ui/Button";
import { cn } from "../utils/cn";

export interface CourseCardProps {
  imageUrl: string;
  title: string;
  category: string;
  categoryTone?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "gray";
  price: number;
  originalPrice?: number;
  rating: number;
  students: number;
  author: string;
}

const categoryToneStyles: Record<
  NonNullable<CourseCardProps["categoryTone"]>,
  string
> = {
  primary: "bg-primary-100 text-primary-800",
  secondary: "bg-secondary-100 text-secondary-800",
  success: "bg-success-100 text-success-800",
  warning: "bg-warning-100 text-warning-800",
  danger: "bg-danger-100 text-danger-800",
  gray: "bg-gray-50 text-gray-800",
};

export default function CourseCard({
  imageUrl,
  title,
  category,
  categoryTone = "gray",
  price,
  originalPrice,
  rating,
  students,
  author,
}: CourseCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
      <img src={imageUrl} alt={title} className="h-44 w-full object-cover" />

      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <span
            className={cn(
              "rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wide",
              categoryToneStyles[categoryTone],
            )}
          >
            {category}
          </span>

          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-primary-500">
              ${price.toFixed(2)}
            </span>
            {originalPrice ? (
              <span className="text-sm text-gray-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            ) : null}
          </div>
        </div>

        <h3 className="line-clamp-2 text-base font-semibold text-neutral-800">
          {title}
        </h3>

        <p className="text-sm text-gray-600">by {author}</p>

        <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-warning-500 text-warning-500" />
            <span className="font-medium text-neutral-800">
              {rating.toFixed(1)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-secondary-500" />
            <span>{students.toLocaleString()} students</span>
          </div>
        </div>

        <Button className="w-full" colorScheme="primary" size="sm">
          View course
        </Button>
      </div>
    </article>
  );
}
