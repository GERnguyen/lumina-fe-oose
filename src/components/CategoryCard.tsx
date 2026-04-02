import type { LucideIcon } from "lucide-react";
import { cn } from "../utils/cn";

export interface CategoryCardProps {
  icon: LucideIcon;
  name: string;
  courseCount: number;
  tone?: "primary" | "secondary" | "success" | "warning" | "danger" | "gray";
}

const toneStyles: Record<NonNullable<CategoryCardProps["tone"]>, string> = {
  primary: "bg-primary-100 text-primary-800",
  secondary: "bg-secondary-100 text-secondary-800",
  success: "bg-success-100 text-success-800",
  warning: "bg-warning-100 text-warning-800",
  danger: "bg-danger-100 text-danger-800",
  gray: "bg-gray-50 text-gray-800",
};

export default function CategoryCard({
  icon: Icon,
  name,
  courseCount,
  tone = "gray",
}: CategoryCardProps) {
  return (
    <article className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-lg",
          toneStyles[tone],
        )}
      >
        <Icon className="h-6 w-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-semibold text-neutral-800">{name}</h3>
        <p className="text-sm text-gray-600">
          {courseCount.toLocaleString()} courses
        </p>
      </div>
    </article>
  );
}
