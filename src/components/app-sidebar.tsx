"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  ChevronRight,
  Command,
  Frame,
  GalleryVerticalEnd,
  ListChecks,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  DollarSign,
  HomeIcon,
  Plus,
  Upload,
  History,
  Pencil,
  Trash,
  CreditCard,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { AccountSwitcher } from "@/components/account-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"

import { useUser } from '@/context/UserContext';
import { Spinner } from './ui/spinner';
import { TransactionForm } from "./transaction-form";

const dataOld = {
  user: {
    name: "shadcn",
    email: "m@example.com",
  },
  navMain: [
    {
      title: "Transactions",
      url: "#",
      icon: DollarSign,
      isActive: true,
      items: [
        {
          title: "Add new",
          url: "#",
          icon: Plus,
        },
        {
          title: "Import",
          url: "#",
          icon: Upload,
        },
        {
          title: "History",
          url: "#",
          icon: History,
        },
      ],
    },
    {
      title: "Account",
      url: "#",
      icon: CreditCard,
      items: [
        {
          title: "Edit",
          url: "#",
          icon: Pencil,
        },
        {
          title: "Delete",
          url: "#",
          icon: Trash,
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [

      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, accounts } = useUser();
  
  dataOld.user.name = user?.name || '';
  dataOld.user.email = user?.currency || '';

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {accounts.length > 0 ? (
          <AccountSwitcher accounts={accounts} />
        ) : (
          <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Spinner className="size-4 animate-spin" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Loading...</span>
                <span className="truncate text-xs">Loading...</span>
              </div>
              <ChevronRight className="ml-auto" />
          </SidebarMenuButton>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={dataOld.navMain} />
        {/* <NavProjects projects={dataOld.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={dataOld.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
