"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "./ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "./ui/form"
import { Button } from "./ui/button"
import { toast } from "sonner"
import { useUser } from "@/context/UserContext"
import { Spinner } from "./ui/spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { cn } from "@/lib/utils"
import { DatePicker } from "./date-picker"
import { useState } from "react"

const formSchema = z.object({
    amount: z.coerce.number<number>({ message: "Amount is required" }),
    type: z.enum(["deposit", "withdrawal", "purchase", "payment", "buy", "sell", "dividend"], {message: "Type is required"}),
    date: z.string().min(1, {message: "Date is required"}),
    category: z.string().min(1, {message: "Category is required"}),
    customFields: z.record(z.string(), z.string().or(z.number()).or(z.boolean())).optional(),
})

export function TransactionForm({ onSuccess, className }: { onSuccess?: () => void, className?: string }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: undefined,
            type: undefined,
            date: '',
            category: '',
            customFields: undefined,
        }
    })

    const { user, accounts, selectedAccount, addTransaction, fetchUserTransactions } = useUser();

    const setDateValue = (date: Date) => {
        form.setValue("date", date.toISOString());
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user) return;
        if (accounts.length === 0) return;
        try {
            const createResoponse = await fetch('/api/transactions', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    ...values, 
                    accountId: selectedAccount?.id,
                }),
            });
            
            if (!createResoponse.ok) throw new Error('Failed to add transaction');

            const transaction = await createResoponse.json();
            addTransaction(transaction);
            fetchUserTransactions(user.id);
            console.log('Added transaction:', transaction)
            toast.success("Transaction added successfully!");
            form.reset();
            onSuccess?.();
        } catch (error){
            toast.error("Something went wrong");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-8 w-1/2 font-mono border-1 border-[#0000001c] rounded-lg p-8 bg-stone-50", className)}>
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input 
                                    type="number"
                                    placeholder="10.00"
                                    value={field.value ?? ""} // convert undefined to an empty string
                                    onChange={(e) => field.onChange(e.target.value || undefined)}
                                />
                            </FormControl>
                            <FormDescription>This is the amount of the transaction.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Transaction Type</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} >
                                    <FormItem>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a type" />
                                                <SelectContent className="font-mono bg-stone-50">
                                                    {selectedAccount?.type === "checking" && (
                                                    <>
                                                        <SelectItem value="deposit">Deposit</SelectItem>
                                                        <SelectItem value="withdrawal">Withdrawal</SelectItem>
                                                    </>
                                                    )}
                                                    {selectedAccount?.type === "savings" && (
                                                    <>
                                                        <SelectItem value="deposit">Deposit</SelectItem>
                                                        <SelectItem value="withdrawal">Withdrawal</SelectItem>
                                                    </>
                                                    )}
                                                    {selectedAccount?.type === "credit card" && (
                                                    <>
                                                        <SelectItem value="purchase">Purchase</SelectItem>
                                                        <SelectItem value="payment">Payment</SelectItem>
                                                    </>
                                                    )}
                                                    {selectedAccount?.type === "investment" && (
                                                    <>
                                                        <SelectItem value="buy">Buy</SelectItem>
                                                        <SelectItem value="sell">Sell</SelectItem>
                                                        <SelectItem value="dividend">Dividend</SelectItem>
                                                    </>
                                                    )}
                                                </SelectContent>
                                            </SelectTrigger>
                                        </FormControl>
                                    </FormItem>
                                </Select>
                            </FormControl>
                            <FormDescription>The type of transaction you wish to add.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="date"
                    render={() => (
                        <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                                <DatePicker returnDate={setDateValue} />
                            </FormControl>
                            <FormDescription>The date of the transaction.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Food" {...field} />
                            </FormControl>
                            <FormDescription>The category of the transaction.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="customFields"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Custom Fields <i>(optional)</i></FormLabel>
                            <FormControl>
                            </FormControl>
                            <FormDescription>Add any additional fields you wish to track.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button 
                    type="submit"
                    variant="default"
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting ? (
                        <Spinner className="size-4" />
                    ) : (
                        "Submit"
                    )}
                </Button>
            </form>
        </Form>
    )
}