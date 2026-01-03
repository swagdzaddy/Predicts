import { NextResponse } from 'next/server'
import { getRecentOpportunities } from '@/lib/services/arbitrage-detector'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/arbitrage/opportunities
 * Fetch recent arbitrage opportunities
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')

    const opportunities = await getRecentOpportunities(limit)

    return NextResponse.json({
      success: true,
      count: opportunities.length,
      opportunities
    })

  } catch (error: any) {
    console.error('Error fetching opportunities:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 })
  }
}
