import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Instrument } from '@/types'
import { fetchInstruments } from '@/api/instruments'

export const useInstrumentsStore = defineStore('instruments', () => {
  const items = ref<Instrument[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load(): Promise<void> {
    loading.value = true
    error.value = null
    const res = await fetchInstruments()
    loading.value = false
    if (!res.ok) {
      error.value = res.error.message
      return
    }
    items.value = res.data
  }

  function updatePrice(symbol: string, price: number): void {
    const instr = items.value.find((i) => i.symbol === symbol)
    if (instr) instr.price = price
  }

  return { items, loading, error, load, updatePrice }
})
