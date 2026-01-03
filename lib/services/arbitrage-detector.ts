/**
 * Arbitrage Detection Service
 * Identifies profitable arbitrage opportunities from matched markets
 */

import { MarketMatch } from './ai-matcher'
import { calculateArbitrage, isSignificantArbitrage } from '@/lib/arbitrage'
import { supabase } from '@/lib/supabase'

export interface DetectedArbitrage {
  id: string
  marketName: string
  polymarketPrice: number
  kalshiPrice: number
  spread: number
  profitPercentage: number
  polymarketTokenId?: string
  kalshiTicker: string
  detectedAt: string
  confidenceScore: number
  reasoning: string
}

/**
 * Detect arbitrage opportunities from market matches
 */
export async function detectArbitrageOpportunities(
  matches: MarketMatch[],
  minProfitThreshold: number = 2
): Promise<DetectedArbitrage[]> {
  const opportunities: DetectedArbitrage[] = []

  for (const match of matches) {
    // Calculate arbitrage for both directions (buy Poly/sell Kalshi and vice versa)
    
    // Direction 1: Buy YES on Polymarket, Sell YES on Kalshi
    const arb1 = calculateArbitrage(
      match.polymarketMarket.yesPrice,
      match.kalshiMarket.yesPrice,
      false // already normalized
    )

    // Direction 2: Buy YES on Kalshi, Sell YES on Polymarket  
    const arb2 = calculateArbitrage(
      match.kalshiMarket.yesPrice,
      match.polymarketMarket.yesPrice,
      false
    )

    // Use the direction with higher profit
    const bestArb = arb1.profitPercentage > arb2.profitPercentage ? arb1 : arb2
    
    if (isSignificantArbitrage(bestArb.profitPercentage, minProfitThreshold)) {
      const opportunity: DetectedArbitrage = {
        id: `${match.polymarketMarket.id}-${match.kalshiMarket.id}`,
        marketName: match.polymarketMarket.question,
        polymarketPrice: match.polymarketMarket.yesPrice,
        kalshiPrice: match.kalshiMarket.yesPrice,
        spread: bestArb.spread,
        profitPercentage: bestArb.profitPercentage,
        polymarketTokenId: match.polymarketMarket.rawData?.yesTokenId,
        kalshiTicker: match.kalshiMarket.id,
        detectedAt: new Date().toISOString(),
        confidenceScore: match.confidenceScore,
        reasoning: match.reasoning,
      }
      
      opportunities.push(opportunity)
    }
  }

  return opportunities
}

/**
 * Store arbitrage opportunities in Supabase
 */
export async function storeArbitrageOpportunities(
  opportunities: DetectedArbitrage[]
): Promise<void> {
  if (opportunities.length === 0) return

  const records = opportunities.map(opp => ({
    market_name: opp.marketName,
    polymarket_price: opp.polymarketPrice,
    kalshi_price: opp.kalshiPrice,
    spread: opp.spread,
    profit_percentage: opp.profitPercentage,
    polymarket_token_id: opp.polymarketTokenId,
    kalshi_ticker: opp.kalshiTicker,
    detected_at: opp.detectedAt,
  }))

  const { error } = await supabase
    .from('arbitrage_opportunities')
    .insert(records)

  if (error) {
    console.error('Error storing arbitrage opportunities:', error)
    throw error
  }

  console.log(`✅ Stored ${opportunities.length} arbitrage opportunities`)
}

/**
 * Fetch recent arbitrage opportunities from database
 */
export async function getRecentOpportunities(limit: number = 50) {
  const { data, error } = await supabase
    .from('arbitrage_opportunities')
    .select('*')
    .order('detected_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching opportunities:', error)
    return []
  }

  return data
}
