export type Banda = {
  id: string;
  nome: string;
  genero: string;
  descricao?: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface Pedaleira {
  id: string;
  nome: string;
  bancos: BancoPedaleira[];
}

export interface BancoPedaleira {
  id: string;
  numero: number; // 1-999
  descricao: string;
  patches: PatchPedaleira[];
}

export interface PatchPedaleira {
  id: string;
  numero: number; // 1-9
  letra: string; // A-Z
  tipo: 'Clean' | 'Drive' | 'Distortion' | 'Fuzz' | 'Solo';
  descricao: string;
  musicas: string[]; // IDs das músicas
}

export interface Musica {
  id: string;
  nome: string;
  artista: string;
  tom: string;
}

export interface BlocoMusical {
  id: string;
  nome: string;
  descricao?: string;
  bandaId: string;
  musicas: Musica[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Repertorio {
  id: string;
  nome: string;
  data: Date;
  bandaId: string;
  blocos: BlocoMusical[];
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
} 