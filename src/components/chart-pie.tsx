"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { NormalizedTransaction } from "./transaction-columns"

function generateChartConfig(transactions: NormalizedTransaction[]) {
    const chartConfig: ChartConfig = {}
    chartConfig.balance = {
        label: "Balance",
    }
    const categories = transactions?.map((transaction) => transaction?.category).filter((category) => category !== undefined)
    const uniqueCategories = [...new Set(categories.filter((category) => category !== ""))]
    const uniqueColors: string[] = []
    let newColor = { r: 25, g: 25, b: 25 }
    categories.forEach((category) => {
        const color = `rgb(${newColor.r}, ${newColor.g}, ${newColor.b})`
        uniqueColors.push(color)
        if (newColor.r > 220) {
            newColor.r = 50
            newColor.g = 50
            newColor.b = 50
        }
        newColor.r += 25
        newColor.g += 25
        newColor.b += 25
    })
    uniqueCategories.forEach((category) => {
        const color = uniqueColors.shift()
        chartConfig[category] = {
            label: category,
            color: color,
        }
    })
    return chartConfig
}

function generateChartData(transactions: NormalizedTransaction[]) {
    const chartConfig = generateChartConfig(transactions)
    const chartData: { category: string, amount: number, fill: string }[] = []
    transactions.forEach((transaction) => {
        if (transaction?.category && transaction.type !== "deposit" && transaction.type !== "payment") {
            if (chartData.find((item) => item.category === transaction?.category) === undefined) {
                chartData.push({ category: transaction?.category ?? "", amount: transaction?.amount ?? 0, fill: chartConfig[transaction?.category ?? ""]?.color ?? "" })
            } else {
                const item = chartData.find((item) => item.category === transaction?.category)
                if (item) {
                    item.amount += transaction?.amount ?? 0
                }
            }
        }
    })
    return chartData
}


export function Chart2({ transactions }: { transactions: NormalizedTransaction[] }) {
    const chartConfig = generateChartConfig(transactions)
    const chartData = generateChartData(transactions)
    return (
        <Card className="flex flex-col shadow-none h-full w-full fade-in overflow-hidden">
            <CardHeader className="items-center pb-0">
                <CardTitle>Spending by category</CardTitle>
                <CardDescription>
                    {chartData.length} {chartData.length === 1 ? "category" : "categories"} found 
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                {Object.keys(chartConfig).length > 1 && chartData.length > 0 ? (
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[240px] w-full -translate-y-1/5"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" />}
                            />
                            <Pie data={chartData} dataKey="amount" nameKey="category" fill="fill" opacity={0.9} />
                        </PieChart>
                    </ChartContainer>
                ) : (
                    <div className="flex justify-center items-center h-full w-full">
                        <p className="text-muted-foreground">No spending categories found.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
