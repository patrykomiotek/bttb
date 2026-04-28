import { http, HttpResponse } from 'msw'
import type { Instrument, Order, OrderRequest, User } from '@/types'

export const sampleInstruments: Instrument[] = [
  { symbol: 'EURUSD', name: 'Euro / US Dollar', category: 'FOREX', price: 1.09, change24h: 0.12, currency: 'USD' },
  { symbol: 'AAPL.US', name: 'Apple Inc.', category: 'STOCK', price: 228.45, change24h: 1.34, currency: 'USD' },
  { symbol: 'BTCUSD', name: 'Bitcoin / USD', category: 'CRYPTO', price: 67000, change24h: 3.1, currency: 'USD' },
]

export const handlers = [
  http.post('*/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }
    if (body.email === 'demo@xtb.local' && body.password === 'Passw0rd') {
      return HttpResponse.json<User>({ id: 'u-1', username: 'demo', token: 'demo-token' })
    }
    return HttpResponse.json(
      { code: 'AUTH_FAILED', message: 'Nieprawidłowe dane logowania' },
      { status: 401 },
    )
  }),

  http.get('*/api/instruments', () => HttpResponse.json(sampleInstruments)),

  http.get('*/api/feature-flags', () =>
    HttpResponse.json({
      flags: {
        NEW_ORDER_FORM: true,
        CRYPTO_TAB: true,
        MARGIN_CALL_BANNER: false,
      },
    }),
  ),

  http.post('*/api/orders', async ({ request }) => {
    const body = (await request.json()) as OrderRequest
    const instr = sampleInstruments.find((i) => i.symbol === body.symbol)
    if (!instr) {
      return HttpResponse.json(
        { code: 'UNKNOWN_SYMBOL', message: `Nieznany symbol: ${body.symbol}` },
        { status: 400 },
      )
    }
    const order: Order = {
      id: 'ORD-TEST-1',
      symbol: body.symbol,
      side: body.side,
      volume: body.volume,
      stopLoss: body.stopLoss,
      openPrice: instr.price,
      createdAt: '2026-04-22T10:00:00.000Z',
      status: 'OPEN',
    }
    return HttpResponse.json(order, { status: 201 })
  }),
]
