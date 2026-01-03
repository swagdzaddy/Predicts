"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUpIcon, DollarSignIcon, ActivityIcon } from "lucide-react"
import { ArbitrageDetector } from "@/components/arbitrage-detector"

export default function DashboardPage() {
  const [activeCount, setActiveCount] = React.useState(0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">
          Monitor arbitrage opportunities across Polymarket and Kalshi
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Opportunities
            </CardTitle>
            <TrendingUpIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-xs text-muted-foreground">
              {activeCount === 0 ? 'No opportunities detected' : 'Click to view details'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              AI Market Matcher
            </CardTitle>
            <DollarSignIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GPT-4</div>
            <p className="text-xs text-muted-foreground">
              Intelligent market matching
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Detection Status
            </CardTitle>
            <ActivityIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ready</div>
            <p className="text-xs text-muted-foreground">
              Click "Run Detection" below
            </p>
          </CardContent>
        </Card>
      </div>

      <ArbitrageDetector onDetectionComplete={setActiveCount} />
    </div>
  )
}