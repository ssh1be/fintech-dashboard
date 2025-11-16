"use client"
import { Card, CardTitle, CardHeader, CardContent, CardDescription, CardAction, CardFooter } from "./ui/card";
import { NormalizedTransaction } from "./transaction-columns";
import { Account, User } from "@/lib/types";
import { Button } from "./ui/button";
import { EyeClosed, Eye, TrendingUp, TrendingDown, TrendingUpDown, Upload, Globe, CreditCard, Wallet, PiggyBank, ChevronsUpDown, ChevronDown } from "lucide-react";
import { useState } from "react";
import { AnimatedCounter } from 'react-animated-counter';
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { DialogTrigger } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

export function AccountBalance({ account, transactions }: { account: Account, transactions: NormalizedTransaction[] }) {
    const accountTransactions = transactions.filter((transaction) => transaction?.accountId === account?.id)
    const totalBalance = (accountTransactions?.reduce((
        acc,
        transaction
    ) => (transaction?.type === 'deposit' || transaction?.type === 'payment' || transaction?.type === 'buy') ? acc + transaction?.amount : acc - transaction?.amount, 0) ?? 0)
    return totalBalance;
}

function lastXdBalancePercentage(transactions: NormalizedTransaction[], totalBalance: number, days: number) {
    const lastXd = transactions.filter((transaction) => new Date(transaction.date) > new Date(Date.now() - days * 24 * 60 * 60 * 1000))
    const lastXdBalance = lastXd.reduce((acc, transaction) =>
        (transaction?.type === 'deposit' ||
            transaction?.type === 'payment' ||
            transaction?.type === 'buy') && transaction?.category !== 'Initial'
            ? acc + transaction?.amount
            : transaction?.category === 'Initial' ? acc : acc - transaction?.amount, 0)
    const lastXdBalancePercentage = lastXdBalance / (totalBalance - lastXdBalance) * 100
    return Number(lastXdBalancePercentage)
}

export function Summary(props: { transactions: NormalizedTransaction[], accounts: Account[], user: User | null }) {
    const { transactions, accounts, user } = props;
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
    const [isPrivate, setIsPrivate] = useState(true)

    const filteredTransactions = selectedAccount ? transactions.filter((transaction) => transaction?.accountId === selectedAccount?.id) : transactions
    const portfolioBalance = accounts?.map((account) => AccountBalance({ account, transactions: filteredTransactions })).reduce((acc, balance) => acc + balance, 0)
    const displayBalance = selectedAccount ? AccountBalance({ account: selectedAccount, transactions: filteredTransactions }) : portfolioBalance

    const lastDayBalancePercentageValue = lastXdBalancePercentage(filteredTransactions, portfolioBalance, 1)
    const last7dBalancePercentageValue = lastXdBalancePercentage(filteredTransactions, portfolioBalance, 7)
    const last30dBalancePercentageValue = lastXdBalancePercentage(filteredTransactions, portfolioBalance, 30)

    const currency = user?.currency === 'JPY' ? '¥' : user?.currency === 'EUR' ? '€' : user?.currency === 'GBP' ? '£' : '$'
    const accountIcons: Record<string, React.ReactNode> = {
        checking: <Wallet className="size-4" />,
        savings: <PiggyBank className="size-4" />,
        credit: <CreditCard className="size-4" />,
        investment: <TrendingUp className="size-4" />,
    }

    return (
        <Card className="h-full shadow-none overflow-hidden">
            <CardHeader>
                <CardTitle className="">Portfolio summary</CardTitle>
                <CardDescription>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <span className="flex flex-row items-center gap-2 cursor-pointer hover:text-primary">
                                {selectedAccount?.name || 'Balance across all accounts'}
                                <ChevronDown className="size-4" />
                            </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="font-mono text-muted-foreground shadow-none">
                            {accounts?.map((account) => (
                                <DropdownMenuItem key={account?.id} onClick={() => setSelectedAccount(account)}>
                                   {accountIcons[account?.type || 'checking']} {account?.name} 
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2" onClick={() => setSelectedAccount(null)}>
                                <Globe className="size-4" /> All accounts
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardDescription>
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
                    {isPrivate ? '********' : <AnimatedCounter value={displayBalance} color="black" fontSize="72px" includeCommas={true} />}
                </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center justify-between text-sm text-muted-foreground mt-2">
                <span className="flex flex-col">
                    <span>Last 24h:</span>
                    {isPrivate ? <span className="font-bold mt-1">********</span> : (
                        <div className={`flex flex-row items-center justify-between mt-1 ${lastDayBalancePercentageValue > 0 ? 'text-green-500' : lastDayBalancePercentageValue < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                            <span className="font-bold text-sm">{lastDayBalancePercentageValue.toFixed(2)}%</span>
                            {lastDayBalancePercentageValue > 0 ? <TrendingUp className="ml-1 size-6" /> : lastDayBalancePercentageValue < 0 ? <TrendingDown className="ml-1 size-6" /> : <TrendingUpDown className="ml-1 size-6" />}
                        </div>
                    )}
                </span>
                <span className="flex flex-col">
                    <span>Last 7d:</span>
                    {isPrivate ? <span className="font-bold mt-1">********</span> : (
                        <div className={`flex flex-row items-center justify-between mt-1 ${last7dBalancePercentageValue > 0 ? 'text-green-500' : last7dBalancePercentageValue < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                            <span className="font-bold text-sm">{last7dBalancePercentageValue.toFixed(2)}%</span>
                            {last7dBalancePercentageValue > 0 ? <TrendingUp className="ml-1 size-6" /> : last7dBalancePercentageValue < 0 ? <TrendingDown className="ml-1 size-6" /> : <TrendingUpDown className="ml-1 size-6" />}
                        </div>
                    )}
                </span>
                <span className="flex flex-col">
                    <span>Last 30d:</span>
                    {isPrivate ? <span className="font-bold mt-1">********</span> : (
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