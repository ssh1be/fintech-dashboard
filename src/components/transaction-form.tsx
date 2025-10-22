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
import { Plus, X } from "lucide-react"
import { Checkbox } from "./ui/checkbox"

const formSchema = z.object({
    amount: z.coerce.number<number>({ message: "Amount is required" }),
    type: z.enum(["deposit", "withdrawal", "purchase", "payment", "buy", "sell", "dividend"], {message: "Type is required"}),
    date: z.string().min(1, {message: "Date is required"}),
    category: z.string().optional(),
    customFields: z.record(z.string(), z.string().or(z.number()).or(z.boolean())).optional(),
})

export function TransactionForm({ onSuccess, className }: { onSuccess?: () => void, className?: string }) {
    const { user, accounts, selectedAccount, addTransaction, fetchUserTransactions } = useUser();
    const [customFieldTypes, setCustomFieldTypes] = useState<Record<string, "string" | "number" | "boolean">>({});
    const [fieldName, setFieldName] = useState<string | null>();
    const [customFields, setCustomFields] = useState<Record<string, string | number | boolean>>({});

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
    const setDateValue = (date: Date) => {
        form.setValue("date", date.toISOString());
    }
    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user) return;
        if (accounts.length === 0) return;
        const customFieldsArray = Object.entries(customFields).map(([fieldName, value]) => ({
            name: fieldName,
            value: typeof value === 'boolean' ? value : String(value),
        }));
        try {
            const createResoponse = await fetch('/api/transactions', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    ...values,
                    customFields: customFieldsArray,
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
    
    
    function addCustomField( fieldName: string ) {
        if (fieldName && customFields[fieldName] !== undefined) return; // Validate and check for duplicates
        setCustomFields({ ...customFields, [fieldName as string]: "" });
        setCustomFieldTypes({ ...customFieldTypes, [fieldName as string]: "string" }); // Default to string
    }

    function removeCustomField(fieldName: string) {
        const newFields = { ...customFields };
        const newTypes = { ...customFieldTypes };
        delete newFields[fieldName];
        delete newTypes[fieldName];
        setCustomFields(newFields);
        setCustomFieldTypes(newTypes);
    }

    function updateCustomFieldType(fieldName: string, type: "string" | "number" | "boolean") {
        setCustomFieldTypes({ ...customFieldTypes, [fieldName]: type });
        // Reset value when type changes to match new type
        if (type === "boolean") {
            setCustomFields({ ...customFields, [fieldName]: "false" });
        } else if (type === "number") {
            setCustomFields({ ...customFields, [fieldName]: 0 });
        } else {
            setCustomFields({ ...customFields, [fieldName]: "" });
        }
    }

    function updateCustomFieldValue(fieldName: string, value: string | number | boolean) {
        setCustomFields({ ...customFields, [fieldName]: value });
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
                                                        <SelectItem value="deposit">(+) Deposit</SelectItem>
                                                        <SelectItem value="withdrawal">(-) Withdrawal</SelectItem>
                                                    </>
                                                    )}
                                                    {selectedAccount?.type === "savings" && (
                                                    <>
                                                        <SelectItem value="deposit">(+) Deposit</SelectItem>
                                                        <SelectItem value="withdrawal">(-) Withdrawal</SelectItem>
                                                    </>
                                                    )}
                                                    {selectedAccount?.type === "credit card" && (
                                                    <>
                                                        <SelectItem value="purchase">(-) Purchase</SelectItem>
                                                        <SelectItem value="payment">(+) Payment</SelectItem>
                                                    </>
                                                    )}
                                                    {selectedAccount?.type === "investment" && (
                                                    <>
                                                        <SelectItem value="buy">(+) Buy</SelectItem>
                                                        <SelectItem value="sell">(-) Sell</SelectItem>
                                                        <SelectItem value="dividend">(+) Dividend</SelectItem>
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
                            <FormLabel>Category <i>(optional)</i></FormLabel>
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
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-row gap-2">
                                        <Input className="min-w-xs" type="text" placeholder="Description, etc." value={fieldName ?? ""} onChange={(e) => setFieldName(e.target.value)} />
                                        {fieldName && (
                                            <Button 
                                                type="button"
                                                variant="outline" 
                                                onClick={() => {addCustomField(fieldName); setFieldName("")}}
                                            >
                                                <Plus className="size-4" />Add Field
                                            </Button>
                                        )}
                                    </div>
                                    {Object.keys(customFields).map((fieldName) => (
                                        <div key={fieldName} className="flex flex-col gap-2 p-3 border rounded">
                                            {/* Field Name (the key) - read-only once created */}
                                            <div className="font-medium text-sm">{fieldName}</div>
                                            
                                            <div className="flex gap-2 items-start">
                                            {/* Type selector */}
                                            <Select 
                                                value={customFieldTypes[fieldName]}
                                                onValueChange={(value) => updateCustomFieldType(fieldName, value as "string" | "number" | "boolean")}
                                            >
                                                <SelectTrigger className="w-[120px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="font-mono bg-stone-50">
                                                    <SelectItem value="string">String</SelectItem>
                                                    <SelectItem value="number">Number</SelectItem>
                                                    <SelectItem value="boolean">Boolean</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            
                                            {/* Value input - changes based on type */}
                                            {customFieldTypes[fieldName] === "boolean" ? (
                                                <Checkbox
                                                className="size-5 mt-2"
                                                checked={Boolean(customFields[fieldName])}
                                                onCheckedChange={(checked: boolean) => updateCustomFieldValue(fieldName, checked)}
                                                />
                                            ) : (
                                                <Input
                                                    type={customFieldTypes[fieldName] === "number" ? "number" : "text"}
                                                    placeholder={`Enter ${fieldName.toLowerCase()}`}
                                                    value={customFields[fieldName]?.toString() ?? ""}
                                                    onChange={(e) => {
                                                        const newValue = customFieldTypes[fieldName] === "number" 
                                                        ? parseFloat(e.target.value) 
                                                        : e.target.value;
                                                        updateCustomFieldValue(fieldName, newValue);
                                                    }}
                                                    className="flex-1 max-w-xs"
                                                />
                                            )}
                                            {/* Remove button */}
                                            <Button 
                                                type="button"
                                                variant="ghost" 
                                                size="icon"
                                                onClick={() => removeCustomField(fieldName)}
                                            >
                                                <X className="size-4" />
                                            </Button>
                                            </div>
                                        </div>
                                        ))}
                                </div>
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