export interface Musica {
  id: string;
  nome: string;
  artista: string;
  tom: string;
  bpm: number;
  observacoes?: string;
  bandasIds?: string[]; // IDs das bandas que tocam essa música
}

export interface Banda {
  id: string;
  nome: string;
  genero: string;
  descricao?: string;
  created_at?: string;
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

// Interfaces para o Show
export interface ContatoShow {
  id?: string;
  nome: string;
  funcao: 'contratante' | 'tecnico' | 'produtor' | 'outro';
  telefone: string;
  email: string;
  observacoes?: string;
}

export interface EquipamentoShow {
  id?: string;
  tipo: 'instrumento' | 'som' | 'luz' | 'estrutura' | 'outro';
  nome: string;
  quantidade: number;
  fornecedor: string;
  valorAluguel?: number;
  responsavel?: string;
  observacoes?: string;
}

interface Hospede {
  nome: string;
  telefone: string;
}

interface Quarto {
  numero: string;
  andar: string;
  tipo: 'standard' | 'superior' | 'luxo' | 'suite';
  hospedes: Hospede[];
  ssidWifi: string;
  senhaWifi: string;
}

export interface HospedagemShow {
  id?: string;
  tipo: 'hotel' | 'pousada' | 'airbnb' | 'outro';
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  checkInData: string;
  checkInHora: string;
  checkOutData: string;
  checkOutHora: string;
  numeroQuartos: number;
  valorDiaria: number;
  incluiCafe: boolean;
  ramalRecepcao?: string;
  ramalCozinha?: string;
  ssidWifi?: string;
  senhaWifi?: string;
  quartos: Quarto[];
  observacoes?: string;
}

export interface CustoShow {
  id?: string;
  categoria: 'cachê' | 'transporte' | 'alimentacao' | 'equipamento' | 'hospedagem' | 'outros';
  descricao: string;
  valor: number;
  formaPagamento: 'dinheiro' | 'pix' | 'transferencia' | 'cartao' | 'outro';
  status: 'pendente' | 'pago' | 'cancelado';
  dataPagamento?: string;
  observacoes?: string;
}

// Interface para Evento
export interface Evento {
  id: string;
  titulo: string;
  tipo: 'show' | 'ensaio' | 'reuniao';
  data: string;
  horaInicio: string;
  horaFim: string;
  local: string;
  endereco?: string;
  bandaId?: string;
  integrantesIds?: string[];
  status: 'agendado' | 'confirmado' | 'cancelado' | 'realizado';
  descricao?: string;
  
  // Campos específicos para shows
  valorCache?: string;
  qtdeIntegrantes?: number;
  contatoLocal?: string;
  telefoneLocal?: string;
  contatoTecnico?: string;
  telefoneTecnico?: string;
  observacoesShow?: string;
  horarioPassagemSom?: string;
  repertorioId?: string;
  equipamentosNecessarios?: { descricao: string; quantidade: number }[];
  equipamentosExistentes?: { descricao: string; quantidade: number }[];
  observacoesEquipamentos?: string;
  
  // Campos específicos para ensaios
  pautaEnsaio?: string;
  objetivosEnsaio?: string;
  musicasEnsaio?: string[];
  
  // Campos específicos para reuniões
  pautaReuniao?: string;
  ataReuniao?: string;
  decisoesTomadas?: string[];
  
  // Novos campos para contatos, equipamentos, hospedagem e custos
  contatos?: ContatoShow[];
  equipamentos?: EquipamentoShow[];
  hospedagem?: HospedagemShow;
  custos?: CustoShow[];
}

export interface Bloco {
  id: string;
  nome: string;
  descricao?: string;
  bandaId?: string;
  musicas: string[]; // IDs das músicas no bloco
}

export interface ShowEvento {
  id: string;
  titulo: string;
  tipo: 'show' | 'ensaio' | 'reuniao';
  data: string;
  local: string;
  status: 'agendado' | 'confirmado' | 'cancelado' | 'realizado';
  contatos?: ContatoShow[];
  equipamentos?: EquipamentoShow[];
  hospedagem?: HospedagemShow;
  custos?: CustoShow[];
  horaInicio?: string;
  horaFim?: string;
  banda?: {
    id: string;
    nome: string;
  };
  integrantes?: {
    id: string;
    nome: string;
    funcao: string;
    freelancer?: boolean;
  }[];
  valor?: string;
  descricao?: string;
  observacoes?: string;
} 