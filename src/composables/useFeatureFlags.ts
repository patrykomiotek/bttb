import { ref, onMounted } from 'vue'
import type { ApiResult } from '@/types'

export type FeatureFlag = 'NEW_ORDER_FORM' | 'CRYPTO_TAB' | 'MARGIN_CALL_BANNER'

interface FlagsResponse {
  flags: Record<FeatureFlag, boolean>
}

async function fetchFlags(): Promise<ApiResult<Record<FeatureFlag, boolean>>> {
  try {
    const res = await fetch('/api/feature-flags')
    if (!res.ok) {
      return { ok: false, error: { code: `HTTP_${res.status}`, message: 'Failed' } }
    }
    const body = (await res.json()) as FlagsResponse
    return { ok: true, data: body.flags }
  } catch {
    return { ok: false, error: { code: 'NETWORK', message: 'Network error' } }
  }
}

/**
 * Pod ćwiczenie 3D — testowanie composable z fallbackiem.
 * Gdy API failuje, używamy lokalnego defaultu.
 */
export function useFeatureFlags(defaults: Record<FeatureFlag, boolean>) {
  const flags = ref<Record<FeatureFlag, boolean>>({ ...defaults })
  const loaded = ref(false)
  const usedFallback = ref(false)

  async function load() {
    const res = await fetchFlags()
    if (res.ok) {
      flags.value = { ...defaults, ...res.data }
      usedFallback.value = false
    } else {
      usedFallback.value = true
    }
    loaded.value = true
  }

  function isEnabled(flag: FeatureFlag): boolean {
    return flags.value[flag] === true
  }

  onMounted(() => void load())

  return { flags, loaded, usedFallback, isEnabled, load }
}
