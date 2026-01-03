/**
 * Kalshi API types and utilities
 */

export interface KalshiMarket {
  ticker: string
  event_ticker: string
  market_type: string
  title: string
  subtitle: string
  yes_bid: number
  yes_ask: number
  no_bid: number
  no_ask: number
  close_time: string
  expiration_time: string
}

export interface KalshiEvent {
  event_ticker: string
  title: string
  category: string
  markets: KalshiMarket[]
}

/**
 * Fetch markets from Kalshi
 */
export async function getKalshiMarkets(): Promise<KalshiMarket[]> {
  try {
    const response = await fetch('https://api.elections.kalshi.com/trade-api/v2/markets')
    const data = await response.json()
    return data.markets || []
  } catch (error) {
    console.error('Error fetching Kalshi markets:', error)
    return []
  }
}

/**
 * Get specific market details
 */
export async function getKalshiMarket(ticker: string): Promise<KalshiMarket | null> {
  try {
    const response = await fetch(`https://api.elections.kalshi.com/trade-api/v2/markets/${ticker}`)
    const data = await response.json()
    return data.market || null
  } catch (error) {
    console.error(`Error fetching Kalshi market ${ticker}:`, error)
    return null
  }
}

/**
 * Calculate mid price from bid/ask
 */
export function getKalshiMidPrice(market: KalshiMarket, side: 'YES' | 'NO'): number {
  if (side === 'YES') {
    return (market.yes_bid + market.yes_ask) / 2
  }
  return (market.no_bid + market.no_ask) / 2
}
