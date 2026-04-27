import type { ApiResult, User } from '@/types'

export async function loginApi(email: string, password: string): Promise<ApiResult<User>> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return {
        ok: false,
        error: {
          code: body.code ?? 'AUTH_FAILED',
          message: body.message ?? 'Logowanie nieudane',
        },
      }
    }
    const data = (await res.json()) as User
    return { ok: true, data }
  } catch {
    return { ok: false, error: { code: 'NETWORK', message: 'Błąd sieci' } }
  }
}
