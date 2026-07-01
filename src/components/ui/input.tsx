"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix" | "suffix"> {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, hint, prefix, suffix, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="w-full">
        {label ? (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-ink-700"
          >
            {label}
          </label>
        ) : null}
        <div className="relative flex items-center">
          {prefix ? (
            <div className="pointer-events-none absolute left-3.5 flex items-center text-ink-400">
              {prefix}
            </div>
          ) : null}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={`
              h-12 w-full rounded-2xl border bg-white text-ink-900
              placeholder:text-ink-400
              transition-colors duration-150
              focus:outline-none focus-visible:outline-2 focus-visible:outline-ink-900
              disabled:bg-ink-50 disabled:text-ink-400
              ${prefix ? "pl-10" : "pl-4"}
              ${suffix ? "pr-10" : "pr-4"}
              ${error ? "border-warning" : "border-ink-200 hover:border-ink-400 focus:border-ink-900"}
              ${className}
            `}
            {...props}
          />
          {suffix ? (
            <div className="absolute right-3.5 flex items-center text-ink-400">
              {suffix}
            </div>
          ) : null}
        </div>
        {error ? (
          <p id={errorId} role="alert" className="mt-1.5 text-sm text-warning">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="mt-1.5 text-sm text-ink-400">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
