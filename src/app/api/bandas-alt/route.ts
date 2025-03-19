import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Função auxiliar para criar a tabela se não existir
async function criarTabelaBandasSeNaoExistir() {
  try {
    // Verificar se a tabela existe
    const { error } = await supabase
      .from('bandas')
      .select('id')
      .limit(1);

    // Se não existir tabela, cria usando RPC
    if (error && error.code === 'PGRST116') {
      const sql = `
        CREATE TABLE IF NOT EXISTS bandas (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          nome TEXT NOT NULL,
          genero TEXT NOT NULL,
          descricao TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        -- Desabilitar RLS para a tabela de bandas
        ALTER TABLE bandas DISABLE ROW LEVEL SECURITY;
      `;
      
      const { error: sqlError } = await supabase.rpc('exec_sql', { sql_query: sql });
      
      if (sqlError) {
        console.log('Erro ao criar tabela bandas:', sqlError);
        return { success: false, message: 'Tabela bandas não existe.' };
      }
      
      console.log('Tabela bandas criada com sucesso!');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao verificar/criar tabela:', error);
    return { success: false, message: 'Erro ao verificar/criar tabela bandas.' };
  }
}

// Endpoint unificado para bandas (CRUD completo)
export async function GET(request: Request) {
  try {
    // Pega todos os parâmetros da URL
    const url = new URL(request.url);
    const idBanda = url.searchParams.get('id');
    
    // Se tiver ID, busca uma banda específica
    if (idBanda) {
      const { data, error } = await supabase
        .from('bandas')
        .select('*')
        .eq('id', idBanda)
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }

      return NextResponse.json({ banda: data });
    }
    
    // Caso contrário, lista todas as bandas
    const { data, error } = await supabase
      .from('bandas')
      .select('*')
      .order('nome');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ bandas: data });
  } catch (error) {
    console.error('Erro ao buscar bandas:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// Criar nova banda
export async function POST(request: Request) {
  try {
    const banda = await request.json();

    // Verifica se a tabela existe, senão cria
    await criarTabelaBandasSeNaoExistir();

    // Log para diagnóstico
    console.log('Tentando inserir banda:', banda);
    console.log('URL Supabase:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('API key length:', (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').length);

    // Força a chave API correta diretamente
    const supabaseUrl = 'https://nlubmklrriltyjagmsig.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sdWJta2xycmlsdHlqYWdtc2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDYzMjExMDYsImV4cCI6MTk2MTg5NzEwNn0.zMQIjoHLO3U8EgL9qOQJ7E8SEHQVSVuSzXTXNgO1Uk4';
    
    const { createClient } = await import('@supabase/supabase-js');
    const diretaClient = createClient(supabaseUrl, supabaseKey);

    // Insere a nova banda
    const { data, error } = await diretaClient
      .from('bandas')
      .insert([{
        nome: banda.nome,
        genero: banda.genero,
        descricao: banda.descricao || null
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar banda:', error);
      return NextResponse.json({ error: error.message, details: error }, { status: 500 });
    }

    return NextResponse.json({ banda: data, success: true }, { status: 201 });
  } catch (error) {
    console.error('Erro na API de bandas (POST):', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// Atualizar ou excluir banda por ID via método PUT ou DELETE
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const idBanda = url.searchParams.get('id');
    const method = url.searchParams.get('method');
    
    if (!idBanda) {
      return NextResponse.json({ error: 'ID da banda não fornecido' }, { status: 400 });
    }
    
    // Se method='delete', executamos DELETE
    if (method === 'delete') {
      const { error } = await supabase
        .from('bandas')
        .delete()
        .eq('id', idBanda);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }
    
    // Caso contrário, update normal
    const bandaAtualizada = await request.json();

    const { data, error } = await supabase
      .from('bandas')
      .update({
        nome: bandaAtualizada.nome,
        genero: bandaAtualizada.genero,
        descricao: bandaAtualizada.descricao
      })
      .eq('id', idBanda)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ banda: data });
  } catch (error) {
    console.error('Erro ao atualizar/excluir banda:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
} 