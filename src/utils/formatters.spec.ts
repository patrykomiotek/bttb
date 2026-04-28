import { describe, it, expect } from "vitest";
import {
  formatPercent,
  formatDelta,
  formatPrice,
  truncateSymbol,
} from "./formatters";

// Przykładowy test — sanity check że Vitest działa.
// Reszta testów formatters/validators/helpers: Ćwiczenie 1.
describe("formatters (sanity)", () => {
  it("formatPercent dodaje znak + dla wartości dodatnich", () => {
    expect(formatPercent(1.5)).toBe("+1.50%");
  });

  it("formatPercent wstawia - dla wartości nieskończonych", () => {
    expect(formatPercent(Infinity)).toBe("—");
  });

  it('formatDelta zwraca kierunek "flat" dla zera', () => {
    expect(formatDelta(0)).toEqual({ text: "0.00%", direction: "flat" });
  });

  it('formatDelta zwraca kierunek "up" dla wartości dodatnich', () => {
    expect(formatDelta(10)).toEqual({ text: "+10.00%", direction: "up" });
  });

  it('formatDelta zwraca kierunek "down" dla wartości ujemnych', () => {
    expect(formatDelta(-10)).toEqual({ text: "-10.00%", direction: "down" });
  });

  it("formatPrice poprawnie formatuje cenę", () => {
    expect(formatPrice(50)).toBe("50,00 USD"); // uwaga NumberFormat wstawia niełamliwą spację (&nbsp;)
  });

  it("truncateSymbol poprawnie wyświetla wartość", () => {
    expect(truncateSymbol("123")).toBe("123");
    expect(truncateSymbol("123456789")).toBe("12345…");
  });
});
