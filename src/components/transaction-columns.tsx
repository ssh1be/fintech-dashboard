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



export interface NormalizedTransaction extends Transaction {
  [key: string]: any // used to render custom field columns
}

export const baseColumns: ColumnDef<NormalizedTransaction>[] = [
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
      if (row.original.category === "") {
        return <div className="text-left">-</div>
      }
      const category = row.original.category
      return <div className="text-left">{category}</div>
    },
  },
  {
    accessorKey: "accountType",
    header: "Account",
    cell: ({ row }) => {
      if (row.original === null) {
        return <div className="text-left">Unknown Account</div>
      }
      return <div className="text-left">{ row.original.accountType.charAt(0).toUpperCase() + row.original.accountType.slice(1) }</div>
    },
  },
]

export function generateCustomFieldColumns<NormalizedTransaction>(
  data: NormalizedTransaction[]
): ColumnDef<NormalizedTransaction>[] {
  if (!data.length) return [];

  // Detect any keys prefixed with "custom_"
  const allKeys = new Set<string>();
  for (const tx of data) {
    for (const key in tx) {
      if (key.startsWith("custom_")) {
        allKeys.add(key);
      }
    }
  }
  // Create column definitions for each custom field
  return Array.from(allKeys).map((key) => {
    const label = key.replace("custom_", "");
    return {
      accessorKey: key,
      header: ({ column }) => (
        <div className="flex items-center">
          *{label}
        </div>
      ),
      cell: ({ row }) => {
        const value = row.getValue(key);
        if (value === undefined || value === null)
          return <span className="text-muted-foreground">—</span>;
        return <span>{String(value)}</span>;
      },
    }
  });
}

export function actionColumn(): ColumnDef<NormalizedTransaction>[] {
  return [
    {
      id: "actions",
      cell: ({ row }) => {
        const { user, deleteTransaction } = useUser();
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
    }
  ];
}