import { NextRequest, NextResponse } from "next/server"
import { Account } from "@/lib/types"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        console.log('Received body:', body);
        const id = crypto.randomUUID()

        const newAccount = {
            id: id,
            userId: body.userId,
            name: body.name,
            type: body.type,
            balance: body.balance,
            ...(body.routingNumber && { routingNumber: body.routingNumber }),
            ...(body.overdraftLimit && { overdraftLimit: body.overdraftLimit }),
            ...(body.interestRate && { interestRate: body.interestRate }),
            ...(body.minimumBalance && { minimumBalance: body.minimumBalance }),
            ...(body.creditLimit && { creditLimit: body.creditLimit }),
            ...(body.apr && { apr: body.apr }),
        } as Account

        console.log('Attempting to save account:', newAccount);
        //save user to database
        const { data, error } = await supabase
            .from("accounts")
            .insert([newAccount])
            .single()
        if (error) { 
            console.error('Supabase error:', error);
            throw error 
        }
        console.log('Saved account:', data);
        return NextResponse.json({ user: data }, { status: 201 })
    } catch (error) {
        console.error('API route error:', error);
        return NextResponse.json({ 
            error: "Failed to create account",
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}