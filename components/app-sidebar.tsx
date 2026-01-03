"use client"

import * as React from "react"
import {
  BarChart3Icon,
  HomeIcon,
  TrendingUpIcon,
  SettingsIcon,
  ActivityIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "Arbitrage Opportunities",
    url: "/arbitrage",
    icon: TrendingUpIcon,
  },
  {
    title: "Market Analysis",
    url: "/markets",
    icon: BarChart3Icon,
  },
  {
    title: "Activity",
    url: "/activity",
    icon: ActivityIcon,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex size-8 items-center justify-center rounded-none bg-primary text-primary-foreground">
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Predicts</span>
            <span className="text-xs text-muted-foreground">Arbitrage Finder</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/settings">
                <SettingsIcon />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
