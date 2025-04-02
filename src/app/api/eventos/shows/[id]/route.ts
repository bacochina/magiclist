import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'

// Usar variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Verificar se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: Variáveis de ambiente do Supabase não encontradas')
  throw new Error('Configuração do Supabase incompleta')
}

// Criar cliente Supabase uma única vez
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do show não fornecido' },
        { status: 400 }
      )
    }

    const { data: show, error } = await supabase
      .from('shows')
      .select(`
        *,
        bandas (
          id,
          nome,
          genero
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.message.includes('não encontrado') || error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Show não encontrado' },
          { status: 404 }
        )
      }
      throw error
    }

    // Formatar os dados para incluir a banda de forma mais acessível
    const showFormatado = {
      ...show,
      banda: show.bandas
    }

    return NextResponse.json(showFormatado)
  } catch (error) {
    console.error(`Erro ao buscar show com ID ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Erro ao buscar o show' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const updateData = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do show não fornecido' },
        { status: 400 }
      )
    }

    const { data: show, error } = await supabase
      .from('shows')
      .update({
        banda_id: updateData.banda_id,
        data: updateData.data,
        local: updateData.local || '',
        contato: updateData.contato || '',
        telefone_contato: updateData.telefone_contato || '',
        status: updateData.status,
        cache_bruto: updateData.cache_bruto || '',
        observacoes: updateData.observacoes || ''
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(show)
  } catch (error) {
    console.error(`Erro ao atualizar show com ID ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Erro ao atualizar o show' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do show não fornecido' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('shows')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Erro ao excluir show com ID ${params.id}:`, error)
    return NextResponse.json(
      { error: 'Erro ao excluir o show' },
      { status: 500 }
    )
  }
} 