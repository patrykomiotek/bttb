import { ref } from 'vue'
import type { ApiResult } from '@/types'

export interface UseRetryFetchOptions {
  maxAttempts?: number
  backoffMs?: number
}

/**
 * Composable do fetcha z retry — używany w Ćwiczeniu 3 (scenariusz błędu).
 * Zwraca stan + akcje. Celowo trzyma attempts żeby było co asertować.
 */
export function useRetryFetch<T>(
  fetcher: () => Promise<ApiResult<T>>,
  options: UseRetryFetchOptions = {},
) {
  const { maxAttempts = 3, backoffMs = 300 } = options

  const data = ref<T | null>(null) as import('vue').Ref<T | null>
  const error = ref<string | null>(null)
  const loading = ref(false)
  const attempts = ref(0)

  async function run(): Promise<void> {
    loading.value = true
    error.value = null
    attempts.value = 0

    for (let i = 1; i <= maxAttempts; i++) {
      attempts.value = i
      const res = await fetcher()
      if (res.ok) {
        data.value = res.data
        loading.value = false
        return
      }
      if (i < maxAttempts) {
        await new Promise((r) => setTimeout(r, backoffMs))
        continue
      }
      error.value = res.error.message
    }
    loading.value = false
  }

  return { data, error, loading, attempts, run }
}
