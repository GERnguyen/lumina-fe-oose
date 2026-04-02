import * as React from "react";
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
} from "lucide-react";
import { cn } from "../../utils/cn";

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  message: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
}

const variantStyles: Record<AlertVariant, string> = {
  info: "bg-gray-50 outline-gray-300 text-gray-800",
  success: "bg-success-100 outline-success-300 text-success-800",
  warning: "bg-warning-100 outline-warning-300 text-warning-800",
  error: "bg-danger-100 outline-danger-300 text-danger-800",
};

const variantIcons: Record<
  AlertVariant,
  React.ComponentType<{ className?: string }>
> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertOctagon,
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "info",
      message,
      actionLabel,
      onAction,
      onClose,
      ...props
    },
    ref,
  ) => {
    const Icon = variantIcons[variant];
    const hasAction = Boolean(actionLabel && onAction);
    const hasClose = Boolean(onClose);

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "flex w-full items-center justify-between rounded-sm px-6 py-3 shadow-sm outline outline-1 outline-offset-[-1px]",
          variantStyles[variant],
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 shrink-0" />
          <div className="text-base font-normal leading-6">{message}</div>
        </div>

        {(hasAction || hasClose) && (
          <div className="ml-4 flex shrink-0 items-center gap-2">
            {hasAction && (
              <button
                type="button"
                onClick={onAction}
                className="px-2 py-1 text-sm font-semibold uppercase tracking-wide transition-opacity hover:opacity-80"
              >
                {actionLabel}
              </button>
            )}

            {hasAction && hasClose && (
              <div
                className="h-6 w-px bg-current opacity-20"
                aria-hidden="true"
              />
            )}

            {hasClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close alert"
                className="rounded-sm p-1 transition-opacity hover:opacity-80"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    );
  },
);

Alert.displayName = "Alert";

export default Alert;
