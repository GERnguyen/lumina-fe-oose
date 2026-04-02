import * as React from "react";
import { cn } from "../../utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  rightIconAriaLabel?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      leftIcon,
      rightIcon,
      onRightIconClick,
      rightIconAriaLabel,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? React.useId();
    const hasLeftIcon = Boolean(leftIcon);
    const hasRightIcon = Boolean(rightIcon);
    const hasError = Boolean(error);

    return (
      <div className="w-full space-y-1.5">
        {label ? (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-800"
          >
            {label}
          </label>
        ) : null}

        <div className="relative">
          {hasLeftIcon ? (
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-500">
              {leftIcon}
            </div>
          ) : null}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={hasError || undefined}
            className={cn(
              "flex h-12 w-full rounded-lg bg-white text-neutral-800 border outline outline-1 outline-gray-400 outline-offset-[-1px] transition-colors duration-200 placeholder:text-gray-500 focus:outline-2 focus:outline-primary-500 focus:outline-offset-[-1px] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400",
              hasLeftIcon ? "pl-10" : "pl-4",
              hasRightIcon ? "pr-10" : "pr-4",
              hasError &&
                "bg-danger-100 text-danger-700 placeholder:text-danger-400 outline-danger-300 focus:outline-danger-500",
              className,
            )}
            {...props}
          />

          {hasRightIcon ? (
            onRightIconClick ? (
              <button
                type="button"
                onClick={onRightIconClick}
                aria-label={rightIconAriaLabel ?? "Toggle input icon action"}
                className="absolute inset-y-0 right-2 flex items-center rounded px-1 text-gray-500 transition hover:text-neutral-700"
              >
                {rightIcon}
              </button>
            ) : (
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                {rightIcon}
              </div>
            )
          ) : null}
        </div>

        {error ? <p className="text-sm text-danger-600">{error}</p> : null}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
