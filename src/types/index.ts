export type InstrumentCategory = "FOREX" | "STOCK" | "CRYPTO" | "COMMODITY";

export interface Instrument {
  symbol: string;
  name: string;
  category: InstrumentCategory;
  price: number;
  change24h: number;
  currency: string;
}

export type OrderSide = "BUY" | "SELL";

export interface OrderRequest {
  symbol: string;
  side: OrderSide;
  volume: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface Order extends OrderRequest {
  id: string;
  createdAt: string;
  openPrice: number;
  status: "OPEN" | "CLOSED";
}

export interface User {
  id: string;
  username: string;
  token: string;
}

export interface ApiError {
  code: string;
  message: string;
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };
