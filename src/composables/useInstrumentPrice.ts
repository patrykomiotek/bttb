import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * Composable subskrybujący ceny instrumentu przez WebSocket.
 * Używany w Bloku 5 (mockowanie WebSocketów) — patrz tests/examples/websocket.spec.ts.
 */
export function useInstrumentPrice(symbol: string, url = '/ws/prices') {
  const price = ref<number | null>(null)
  const connected = ref(false)
  const error = ref<string | null>(null)
  let ws: WebSocket | null = null

  function connect() {
    const fullUrl = url.startsWith('ws') ? url : `ws://${location.host}${url}`
    try {
      ws = new WebSocket(fullUrl)
    } catch (e) {
      error.value = (e as Error).message
      return
    }

    ws.onopen = () => {
      connected.value = true
      ws?.send(JSON.stringify({ type: 'subscribe', symbol }))
    }
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.type === 'price' && msg.symbol === symbol) {
          price.value = msg.price
        }
      } catch {
        // ignorujemy niepoprawne wiadomości — to jest testowane
      }
    }
    ws.onerror = () => {
      error.value = 'WebSocket error'
    }
    ws.onclose = () => {
      connected.value = false
    }
  }

  function disconnect() {
    ws?.close()
    ws = null
  }

  onMounted(connect)
  onBeforeUnmount(disconnect)

  return { price, connected, error, disconnect }
}
