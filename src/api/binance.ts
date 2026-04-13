const BASE_URL = 'https://api.binance.com/api/v3'
const TIMEOUT_MS = 10_000

export const SYMBOL_MAP: Record<string, string> = {
  bitcoin: 'BTCUSDT',
  ethereum: 'ETHUSDT',
  solana: 'SOLUSDT'
}

export interface PriceData {
  [coinId: string]: {
    usd: number
    usd_24h_change: number
    last_updated_at: number // ms timestamp
  }
}

export interface MarketChartData {
  prices: [number, number][] // [timestamp_ms, price]
}

interface BinanceTicker {
  symbol: string
  lastPrice: string
  priceChangePercent: string
  closeTime: number
}

interface BinanceKline {
  // Binance returns arrays: [openTime, open, high, low, close, ...]
  0: number // open time
  4: string // close price
}

// Helpers
function buildUrl(
  path: string,
  params: Record<string, string | number>
): string {
  const url = new URL(`${BASE_URL}${path}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
  return url.toString()
}

async function apiFetch<T>(
  path: string,
  params: Record<string, string | number> = {}
): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(buildUrl(path, params), {
      signal: controller.signal
    })

    if (!res.ok) {
      throw Object.assign(new Error(`Binance HTTP ${res.status}`), {
        status: res.status
      })
    }

    return res.json() as Promise<T>
  } finally {
    clearTimeout(timer)
  }
}

function toSymbol(coinId: string): string {
  const symbol = SYMBOL_MAP[coinId.toLowerCase()]
  if (!symbol)
    throw new Error(
      `No Binance symbol mapped for "${coinId}". Add it to SYMBOL_MAP.`
    )
  return symbol
}

// Public API
/**
 * Replaces CoinGecko's /simple/price
 * Uses Binance's 24hr ticker — one request per symbol (batching not supported on this endpoint).
 */
export async function fetchPrices(ids: string[]): Promise<PriceData> {
  const tickers = await Promise.all(
    ids.map((id) =>
      apiFetch<BinanceTicker>('/ticker/24hr', { symbol: toSymbol(id) }).then(
        (t) => ({ id, t })
      )
    )
  )

  return Object.fromEntries(
    tickers.map(({ id, t }) => [
      id,
      {
        usd: parseFloat(t.lastPrice),
        usd_24h_change: parseFloat(t.priceChangePercent),
        last_updated_at: Math.floor(t.closeTime / 1000) // to seconds, matching CoinGecko shape
      }
    ])
  )
}

/**
 * Replaces CoinGecko's /coins/{id}/market_chart
 * Uses Binance klines (candlesticks). Interval is auto-selected from `days`.
 */
export async function fetchMarketChart(
  id: string,
  days = 1
): Promise<MarketChartData> {
  // Pick a sensible interval based on the requested range
  const interval =
    days <= 1 ? '1m' : days <= 7 ? '15m' : days <= 30 ? '1h' : '4h'

  // Binance max 1000 klines per request; limit to a sensible number
  const limit = Math.min(days * (days <= 1 ? 60 : days <= 7 ? 96 : 24), 1000)

  const klines = await apiFetch<BinanceKline[]>('/klines', {
    symbol: toSymbol(id),
    interval,
    limit
  })

  return {
    // Each kline: [openTime, open, high, low, close, ...]
    prices: klines.map((k) => [k[0], parseFloat(k[4])])
  }
}
