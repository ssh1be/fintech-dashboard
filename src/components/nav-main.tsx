"use client"

import { ChevronRight, DollarSign, Plus, Upload, Trash, Landmark, FilePlus2, Pencil, Link, Merge } from "lucide-react"

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
import { Button } from "./ui/button"
import { AccountForm } from "./account-form"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { Account, User } from "@/lib/types"
import { useUser } from "@/context/UserContext"
import { TestPlaid } from "./test-plaid"
import { toast } from "sonner"

export function NavMain({
  selectedaccount,
  user,
}: {
  selectedaccount: Account | null
  user: User | null
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false)
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false)
  const { deleteAccount } = useUser()
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
                          <FilePlus2 className="h-4 w-4" />
                          <span>Add new</span>
                        </a>
                      </SidebarMenuSubButton>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto font-mono p-10 bg-stone-50">
                      <DialogHeader>
                        <DialogTitle>Add transaction to "<i>{selectedaccount?.name}</i>"</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <TransactionForm onSuccess={() => setIsDialogOpen(false)} className="w-full border-none p-1" />
                      </div>
                    </DialogContent>
                  </Dialog>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                    <Tooltip delayDuration={500}>
                      <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                          <SidebarMenuSubButton asChild className="flex flex-row disabled" onSelect={(e) => e.preventDefault()}>
                            <a href="#">
                              <Upload className="h-4 w-4" />
                              <span>Import</span>
                            </a>
                          </SidebarMenuSubButton>
                        </DialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent className="font-mono" side="right">
                        <p>CSV import coming soon</p>
                      </TooltipContent>
                    </Tooltip>
                  </Dialog>
                </SidebarMenuSubItem>
                
                <SidebarMenuSubItem>
                  <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
                    <DialogTrigger asChild>
                      <SidebarMenuSubButton asChild className="flex flex-row" onSelect={(e) => e.preventDefault()}>
                        <a href="#">
                          <Merge className="h-4 w-4" />
                          <span>Link</span>
                        </a>
                      </SidebarMenuSubButton>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto font-mono p-10 bg-stone-50">
                      <DialogHeader>
                        <DialogTitle>Link to an existing bank account?</DialogTitle>
                      </DialogHeader>
                      <DialogDescription>
                        This action will load test transactions from Plaid Sandbox and add them to your account.
                      </DialogDescription>
                      <div className="mt-4">
                        <TestPlaid onSuccess={() => {
                          setIsTestDialogOpen(false);
                          toast.success("Account linked successfully!");
                        }} />
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
                <Landmark className="h-4 w-4" />
                <span>Account</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <Dialog open={isAddAccountDialogOpen} onOpenChange={setIsAddAccountDialogOpen}>
                    <DialogTrigger asChild>
                      <SidebarMenuSubButton asChild className="flex flex-row" onSelect={(e) => e.preventDefault()}>
                        <a href="#">
                          <Plus className="h-4 w-4" />
                          <span>Add new</span>
                        </a>
                      </SidebarMenuSubButton>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto font-mono p-10 bg-stone-50">
                      <DialogHeader>
                        <DialogTitle>Add a new account</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <AccountForm onSuccess={() => setIsAddAccountDialogOpen(false)} className="w-full border-none p-1" />
                      </div>
                    </DialogContent>
                  </Dialog>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <Dialog>
                    <DialogTrigger asChild>
                      <SidebarMenuSubButton asChild className="flex flex-row disabled" onSelect={(e) => e.preventDefault()}>
                        <a href="#">
                          <Pencil className="h-4 w-4" />
                          <span>Edit</span>
                        </a>
                      </SidebarMenuSubButton>
                    </DialogTrigger>
                  </Dialog>
                </SidebarMenuSubItem>
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
                        <DialogTitle>Are you sure you want to delete account "<i>{selectedaccount?.name}</i>" ?</DialogTitle>
                      </DialogHeader>
                      <DialogDescription>WARNING: This action will delete all transactions associated with this account.</DialogDescription>
                      <div className="mt-2">
                        {selectedaccount?.id && user?.id && (
                          <Button variant="destructive" onClick={() => { 
                            deleteAccount(selectedaccount?.id, user?.id); 
                            setIsDeleteDialogOpen(false);}}>
                            Delete
                          </Button>
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