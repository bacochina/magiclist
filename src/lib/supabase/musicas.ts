import { supabase } from '@/lib/supabase';
import { Musica, SupabaseMusica, MusicaArtista, MusicaTag } from '@/lib/types';

/**
 * Converte uma música do formato Supabase para o formato da aplicação
 */
export function supabaseMusicaToMusica(supabaseMusica: SupabaseMusica): Musica {
  return {
    id: supabaseMusica.id,
    // Preferimos os campos específicos da aplicação se estiverem presentes
    nome: supabaseMusica.nome || supabaseMusica.titulo,
    artista: supabaseMusica.artista,
    tom: supabaseMusica.tom || '',
    bpm: supabaseMusica.bpm || 0,
    observacoes: supabaseMusica.observacoes,
    
    // Campos específicos do Supabase
    titulo: supabaseMusica.titulo,
    album: supabaseMusica.album,
    duracao: supabaseMusica.duracao,
    ano_lancamento: supabaseMusica.ano_lancamento,
    genero: supabaseMusica.genero,
    url_streaming: supabaseMusica.url_streaming,
    url_download: supabaseMusica.url_download,
    url_capa: supabaseMusica.url_capa,
    letra: supabaseMusica.letra,
    classificacao: supabaseMusica.classificacao,
    created_at: supabaseMusica.created_at,
    updated_at: supabaseMusica.updated_at,
    user_id: supabaseMusica.user_id
  };
}

/**
 * Converte uma música do formato da aplicação para o formato Supabase
 */
export function musicaToSupabaseMusica(musica: Musica): SupabaseMusica {
  return {
    id: musica.id,
    titulo: musica.titulo || musica.nome,
    artista: musica.artista,
    album: musica.album,
    duracao: musica.duracao,
    ano_lancamento: musica.ano_lancamento,
    genero: musica.genero,
    url_streaming: musica.url_streaming,
    url_download: musica.url_download,
    url_capa: musica.url_capa,
    letra: musica.letra,
    classificacao: musica.classificacao,
    created_at: musica.created_at || new Date().toISOString(),
    updated_at: musica.updated_at || new Date().toISOString(),
    user_id: musica.user_id || '',
    
    // Campos específicos da aplicação
    nome: musica.nome,
    tom: musica.tom,
    bpm: musica.bpm,
    observacoes: musica.observacoes
  };
}

/**
 * Busca todas as músicas
 */
export async function getMusicas(): Promise<Musica[]> {
  try {
    const { data, error } = await supabase
      .from('musicas')
      .select('*')
      .order('titulo');
    
    if (error) throw error;
    
    return data.map(supabaseMusicaToMusica);
  } catch (error) {
    console.error('Erro ao buscar músicas:', error);
    return [];
  }
}

/**
 * Busca uma música pelo ID
 */
export async function getMusicaById(id: string): Promise<Musica | null> {
  try {
    const { data, error } = await supabase
      .from('musicas')
      .select(`
        *,
        musicas_artistas(*),
        musicas_tags(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) return null;
    
    const musica = supabaseMusicaToMusica(data);
    
    // Adicionar dados de artistas e tags
    if (data.musicas_artistas) {
      musica.artistas = data.musicas_artistas;
    }
    
    if (data.musicas_tags) {
      musica.tags = data.musicas_tags;
    }
    
    return musica;
  } catch (error) {
    console.error(`Erro ao buscar música com ID ${id}:`, error);
    return null;
  }
}

/**
 * Adiciona uma nova música
 */
export async function addMusica(musica: Musica): Promise<Musica | null> {
  try {
    // Converter para o formato do Supabase
    const supabaseMusica = musicaToSupabaseMusica(musica);
    
    // Remover o id para que o Supabase gere um novo
    const { id, ...musicaSemId } = supabaseMusica;
    
    const { data, error } = await supabase
      .from('musicas')
      .insert(musicaSemId)
      .select()
      .single();
    
    if (error) throw error;
    
    return supabaseMusicaToMusica(data);
  } catch (error) {
    console.error('Erro ao adicionar música:', error);
    return null;
  }
}

/**
 * Atualiza uma música existente
 */
export async function updateMusica(id: string, musica: Partial<Musica>): Promise<Musica | null> {
  try {
    // Preparar dados para atualização - apenas os campos do Supabase
    const supabaseMusica = musicaToSupabaseMusica({
      ...musica,
      id
    } as Musica);
    
    // Remover campos que não devem ser atualizados
    const { created_at, user_id, ...updateData } = supabaseMusica;
    
    const { data, error } = await supabase
      .from('musicas')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return supabaseMusicaToMusica(data);
  } catch (error) {
    console.error(`Erro ao atualizar música com ID ${id}:`, error);
    return null;
  }
}

/**
 * Remove uma música
 */
export async function deleteMusica(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('musicas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Erro ao excluir música com ID ${id}:`, error);
    return false;
  }
}

/**
 * Adiciona um artista à música
 */
export async function addArtistaToMusica(musicaId: string, nomeArtista: string, tipo: string = 'principal'): Promise<MusicaArtista | null> {
  try {
    const { data, error } = await supabase
      .from('musicas_artistas')
      .insert({
        musica_id: musicaId,
        nome_artista: nomeArtista,
        tipo
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Erro ao adicionar artista à música ${musicaId}:`, error);
    return null;
  }
}

/**
 * Adiciona uma tag à música
 */
export async function addTagToMusica(musicaId: string, tag: string): Promise<MusicaTag | null> {
  try {
    const { data, error } = await supabase
      .from('musicas_tags')
      .insert({
        musica_id: musicaId,
        tag
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Erro ao adicionar tag à música ${musicaId}:`, error);
    return null;
  }
}

/**
 * Remove um artista da música
 */
export async function removeArtistaFromMusica(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('musicas_artistas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Erro ao remover artista com ID ${id}:`, error);
    return false;
  }
}

/**
 * Remove uma tag da música
 */
export async function removeTagFromMusica(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('musicas_tags')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Erro ao remover tag com ID ${id}:`, error);
    return false;
  }
} 