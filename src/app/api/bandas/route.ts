import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Usar variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Verificar se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: Variáveis de ambiente do Supabase não encontradas');
  console.log('URL:', supabaseUrl ? 'Definida' : 'Indefinida');
  console.log('Key:', supabaseKey ? 'Definida' : 'Indefinida');
  throw new Error('Configuração do Supabase incompleta');
}

// Criar cliente Supabase uma única vez
const supabase = createClient(supabaseUrl, supabaseKey);

// Tipo para integrantes
interface Integrante {
  id: string;
  nome: string;
  instrumento?: string;
  apelido?: string;
}

// Tipo para resposta da consulta
interface IntegranteBandaResponse {
  integrante_id: string;
  integrantes: {
    id: string;
    nome: string;
    instrumento?: string;
    apelido?: string;
  } | null;
}

// Método GET para listar bandas com integrantes
export async function GET() {
  try {
    console.log('GET: Buscando todas as bandas');
    
    // Buscar todas as bandas
    const { data: bandas, error: listError } = await supabase
      .from('bandas')
      .select('*')
      .order('nome');
      
    if (listError) {
      console.error('Erro ao buscar bandas:', listError);
      throw listError;
    }

    // Para cada banda, buscar seus integrantes
    const bandasComIntegrantes = await Promise.all(
      bandas.map(async (banda) => {
        // Buscar integrantes da banda
        const { data: integrantesBanda, error: integrantesError } = await supabase
          .from('integrantes_bandas')
          .select(`
            integrante_id,
            integrantes (
              id,
              nome,
              instrumento,
              apelido
            )
          `)
          .eq('banda_id', banda.id);
          
        if (integrantesError) {
          console.error(`Erro ao buscar integrantes da banda ${banda.id}:`, integrantesError);
          return { ...banda, integrantes: [] };
        }
        
        // Formatar integrantes
        const integrantes: Integrante[] = integrantesBanda 
          ? integrantesBanda
              .filter((item: any) => item.integrantes !== null)
              .map((item: any) => ({
                id: item.integrantes.id,
                nome: item.integrantes.nome,
                instrumento: item.integrantes.instrumento,
                apelido: item.integrantes.apelido
              }))
          : [];
          
        // Retornar banda com seus integrantes
        return {
          ...banda,
          integrantes
        };
      })
    );
    
    return NextResponse.json({ data: bandasComIntegrantes });
  } catch (error) {
    console.error('Erro na API GET de bandas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar bandas' },
      { status: 500 }
    );
  }
}

// Endpoint único para todas as operações
export async function POST(request: Request) {
  try {
    const { action, data } = await request.json();
    
    console.log('Received request:', { action, data });
    
    switch (action) {
      case 'list':
        // Listar bandas
        const { data: bandas, error: listError } = await supabase
          .from('bandas')
          .select('*')
          .order('nome');
          
        if (listError) throw listError;
        
        return NextResponse.json({ bandas });
        
      case 'get':
        // Obter banda por ID
        const { data: banda, error: getError } = await supabase
          .from('bandas')
          .select('*')
          .eq('id', data.id)
          .single();
          
        if (getError) throw getError;
        
        // Buscar integrantes da banda
        const { data: integrantesBanda, error: integrantesError } = await supabase
          .from('integrantes_bandas')
          .select(`
            integrante_id,
            integrantes (
              id,
              nome,
              instrumento,
              apelido
            )
          `)
          .eq('banda_id', data.id);
          
        if (integrantesError) {
          console.error('Erro ao buscar integrantes:', integrantesError);
        }
        
        // Formatar integrantes
        const integrantes: Integrante[] = integrantesBanda 
          ? integrantesBanda
              .filter((item: any) => item.integrantes !== null)
              .map((item: any) => ({
                id: item.integrantes.id,
                nome: item.integrantes.nome,
                instrumento: item.integrantes.instrumento,
                apelido: item.integrantes.apelido
              }))
          : [];
          
        return NextResponse.json({ 
          banda,
          integrantes
        });
        
      case 'create':
        // Criar nova banda
        const { data: newBanda, error: createError } = await supabase
          .from('bandas')
          .insert([data])
          .select()
          .single();
          
        if (createError) throw createError;
        
        return NextResponse.json({ banda: newBanda });
        
      case 'update':
        // Atualizar banda
        const { data: updatedBanda, error: updateError } = await supabase
          .from('bandas')
          .update(data)
          .eq('id', data.id)
          .select()
          .single();
          
        if (updateError) throw updateError;
        
        return NextResponse.json({ banda: updatedBanda });
        
      case 'delete':
        // Excluir banda
        const { error: deleteError } = await supabase
          .from('bandas')
          .delete()
          .eq('id', data.id);
          
        if (deleteError) throw deleteError;
        
        return NextResponse.json({ success: true });
        
      default:
        return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
    }
  } catch (error) {
    console.error('Erro na API de bandas:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    );
  }
}

// Endpoint para lidar com DELETE de uma banda específica
export async function DELETE(request: Request) {
  try {
    // Extrair ID da URL
    const url = new URL(request.url);
    const parts = url.pathname.split('/');
    const id = parts[parts.length - 1];
    
    if (!id) {
      return NextResponse.json({ error: 'ID da banda não fornecido' }, { status: 400 });
    }
    
    console.log(`DELETE: Excluindo banda com ID ${id}`);
    
    // Excluir banda
    const { error: deleteError } = await supabase
      .from('bandas')
      .delete()
      .eq('id', id);
      
    if (deleteError) {
      console.error('Erro ao excluir banda:', deleteError);
      throw deleteError;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro na API DELETE de bandas:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir a banda' },
      { status: 500 }
    );
  }
} 