import { MoreVertical, Star, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../utils/cn";

export interface InstructorCourseCardProps {
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
}

const categoryToneStyles: Record<
  NonNullable<InstructorCourseCardProps["categoryTone"]>,
  string
> = {
  primary: "bg-primary-100 text-primary-800",
  secondary: "bg-secondary-100 text-secondary-800",
  success: "bg-success-100 text-success-800",
  warning: "bg-warning-100 text-warning-800",
  danger: "bg-danger-100 text-danger-800",
  gray: "bg-gray-50 text-gray-800",
};

export default function InstructorCourseCard({
  imageUrl,
  title,
  category,
  categoryTone = "gray",
  price,
  originalPrice,
  rating,
  students,
}: InstructorCourseCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <article className="overflow-visible rounded-xl border border-gray-200 bg-white">
      <img src={imageUrl} alt={title} className="h-52 w-full object-cover" />

      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <span
            className={cn(
              "inline-flex rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wide",
              categoryToneStyles[categoryTone],
            )}
          >
            {category}
          </span>

          <h3 className="line-clamp-2 text-base font-semibold text-neutral-800">
            {title}
          </h3>
        </div>

        <div className="flex items-center justify-between border-y border-gray-200 py-3 text-sm text-gray-600">
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

        <div
          className="relative flex items-center justify-between"
          ref={dropdownRef}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-primary-500">
              ${price.toFixed(2)}
            </span>
            {originalPrice ? (
              <span className="text-sm text-gray-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-neutral-800"
            aria-label="Open course actions"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {isOpen ? (
            <div className="absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
              <button
                type="button"
                className="w-full bg-orange-500 px-4 py-2 text-left text-sm font-medium text-white"
              >
                View Details
              </button>
              <button
                type="button"
                className="w-full px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50"
              >
                Edit Course
              </button>
              <button
                type="button"
                className="w-full px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50"
              >
                Delete Course
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
