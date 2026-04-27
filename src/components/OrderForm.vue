<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import {
  validateSymbol,
  validateVolume,
  validateStopLoss,
} from '@/utils/validators'
import { placeOrder } from '@/api/orders'
import type { OrderSide, Order } from '@/types'

interface Props {
  defaultSymbol?: string
  defaultPrice?: number
}
const props = withDefaults(defineProps<Props>(), {
  defaultSymbol: 'EURUSD',
  defaultPrice: 1.0925,
})

const emit = defineEmits<{ (e: 'placed', order: Order): void }>()

const form = reactive({
  symbol: props.defaultSymbol,
  side: 'BUY' as OrderSide,
  volume: 0.1,
  stopLoss: undefined as number | undefined,
})

const submitting = ref(false)
const submitError = ref<string | null>(null)
const successOrder = ref<Order | null>(null)
const touched = reactive({ symbol: false, volume: false, stopLoss: false })

const symbolError = computed(() =>
  touched.symbol ? validateSymbol(form.symbol).message : undefined,
)
const volumeError = computed(() =>
  touched.volume ? validateVolume(form.volume).message : undefined,
)
const stopLossError = computed(() =>
  touched.stopLoss
    ? validateStopLoss(form.side, props.defaultPrice, form.stopLoss).message
    : undefined,
)

const canSubmit = computed(
  () =>
    validateSymbol(form.symbol).valid &&
    validateVolume(form.volume).valid &&
    validateStopLoss(form.side, props.defaultPrice, form.stopLoss).valid &&
    !submitting.value,
)

async function submit() {
  touched.symbol = true
  touched.volume = true
  touched.stopLoss = true
  if (!canSubmit.value) return

  submitting.value = true
  submitError.value = null
  successOrder.value = null

  const res = await placeOrder({
    symbol: form.symbol,
    side: form.side,
    volume: form.volume,
    stopLoss: form.stopLoss,
  })

  submitting.value = false
  if (!res.ok) {
    submitError.value = res.error.message
    return
  }
  successOrder.value = res.data
  emit('placed', res.data)
}
</script>

<template>
  <form class="card" data-testid="order-form" @submit.prevent="submit">
    <h2>Nowe zlecenie</h2>
    <div class="field">
      <label class="label" for="symbol">Symbol</label>
      <input
        id="symbol"
        v-model="form.symbol"
        class="input"
        data-testid="order-symbol"
        @blur="touched.symbol = true"
      />
      <div v-if="symbolError" class="error" data-testid="order-symbol-error">{{ symbolError }}</div>
    </div>
    <div class="field">
      <label class="label" for="side">Strona</label>
      <select id="side" v-model="form.side" class="select" data-testid="order-side">
        <option value="BUY">BUY</option>
        <option value="SELL">SELL</option>
      </select>
    </div>
    <div class="field">
      <label class="label" for="volume">Wolumen</label>
      <input
        id="volume"
        v-model.number="form.volume"
        class="input"
        type="number"
        step="0.01"
        data-testid="order-volume"
        @blur="touched.volume = true"
      />
      <div v-if="volumeError" class="error" data-testid="order-volume-error">{{ volumeError }}</div>
    </div>
    <div class="field">
      <label class="label" for="sl">Stop-loss (opcjonalny)</label>
      <input
        id="sl"
        v-model.number="form.stopLoss"
        class="input"
        type="number"
        step="0.0001"
        data-testid="order-stoploss"
        @blur="touched.stopLoss = true"
      />
      <div v-if="stopLossError" class="error" data-testid="order-stoploss-error">
        {{ stopLossError }}
      </div>
    </div>
    <div v-if="submitError" class="error" data-testid="order-submit-error">{{ submitError }}</div>
    <div
      v-if="successOrder"
      class="success"
      data-testid="order-success"
    >
      Zlecenie {{ successOrder.id }} zostało złożone.
    </div>
    <button class="btn" type="submit" :disabled="!canSubmit" data-testid="order-submit">
      {{ submitting ? 'Wysyłam…' : 'Złóż zlecenie' }}
    </button>
  </form>
</template>
