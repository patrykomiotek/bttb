import type { ApiResult, Order, OrderRequest } from '@/types'

export async function placeOrder(req: OrderRequest): Promise<ApiResult<Order>> {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return {
        ok: false,
        error: {
          code: body.code ?? `HTTP_${res.status}`,
          message: body.message ?? 'Błąd składania zlecenia',
        },
      }
    }
    const data = (await res.json()) as Order
    return { ok: true, data }
  } catch {
    return { ok: false, error: { code: 'NETWORK', message: 'Błąd sieci' } }
  }
}
