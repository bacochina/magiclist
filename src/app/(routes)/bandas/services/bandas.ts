import { supabase } from "@/lib/supabase"
import type { Banda } from "../types"

export async function getBandas(): Promise<Banda[]> {
  const { data, error } = await supabase
    .from("bandas")
    .select("*")
    .order("nome", { ascending: true })

  if (error) {
    console.error("Erro ao buscar bandas:", error)
    return []
  }

  return data
}

export async function getBanda(id: string): Promise<Banda | null> {
  const { data, error } = await supabase
    .from("bandas")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Erro ao buscar banda:", error)
    return null
  }

  return data
}

export async function createBanda(banda: Partial<Banda>): Promise<Banda> {
  const { data, error } = await supabase
    .from("bandas")
    .insert([banda])
    .select()
    .single()

  if (error) {
    console.error("Erro ao criar banda:", error)
    throw error
  }

  return data
}

export async function updateBanda(id: string, banda: Partial<Banda>): Promise<Banda> {
  const { data, error } = await supabase
    .from("bandas")
    .update(banda)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Erro ao atualizar banda:", error)
    throw error
  }

  return data
}

export async function deleteBanda(id: string): Promise<void> {
  const { error } = await supabase
    .from("bandas")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Erro ao excluir banda:", error)
    throw error
  }
} 