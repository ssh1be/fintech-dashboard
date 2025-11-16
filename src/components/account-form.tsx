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

const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    type: z.enum(["checking", "savings", "credit card", "investment"], {message: "Type is required"}),
    balance: z.coerce.number<number>({ message: "Balance is required" }),
    overdraftLimit: z.coerce.number<number>().min(0).optional(),
    interestRate: z.coerce.number<number>().min(0).max(100).optional(),
    minimumBalance: z.coerce.number<number>().min(0).optional(),
    creditLimit: z.coerce.number<number>().min(0).optional(),
    apr: z.coerce.number<number>().min(0).max(100).optional(),
})

export function AccountForm({ onSuccess, className }: { onSuccess?: () => void, className?: string }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            type: undefined,
            balance: undefined,
            overdraftLimit: undefined,
            interestRate: undefined,
            minimumBalance: undefined,
            creditLimit: undefined,
            apr: undefined,
        }
    })
    const accountType = form.watch("type");
    const { user, addAccount, fetchUserAccounts, addTransaction, fetchUserTransactions } = useUser();
    
    async function addFirstTransaction(amount: number, accountId: string) {
        if (!user) return;
        try {
            const createResoponse = await fetch('/api/transactions', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    amount: amount,
                    type: 'deposit',
                    date: new Date().toISOString(),
                    category: 'Initial',
                    customFields: undefined,
                    accountId: accountId,
                }),
            });
            
            if (!createResoponse.ok) throw new Error('Failed to add transaction');

            const transaction = await createResoponse.json();
            addTransaction(transaction);
            fetchUserTransactions(user.id);
            console.log('Added transaction:', transaction)
            return transaction;
        } catch (error){
            toast.error("Something went wrong adding the first transaction");
            return null;
        }
    }
    
    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user) return;
        try {
            const accountId = crypto.randomUUID();
            const createResoponse = await fetch('/api/accounts', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    ...values, 
                    userId: user.id,
                    id: accountId,
                }),
            });
            
            if (!createResoponse.ok) throw new Error('Failed to create account');

            const account = await createResoponse.json();
            addAccount(account);
            fetchUserAccounts(user.id);
            console.log('Created account:', account)
            toast.success("Account created successfully!");
            const transaction = await addFirstTransaction(values.balance, accountId);
            if (transaction) {
                form.reset();
                onSuccess?.();
            }
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
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Account Name</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="My bank account" {...field} />
                            </FormControl>
                            <FormDescription>This is the name of your account.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Account Type</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} >
                                    <FormItem>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a type" />
                                                <SelectContent className="font-mono bg-stone-50">
                                                    <SelectItem value="checking">Checking</SelectItem>
                                                    <SelectItem value="savings">Savings</SelectItem>
                                                    <SelectItem value="credit card">Credit Card</SelectItem>
                                                    <SelectItem value="investment" className="disabled pointer-events-none">Investment</SelectItem>
                                                </SelectContent>
                                            </SelectTrigger>
                                        </FormControl>
                                    </FormItem>
                                </Select>
                            </FormControl>
                            <FormDescription>The type of account you wish to track.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="balance"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Account Balance ({user?.currency})</FormLabel>
                            <FormControl>
                                <Input 
                                    type="number"
                                    placeholder="1000"
                                    value={field.value ?? ""} // convert undefined to an empty string
                                    onChange={(e) => field.onChange(e.target.value || undefined)}
                                    />
                            </FormControl>
                            <FormDescription>The current balance of your account.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {accountType === 'checking' && (
                <FormField
                    control={form.control}
                    name="overdraftLimit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Overdraft Limit <i>(optional)</i></FormLabel>
                            <FormControl>
                            <Input 
                                type="number"
                                placeholder="500"
                                value={field.value ?? ""} // convert undefined to an empty string
                                onChange={(e) => field.onChange(e.target.value || undefined)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                )}
                {accountType === 'savings' && (
                <>
                    <FormField
                        control={form.control}
                        name="interestRate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Interest Rate % <i>(optional)</i></FormLabel>
                                <FormControl>
                                <Input 
                                    type="number"
                                    placeholder="1.5%"
                                    value={field.value ?? ""} // convert undefined to an empty string
                                    onChange={(e) => field.onChange(e.target.value || undefined)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="minimumBalance"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Minimum Balance <i>(optional)</i></FormLabel>
                                <FormControl>
                                    <Input 
                                        type="number"
                                        placeholder="200"
                                        value={field.value ?? ""} // convert undefined to an empty string
                                        onChange={(e) => field.onChange(e.target.value || undefined)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </>
                )}
                {accountType === 'credit card' && (
                <>
                    <FormField
                        control={form.control}
                        name="creditLimit"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Credit Limit <i>(optional)</i></FormLabel>
                                <FormControl>
                                    <Input 
                                        type="number"
                                        placeholder="2000"
                                        value={field.value ?? ""} // convert undefined to an empty string
                                        onChange={(e) => field.onChange(e.target.value || undefined)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="apr"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>APR % <i>(optional)</i></FormLabel>
                                <FormControl>
                                    <Input 
                                        type="number"
                                        placeholder="17.5%"
                                        value={field.value ?? ""} // convert undefined to an empty string
                                        onChange={(e) => field.onChange(e.target.value || undefined)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </>
                )}
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