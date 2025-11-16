'use client'

import { Area, Bar, BarChart, CartesianGrid, Line, AreaChart, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { NormalizedTransaction } from "./transaction-columns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Account } from "@/lib/types"
import { TrendingUp } from "lucide-react"
const chartConfig = {
  amounts: {
    label: "Balance",
    color: "#2563eb",
  },
} satisfies ChartConfig

function lastXMonths(transactions: NormalizedTransaction[], accounts: Account[], months: number) {
    const lastXMonths = Array.from({ length: months }, (_, i) => i ).map((month: number) => {
        const date = new Date(new Date().getFullYear(), new Date().getMonth() - month, 1)
        const baseBalance = accounts?.reduce((acc, account) => acc + (account?.balance ?? 0), 0) ?? 0
        return {
            month: date.toLocaleDateString('en-US', { month: 'long' }),
            balance: transactions.filter((transaction) => 
                new Date(transaction.date) <= new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000)
            ).reduce((acc, transaction) => transaction?.type === 'deposit' || transaction?.type === 'payment' || transaction?.type === 'buy' ? acc + transaction?.amount : acc - transaction?.amount, 0) ,
        }
    }).reverse()
    return lastXMonths
}

export function Chart1({ transactions, accounts }: { transactions: NormalizedTransaction[], accounts: Account[]}) {
    const chartData = lastXMonths(transactions, accounts, 6)
    return (
        <Card className="shadow-none h-full w-full fade-in overflow-hidden">
          <CardHeader>
            <CardTitle>Balance over time</CardTitle>
            <CardDescription>{chartData[0].month} {new Date().getFullYear()} - {chartData[chartData.length - 1].month} {new Date().getFullYear()}</CardDescription>
          </CardHeader> 
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[170px] w-full">
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={6}
                  fontSize={12}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <defs>
                  <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-foreground)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-foreground)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="balance"
                  type="natural"
                  stroke="var(--color-foreground)"
                  fill="url(#fillBalance)"
                  fillOpacity={0.3}
                  strokeWidth={1}
                  dot={false}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )
    }