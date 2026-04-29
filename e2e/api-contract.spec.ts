import { test, expect } from '@playwright/test'

const API = 'http://localhost:3001'

test.beforeEach(async ({ request }) => {
  await request.delete(`${API}/api/orders`)
})

test.describe('API contract — orders', () => {
  test('POST /api/orders → 201 + Order shape', async ({ request }) => {
    const res = await request.post(`${API}/api/orders`, {
      data: { symbol: 'EURUSD', side: 'BUY', volume: 0.1 },
    })
    expect(res.status()).toBe(201)
    const order = await res.json()
    expect(order).toMatchObject({
      id: expect.stringMatching(/^ORD-/),
      symbol: 'EURUSD',
      side: 'BUY',
      volume: 0.1,
      status: 'OPEN',
    })
    expect(order.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  test('POST z nieznanym symbolem → 400', async ({ request }) => {
    const res = await request.post(`${API}/api/orders`, {
      data: { symbol: 'NOTREAL', side: 'BUY', volume: 0.1 },
    })
    expect(res.status()).toBe(400)
    const body = await res.json()
    expect(body).toMatchObject({ code: 'UNKNOWN_SYMBOL' })
  })

  test('DELETE /api/orders/:id usuwa zlecenie', async ({ request }) => {
    const created = await request.post(`${API}/api/orders`, {
      data: { symbol: 'EURUSD', side: 'BUY', volume: 0.1 },
    })
    const { id } = await created.json()

    const del = await request.delete(`${API}/api/orders/${id}`)
    expect(del.status()).toBe(204)

    const list = await request.get(`${API}/api/orders`)
    expect(await list.json()).toEqual([])
  })

  test('DELETE nieistniejącego ID → 404', async ({ request }) => {
    const res = await request.delete(`${API}/api/orders/ORD-NOPE`)
    expect(res.status()).toBe(404)
  })

  test('GET /api/feature-flags zwraca strukturę flag', async ({ request }) => {
    const res = await request.get(`${API}/api/feature-flags`)
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body.flags).toMatchObject({
      NEW_ORDER_FORM: expect.any(Boolean),
      CRYPTO_TAB: expect.any(Boolean),
      MARGIN_CALL_BANNER: expect.any(Boolean),
    })
  })
})
