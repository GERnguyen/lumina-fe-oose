import { Check } from "lucide-react";
import { cn } from "../../utils/cn";

export interface CheckboxProps {
  label: string;
  count?: number;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function Checkbox({
  label,
  count,
  checked = false,
  onChange,
}: CheckboxProps) {
  return (
    <button
      type="button"
      onClick={() => onChange?.(!checked)}
      className="flex w-full items-center justify-between gap-3 text-left"
      aria-pressed={checked}
    >
      <span className="flex items-center gap-3">
        <span
          className={cn(
            "inline-flex h-4 w-4 items-center justify-center border transition-colors",
            checked
              ? "border-primary-500 bg-primary-500 text-white"
              : "border-gray-300 bg-white text-transparent",
          )}
          aria-hidden="true"
        >
          <Check className="h-3 w-3" />
        </span>

        <span
          className={cn(
            "text-sm leading-5",
            checked
              ? "font-medium text-primary-500"
              : "font-normal text-gray-600",
          )}
        >
          {label}
        </span>
      </span>

      {typeof count === "number" ? (
        <span
          className={cn(
            "text-xs leading-4",
            checked ? "font-medium text-gray-600" : "font-normal text-gray-400",
          )}
        >
          {count.toLocaleString()}
        </span>
      ) : null}
    </button>
  );
}
