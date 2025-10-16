import { NextRequest, NextResponse } from "next/server"
import { User } from "@/lib/types"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        console.log('Received body:', body);
        const id = crypto.randomUUID()

        const newUser: User = {
            id: id,
            name: body.name,
            pin: body.pin,
            currency: body.currency,
        }
        console.log('Attempting to save user:', newUser);
        //save user to database
        const { data, error } = await supabase
            .from("users")
            .insert([newUser])
            .single()
        if (error) { 
            console.error('Supabase error:', error);
            throw error 
        }
        console.log('Saved user:', data);
        return NextResponse.json({ user: data }, { status: 201 })
    } catch (error) {
        console.error('API route error:', error);
        return NextResponse.json({ 
            error: "Failed to create user",
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const body = await request.json()
        console.log('Received body:', body);

        const name: string = body.name
        //save user to database
        const { data, error } = await supabase
            .from("users")
            .select("name")
            .eq("name", name)
            .limit(1)
        if (error) { 
            console.error('Supabase error:', error);
            throw error 
        }
        console.log('User:', data);
        return NextResponse.json({ user: data }, { status: 200 })
    } catch (error) {
        console.error('API route error:', error);
        return NextResponse.json({ 
            error: "Failed to get user",
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
