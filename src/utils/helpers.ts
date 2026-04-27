/**
 * Helpery — ryzyko, P/L, cooldowny.
 * CEL ĆWICZENIA 1B: te funkcje są *celowo* trudniejsze do przetestowania.
 * Niektóre mają niejawne zależności (Date.now, Math.random) lub subtelne
 * pułapki numeryczne. Zadanie: uczynić je testowalnymi i pokryć testami.
 */

import type { OrderSide } from '@/types'

export function calculatePnL(
  side: OrderSide,
  openPrice: number,
  currentPrice: number,
  volume: number,
): number {
  const diff = side === 'BUY' ? currentPrice - openPrice : openPrice - currentPrice
  return Math.round(diff * volume * 100) / 100
}

export function calculateMargin(
  openPrice: number,
  volume: number,
  leverage: number,
): number {
  if (leverage <= 0) throw new Error('Leverage must be positive')
  return (openPrice * volume) / leverage
}

export function riskLevel(balance: number, openPositions: number): 'LOW' | 'MEDIUM' | 'HIGH' {
  if (balance <= 0) return 'HIGH'
  const perPosition = balance / Math.max(openPositions, 1)
  if (perPosition < 100) return 'HIGH'
  if (perPosition < 1000) return 'MEDIUM'
  return 'LOW'
}

// --- Ćwiczenie 1B: celowo trudne do przetestowania ---

/**
 * Sprawdza, czy od ostatniego logowania minął cooldown (w ms).
 * Problem: używa Date.now() bezpośrednio. Zadaniem pary jest zrobić to
 * testowalnym (np. przyjmując `now` jako parametr lub używając fake timers).
 */
export function canLoginAgain(lastLoginAt: number, cooldownMs = 5000): boolean {
  return Date.now() - lastLoginAt >= cooldownMs
}

/**
 * Generuje ID zlecenia.
 * Problem: Math.random() + Date.now(). Trzeba rozważyć strategię:
 *  - wstrzyknięcie generatora (DI)
 *  - vi.spyOn / vi.setSystemTime
 *  - pokrycie contractu (format) zamiast konkretnej wartości
 */
export function generateOrderId(): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase()
  const ts = Date.now().toString(36).toUpperCase()
  return `ORD-${ts}-${rand}`
}

/**
 * Debounce — klasyk "trudnego testu".
 * Zadanie rozszerzone: przetestować z vi.useFakeTimers().
 */
export function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  delayMs: number,
): (...args: A) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: A) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delayMs)
  }
}
