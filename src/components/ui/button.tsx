"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-ink-900 text-white hover:bg-ink-700 active:bg-black disabled:bg-ink-200 disabled:text-ink-400",
  secondary:
    "bg-white text-ink-900 border border-ink-200 hover:border-ink-900 hover:bg-ink-50 disabled:text-ink-200 disabled:border-ink-100",
  ghost:
    "bg-transparent text-ink-900 hover:bg-ink-50 disabled:text-ink-200",
  danger:
    "bg-warning text-white hover:bg-red-700 active:bg-red-800 disabled:bg-ink-200 disabled:text-ink-400",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-[0.95rem] gap-2",
  lg: "h-13 px-7 text-base gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "primary", size = "md", isLoading, disabled, children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center rounded-2xl font-medium
          transition-all duration-200 ease-out
          disabled:cursor-not-allowed
          active:scale-[0.98]
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.25} />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
