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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: musica, error } = await supabase
      .from('musicas')
      .select(`
        *,
        musicas_bandas (
          bandas (
            id,
            nome,
            genero
          )
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) throw error

    // Formatar os dados para incluir as bandas de forma mais acessível
    const musicaFormatada = {
      ...musica,
      bandas: musica.musicas_bandas?.map((rel: any) => rel.bandas) || []
    }

    return NextResponse.json(musicaFormatada)
  } catch (error) {
    console.error('Erro ao buscar música:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar música' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updateData = await request.json()

    // 1. Atualizar dados da música
    const { data: musica, error: updateError } = await supabase
      .from('musicas')
      .update({
        titulo: updateData.titulo,
        artista: updateData.artista,
        genero: updateData.genero || '',
        duracao: updateData.duracao || '',
        tom: updateData.tom || '',
        bpm: updateData.bpm || '',
        observacoes: updateData.observacoes || '',
        link_letra: updateData.link_letra || '',
        link_cifra: updateData.link_cifra || '',
        link_mp3: updateData.link_mp3 || '',
        link_vs: updateData.link_vs || '',
        status_vs: updateData.status_vs || 'Não Tem'
      })
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) {
      console.error('Erro ao atualizar música:', updateError)
      throw updateError
    }

    // 2. Atualizar relações com bandas
    if (updateData.bandas) {
      // Primeiro, remover todas as relações existentes
      const { error: delError } = await supabase
        .from('musicas_bandas')
        .delete()
        .eq('musica_id', params.id)

      if (delError) {
        console.error('Erro ao remover relações antigas:', delError)
        throw delError
      }

      // Depois, adicionar as novas relações
      if (updateData.bandas.length > 0) {
        const relacoes = updateData.bandas.map((bandaId: string) => ({
          musica_id: params.id,
          banda_id: bandaId
        }))

        const { error: relError } = await supabase
          .from('musicas_bandas')
          .insert(relacoes)

        if (relError) {
          console.error('Erro ao criar novas relações:', relError)
          throw relError
        }
      }
    }

    return NextResponse.json({ musica })
  } catch (error) {
    console.error('Erro ao atualizar música:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar música' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Primeiro, remover as relações com bandas
    const { error: relError } = await supabase
      .from('musicas_bandas')
      .delete()
      .eq('musica_id', params.id)

    if (relError) throw relError

    // Depois, remover a música
    const { error } = await supabase
      .from('musicas')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir música:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir música' },
      { status: 500 }
    )
  }
} 