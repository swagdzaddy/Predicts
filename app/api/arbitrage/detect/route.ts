import { NextResponse } from 'next/server'
import { fetchAllMarkets } from '@/lib/services/market-fetcher'
import { findMarketMatches } from '@/lib/services/ai-matcher'
import { detectArbitrageOpportunities, storeArbitrageOpportunities } from '@/lib/services/arbitrage-detector'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/arbitrage/detect
 * Triggers arbitrage detection process
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const minProfitThreshold = body.minProfitThreshold || 2

    console.log('🔍 Starting arbitrage detection...')
    
    // Step 1: Fetch markets from both platforms
    console.log('📊 Fetching markets from Polymarket and Kalshi...')
    const { polymarket, kalshi } = await fetchAllMarkets()
    
    console.log(`Found ${polymarket.length} Polymarket markets and ${kalshi.length} Kalshi markets`)
    
    if (polymarket.length === 0 || kalshi.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No markets found on one or both platforms',
        stats: { polymarket: polymarket.length, kalshi: kalshi.length }
      }, { status: 400 })
    }

    // Step 2: Use AI to match markets
    console.log('🤖 Using AI to match markets...')
    const matches = await findMarketMatches(polymarket, kalshi)
    
    console.log(`Found ${matches.length} market matches`)
    
    if (matches.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No matching markets found',
        stats: {
          polymarketMarkets: polymarket.length,
          kalshiMarkets: kalshi.length,
          matches: 0,
          opportunities: 0
        }
      })
    }

    // Step 3: Detect arbitrage opportunities
    console.log('💰 Detecting arbitrage opportunities...')
    const opportunities = await detectArbitrageOpportunities(matches, minProfitThreshold)
    
    console.log(`Found ${opportunities.length} arbitrage opportunities`)

    // Step 4: Store in database
    if (opportunities.length > 0) {
      console.log('💾 Storing opportunities in database...')
      await storeArbitrageOpportunities(opportunities)
    }

    return NextResponse.json({
      success: true,
      message: `Detection complete! Found ${opportunities.length} arbitrage opportunities`,
      stats: {
        polymarketMarkets: polymarket.length,
        kalshiMarkets: kalshi.length,
        matches: matches.length,
        opportunities: opportunities.length
      },
      opportunities: opportunities.slice(0, 10) // Return first 10 for preview
    })

  } catch (error: any) {
    console.error('❌ Error in arbitrage detection:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

/**
 * GET /api/arbitrage/detect
 * Get detection status
 */
export async function GET() {
  return NextResponse.json({
    status: 'ready',
    message: 'Send a POST request to trigger arbitrage detection',
    endpoint: '/api/arbitrage/detect'
  })
}
