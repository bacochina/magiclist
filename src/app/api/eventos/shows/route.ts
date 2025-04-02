import { NextResponse } from 'next/server';
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

export async function GET() {
  try {
    const { data: shows, error } = await supabase
      .from("shows")
      .select(`
        *,
        bandas (
          id,
          nome,
          genero
        )
      `)
      .order('data', { ascending: false })

    if (error) throw error

    // Formatar os dados para incluir a banda de forma mais acessível
    const showsFormatados = shows.map((show: any) => ({
      ...show,
      banda: show.bandas
    }))

    return NextResponse.json(showsFormatados)
  } catch (error) {
    console.error("Erro ao buscar shows:", error)
    return NextResponse.json(
      { error: "Erro ao buscar os shows" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const showData = await request.json()
    
    // Inserir show
    const { data: newShow, error } = await supabase
      .from('shows')
      .insert([{
        banda_id: showData.banda_id,
        data: showData.data,
        local: showData.local || '',
        contato: showData.contato || '',
        telefone_contato: showData.telefone_contato || '',
        status: showData.status,
        cache_bruto: showData.cache_bruto || '',
        observacoes: showData.observacoes || ''
      }])
      .select()
      .single()
      
    if (error) {
      console.error('Erro ao criar show:', error)
      throw error
    }
    
    return NextResponse.json(newShow)
  } catch (error) {
    console.error('Erro na API de shows:', error)
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json()
    
    // Validar ID
    if (!id) {
      return NextResponse.json(
        { error: "ID do show não fornecido" },
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
    console.error('Erro ao atualizar show:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar show' },
      { status: 500 }
    )
  }
} 