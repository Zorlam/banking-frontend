import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ className = "", hoverable, children, ...props }: CardProps) {
  return (
    <div
      className={`
        rounded-3xl border border-ink-100 shadow-card
        ${hoverable ? "transition-shadow duration-200 hover:shadow-card-hover" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
