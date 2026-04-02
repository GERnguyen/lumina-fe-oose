import type { LucideIcon } from "lucide-react";
import { cn } from "../utils/cn";

type StatCardTheme = "primary" | "secondary" | "success" | "warning";

export interface StatCardProps {
  icon: LucideIcon;
  count: number;
  label: string;
  theme?: StatCardTheme;
}

const themeStyles: Record<StatCardTheme, string> = {
  primary: "bg-primary-100 text-primary-500",
  secondary: "bg-secondary-100 text-secondary-500",
  success: "bg-success-100 text-success-600",
  warning: "bg-warning-100 text-warning-500",
};

export default function StatCard({
  icon: Icon,
  count,
  label,
  theme = "primary",
}: StatCardProps) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "inline-flex h-14 w-14 items-center justify-center rounded-lg",
            themeStyles[theme],
          )}
        >
          <Icon className="h-7 w-7" />
        </div>

        <div className="space-y-1">
          <p className="text-3xl font-semibold text-neutral-800">
            {count.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </article>
  );
}
