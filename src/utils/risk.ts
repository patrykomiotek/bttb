/**
 * Bardziej zaawansowane kalkulacje ryzyka — pod ćwiczenie 1D (rozszerzone).
 * Funkcje są celowo nietrywialne: branch coverage nieoczywiste,
 * floating point pułapki, granica całkowania.
 */

import type { OrderSide } from '@/types'

export interface Position {
  side: OrderSide
  openPrice: number
  currentPrice: number
  volume: number
  leverage: number
}

/**
 * Oblicz wartość portfela z otwartymi pozycjami.
 * Pułapka: floating point (0.1 + 0.2), wieloma pozycjami.
 */
export function portfolioValue(balance: number, positions: Position[]): number {
  const pnl = positions.reduce((acc, p) => {
    const diff = p.side === 'BUY' ? p.currentPrice - p.openPrice : p.openPrice - p.currentPrice
    return acc + diff * p.volume
  }, 0)
  return Math.round((balance + pnl) * 100) / 100
}

/**
 * Margin call — gdy equity / used margin < threshold.
 * Branch coverage: zero pozycji, zero equity, granica.
 */
export function marginCallTriggered(
  equity: number,
  positions: Position[],
  thresholdPct = 50,
): boolean {
  if (positions.length === 0) return false
  const usedMargin = positions.reduce(
    (acc, p) => acc + (p.openPrice * p.volume) / p.leverage,
    0,
  )
  if (usedMargin === 0) return false
  const ratio = (equity / usedMargin) * 100
  return ratio < thresholdPct
}

/**
 * Konwersja wolumenu na lota standard (100k jednostek dla FX).
 * Granica: małe ułamki, problem zaokrągleń bankierskich.
 */
export function lotsToUnits(lots: number, lotSize = 100_000): number {
  if (lots < 0) throw new Error('Lots must be non-negative')
  return Math.round(lots * lotSize)
}

/**
 * Klasyfikacja wolumenu wg progów. Wieloargumentowy switch z otwartymi przedziałami.
 */
export function volumeTier(lots: number): 'MICRO' | 'MINI' | 'STANDARD' | 'INSTITUTIONAL' {
  if (lots < 0.01) return 'MICRO'
  if (lots < 0.1) return 'MINI'
  if (lots < 10) return 'STANDARD'
  return 'INSTITUTIONAL'
}
