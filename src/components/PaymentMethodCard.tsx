import {
  CheckCircle2,
  Circle,
  CreditCard,
  PlusCircle,
  Wallet,
} from "lucide-react";
import type { PaymentMethodType } from "../data/checkout.mock";
import { cn } from "../utils/cn";

interface PaymentMethodCardProps {
  title: string;
  details: string[];
  type: PaymentMethodType;
  isActive?: boolean;
  onClick?: () => void;
}

export default function PaymentMethodCard({
  title,
  details,
  type,
  isActive = false,
  onClick,
}: PaymentMethodCardProps) {
  const MethodIcon =
    type === "paypal" ? Wallet : type === "new-card" ? PlusCircle : CreditCard;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border bg-white p-4 text-left transition sm:p-5",
        isActive
          ? "border-primary-500 shadow-[0_0_0_1px_rgba(255,102,54,0.20)]"
          : "border-gray-200 hover:border-gray-300",
      )}
      aria-pressed={isActive}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              "mt-0.5 rounded-lg p-2",
              isActive
                ? "bg-orange-100 text-primary-500"
                : "bg-gray-100 text-gray-500",
            )}
          >
            <MethodIcon className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="text-base font-semibold text-neutral-800">{title}</p>
            <div className="mt-1.5 space-y-0.5">
              {details.map((detail) => (
                <p key={detail} className="truncate text-sm text-gray-600">
                  {detail}
                </p>
              ))}
            </div>
          </div>
        </div>

        {isActive ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-500" />
        ) : (
          <Circle className="h-5 w-5 shrink-0 text-gray-300" />
        )}
      </div>
    </button>
  );
}
