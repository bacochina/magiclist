import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  try {
    const { data: shows, error } = await supabase
      .from('show_evento')
      .select('*')
      .order('data', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ shows });
  } catch (error) {
    console.error('Erro ao buscar shows:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar shows' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { data: show, error } = await supabase
      .from('show_evento')
      .insert([data])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ show });
  } catch (error) {
    console.error('Erro ao criar show:', error);
    return NextResponse.json(
      { error: 'Erro ao criar show' },
      { status: 500 }
    );
  }
} 