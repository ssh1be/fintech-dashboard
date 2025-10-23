"use client"
import { Card, CardTitle, CardHeader, CardContent, CardDescription, CardAction, CardFooter } from "./ui/card";
import { NormalizedTransaction } from "./transaction-columns";
import { Account, User } from "@/lib/types";
import { Button } from "./ui/button";
import { EyeClosed, Eye, TrendingUp, TrendingDown, TrendingUpDown, Upload } from "lucide-react";
import { useState } from "react";
import { AnimatedCounter } from 'react-animated-counter';
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { DialogTrigger } from "./ui/dialog";

export function AccountBalance({ account, transactions }: { account: Account, transactions: NormalizedTransaction[] }) {
    const accountTransactions = transactions.filter((transaction) => transaction?.accountId === account?.id)
    const totalBalance = account?.balance + (accountTransactions?.reduce((
        acc,
        transaction
    ) => transaction?.type === 'deposit' || transaction?.type === 'payment' || transaction?.type === 'buy' ? acc + transaction?.amount : acc - transaction?.amount, 0) ?? 0)
    return totalBalance;
}

function lastXdBalancePercentage(transactions: NormalizedTransaction[], totalBalance: number, days: number) {
    const lastXd = transactions.filter((transaction) => new Date(transaction.date) > new Date(Date.now() - days * 24 * 60 * 60 * 1000))
    const lastXdBalance = lastXd.reduce((acc, transaction) =>
        transaction?.type === 'deposit' ||
            transaction?.type === 'payment' ||
            transaction?.type === 'buy'
            ? acc + transaction?.amount
            : acc - transaction?.amount, 0)
    const lastXdBalancePercentage = lastXdBalance / (totalBalance - lastXdBalance) * 100
    return Number(lastXdBalancePercentage)
}

export function Summary(props: { transactions: NormalizedTransaction[], accounts: Account[], user: User | null }) {
    const { transactions, accounts, user } = props;
    const [isPrivate, setIsPrivate] = useState(true)
    const portfolioBalance = accounts?.map((account) => AccountBalance({ account, transactions })).reduce((acc, balance) => acc + balance, 0)
    const currency = user?.currency === 'USD' ? '$' : user?.currency === 'EUR' ? '€' : user?.currency === 'GBP' ? '£' : '¥'

    const lastDayBalancePercentageValue = lastXdBalancePercentage(transactions, portfolioBalance, 1)
    const last7dBalancePercentageValue = lastXdBalancePercentage(transactions, portfolioBalance, 7)
    const last30dBalancePercentageValue = lastXdBalancePercentage(transactions, portfolioBalance, 30)
    return (
        <Card className="h-full shadow-none overflow-hidden">
            <CardHeader>
                <CardTitle className="">Portfolio summary</CardTitle>
                <CardDescription>Total across all accounts</CardDescription>
                <CardAction>
                    <Tooltip delayDuration={500}>
                        <TooltipTrigger asChild>
                            <Button variant="outline" onClick={() => setIsPrivate(!isPrivate)} className="shadow-none text-muted-foreground">
                                {isPrivate ? <EyeClosed className="size-4" /> : <Eye className="size-4" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="font-mono" side="right">
                            {isPrivate ? 'Show portfolio balance' : 'Toggle privacy mode'}
                        </TooltipContent>
                    </Tooltip>
                </CardAction>
            </CardHeader>
            <CardContent className={`text-7xl font-normal flex items-center justify-center mt-2`}>
                <div className="flex">
                    {isPrivate ? '' : currency}
                    {isPrivate ? '********' : <AnimatedCounter value={portfolioBalance} color="black" fontSize="72px" includeCommas={true} />}
                </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center justify-between text-sm text-muted-foreground mt-2">
                <span className="flex flex-col">
                    <span>Last 24h:</span>
                    {isPrivate ? <span className="font-bold text-sm mt-1">********</span> : (
                        <div className={`flex flex-row items-center justify-between mt-1 ${lastDayBalancePercentageValue > 0 ? 'text-green-500' : lastDayBalancePercentageValue < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                            <span className="font-bold text-sm">{lastDayBalancePercentageValue.toFixed(2)}%</span>
                            {lastDayBalancePercentageValue > 0 ? <TrendingUp className="ml-1 size-6" /> : lastDayBalancePercentageValue < 0 ? <TrendingDown className="ml-1 size-6" /> : <TrendingUpDown className="ml-1 size-6" />}
                        </div>
                    )}
                </span>
                <span className="flex flex-col">
                    <span>Last 7d:</span>
                    {isPrivate ? <span className="font-bold text-sm mt-1">********</span> : (
                        <div className={`flex flex-row items-center justify-between mt-1 ${last7dBalancePercentageValue > 0 ? 'text-green-500' : last7dBalancePercentageValue < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                            <span className="font-bold text-sm">{last7dBalancePercentageValue.toFixed(2)}%</span>
                            {last7dBalancePercentageValue > 0 ? <TrendingUp className="ml-1 size-6" /> : last7dBalancePercentageValue < 0 ? <TrendingDown className="ml-1 size-6" /> : <TrendingUpDown className="ml-1 size-6" />}
                        </div>
                    )}
                </span>
                <span className="flex flex-col">
                    <span>Last 30d:</span>
                    {isPrivate ? <span className="font-bold text-sm mt-1">********</span> : (
                        <div className={`flex flex-row items-center justify-between mt-1 ${last30dBalancePercentageValue > 0 ? 'text-green-500' : last30dBalancePercentageValue < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                            <span className="font-bold text-sm">{last30dBalancePercentageValue.toFixed(2)}%</span>
                            {last30dBalancePercentageValue > 0 ? <TrendingUp className="ml-1 size-6" /> : last30dBalancePercentageValue < 0 ? <TrendingDown className="ml-1 size-6" /> : <TrendingUpDown className="ml-1 size-6" />}
                        </div>
                    )}
                </span>
            </CardFooter>
        </Card>
    )
}