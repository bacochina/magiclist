import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    const { data: integrante, error } = await supabase
      .from("integrantes")
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
      .eq("id", params.id)
      .single()

    if (error) throw error

    if (!integrante) {
      return new NextResponse("Integrante não encontrado", { status: 404 })
    }

    return NextResponse.json(integrante)
  } catch (error) {
    console.error("[INTEGRANTE_GET]", error)
    return new NextResponse("Erro interno do servidor", { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const body = await request.json()
    
    console.log('Dados recebidos:', body)
    
    const { bandas, ...updateData } = body

    // Garantir que os novos campos estejam incluídos no updateData
    // apelido, tipo_chave_pix e chave_pix já estarão incluídos no ...updateData

    console.log('Bandas para atualizar:', bandas)
    console.log('Dados para atualizar:', updateData)

    // 1. Atualizar dados do integrante
    const { data: integrante, error: updateError } = await supabase
      .from("integrantes")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (updateError) {
      console.error('Erro ao atualizar integrante:', updateError)
      throw updateError
    }

    // 2. Atualizar relações com bandas
    // Primeiro, remover todas as relações existentes
    const { error: delError } = await supabase
      .from("integrantes_bandas")
      .delete()
      .eq("integrante_id", params.id)

    if (delError) {
      console.error('Erro ao deletar relações:', delError)
      throw delError
    }

    // Depois, adicionar as novas relações se houver bandas
    if (bandas && bandas.length > 0) {
      const relacoes = bandas.map((bandaId: string) => ({
        integrante_id: params.id,
        banda_id: bandaId
      }))

      console.log('Inserindo novas relações:', relacoes)

      const { error: relError } = await supabase
        .from("integrantes_bandas")
        .insert(relacoes)

      if (relError) {
        console.error('Erro ao inserir relações:', relError)
        throw relError
      }
    }

    // 3. Buscar o integrante atualizado com suas bandas
    const { data: updatedIntegrante, error: getError } = await supabase
      .from("integrantes")
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
      .eq("id", params.id)
      .single()

    if (getError) throw getError

    return NextResponse.json(updatedIntegrante)
  } catch (error) {
    console.error("[INTEGRANTE_UPDATE]", error)
    return new NextResponse(
      JSON.stringify({ error: "Erro ao atualizar integrante" }), 
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from("integrantes")
      .delete()
      .eq("id", params.id)

    if (error) throw error

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[INTEGRANTE_DELETE]", error)
    return new NextResponse("Erro interno do servidor", { status: 500 })
  }
} 