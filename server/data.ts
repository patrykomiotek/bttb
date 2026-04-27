import type { Instrument } from '../src/types'

export const demoUser = {
  id: 'u-1',
  email: 'demo@xtb.local',
  password: 'Passw0rd',
  username: 'demo',
}

export const instruments: Instrument[] = [
  { symbol: 'EURUSD', name: 'Euro / US Dollar', category: 'FOREX', price: 1.0925, change24h: 0.12, currency: 'USD' },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', category: 'FOREX', price: 152.31, change24h: -0.08, currency: 'JPY' },
  { symbol: 'AAPL.US', name: 'Apple Inc.', category: 'STOCK', price: 228.45, change24h: 1.34, currency: 'USD' },
  { symbol: 'TSLA.US', name: 'Tesla Inc.', category: 'STOCK', price: 251.80, change24h: -2.10, currency: 'USD' },
  { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar', category: 'CRYPTO', price: 67890.5, change24h: 3.45, currency: 'USD' },
  { symbol: 'GOLD', name: 'Gold Spot', category: 'COMMODITY', price: 2398.12, change24h: 0.55, currency: 'USD' },
]
