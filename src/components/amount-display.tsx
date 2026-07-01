import { splitNaira } from "@/lib/format";

interface AmountDisplayProps {
  amount: string | number;
  size?: "lg" | "xl";
  className?: string;
}

/**
 * The dashboard's signature treatment: the whole-naira figure is set in
 * Playfair Display at full size, while the kobo (the exact, no-rounding
 * remainder the backend stores down to the integer) sits smaller and in
 * monospace — a quiet nod to the fact that every unit is accounted for,
 * never silently rounded.
 */
export function AmountDisplay({ amount, size = "xl", className = "" }: AmountDisplayProps) {
  const { whole, decimal } = splitNaira(amount);

  const wholeSize = size === "xl" ? "text-5xl sm:text-6xl" : "text-3xl sm:text-4xl";
  const decimalSize = size === "xl" ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl";

  return (
    <span className={`font-serif tabular ${className}`}>
      <span className={`font-semibold tracking-tight ${wholeSize}`}>{whole}</span>
      <span className={`font-mono font-normal text-ink-400 ${decimalSize}`}>.{decimal}</span>
    </span>
  );
}
