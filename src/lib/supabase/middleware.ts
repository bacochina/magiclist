import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from './service-client';

export async function createServerSupabaseClient(req: NextRequest) {
  const res = NextResponse.next();
  
  try {
    // Tentar criar o cliente baseado em cookies
    const supabase = createMiddlewareClient({ req, res });
    return { supabase, res };
  } catch (error) {
    console.error('Erro ao criar cliente Supabase no middleware, usando cliente de serviço como fallback:', error);
    
    // Usar o cliente de serviço como fallback
    return { 
      supabase: supabaseService, 
      res 
    };
  }
} 