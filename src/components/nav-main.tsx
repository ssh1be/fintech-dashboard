"use client"

import { ChevronRight, Plus, type LucideIcon } from "lucide-react"

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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"

import { useState } from "react"
import { TransactionForm } from "./transaction-form"
import { useUser } from "@/context/UserContext"
export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
      icon?: LucideIcon
    }[]
  }[]
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { selectedAccount } = useUser()
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Account actions</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <SidebarMenuSubButton asChild className="flex flex-row" onSelect={(e) => e.preventDefault()}>
                              <a href={subItem.url}>
                                {subItem.icon && <subItem.icon />}
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </DialogTrigger>
                          {subItem?.title === "Add new" && 
                            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto font-mono p-10 bg-stone-50">
                              <DialogHeader>
                                <DialogTitle>Add transaction to "<i>{selectedAccount?.name}</i>"</DialogTitle>
                              </DialogHeader>
                              <div className="mt-4">
                                <TransactionForm onSuccess={() => setIsDialogOpen(false)} className="w-full border-none p-1" />
                              </div>
                            </DialogContent>
                          }
                      </Dialog>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
