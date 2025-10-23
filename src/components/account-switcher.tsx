"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, Wallet, CreditCard, PiggyBank, TrendingUp, ChevronRight, ChevronDown, RefreshCw } from "lucide-react"
import { Account, Transaction, User } from "@/lib/types"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AccountForm } from "@/components/account-form"
import { useEffect } from "react"
import { useUser } from "@/context/UserContext"
import { AccountBalance } from "@/components/summary"
// Map account types to icons
const accountIcons: Record<string, React.ElementType> = {
  checking: Wallet,
  savings: PiggyBank,
  credit: CreditCard,
  investment: TrendingUp,
}

export function AccountSwitcher({
  accounts,
  transactions,
  user,
}: {
  accounts: Account[]
  transactions: Transaction[]
  user: User | null
}) {
  const { isMobile } = useSidebar()
  const [activeAccount, setActiveAccount] = React.useState<Account>(accounts[0])
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const { setSelectedAccount } = useUser()

  useEffect(() => {
    setSelectedAccount(activeAccount)
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 650)
  }, [activeAccount])

  useEffect(() => {
    if (accounts.length > 0) {
      setActiveAccount(accounts[0])
    }
  }, [accounts])

  const ActiveIcon = React.useMemo(() => {
    return accountIcons[activeAccount?.type || 'checking'] || Wallet
  }, [activeAccount])
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="group/dropdown-menu">
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <ActiveIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeAccount?.name}</span>
                <span className="truncate text-xs capitalize">
                  {activeAccount?.type} | {user?.currency} 
                </span>
              </div>
              <RefreshCw className={`size-4 ${isRefreshing ? 'block animate-spin' : 'hidden'} `} />
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/dropdown-menu:rotate-90" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg font-mono"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Accounts
            </DropdownMenuLabel>
            {accounts?.map((account, index) => {
              const Icon = accountIcons[account?.type || 'checking'] || Wallet
              return (
                <DropdownMenuItem
                  key={account?.id ?? index}
                  onClick={() => setActiveAccount(account)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <Icon className="size-3.5 shrink-0" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span>{account?.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {AccountBalance({ account, transactions })} {user?.currency}
                    </span>
                  </div>
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem className="gap-2 p-2 text-muted-foreground hover:text-primary" onSelect={(e) => e.preventDefault()}>
                  <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                    <Plus className="size-4 hover:text-primary" />
                  </div>
                  <div className="font-medium">Add account</div> 
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto font-mono p-10 bg-stone-50">
                <DialogHeader>
                  <DialogTitle>Add a new account</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <AccountForm onSuccess={() => setIsDialogOpen(false)} className="w-full border-none p-1" />
                </div>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}