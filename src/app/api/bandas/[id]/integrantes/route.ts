import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Usar variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Verificar se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: Variáveis de ambiente do Supabase não encontradas');
  throw new Error('Configuração do Supabase incompleta');
}

// Criar cliente Supabase uma única vez
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bandaId = params.id;
    console.log(`API: Buscando integrantes para a banda ${bandaId}`);
    
    // Buscar integrantes da banda usando a tabela de junção (estratégia 1)
    const { data: integrantes, error } = await supabase
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
      .eq('banda_id', bandaId);
      
    if (error) {
      console.error('Erro no Supabase:', error);
      throw error;
    }
    
    console.log(`API: Encontrados ${integrantes?.length || 0} integrantes`);
    
    if (!integrantes || integrantes.length === 0) {
      console.log('API: Nenhum integrante encontrado, usando estratégia alternativa');
      
      // Estratégia 2: Buscar diretamente na tabela de integrantes usando os IDs da tabela de junção
      const { data: integrantesBandas, error: errorJuncao } = await supabase
        .from('integrantes_bandas')
        .select('integrante_id')
        .eq('banda_id', bandaId);
        
      if (errorJuncao) {
        console.error('Erro ao buscar IDs de integrantes:', errorJuncao);
        throw errorJuncao;
      }
      
      if (!integrantesBandas || integrantesBandas.length === 0) {
        console.log('API: Nenhum ID de integrante encontrado na tabela de junção');
        return NextResponse.json([]);
      }
      
      const integrantesIds = integrantesBandas.map(item => item.integrante_id);
      console.log('API: IDs de integrantes encontrados:', integrantesIds);
      
      const { data: integrantesDireto, error: errorIntegrantes } = await supabase
        .from('integrantes')
        .select('id, nome, instrumento, apelido')
        .in('id', integrantesIds);
        
      if (errorIntegrantes) {
        console.error('Erro ao buscar integrantes diretamente:', errorIntegrantes);
        throw errorIntegrantes;
      }
      
      console.log('API: Integrantes encontrados diretamente:', JSON.stringify(integrantesDireto));
      return NextResponse.json(integrantesDireto || []);
    }
    
    console.log('API: Dados brutos:', JSON.stringify(integrantes));
    
    // Formatar os dados para retornar apenas as informações dos integrantes
    const integrantesFormatados = integrantes.map((item: any) => {
      if (!item.integrantes) {
        console.error('API: Item de integrante inválido:', item);
        return null;
      }
      
      return {
        id: item.integrantes.id,
        nome: item.integrantes.nome,
        instrumento: item.integrantes.instrumento,
        apelido: item.integrantes.apelido
      };
    }).filter(Boolean); // Remove valores nulos
    
    console.log('API: Dados formatados:', JSON.stringify(integrantesFormatados));
    
    return NextResponse.json(integrantesFormatados);
  } catch (error) {
    console.error('Erro ao buscar integrantes da banda:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar integrantes da banda' },
      { status: 500 }
    );
  }
}

// Adicionando endpoint POST para permitir outro método de acesso
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bandaId = params.id;
    console.log(`API POST: Buscando integrantes para a banda ${bandaId}`);
    
    // Buscar diretamente todos os integrantes da banda (abordagem simplificada)
    const { data, error } = await supabase
      .from('integrantes_bandas')
      .select(`
        banda_id,
        integrante_id,
        integrantes (*)
      `)
      .eq('banda_id', bandaId);
    
    if (error) {
      console.error('Erro no Supabase (POST):', error);
      throw error;
    }
    
    console.log(`API POST: Resultado bruto: ${JSON.stringify(data)}`);
    
    if (!data || data.length === 0) {
      console.log('API POST: Nenhum integrante encontrado');
      return NextResponse.json([]);
    }
    
    // Formatar os dados mais simplesmente
    const integrantesFormatados = data
      .filter(item => item.integrantes)
      .map(item => item.integrantes);
    
    console.log(`API POST: Integrantes formatados: ${JSON.stringify(integrantesFormatados)}`);
    
    return NextResponse.json(integrantesFormatados);
  } catch (error) {
    console.error('Erro ao buscar integrantes (POST):', error);
    return NextResponse.json(
      { error: 'Erro ao buscar integrantes da banda' },
      { status: 500 }
    );
  }
} 