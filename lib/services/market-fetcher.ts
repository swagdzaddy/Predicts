/**
 * Market Fetching Service
 * Fetches and normalizes markets from Polymarket and Kalshi
 */

import { getPolymarketMarkets } from '@/lib/polymarket'
import { getKalshiMarkets } from '@/lib/kalshi'

export interface NormalizedMarket {
  platform: 'polymarket' | 'kalshi'
  id: string
  question: string
  description?: string
  yesPrice: number  // Normalized to 0-1
  noPrice: number   // Normalized to 0-1
  closeTime: string
  rawData: any
}

/**
 * Fetch and normalize markets from Polymarket
 */
export async function fetchPolymarketMarkets(): Promise<NormalizedMarket[]> {
  try {
    const markets = await getPolymarketMarkets()
    
    return markets.flatMap(market => {
      // Each Polymarket market can have multiple outcomes (YES/NO tokens)
      if (!market.tokens || market.tokens.length < 2) return []
      
      const yesToken = market.tokens.find(t => t.outcome.toLowerCase() === 'yes')
      const noToken = market.tokens.find(t => t.outcome.toLowerCase() === 'no')
      
      if (!yesToken || !noToken) return []
      
      return {
        platform: 'polymarket' as const,
        id: market.condition_id,
        question: market.question,
        description: market.description,
        yesPrice: yesToken.price,
        noPrice: noToken.price,
        closeTime: market.end_date_iso,
        rawData: {
          tokens: market.tokens,
          yesTokenId: yesToken.token_id,
          noTokenId: noToken.token_id,
        }
      }
    })
  } catch (error) {
    console.error('Error fetching Polymarket markets:', error)
    return []
  }
}

/**
 * Fetch and normalize markets from Kalshi
 */
export async function fetchKalshiMarkets(): Promise<NormalizedMarket[]> {
  try {
    const markets = await getKalshiMarkets()
    
    return markets.map(market => {
      // Kalshi prices are in cents (0-100), convert to 0-1
      const yesMid = (market.yes_bid + market.yes_ask) / 200
      const noMid = (market.no_bid + market.no_ask) / 200
      
      return {
        platform: 'kalshi' as const,
        id: market.ticker,
        question: market.title,
        description: market.subtitle,
        yesPrice: yesMid,
        noPrice: noMid,
        closeTime: market.close_time,
        rawData: market
      }
    })
  } catch (error) {
    console.error('Error fetching Kalshi markets:', error)
    return []
  }
}

/**
 * Fetch markets from both platforms
 */
export async function fetchAllMarkets(): Promise<{
  polymarket: NormalizedMarket[]
  kalshi: NormalizedMarket[]
}> {
  const [polymarket, kalshi] = await Promise.all([
    fetchPolymarketMarkets(),
    fetchKalshiMarkets(),
  ])
  
  return { polymarket, kalshi }
}
