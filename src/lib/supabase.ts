import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Log para debug das variáveis de ambiente
if (process.env.NODE_ENV === 'development') {
  console.log('Variáveis de ambiente Supabase:', {
    url: supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    hasServiceKey: !!supabaseServiceKey,
    anonKeyLength: supabaseAnonKey?.length,
    serviceKeyLength: supabaseServiceKey?.length,
  });
}

// Opções do cliente para acesso público
const publicOptions = {
  auth: {
    persistSession: false, // Não persistir sessão
    autoRefreshToken: false, // Não atualizar token
    detectSessionInUrl: false, // Não detectar sessão na URL
  },
  db: {
    schema: 'public'
  }
};

// Opções do cliente para acesso administrativo
const adminOptions = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  db: {
    schema: 'public'
  }
};

// Cliente público para operações normais
export const supabase = createClient(supabaseUrl, supabaseAnonKey, publicOptions);

// Cliente administrativo para operações que requerem privilégios elevados
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, adminOptions);

// Log para debug da inicialização
if (process.env.NODE_ENV === 'development') {
  console.log('Clientes Supabase inicializados (público e admin)');
} 