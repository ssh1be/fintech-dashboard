import { NextRequest, NextResponse } from "next/server"
import { Transaction } from "@/lib/types"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        console.log('Received body:', body);
        const id = crypto.randomUUID()

        const newTransaction = {
            id: id,
            accountId: body.accountId,
            amount: body.amount,
            type: body.type,
            date: body.date,
            category: body.category,
            ...(body.customFields && { customFields: body.customFields }),
        } as Transaction

        console.log('Attempting to add transaction:', newTransaction);
        //save transaction to database
        const { data, error } = await supabase
            .from("transactions")
            .insert([newTransaction])
            .single()
        if (error) { 
            console.error('Supabase error:', error);
            throw error 
        }
        console.log('Added transaction:', data);
        return NextResponse.json( data , { status: 201 })
    } catch (error) {
        console.error('API route error:', error);
        return NextResponse.json({ 
            error: "Failed to add transaction",
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        if (!userId) {
            return NextResponse.json({ error: 'userId required' }, { status: 400 });
        }
        console.log('Recieved userId', userId);

        const { data, error } = await supabase
            .from("accounts")
            .select("*")
            .eq("userId", userId)
        if (error) {
            console.error('Supabase error:', error);
            throw error 
        }
        const allTransactions: Transaction[] = [];
        for (const account of data) {
            const { data: transactions, error: transactionsError } = await supabase
                .from("transactions")
                .select("*")
                .eq("accountId", account.id)
            if (transactionsError) {
                console.error('Supabase error:', transactionsError);
                throw transactionsError 
            }
            allTransactions.push(...transactions);
        }
        console.log('All transactions:', allTransactions);
        return NextResponse.json(allTransactions, {status: 200})
    } catch (error) {
        console.error('API route error:', error);
        return NextResponse.json({ 
            error: "Failed to get transactions",
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}