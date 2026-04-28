/**
 * Formatery — wyświetlanie cen, zmian, walut.
 * CEL ĆWICZENIA 1A: napisać testy jednostkowe (szczególnie zwróć uwagę na edge cases).
 */

export function formatPrice(
  value: number,
  currency = "USD",
  locale = "pl-PL",
): string {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}

export function formatPercent(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

export function formatDelta(delta: number): {
  text: string;
  direction: "up" | "down" | "flat";
} {
  if (!Number.isFinite(delta) || delta === 0) {
    return { text: formatPercent(0), direction: "flat" };
  }
  return {
    text: formatPercent(delta),
    direction: delta > 0 ? "up" : "down",
  };
}

export function truncateSymbol(symbol: string, maxLen = 6): string {
  if (symbol.length <= maxLen) return symbol;
  return `${symbol.slice(0, maxLen - 1)}…`;
}

export function formatDateTime(iso: string, locale = "pl-PL"): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);
}
