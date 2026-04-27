<script setup lang="ts">
import { useInstrumentPrice } from '@/composables/useInstrumentPrice'
import { formatPrice } from '@/utils/formatters'

interface Props {
  symbol: string
  currency?: string
}
const props = withDefaults(defineProps<Props>(), { currency: 'USD' })

const { price, connected } = useInstrumentPrice(props.symbol)
</script>

<template>
  <span class="badge" :data-testid="`ticker-${symbol}`">
    <template v-if="price !== null">{{ formatPrice(price, currency) }}</template>
    <template v-else-if="connected">Czekam na cenę…</template>
    <template v-else>Łączenie…</template>
  </span>
</template>
