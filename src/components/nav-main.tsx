"use client"

import { ChevronRight, DollarSign, Plus, Pencil, Upload, UserIcon, Trash, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"

import { useState } from "react"
import { TransactionForm } from "./transaction-form"
import { useUser } from "@/context/UserContext"
import { Button } from "./ui/button"
export function NavMain({
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { selectedAccount, deleteAccount, user } = useUser()
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Account actions</SidebarGroupLabel>
      <SidebarMenu>
          <Collapsible
            asChild
            defaultOpen={true}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <DollarSign className="h-4 w-4" />
                  <span>Transactions</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <SidebarMenuSubButton asChild className="flex flex-row" onSelect={(e) => e.preventDefault()}>
                          <a href="#">
                            <Plus className="h-4 w-4" />
                            <span>Add new</span>
                          </a>
                        </SidebarMenuSubButton>
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
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                      <DialogTrigger asChild>
                        <SidebarMenuSubButton asChild className="flex flex-row disabled" onSelect={(e) => e.preventDefault()}>
                          <a href="#">
                            <Upload className="h-4 w-4" />
                            <span>Import</span>
                          </a>
                        </SidebarMenuSubButton>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto font-mono p-10 bg-stone-50">
                        <DialogHeader>
                          <DialogTitle>Import transactions to "<i>{selectedAccount?.name}</i>"</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <TransactionForm onSuccess={() => setIsImportDialogOpen(false)} className="w-full border-none p-1" />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
          <Collapsible
            asChild
            defaultOpen={true}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <UserIcon className="h-4 w-4" />
                  <span>Account</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                      <DialogTrigger asChild>
                        <SidebarMenuSubButton asChild className="flex flex-row" onSelect={(e) => e.preventDefault()}>
                          <a href="#">
                            <Trash className="h-4 w-4" />
                            <span>Delete</span>
                          </a>
                        </SidebarMenuSubButton>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto font-mono p-10 bg-stone-50">
                        <DialogHeader>
                          <DialogTitle>Are you sure you want to delete account "<i>{selectedAccount?.name}</i>" ?</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>WARNING: This action will delete all transactions associated with this account.</DialogDescription>
                        <div className="mt-2">
                          {selectedAccount?.id && user?.id && (
                            <Button variant="destructive" onClick={() => {deleteAccount(selectedAccount?.id, user?.id); setIsDeleteDialogOpen(false);}}>Delete</Button>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  )
}
