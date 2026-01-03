"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { BellIcon, UserIcon } from "lucide-react"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-sm font-medium">Arbitrage Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm">
            <BellIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <UserIcon className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
