import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dns from 'dns';
import { promisify } from 'util';
import { supabase } from '@/lib/supabase';

// Converter dns.lookup para Promise
const lookup = promisify(dns.lookup);

export async function GET() {
  try {
    // Teste de conexão básico
    const { data, error } = await supabase.from('shows').select('count').single();

    if (error) {
      console.error('Erro Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Verificar variáveis de ambiente
    const config = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };

    return NextResponse.json({
      status: 'success',
      config,
      data,
    });
  } catch (error) {
    console.error('Erro inesperado:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 