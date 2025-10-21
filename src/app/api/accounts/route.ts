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
        return NextResponse.json( data , { status: 201 })
    } catch (error) {
        console.error('API route error:', error);
        return NextResponse.json({ 
            error: "Failed to create account",
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
            console.error('Supabase error:', error)
            throw error
        }
        // console.log('Account(s):', data);
        return NextResponse.json(data, {status: 200})
    } catch (error){
        console.log('API route error', error);
        return NextResponse.json({ 
            error: "Failed to get accounts",
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const accountId = searchParams.get('accountId');
        if (!accountId) {
            return NextResponse.json({ error: 'accountId required' }, { status: 400 });
        }
        console.log('Recieved accountId', accountId);
        const { data, error } = await supabase
            .from("accounts")
            .delete()
            .eq("id", accountId)
        if (error) {
            console.error('Supabase error:', error);
            throw error
        }
        console.log('Deleted account:', data);
        return NextResponse.json(data, {status: 200})
    } catch (error) {
        console.log('API route error', error);
        return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
    }
}