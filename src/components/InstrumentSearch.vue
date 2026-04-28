<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { debounce } from '@/utils/helpers'
import { useInstrumentsStore } from '@/stores/instruments'

const store = useInstrumentsStore()
const query = ref('')
const debouncedQuery = ref('')

const updateDebounced = debounce((q: string) => {
  debouncedQuery.value = q
}, 250)

watch(query, (q) => updateDebounced(q))

const results = computed(() => {
  const q = debouncedQuery.value.trim().toUpperCase()
  if (!q) return store.items
  return store.items.filter(
    (i) => i.symbol.includes(q) || i.name.toUpperCase().includes(q),
  )
})
</script>

<template>
  <section class="card" data-testid="instrument-search">
    <h2>Wyszukaj instrument</h2>
    <div class="field">
      <input
        v-model="query"
        class="input"
        placeholder="np. EUR, AAPL, BTC"
        data-testid="search-input"
      />
    </div>
    <ul data-testid="search-results">
      <li
        v-for="r in results"
        :key="r.symbol"
        :data-testid="`search-result-${r.symbol}`"
      >
        <strong>{{ r.symbol }}</strong> — {{ r.name }}
      </li>
      <li
        v-if="results.length === 0 && debouncedQuery"
        data-testid="search-empty"
      >
        Brak wyników dla "{{ debouncedQuery }}"
      </li>
    </ul>
  </section>
</template>
