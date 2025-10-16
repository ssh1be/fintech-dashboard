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

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    type: z.enum(["checking", "savings", "credit card", "investment"]),
    balance: z.number(),
    overdraftLimit: z.number().optional(),
    interestRate: z.number().optional(),
    minimumBalance: z.number().optional(),
    creditLimit: z.number().optional(),
    apr: z.number().optional(),
})

export function AccountForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            balance: 0,
        },
    })

    const { user } = useUser();
    const accountType = form.watch("type");

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user) return;
        try {
            const createResoponse = await fetch('/api/accounts', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    ...values, 
                    userId: user.id,
                }),
            });
            
            if (!createResoponse.ok) throw new Error('Failed to create account');

            const account = await createResoponse.json();
            console.log('Created account:', account)
            toast.success("Account created successfully!");
            form.reset();
        } catch (error){
            toast.error("Something went wrong");
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-1/2 font-mono border-1 border-black rounded-lg p-8 bg-stone-50">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Account Name</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="My checking account" {...field} />
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
                                                    <SelectItem value="investment">Investment</SelectItem>
                                                </SelectContent>
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage />
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
                                <Input type="number" placeholder="1000" {...field} />
                            </FormControl>
                            <FormDescription>The current balance of your account.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {accountType === 'checking' && (
                <>
                <FormField
                    control={form.control}
                    name="overdraftLimit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Overdraft Limit <i>(optional)</i></FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="500" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                </>
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
                                <Input type="number" placeholder="1.5%" {...field} />
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
                                <Input type="number" placeholder="200" {...field} />
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
                                <Input type="number" placeholder="200" {...field} />
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
                                <Input type="number" placeholder="200" {...field} />
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