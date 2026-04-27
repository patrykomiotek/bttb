import { describe, it, expect } from 'vitest'
import { formatPercent, formatDelta } from './formatters'

// Przykładowy test — sanity check że Vitest działa.
// Reszta testów formatters/validators/helpers: Ćwiczenie 1.
describe('formatters (sanity)', () => {
  it('formatPercent dodaje znak + dla wartości dodatnich', () => {
    expect(formatPercent(1.5)).toBe('+1.50%')
  })

  it('formatDelta zwraca kierunek "flat" dla zera', () => {
    expect(formatDelta(0)).toEqual({ text: '0.00%', direction: 'flat' })
  })
})
