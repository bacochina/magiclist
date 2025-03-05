export interface Banda {
  id: string;
  nome: string;
  genero: string;
  descricao?: string;
}

export interface Pedaleira {
  id: string;
  nome: string;
  marca: string;
  usaLetras: boolean;
  qtdeBancos: number;
  qtdePresetsporBanco: number;
  bancos: BancoPedaleira[];
}

export interface BancoPedaleira {
  id: string;
  numero: number;
  descricao: string;
  patches: PatchPedaleira[];
}

export interface PatchPedaleira {
  id: string;
  numero: number;
  letra: string;
  tipo: 'Clean' | 'Drive' | 'Distortion' | 'Fuzz' | 'Solo';
  descricao: string;
  musicas: string[];
}

export interface Musica {
  id: string;
  nome: string;
  artista: string;
  tom: string;
  bpm?: number;
  dicas?: string[];
}

export interface BlocoMusical {
  id: string;
  nome: string;
  descricao?: string;
  bandaId: string;
  musicas: Musica[];
}

export interface Repertorio {
  id: string;
  nome: string;
  data: Date;
  bandaId: string;
  blocos: BlocoMusical[];
  observacoes?: string;
} 