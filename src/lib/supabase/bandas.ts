import { supabase } from '@/lib/supabase';
import { Banda } from '@/lib/types';

/**
 * Busca todas as bandas
 */
export async function getBandas(): Promise<Banda[]> {
  try {
    const { data, error } = await supabase
      .from('bandas')
      .select('*')
      .order('nome');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar bandas:', error);
    return [];
  }
}

/**
 * Busca uma banda pelo ID
 */
export async function getBandaById(id: string): Promise<Banda | null> {
  try {
    const { data, error } = await supabase
      .from('bandas')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Erro ao buscar banda com ID ${id}:`, error);
    return null;
  }
}

/**
 * Adiciona uma nova banda
 */
export async function addBanda(banda: Banda): Promise<Banda | null> {
  try {
    // Remover o id para que o Supabase gere um novo
    const { id, ...bandaSemId } = banda;
    
    const { data, error } = await supabase
      .from('bandas')
      .insert(bandaSemId)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erro ao adicionar banda:', error);
    return null;
  }
}

/**
 * Atualiza uma banda existente
 */
export async function updateBanda(id: string, banda: Partial<Banda>): Promise<Banda | null> {
  try {
    const { data, error } = await supabase
      .from('bandas')
      .update({ ...banda })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Erro ao atualizar banda com ID ${id}:`, error);
    return null;
  }
}

/**
 * Remove uma banda
 */
export async function deleteBanda(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('bandas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Erro ao excluir banda com ID ${id}:`, error);
    return false;
  }
} 