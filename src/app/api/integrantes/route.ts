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

// Função para formatar o telefone no padrão (99) 99999-9999 ou (99) 9999-9999
function formatarTelefone(telefone: string | null | undefined): string | null {
  if (!telefone) return null;
  
  // Remove todos os caracteres não numéricos
  const numeros = telefone.replace(/\D/g, '');
  
  // Verifica se tem a quantidade correta de dígitos (10 ou 11)
  if (numeros.length < 10 || numeros.length > 11) {
    throw new Error('Telefone deve ter 10 ou 11 dígitos');
  }
  
  // Formata o número
  const ddd = numeros.slice(0, 2);
  const parte1 = numeros.length === 11 ? numeros.slice(2, 7) : numeros.slice(2, 6);
  const parte2 = numeros.slice(-4);
  
  return `(${ddd}) ${parte1}-${parte2}`;
}

// Endpoint único para todas as operações
export async function POST(request: Request) {
  try {
    const { action, data } = await request.json();
    
    console.log('Received request:', { action, data });
    
    switch (action) {
      case 'list':
        // Listar integrantes com suas bandas
        const { data: integrantes, error: listError } = await supabase
          .from('integrantes')
          .select(`
            *,
            integrantes_bandas (
              bandas (
                id,
                nome,
                genero
              )
            )
          `)
          .order('nome');
          
        if (listError) throw listError;
        
        // Formatar os dados para incluir as bandas de forma mais acessível
        const integrantesFormatados = integrantes.map((integrante: any) => ({
          ...integrante,
          bandas: integrante.integrantes_bandas?.map((rel: any) => rel.bandas) || []
        }));
        
        return NextResponse.json(integrantesFormatados);
        
      case 'get':
        // Obter integrante por ID com suas bandas
        const { data: integrante, error: getError } = await supabase
          .from('integrantes')
          .select(`
            *,
            integrantes_bandas (
              banda_id,
              bandas (
                id,
                nome,
                genero
              )
            )
          `)
          .eq('id', data.id)
          .single();
          
        if (getError) throw getError;
        
        return NextResponse.json({ integrante });
        
      case 'create':
        // Criar novo integrante
        const { bandas, ...integranteData } = data;
        
        // 1. Inserir integrante
        const { data: newIntegrante, error: createError } = await supabase
          .from('integrantes')
          .insert([{
            nome: integranteData.nome,
            instrumento: integranteData.instrumento,
            telefone: formatarTelefone(integranteData.telefone),
            email: integranteData.email,
            observacoes: integranteData.observacoes,
            apelido: integranteData.apelido,
            tipo_chave_pix: integranteData.tipo_chave_pix,
            chave_pix: integranteData.chave_pix
          }])
          .select()
          .single();
          
        if (createError) throw createError;
        
        // 2. Se houver bandas selecionadas, criar relações
        if (bandas && bandas.length > 0) {
          const bandasRelations = bandas.map((bandaId: string) => ({
            integrante_id: newIntegrante.id,
            banda_id: bandaId
          }));
          
          const { error: relationError } = await supabase
            .from('integrantes_bandas')
            .insert(bandasRelations);
            
          if (relationError) throw relationError;
        }
        
        return NextResponse.json(newIntegrante);
        
      case 'update':
        // Atualizar integrante
        const { bandas: updateBandas, ...updateData } = data;
        
        // 1. Atualizar dados do integrante
        const { data: updatedIntegrante, error: updateError } = await supabase
          .from('integrantes')
          .update(updateData)
          .eq('id', data.id)
          .select()
          .single();
          
        if (updateError) throw updateError;
        
        // 2. Atualizar relações com bandas
        if (updateBandas) {
          // Primeiro remove todas as relações existentes
          await supabase
            .from('integrantes_bandas')
            .delete()
            .eq('integrante_id', data.id);
          
          // Depois insere as novas relações
          if (updateBandas.length > 0) {
            const newRelations = updateBandas.map((bandaId: string) => ({
              integrante_id: data.id,
              banda_id: bandaId
            }));
            
            const { error: newRelationError } = await supabase
              .from('integrantes_bandas')
              .insert(newRelations);
              
            if (newRelationError) throw newRelationError;
          }
        }
        
        return NextResponse.json({ integrante: updatedIntegrante });
        
      case 'delete':
        // Excluir integrante
        const { error: deleteError } = await supabase
          .from('integrantes')
          .delete()
          .eq('id', data.id);
          
        if (deleteError) throw deleteError;
        
        return NextResponse.json({ success: true });
        
      default:
        return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
    }
  } catch (error) {
    console.error('Erro na API de integrantes:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data: integrantes, error } = await supabase
      .from("integrantes")
      .select(`
        *,
        integrantes_bandas (
          bandas (
            id,
            nome,
            genero
          )
        )
      `)
      .order('nome')

    if (error) throw error

    // Formatar os dados para incluir as bandas de forma mais acessível
    const integrantesFormatados = integrantes.map((integrante: any) => ({
      ...integrante,
      bandas: integrante.integrantes_bandas?.map((rel: any) => rel.bandas) || []
    }))

    return NextResponse.json(integrantesFormatados)
  } catch (error) {
    console.error("Erro ao buscar integrantes:", error)
    return NextResponse.json(
      { error: "Erro ao buscar integrantes" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json();
    const telefoneFormatado = formatarTelefone(updateData.telefone);

    const { data: integrante, error } = await supabase
      .from('integrantes')
      .update({
        nome: updateData.nome,
        instrumento: updateData.instrumento,
        telefone: telefoneFormatado,
        email: updateData.email,
        observacoes: updateData.observacoes,
        apelido: updateData.apelido,
        tipo_chave_pix: updateData.tipo_chave_pix,
        chave_pix: updateData.chave_pix
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Atualizar relações com bandas
    if (updateData.bandas) {
      // Primeiro, remover todas as relações existentes
      const { error: delError } = await supabase
        .from('integrantes_bandas')
        .delete()
        .eq('integrante_id', id);

      if (delError) throw delError;

      // Depois, adicionar as novas relações
      if (updateData.bandas.length > 0) {
        const relacoes = updateData.bandas.map((bandaId: string) => ({
          integrante_id: id,
          banda_id: bandaId
        }));

        const { error: relError } = await supabase
          .from('integrantes_bandas')
          .insert(relacoes);

        if (relError) throw relError;
      }
    }

    return NextResponse.json({ integrante });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    throw error;
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    // Primeiro, remover todas as relações com bandas
    const { error: relError } = await supabase
      .from('integrantes_bandas')
      .delete()
      .eq('integrante_id', id);

    if (relError) throw relError;

    // Depois, remover o integrante
    const { error } = await supabase
      .from('integrantes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir integrante:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir integrante' },
      { status: 500 }
    );
  }
} 