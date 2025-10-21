"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Transaction } from "@/lib/types"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from "@/context/UserContext"
import { Spinner } from "./ui/spinner"

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      if (row.original === null) {
        return <div className="text-left">Unknown Date</div>
      } 
      const date = new Date(row.getValue("date"))
      const formatted = date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      return <div className="text-left">{formatted}</div>
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      if (row.original === null) {
        return <div className="text-left">Unknown Amount</div>
      }
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      if (row.original.type === "withdrawal" || row.original.type === "purchase" || row.original.type === "sell") {
        return <div className="text-left text-red-500">-{formatted}</div>
      } else if (row.original.type === "deposit" || row.original.type === "buy" || row.original.type === "dividend") {
        return <div className="text-left text-green-500">+{formatted}</div>
      }
      return <div className="text-left">{formatted}</div>
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      if (row.original === null) {
        return <div className="text-left">Unknown Type</div>
      }
      const type = row.original.type
      return <div className="text-left">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      if (row.original === null) {
        return <div className="text-left">Unknown Category</div>
      }
      const category = row.original.category
      return <div className="text-left">{category}</div>
    },
  },
  {
    accessorKey: "accountId",
    header: "Account",
    cell: ({ row }) => {
      if (row.original === null) {
        return <div className="text-left">Unknown Account</div>
      }
      const { accounts } = useUser()
      const account = accounts.find((account) => account.id === row.original.accountId)
      if (!account) {
        return <Spinner className="size-4 animate-spin" />
      }
      return <div className="text-left">{account?.type.charAt(0).toUpperCase() + account?.type.slice(1)}</div>
    },
  },
  // {
  //   accessorKey: "customFields",
  //   header: "Custom Fields",
  //   cell: ({ row }) => {
  //     if (row.original === null) {
  //       return <div className="text-left">Unknown Custom Fields</div>
  //     }
  //     const customFields = row.original.customFields
  //     return <div className="text-left">{customFields?.toString()}</div>
  //   },
  // },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      if (row.original === null) {
        return <div className="text-left">Unknown Transaction</div>
      }
      const { deleteTransaction, user } = useUser();
      return (
        <>
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-stone-50 font-mono text-muted-foreground">
              <DropdownMenuItem onClick={() => deleteTransaction(row.original.id, user.id)}>
                <Trash2 className="h-4 w-4" /> Delete 
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="disabled">
                <Pencil className="h-4 w-4" /> Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        </>
      )
    },
  },
]