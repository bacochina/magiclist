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

export interface Integrante {
  id: string;
  nome: string;
  funcao: string;
  telefone?: string;
  email?: string;
  observacoes?: string;
  bandasIds: string[]; // IDs das bandas que o integrante participa
}

// Tipos de eventos
export type TipoEvento = 'show' | 'ensaio' | 'reuniao';

// Status do evento
export type StatusEvento = 'agendado' | 'confirmado' | 'cancelado' | 'concluido';

export interface Repertorio {
  id: string;
  nome: string;
  descricao?: string;
  bandaId?: string;
  blocos?: string[]; // IDs dos blocos no repertório
  createdAt?: string;
  updatedAt?: string;
}

// Interface para Evento
export interface Evento {
  id: string;
  titulo: string;
  tipo: TipoEvento;
  data: string; // ISO date string
  horaInicio: string;
  horaFim: string;
  local: string;
  endereco?: string;
  bandaId?: string; // Opcional, pois reuniões podem não estar associadas a uma banda específica
  integrantesIds: string[]; // IDs dos integrantes que participarão
  status: StatusEvento;
  descricao?: string;
  
  // Campos específicos para shows
  valorCache?: number;
  custos?: { descricao: string; valor: string }[];
  qtdeIntegrantes?: number;
  contatoLocal?: string;
  telefoneLocal?: string;
  contatoTecnico?: string;
  telefoneTecnico?: string;
  observacoesContato?: string;
  horarioPassagemSom?: string;
  observacoesShow?: string;
  repertorioId?: string; // ID do repertório que será usado
  equipamentosNecessarios?: { descricao: string; quantidade: number }[];
  equipamentosExistentes?: { descricao: string; quantidade: number }[];
  
  // Campos específicos para ensaios
  pautaEnsaio?: string;
  objetivosEnsaio?: string;
  musicasEnsaio?: string[]; // IDs das músicas a serem ensaiadas
  
  // Campos específicos para reuniões
  pautaReuniao?: string;
  ataReuniao?: string;
  decisoesTomadas?: string[];
  observacoesEquipamentos?: string;
  temViagem?: boolean;
  itensViagem?: {
    data: string;
    descricao: string;
    valor: number;
    responsavelCusto: string;
  }[];
  hospedagem?: {
    local: string;
    endereco?: string;
    dataCheckIn: string;
    dataCheckOut: string;
    horaCheckIn: string;
    horaCheckOut: string;
    valor: number;
    responsavelCusto: string;
    numeroRecepcao?: string;
    incluiCafe: boolean;
    horarioCafeInicio?: string;
    horarioCafeFim?: string;
    incluiAlmoco: boolean;
    horarioAlmocoInicio?: string;
    horarioAlmocoFim?: string;
    incluiJantar: boolean;
    horarioJantarInicio?: string;
    horarioJantarFim?: string;
    observacoes?: string;
    contatoHotel?: string;
    telefoneHotel?: string;
    redeWifi?: string;
    senhaWifi?: string;
    quartos?: {
      numero: string;
      andar: string;
      ocupantes: string[];
    }[];
  };
}

export interface Bloco {
  id: string;
  nome: string;
  descricao?: string;
  bandaId?: string;
  musicas: string[]; // IDs das músicas no bloco
} 