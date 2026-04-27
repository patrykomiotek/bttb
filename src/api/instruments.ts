import type { ApiResult, Instrument } from '@/types'

export async function fetchInstruments(): Promise<ApiResult<Instrument[]>> {
  try {
    const res = await fetch('/api/instruments')
    if (!res.ok) {
      return {
        ok: false,
        error: { code: `HTTP_${res.status}`, message: `Błąd pobierania (${res.status})` },
      }
    }
    const data = (await res.json()) as Instrument[]
    return { ok: true, data }
  } catch {
    return { ok: false, error: { code: 'NETWORK', message: 'Błąd sieci' } }
  }
}
