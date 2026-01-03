/**
 * AI-Powered Market Matching Service
 * Uses OpenAI to intelligently match similar markets across platforms
 */

import OpenAI from 'openai'
import { NormalizedMarket } from './market-fetcher'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface MarketMatch {
  polymarketMarket: NormalizedMarket
  kalshiMarket: NormalizedMarket
  confidenceScore: number
  reasoning: string
}

/**
 * Use AI to find matching markets between Polymarket and Kalshi
 */
export async function findMarketMatches(
  polymarketMarkets: NormalizedMarket[],
  kalshiMarkets: NormalizedMarket[]
): Promise<MarketMatch[]> {
  if (polymarketMarkets.length === 0 || kalshiMarkets.length === 0) {
    return []
  }

  // Limit to first 20 markets from each platform to avoid token limits
  const limitedPoly = polymarketMarkets.slice(0, 20)
  const limitedKalshi = kalshiMarkets.slice(0, 20)

  const prompt = `You are an expert at matching prediction market questions across different platforms.

Polymarket Markets:
${limitedPoly.map((m, i) => `${i + 1}. "${m.question}"${m.description ? ` - ${m.description}` : ''}`).join('\n')}

Kalshi Markets:
${limitedKalshi.map((m, i) => `${i + 1}. "${m.question}"${m.description ? ` - ${m.description}` : ''}`).join('\n')}

Find all markets that are asking about the SAME EVENT or outcome. Markets match if they're asking about the same real-world event, even if worded differently.

For each match, respond with a JSON array of objects with this format:
{
  "polymarketIndex": <index from 1>,
  "kalshiIndex": <index from 1>,
  "confidence": <0.0 to 1.0>,
  "reasoning": "<why these match>"
}

Only include matches with confidence >= 0.7. Return ONLY the JSON array, no other text.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a prediction market analyst. Respond only with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })

    const content = response.choices[0]?.message?.content?.trim()
    if (!content) return []

    // Parse JSON response
    const matches = JSON.parse(content)
    
    // Convert to MarketMatch objects
    return matches
      .filter((m: any) => m.confidence >= 0.7)
      .map((m: any) => ({
        polymarketMarket: limitedPoly[m.polymarketIndex - 1],
        kalshiMarket: limitedKalshi[m.kalshiIndex - 1],
        confidenceScore: m.confidence,
        reasoning: m.reasoning,
      }))
      .filter((m: any) => m.polymarketMarket && m.kalshiMarket)
      
  } catch (error) {
    console.error('Error matching markets with AI:', error)
    
    // Fallback to simple string matching
    return simpleStringMatch(limitedPoly, limitedKalshi)
  }
}

/**
 * Fallback: Simple string matching if AI fails
 */
function simpleStringMatch(
  polymarketMarkets: NormalizedMarket[],
  kalshiMarkets: NormalizedMarket[]
): MarketMatch[] {
  const matches: MarketMatch[] = []
  
  for (const poly of polymarketMarkets) {
    for (const kalshi of kalshiMarkets) {
      const polyWords = poly.question.toLowerCase().split(/\s+/)
      const kalshiWords = kalshi.question.toLowerCase().split(/\s+/)
      
      const commonWords = polyWords.filter(w => 
        w.length > 3 && kalshiWords.includes(w)
      )
      
      if (commonWords.length >= 3) {
        matches.push({
          polymarketMarket: poly,
          kalshiMarket: kalshi,
          confidenceScore: Math.min(commonWords.length / 5, 0.9),
          reasoning: `Simple match: ${commonWords.length} common words`,
        })
      }
    }
  }
  
  return matches.filter(m => m.confidenceScore >= 0.6)
}
