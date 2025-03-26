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
    const { data: musicas, error } = await supabase
      .from("musicas")
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
      .order('titulo')

    if (error) throw error

    // Formatar os dados para incluir as bandas de forma mais acessível
    const musicasFormatadas = musicas.map((musica: any) => ({
      ...musica,
      bandas: musica.musicas_bandas?.map((rel: any) => rel.bandas) || []
    }))

    return NextResponse.json(musicasFormatadas)
  } catch (error) {
    console.error("Erro ao buscar músicas:", error)
    return NextResponse.json(
      { error: "Erro ao buscar as músicas" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { action, data } = await request.json()

    switch (action) {
      case 'create': {
        const { bandas, ...musicaData } = data
        
        // 1. Inserir música
        const { data: newMusica, error: createError } = await supabase
          .from('musicas')
          .insert([{
            titulo: musicaData.titulo,
            artista: musicaData.artista,
            genero: musicaData.genero || '',
            duracao: musicaData.duracao || '',
            tom: musicaData.tom || '',
            bpm: musicaData.bpm || '',
            observacoes: musicaData.observacoes || '',
            link_letra: musicaData.link_letra || '',
            link_cifra: musicaData.link_cifra || '',
            link_mp3: musicaData.link_mp3 || '',
            link_vs: musicaData.link_vs || '',
            status_vs: musicaData.status_vs || 'Não Tem'
          }])
          .select()
          .single()
          
        if (createError) {
          console.error('Erro ao criar música:', createError)
          throw createError
        }
        
        // 2. Se houver bandas selecionadas, criar relações
        if (bandas && bandas.length > 0) {
          const bandasRelations = bandas.map((bandaId: string) => ({
            musica_id: newMusica.id,
            banda_id: bandaId
          }))
          
          const { error: relationError } = await supabase
            .from('musicas_bandas')
            .insert(bandasRelations)
            
          if (relationError) {
            console.error('Erro ao criar relações com bandas:', relationError)
            throw relationError
          }
        }
        
        return NextResponse.json(newMusica)
      }
        
      default:
        return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
    }
  } catch (error) {
    console.error('Erro na API de músicas:', error)
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json()

    const { data: musica, error } = await supabase
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
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Atualizar relações com bandas
    if (updateData.bandas) {
      // Primeiro, remover todas as relações existentes
      const { error: delError } = await supabase
        .from('musicas_bandas')
        .delete()
        .eq('musica_id', id)

      if (delError) throw delError

      // Depois, adicionar as novas relações
      if (updateData.bandas.length > 0) {
        const relacoes = updateData.bandas.map((bandaId: string) => ({
          musica_id: id,
          banda_id: bandaId
        }))

        const { error: relError } = await supabase
          .from('musicas_bandas')
          .insert(relacoes)

        if (relError) throw relError
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

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return NextResponse.json(
        { error: 'ID da música não fornecido' },
        { status: 400 }
      )
    }

    // Primeiro, remover as relações com bandas
    const { error: relError } = await supabase
      .from('musicas_bandas')
      .delete()
      .eq('musica_id', id)

    if (relError) throw relError

    // Depois, remover a música
    const { error } = await supabase
      .from('musicas')
      .delete()
      .eq('id', id)

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