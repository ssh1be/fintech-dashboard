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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select"

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    pin: z.string().min(4, { message: "Password must be at least 4 characters" }),
    currency: z.enum(["USD", "EUR", "GBP", "JPY", "CAD", "AUD"]),
})
 
export function UserForm() {
  const { setUser, user } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: "",
        pin: "",
        currency: "USD",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Try login first
      const loginResponse = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      
      if (loginResponse.ok) {
        const existingUser = await loginResponse.json();
        setUser(existingUser);
        toast.success(`Hi ${existingUser.name}!`);
        return;
      }
      
      // If login fails, create new user
      const createResponse = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      
      if (!createResponse.ok) throw new Error('Failed to create user');
      
      const newUser = await createResponse.json();
      setUser(newUser);
      toast.success("User created successfully!");
      form.reset();
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-1/2 font-mono border-1 border-[#0000001c] rounded-lg p-8 bg-stone-50">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                    <Input type="text" placeholder="Joe Smith" {...field} />
                </FormControl>
                <FormDescription>This is your display name.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                        <Select onValueChange={field.onChange}>
                            <FormItem>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a currency" />
                                        <SelectContent className="font-mono bg-stone-50">
                                            <SelectItem value="USD">USD $</SelectItem>
                                            <SelectItem value="EUR">EUR €</SelectItem>
                                            <SelectItem value="GBP">GBP £</SelectItem>
                                            <SelectItem value="JPY">JPY ¥</SelectItem>
                                        </SelectContent>
                                    </SelectTrigger>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </Select>
                    </FormControl>
                    <FormDescription>The primary currency you use.</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
                <FormItem>
                <FormLabel>PIN</FormLabel>
                <FormControl>
                    <Input type="password" placeholder="****" {...field} />
                </FormControl>
                <FormDescription>Used to access your account.</FormDescription>
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
              <Spinner
                className="size-4"
              />
              ) : (
                "Submit"
              )}
            </Button>
        </form>
    </Form>
  )
}