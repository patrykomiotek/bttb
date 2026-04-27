import { describe, it, expect } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useInstrumentsStore } from '@/stores/instruments'

// Przykładowy test integracyjny — store + API + MSW (handlers.ts).
// Reszta scenariuszy (retry, error, loading sequence): Ćwiczenie 3.
describe('useInstrumentsStore — happy path (przykład)', () => {
  it('pobiera listę instrumentów przez MSW', async () => {
    setActivePinia(createPinia())
    const store = useInstrumentsStore()

    await store.load()

    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.items.length).toBeGreaterThan(0)
    expect(store.items[0]).toHaveProperty('symbol')
  })
})
