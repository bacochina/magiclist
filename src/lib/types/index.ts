export interface Banda {
  id: string;
  nome: string;
  genero: string;
  descricao?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pedaleira {
  id: string;
  nome: string;
  bancos: BancoPedaleira[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BancoPedaleira {
  id: string;
  numero: number; // 1 até 999
  descricao?: string;
  pedaleira_id: string;
  patches: PatchPedaleira[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PatchPedaleira {
  id: string;
  numero: number; // 1 até 9
  letra: string; // A até Z
  tipo: 'Clean' | 'Drive' | 'Distortion' | 'Fuzz' | 'Solo';
  descricao?: string;
  banco_id: string;
  musicas: Musica[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Musica {
  id: string;
  nome: string;
  artista: string;
  tom: string;
  bpm: number;
  bandaId: string;
  createdAt: Date;
  updatedAt: Date;
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