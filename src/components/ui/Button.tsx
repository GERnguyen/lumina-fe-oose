import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

export type ButtonVariant = "solid" | "outline" | "ghost";
export type ButtonColorScheme =
  | "primary"
  | "secondary"
  | "gray"
  | "success"
  | "warning"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  colorScheme?: ButtonColorScheme;
  size?: ButtonSize;
  isLoading?: boolean;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-lg",
};

const solidStyles: Record<ButtonColorScheme, string> = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500 disabled:bg-primary-300",
  secondary:
    "bg-secondary-500 text-white hover:bg-secondary-600 focus-visible:ring-secondary-500 disabled:bg-secondary-300",
  gray: "bg-gray-500 text-white hover:bg-gray-600 focus-visible:ring-gray-500 disabled:bg-gray-300",
  success:
    "bg-success-500 text-white hover:bg-success-600 focus-visible:ring-success-500 disabled:bg-success-300",
  warning:
    "bg-warning-500 text-white hover:bg-warning-600 focus-visible:ring-warning-500 disabled:bg-warning-300",
  danger:
    "bg-danger-500 text-white hover:bg-danger-600 focus-visible:ring-danger-500 disabled:bg-danger-300",
};

const outlineStyles: Record<ButtonColorScheme, string> = {
  primary:
    "border border-primary-200 bg-white text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-500 disabled:border-primary-100 disabled:text-primary-300",
  secondary:
    "border border-secondary-200 bg-white text-secondary-600 hover:bg-secondary-50 focus-visible:ring-secondary-500 disabled:border-secondary-100 disabled:text-secondary-300",
  gray: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500 disabled:border-gray-100 disabled:text-gray-300",
  success:
    "border border-success-200 bg-white text-success-600 hover:bg-success-50 focus-visible:ring-success-500 disabled:border-success-100 disabled:text-success-300",
  warning:
    "border border-warning-200 bg-white text-warning-600 hover:bg-warning-50 focus-visible:ring-warning-500 disabled:border-warning-100 disabled:text-warning-300",
  danger:
    "border border-danger-200 bg-white text-danger-600 hover:bg-danger-50 focus-visible:ring-danger-500 disabled:border-danger-100 disabled:text-danger-300",
};

const ghostStyles: Record<ButtonColorScheme, string> = {
  primary:
    "bg-transparent text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-500 disabled:text-primary-300",
  secondary:
    "bg-transparent text-secondary-600 hover:bg-secondary-50 focus-visible:ring-secondary-500 disabled:text-secondary-300",
  gray: "bg-transparent text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500 disabled:text-gray-300",
  success:
    "bg-transparent text-success-600 hover:bg-success-50 focus-visible:ring-success-500 disabled:text-success-300",
  warning:
    "bg-transparent text-warning-600 hover:bg-warning-50 focus-visible:ring-warning-500 disabled:text-warning-300",
  danger:
    "bg-transparent text-danger-600 hover:bg-danger-50 focus-visible:ring-danger-500 disabled:text-danger-300",
};

const loadingSpinnerStyles: Record<ButtonColorScheme, string> = {
  primary: "text-white",
  secondary: "text-white",
  gray: "text-white",
  success: "text-white",
  warning: "text-white",
  danger: "text-white",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "solid",
      colorScheme = "primary",
      size = "md",
      isLoading = false,
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    const variantStyles =
      variant === "outline"
        ? outlineStyles[colorScheme]
        : variant === "ghost"
          ? ghostStyles[colorScheme]
          : solidStyles[colorScheme];

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-sans font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
          sizeStyles[size],
          variantStyles,
          className,
        )}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <Loader2
            className={cn(
              "h-4 w-4 animate-spin",
              loadingSpinnerStyles[colorScheme],
            )}
          />
        ) : null}
        <span>{children}</span>
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
