import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { pin, name } = await request.json();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('pin', pin)
      .eq('name', name)
      .single();
    
    if (error || !data) {
      return NextResponse.json({ error: 'Invalid PIN or Name' }, { status: 401 });
    }
    
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}