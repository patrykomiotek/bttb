import { ref, computed } from 'vue'
import type { Order } from '@/types'

export interface OrderHistoryFilter {
  symbol?: string
  side?: 'BUY' | 'SELL'
  status?: 'OPEN' | 'CLOSED'
}

/**
 * Composable do filtrowania i sortowania historii zleceń.
 * Pod ćwiczenie 2C — testowanie composables w izolacji.
 */
export function useOrderHistory(initial: Order[] = []) {
  const orders = ref<Order[]>([...initial])
  const filter = ref<OrderHistoryFilter>({})
  const sortBy = ref<'createdAt' | 'volume' | 'symbol'>('createdAt')
  const sortDir = ref<'asc' | 'desc'>('desc')

  const filtered = computed(() => {
    return orders.value.filter((o) => {
      if (filter.value.symbol && !o.symbol.includes(filter.value.symbol)) return false
      if (filter.value.side && o.side !== filter.value.side) return false
      if (filter.value.status && o.status !== filter.value.status) return false
      return true
    })
  })

  const sorted = computed(() => {
    const dir = sortDir.value === 'asc' ? 1 : -1
    return [...filtered.value].sort((a, b) => {
      const key = sortBy.value
      const av = a[key]
      const bv = b[key]
      if (av < bv) return -1 * dir
      if (av > bv) return 1 * dir
      return 0
    })
  })

  function add(order: Order) {
    orders.value = [...orders.value, order]
  }

  function clear() {
    orders.value = []
    filter.value = {}
  }

  return {
    orders,
    filter,
    sortBy,
    sortDir,
    filtered,
    sorted,
    add,
    clear,
  }
}
