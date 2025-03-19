import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// URL e chave estáticas hardcoded
const supabaseUrl = 'https://nlubmklrriltyjagmsig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sdWJta2xycmlsdHlqYWdtc2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDYzMjExMDYsImV4cCI6MTk2MTg5NzEwNn0.zMQIjoHLO3U8EgL9qOQJ7E8SEHQVSVuSzXTXNgO1Uk4';

// Endpoint único para todas as operações
export async function POST(request: Request) {
  try {
    // Criar cliente diretamente
    const client = createClient(supabaseUrl, supabaseKey);
    
    const { action, data } = await request.json();
    
    console.log('Received request:', { action, data });
    
    switch (action) {
      case 'list':
        // Listar bandas
        const { data: bandas, error: listError } = await client
          .from('bandas')
          .select('*')
          .order('nome');
          
        if (listError) {
          return NextResponse.json({ error: listError.message }, { status: 500 });
        }
        
        return NextResponse.json({ bandas });
        
      case 'get':
        // Obter banda por ID
        const { data: banda, error: getError } = await client
          .from('bandas')
          .select('*')
          .eq('id', data.id)
          .single();
          
        if (getError) {
          return NextResponse.json({ error: getError.message }, { status: 404 });
        }
        
        return NextResponse.json({ banda });
        
      case 'create':
        // Criar nova banda
        const { data: newBanda, error: createError } = await client
          .from('bandas')
          .insert([{
            nome: data.nome,
            genero: data.genero,
            descricao: data.descricao || null
          }])
          .select()
          .single();
          
        if (createError) {
          console.error('Erro ao criar banda:', createError);
          return NextResponse.json({ error: createError.message }, { status: 500 });
        }
        
        return NextResponse.json({ banda: newBanda }, { status: 201 });
        
      case 'update':
        // Atualizar banda
        const { data: updatedBanda, error: updateError } = await client
          .from('bandas')
          .update({
            nome: data.nome,
            genero: data.genero,
            descricao: data.descricao
          })
          .eq('id', data.id)
          .select()
          .single();
          
        if (updateError) {
          return NextResponse.json({ error: updateError.message }, { status: 500 });
        }
        
        return NextResponse.json({ banda: updatedBanda });
        
      case 'delete':
        // Excluir banda
        const { error: deleteError } = await client
          .from('bandas')
          .delete()
          .eq('id', data.id);
          
        if (deleteError) {
          return NextResponse.json({ error: deleteError.message }, { status: 500 });
        }
        
        return NextResponse.json({ success: true });
        
      default:
        return NextResponse.json({ error: 'Ação não reconhecida' }, { status: 400 });
    }
  } catch (error) {
    console.error('Erro na API de bandas:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
} 