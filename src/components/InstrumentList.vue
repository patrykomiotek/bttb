<script setup lang="ts">
import { useInstrumentsStore } from '@/stores/instruments'
import { formatPrice, formatDelta } from '@/utils/formatters'

const store = useInstrumentsStore()

if (store.items.length === 0) {
  void store.load()
}
</script>

<template>
  <section class="card" data-testid="instrument-list">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h2>Instrumenty</h2>
      <button
        class="btn"
        data-testid="instruments-reload"
        :disabled="store.loading"
        @click="store.load()"
      >
        {{ store.loading ? 'Ładuję…' : 'Odśwież' }}
      </button>
    </div>

    <p v-if="store.loading" data-testid="instruments-loading">Ładowanie instrumentów…</p>

    <div v-else-if="store.error" data-testid="instruments-error" class="error">
      {{ store.error }}
      <button class="btn" style="margin-left: 0.5rem" @click="store.load()">Spróbuj ponownie</button>
    </div>

    <table v-else class="table">
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Nazwa</th>
          <th>Cena</th>
          <th>Zmiana 24h</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="i in store.items"
          :key="i.symbol"
          :data-testid="`instrument-row-${i.symbol}`"
        >
          <td>{{ i.symbol }}</td>
          <td>{{ i.name }}</td>
          <td>{{ formatPrice(i.price, i.currency) }}</td>
          <td>
            <span
              class="badge"
              :class="{
                'badge-up': formatDelta(i.change24h).direction === 'up',
                'badge-down': formatDelta(i.change24h).direction === 'down',
              }"
            >
              {{ formatDelta(i.change24h).text }}
            </span>
          </td>
        </tr>
        <tr v-if="store.items.length === 0">
          <td colspan="4" data-testid="instruments-empty">Brak instrumentów</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
