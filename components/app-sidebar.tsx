"use client";

import * as React from "react";
import Link from "next/link";
import {
  TrendingUp,
  LayoutDashboard,
  Search,
  Bell,
  History,
  BarChart3,
  Settings,
  HelpCircle,
  Zap,
  CircleDollarSign,
  Target
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";

const navMain = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard
  },
  {
    title: "Live Opportunities",
    url: "/opportunities",
    icon: Zap
  },
  {
    title: "Market Scanner",
    url: "/scanner",
    icon: Search
  },
  {
    title: "My Positions",
    url: "/positions",
    icon: Target
  }
];

const navMarkets = [
  {
    title: "Polymarket",
    url: "/markets/polymarket",
    icon: CircleDollarSign
  },
  {
    title: "Kalshi",
    url: "/markets/kalshi",
    icon: CircleDollarSign
  }
];

const navAnalytics = [
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3
  },
  {
    title: "History",
    url: "/history",
    icon: History
  },
  {
    title: "Alerts",
    url: "/alerts",
    icon: Bell
  }
];

const navSecondary = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings
  },
  {
    title: "Help",
    url: "/help",
    icon: HelpCircle
  }
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="none" className="h-auto border-r" {...props}>
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link href="/">
                <TrendingUp className="size-5!" />
                <span className="text-base font-semibold">Predicts</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Arbitrage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Markets</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMarkets.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Insights</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navAnalytics.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="text-xs text-muted-foreground">
          Monitoring Polymarket & Kalshi
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}