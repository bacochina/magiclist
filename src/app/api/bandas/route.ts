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
        
        return NextResponse.json({ banda });
        
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