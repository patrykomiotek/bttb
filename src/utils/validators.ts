/**
 * Walidatory używane w formularzach aplikacji.
 * CEL ĆWICZENIA 1A: napisać testy jednostkowe dla wszystkich funkcji z tego pliku.
 */

export interface ValidationResult {
  valid: boolean
  message?: string
}

const OK: ValidationResult = { valid: true }

export function validateEmail(input: string): ValidationResult {
  if (!input) return { valid: false, message: 'Email jest wymagany' }
  const trimmed = input.trim()
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!re.test(trimmed)) return { valid: false, message: 'Niepoprawny format email' }
  return OK
}

export function validatePassword(input: string): ValidationResult {
  if (!input) return { valid: false, message: 'Hasło jest wymagane' }
  if (input.length < 8) return { valid: false, message: 'Minimum 8 znaków' }
  if (!/[A-Z]/.test(input)) return { valid: false, message: 'Wymagana wielka litera' }
  if (!/[0-9]/.test(input)) return { valid: false, message: 'Wymagana cyfra' }
  return OK
}

export function validateVolume(value: unknown): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return { valid: false, message: 'Wolumen jest wymagany' }
  }
  const n = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(n)) return { valid: false, message: 'Wolumen musi być liczbą' }
  if (n <= 0) return { valid: false, message: 'Wolumen musi być dodatni' }
  if (n > 1000) return { valid: false, message: 'Wolumen nie może przekraczać 1000' }
  const rounded = Math.round(n * 100) / 100
  if (rounded !== n) return { valid: false, message: 'Dozwolone są max 2 miejsca po przecinku' }
  return OK
}

export function validateSymbol(symbol: string): ValidationResult {
  if (!symbol) return { valid: false, message: 'Symbol jest wymagany' }
  if (!/^[A-Z]{3,10}(\.[A-Z]{2,4})?$/.test(symbol)) {
    return { valid: false, message: 'Niepoprawny format symbolu (np. EURUSD, AAPL.US)' }
  }
  return OK
}

export function validateStopLoss(
  side: 'BUY' | 'SELL',
  openPrice: number,
  stopLoss: number | undefined,
): ValidationResult {
  if (stopLoss === undefined) return OK
  if (stopLoss <= 0) return { valid: false, message: 'Stop-loss musi być dodatni' }
  if (side === 'BUY' && stopLoss >= openPrice) {
    return { valid: false, message: 'Stop-loss dla BUY musi być niżej niż cena otwarcia' }
  }
  if (side === 'SELL' && stopLoss <= openPrice) {
    return { valid: false, message: 'Stop-loss dla SELL musi być wyżej niż cena otwarcia' }
  }
  return OK
}
