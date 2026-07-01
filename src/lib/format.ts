/**
 * Formats a decimal string amount (e.g. "1000.5") as Naira display,
 * always showing exactly 2 decimal places (kobo precision).
 */
export function formatNaira(amount: string | number): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  if (Number.isNaN(value)) return "₦0.00";
  return `₦${value.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Splits a formatted Naira string into integer and decimal parts,
 * so the UI can render the kobo portion at a smaller scale —
 * the exact figure is always present, never rounded away.
 */
export function splitNaira(amount: string | number): { whole: string; decimal: string } {
  const formatted = formatNaira(amount);
  const [whole, decimal] = formatted.split(".");
  return { whole, decimal: decimal ?? "00" };
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatAccountNumber(accountNumber: string): string {
  // Group into 4s for readability: 1234567890 -> 1234 5678 90
  return accountNumber.replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function maskAccountNumber(accountNumber: string): string {
  const last4 = accountNumber.slice(-4);
  return `•••• ${last4}`;
}
