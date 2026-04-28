import express from 'express'
import cors from 'cors'
import http from 'node:http'
import { WebSocketServer } from 'ws'
import { demoUser, instruments } from './data'
import type { Order, OrderRequest } from '../src/types'

const app = express()
app.use(cors())
app.use(express.json())

let orders: Order[] = []

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body ?? {}
  if (email !== demoUser.email || password !== demoUser.password) {
    return res.status(401).json({ code: 'AUTH_FAILED', message: 'Nieprawidłowe dane logowania' })
  }
  res.json({ id: demoUser.id, username: demoUser.username, token: 'demo-token' })
})

app.get('/api/instruments', (_req, res) => {
  res.json(instruments)
})

app.get('/api/orders', (_req, res) => {
  res.json(orders)
})

app.post('/api/orders', (req, res) => {
  const body = req.body as OrderRequest
  const instrument = instruments.find((i) => i.symbol === body.symbol)
  if (!instrument) {
    return res
      .status(400)
      .json({ code: 'UNKNOWN_SYMBOL', message: `Nieznany symbol: ${body.symbol}` })
  }
  if (!body.volume || body.volume <= 0) {
    return res.status(400).json({ code: 'BAD_VOLUME', message: 'Wolumen musi być dodatni' })
  }
  const order: Order = {
    id: `ORD-${Date.now()}`,
    symbol: body.symbol,
    side: body.side,
    volume: body.volume,
    stopLoss: body.stopLoss,
    takeProfit: body.takeProfit,
    openPrice: instrument.price,
    createdAt: new Date().toISOString(),
    status: 'OPEN',
  }
  orders = [...orders, order]
  res.status(201).json(order)
})

app.delete('/api/orders', (_req, res) => {
  orders = []
  res.status(204).end()
})

app.delete('/api/orders/:id', (req, res) => {
  const before = orders.length
  orders = orders.filter((o) => o.id !== req.params.id)
  if (orders.length === before) {
    return res.status(404).json({ code: 'NOT_FOUND', message: 'Zlecenie nie istnieje' })
  }
  res.status(204).end()
})

app.get('/api/feature-flags', (_req, res) => {
  res.json({
    flags: {
      NEW_ORDER_FORM: true,
      CRYPTO_TAB: true,
      MARGIN_CALL_BANNER: false,
    },
  })
})

app.get('/api/health', (_req, res) => res.json({ ok: true }))

const server = http.createServer(app)
const wss = new WebSocketServer({ server, path: '/ws/prices' })

wss.on('connection', (socket) => {
  let subscribed: Set<string> = new Set()
  socket.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString())
      if (msg.type === 'subscribe' && typeof msg.symbol === 'string') {
        subscribed.add(msg.symbol)
      }
    } catch {
      // ignore
    }
  })

  const interval = setInterval(() => {
    for (const symbol of subscribed) {
      const instr = instruments.find((i) => i.symbol === symbol)
      if (!instr) continue
      const jitter = (Math.random() - 0.5) * instr.price * 0.001
      const newPrice = Number((instr.price + jitter).toFixed(4))
      socket.send(JSON.stringify({ type: 'price', symbol, price: newPrice, ts: Date.now() }))
    }
  }, 1000)

  socket.on('close', () => {
    clearInterval(interval)
    subscribed.clear()
  })
})

const PORT = Number(process.env.PORT ?? 3001)
server.listen(PORT, () => {
  console.log(`[server] API + WS nasłuchuje na :${PORT}`)
})
