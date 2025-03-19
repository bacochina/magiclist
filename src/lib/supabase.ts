import { createClient } from '@supabase/supabase-js';

// URL e chave estáticas para garantir que funcionem
const supabaseUrl = 'https://nlubmklrriltyjagmsig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sdWJta2xycmlsdHlqYWdtc2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDYzMjExMDYsImV4cCI6MTk2MTg5NzEwNn0.zMQIjoHLO3U8EgL9qOQJ7E8SEHQVSVuSzXTXNgO1Uk4';

// Opções do cliente para melhorar o desempenho
const options = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
};

// Criar um único cliente para ser reutilizado em toda a aplicação
export const supabase = createClient(supabaseUrl, supabaseKey, options);

console.log('Cliente Supabase inicializado com URL:', supabaseUrl); 