/**
 * Arbitrage detection utilities
 */

export interface ArbitrageOpportunity {
  id: string
  market_name: string
  polymarket_price: number
  kalshi_price: number
  spread: number
  profit_percentage: number
  polymarket_token_id?: string
  kalshi_ticker?: string
  detected_at: string
}

/**
 * Calculate arbitrage opportunity between two prices
 * @param price1 Price from market 1 (0-1 or 0-100)
 * @param price2 Price from market 2 (0-1 or 0-100)
 * @param normalize Whether to normalize prices to 0-1 range
 */
export function calculateArbitrage(
  price1: number,
  price2: number,
  normalize: boolean = true
): { spread: number; profitPercentage: number } {
  // Normalize to 0-1 if needed
  const p1 = normalize && price1 > 1 ? price1 / 100 : price1
  const p2 = normalize && price2 > 1 ? price2 / 100 : price2

  const spread = Math.abs(p1 - p2)
  
  // Calculate potential profit percentage
  // If you buy low and sell high, profit is the spread
  const profitPercentage = (spread / Math.min(p1, p2)) * 100

  return { spread, profitPercentage }
}

/**
 * Check if arbitrage opportunity is significant enough
 * @param profitPercentage Potential profit percentage
 * @param minProfitThreshold Minimum profit threshold (default 2%)
 */
export function isSignificantArbitrage(
  profitPercentage: number,
  minProfitThreshold: number = 2
): boolean {
  return profitPercentage >= minProfitThreshold
}

/**
 * Match markets between Polymarket and Kalshi by question similarity
 * Simple matching for now - can be enhanced with fuzzy matching
 */
export function matchMarkets(
  polymarketQuestion: string,
  kalshiQuestion: string
): boolean {
  const normalize = (str: string) =>
    str.toLowerCase().replace(/[^\w\s]/g, '').trim()
  
  const poly = normalize(polymarketQuestion)
  const kalshi = normalize(kalshiQuestion)

  // Simple substring matching - can be improved
  return poly.includes(kalshi) || kalshi.includes(poly)
}
