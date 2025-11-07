// utils/formatCurrency.ts
export type FormatCurrencyOptions = {
  locale?: string;                 // default: 'es-AR'
  currency?: string;               // default: 'ARS'
  withSymbol?: boolean;            // default: true  -> "$ 1.234,56"
  compact?: boolean;               // default: false -> "$ 1.234,56" | true -> "$ 1,2 M"
  minimumFractionDigits?: number;  // default: 2
  maximumFractionDigits?: number;  // default: 2
};

export function formatCurrency(
  value: number | string | null | undefined,
  {
    locale = "es-AR",
    currency = "ARS",
    withSymbol = true,
    compact = false,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  }: FormatCurrencyOptions = {}
): string {
  const n =
    typeof value === "string"
      ? Number(value.replace(/[, ]+/g, "").trim())
      : Number(value);

  if (!Number.isFinite(n)) return "—";

  const formatter = new Intl.NumberFormat(locale, {
    // Use currency style when we want the symbol; decimal otherwise.
    style: withSymbol ? "currency" : "decimal",
    currency,
    currencyDisplay: "narrowSymbol", // "$"
    notation: compact ? "compact" : "standard",
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return formatter.format(n);
}