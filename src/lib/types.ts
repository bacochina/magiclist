export interface Musica {
  id: string;
  nome: string;
  artista: string;
  tom: string;
  bpm: number;
  observacoes?: string;
}

export interface Banda {
  id: string;
  nome: string;
  genero: string;
  descricao?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Bloco {
  id: string;
  nome: string;
  descricao?: string;
  bandaId: string;
  musicas: Musica[];
} 