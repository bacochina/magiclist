import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Opções do cliente para melhorar o desempenho
const options = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-my-custom-header': 'magiclist'
    }
  }
};

// Criar um único cliente para ser reutilizado em toda a aplicação
export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);

// Log para debug
if (process.env.NODE_ENV === 'development') {
  console.log('Cliente Supabase inicializado com URL:', supabaseUrl);
} 