'use client'
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { Button } from "@/components/ui/button"
import { LogOut, Plus } from "lucide-react"
import { useUser } from '@/context/UserContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TransactionsTable } from "@/components/transactions-table"
import { columns } from "@/components/transaction-columns"
import { Spinner } from "@/components/ui/spinner"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TransactionForm } from "@/components/transaction-form"
export default function Page() {
  const { logout, user, transactions, selectedAccount, fetchUserTransactions } = useUser();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() =>{
    if (!user) {
      router.push('/');
    } else {
      fetchUserTransactions(user.id);
    }
  }, [user])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 font-mono">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 text-muted-foreground" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            {/* <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex flex-row gap-2" onSelect={(e) => e.preventDefault()}>
                    <Plus className="size-4" />
                    <span>Add transaction</span>
                  </Button>
                </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto font-mono p-10 bg-stone-50">
                    <DialogHeader>
                      <DialogTitle>Add transaction to "<i>{selectedAccount?.name}</i>"</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <TransactionForm onSuccess={() => setIsDialogOpen(false)} className="w-full border-none p-1" />
                    </div>
                  </DialogContent>
            </Dialog>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/100 aspect-video rounded-xl animate-pulse" />
            <div className="bg-muted/75 aspect-video rounded-xl animate-pulse" />
            <div className="bg-muted/50 aspect-video rounded-xl animate-pulse" />
          </div>
          {transactions.length > 0 ? (
            <div className="bg-transparent min-h-[100vh] flex-1 rounded-xl md:min-h-min text-muted-foreground fade-in">
              <TransactionsTable columns={columns} data={transactions} />
            </div>
          ) : (
            <div className="bg-muted/100 min-h-[100vh] flex-1 rounded-xl md:min-h-min animate-pulse flex justify-center items-center">
            <Spinner className="size-10 animate-spin" />
            </div>
          )}
        </div>
        <Button className="absolute top-3.5 right-5 font-mono py-0 border-none shadow-none text-muted-foreground hover:bg-stone-50" onClick={logout} variant="outline">Logout <LogOut className="size-4"/></Button>
      </SidebarInset>
    </SidebarProvider>
  )
}
