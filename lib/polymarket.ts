/**
 * Polymarket API types and utilities
 */

export interface PolymarketMarket {
  condition_id: string
  question: string
  description: string
  end_date_iso: string
  tokens: PolymarketToken[]
}

export interface PolymarketToken {
  token_id: string
  outcome: string
  price: number
}

export interface PolymarketOrderBook {
  market: string
  asset_id: string
  bids: PolymarketOrder[]
  asks: PolymarketOrder[]
}

export interface PolymarketOrder {
  price: string
  size: string
}

/**
 * Fetch markets from Polymarket
 */
export async function getPolymarketMarkets(): Promise<PolymarketMarket[]> {
  const response = await fetch('https://clob.polymarket.com/simplified-markets')
  const data = await response.json()
  return data.data || []
}

/**
 * Get order book for a specific token
 */
export async function getPolymarketOrderBook(tokenId: string): Promise<PolymarketOrderBook> {
  const response = await fetch(`https://clob.polymarket.com/book?token_id=${tokenId}`)
  return await response.json()
}

/**
 * Get current price for a token
 */
export async function getPolymarketPrice(tokenId: string, side: 'BUY' | 'SELL'): Promise<number> {
  const response = await fetch(`https://clob.polymarket.com/price?token_id=${tokenId}&side=${side}`)
  const data = await response.json()
  return parseFloat(data.price)
}
