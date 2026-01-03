"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUpIcon, RefreshCwIcon, AlertCircleIcon } from "lucide-react"

interface Opportunity {
  id: string
  market_name: string
  polymarket_price: number
  kalshi_price: number
  spread: number
  profit_percentage: number
  polymarket_token_id?: string
  kalshi_ticker: string
  detected_at: string
}

interface ArbitrageDetectorProps {
  onDetectionComplete?: (count: number) => void
}

export function ArbitrageDetector({ onDetectionComplete }: ArbitrageDetectorProps) {
  const [isDetecting, setIsDetecting] = React.useState(false)
  const [opportunities, setOpportunities] = React.useState<Opportunity[]>([])
  const [stats, setStats] = React.useState<any>(null)
  const [error, setError] = React.useState<string | null>(null)

  const runDetection = async () => {
    setIsDetecting(true)
    setError(null)

    try {
      const response = await fetch('/api/arbitrage/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ minProfitThreshold: 2 })
      })

      const data = await response.json()

      if (data.success) {
        setStats(data.stats)
        if (data.opportunities) {
          setOpportunities(data.opportunities)
        }
        onDetectionComplete?.(data.stats?.opportunities || 0)
        
        // Refresh full list
        fetchOpportunities()
      } else {
        setError(data.error || 'Detection failed')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to run detection')
    } finally {
      setIsDetecting(false)
    }
  }

  const fetchOpportunities = async () => {
    try {
      const response = await fetch('/api/arbitrage/opportunities?limit=50')
      const data = await response.json()
      
      if (data.success) {
        setOpportunities(data.opportunities)
      }
    } catch (err) {
      console.error('Failed to fetch opportunities:', err)
    }
  }

  React.useEffect(() => {
    fetchOpportunities()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Arbitrage Detection</h3>
          <p className="text-sm text-muted-foreground">
            AI-powered market matching and arbitrage finder
          </p>
        </div>
        <Button
          onClick={runDetection}
          disabled={isDetecting}
          size="sm"
        >
          {isDetecting ? (
            <>
              <RefreshCwIcon className="animate-spin" />
              Detecting...
            </>
          ) : (
            <>
              <TrendingUpIcon />
              Run Detection
            </>
          )}
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircleIcon className="size-4" />
              <span className="text-sm">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Detection Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Polymarket</p>
                <p className="text-lg font-bold">{stats.polymarketMarkets}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Kalshi</p>
                <p className="text-lg font-bold">{stats.kalshiMarkets}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Matches</p>
                <p className="text-lg font-bold">{stats.matches}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Opportunities</p>
                <p className="text-lg font-bold text-primary">{stats.opportunities}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Opportunities</CardTitle>
          <CardDescription>
            {opportunities.length} arbitrage opportunities detected
          </CardDescription>
        </CardHeader>
        <CardContent>
          {opportunities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-muted-foreground">
                No opportunities found yet.
              </p>
              <p className="text-xs text-muted-foreground">
                Click "Run Detection" to scan for arbitrage bets.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="flex items-start justify-between gap-4 rounded-none border p-3"
                >
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium line-clamp-2">
                      {opp.market_name}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>Polymarket: {(opp.polymarket_price * 100).toFixed(1)}%</span>
                      <span>•</span>
                      <span>Kalshi: {(opp.kalshi_price * 100).toFixed(1)}%</span>
                      <span>•</span>
                      <span>Spread: {(opp.spread * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="default" className="whitespace-nowrap">
                      {opp.profit_percentage.toFixed(2)}% profit
                    </Badge>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(opp.detected_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
