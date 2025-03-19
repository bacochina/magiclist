import { NextResponse } from 'next/server';
import { bandasSeed } from '@/lib/seeds/bandas';
import { supabase } from '@/lib/supabase';

// Funções para gerenciar localStorage
const getBandas = () => {
  if (typeof window === 'undefined') return bandasSeed;
  const bandas = localStorage.getItem('bandas');
  return bandas ? JSON.parse(bandas) : bandasSeed;
};

const saveBandas = (bandas: any[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('bandas', JSON.stringify(bandas));
};

// GET - Listar todas as bandas
export async function GET() {
  try {
    // Tenta buscar bandas do Supabase
    const { data, error } = await supabase
      .from('bandas')
      .select('*')
      .order('nome');

    if (error) {
      console.error('Erro ao buscar bandas:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ bandas: data });
  } catch (error) {
    console.error('Erro na API de bandas:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST - Criar nova banda
export async function POST(request: Request) {
  try {
    const banda = await request.json();

    // Verifica se a tabela existe, senão cria
    await criarTabelaBandasSeNaoExistir();

    // Insere a nova banda
    const { data, error } = await supabase
      .from('bandas')
      .insert([{
        nome: banda.nome,
        genero: banda.genero,
        descricao: banda.descricao
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar banda:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ banda: data }, { status: 201 });
  } catch (error) {
    console.error('Erro na API de bandas (POST):', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// Função auxiliar para criar a tabela se não existir
async function criarTabelaBandasSeNaoExistir() {
  try {
    // Verificar se a tabela existe usando a API REST
    const { error } = await supabase
      .from('bandas')
      .select('id')
      .limit(1);

    // Se não existir tabela, cria usando RPC (ou SQL)
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
      
      // Se não conseguir criar por RPC, retorna instruções
      if (sqlError) {
        console.log('Erro ao criar tabela bandas:', sqlError);
        return { 
          success: false, 
          message: 'Tabela bandas não existe. Por favor, crie manualmente no Supabase.'
        };
      }
      
      console.log('Tabela bandas criada com sucesso!');
      return { success: true };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao verificar/criar tabela:', error);
    return { 
      success: false, 
      message: 'Erro ao verificar/criar tabela bandas.'
    };
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const bandas = getBandas();
    const index = bandas.findIndex(b => b.id === data.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Banda não encontrada' },
        { status: 404 }
      );
    }

    bandas[index] = {
      ...bandas[index],
      ...data,
      updatedAt: new Date()
    };

    saveBandas(bandas);
    return NextResponse.json(bandas[index]);
  } catch (error) {
    console.error('Erro ao atualizar banda:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar banda' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID não fornecido' },
        { status: 400 }
      );
    }

    const bandas = getBandas();
    const novasBandas = bandas.filter(b => b.id !== id);
    saveBandas(novasBandas);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir banda:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir banda' },
      { status: 500 }
    );
  }
} 