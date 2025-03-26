import { Evento, TipoEvento, StatusEvento } from '@/lib/types';
import { format, addMonths, addDays } from 'date-fns';

// Função para gerar um ID aleatório
const gerarId = () => Math.random().toString(36).substr(2, 9);

// Função para gerar um valor aleatório entre min e max
const valorAleatorio = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Função para escolher um item aleatório de um array
const escolherAleatorio = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

// Bandas de exemplo (IDs fictícios)
const bandasIds = ['banda1', 'banda2', 'banda3'];

// Integrantes de exemplo (IDs fictícios)
const integrantesIds = [
  'integrante1', 'integrante2', 'integrante3', 'integrante4', 
  'integrante5', 'integrante6', 'integrante7', 'integrante8'
];

// Repertórios de exemplo (IDs fictícios)
const repertoriosIds = ['repertorio1', 'repertorio2', 'repertorio3'];

// Músicas de exemplo (IDs fictícios)
const musicasIds = [
  'musica1', 'musica2', 'musica3', 'musica4', 'musica5',
  'musica6', 'musica7', 'musica8', 'musica9', 'musica10'
];

// Locais de exemplo
const locais = [
  { nome: 'Bar do Zé', endereco: 'Rua das Flores, 123, São Paulo, SP' },
  { nome: 'Pub Rock n\' Roll', endereco: 'Av. Paulista, 1000, São Paulo, SP' },
  { nome: 'Teatro Municipal', endereco: 'Praça Ramos de Azevedo, s/n, São Paulo, SP' },
  { nome: 'Estúdio Som Livre', endereco: 'Rua Augusta, 500, São Paulo, SP' },
  { nome: 'Casa de Shows Melody', endereco: 'Rua Consolação, 2500, São Paulo, SP' },
  { nome: 'Sede da Banda', endereco: 'Rua Vergueiro, 1500, São Paulo, SP' },
  { nome: 'Centro Cultural', endereco: 'Av. Brigadeiro Faria Lima, 1000, São Paulo, SP' },
  { nome: 'Espaço Musical', endereco: 'Rua Oscar Freire, 800, São Paulo, SP' }
];

// Tipos de equipamentos
const tiposEquipamentos = [
  { descricao: 'Microfone SM58', quantidade: 4 },
  { descricao: 'Caixa de som ativa', quantidade: 2 },
  { descricao: 'Mesa de som digital', quantidade: 1 },
  { descricao: 'Pedestal de microfone', quantidade: 4 },
  { descricao: 'Cabo XLR', quantidade: 10 },
  { descricao: 'Cabo P10', quantidade: 8 },
  { descricao: 'Amplificador de guitarra', quantidade: 2 },
  { descricao: 'Amplificador de baixo', quantidade: 1 },
  { descricao: 'Bateria completa', quantidade: 1 },
  { descricao: 'Teclado', quantidade: 1 }
];

// Tipos de custos
const tiposCustos = [
  { descricao: 'Transporte', valor: '150.00', responsavel: 'João' },
  { descricao: 'Alimentação', valor: '200.00', responsavel: 'Maria' },
  { descricao: 'Hospedagem', valor: '350.00', responsavel: 'Pedro' },
  { descricao: 'Aluguel de equipamentos', valor: '500.00', responsavel: 'Ana' },
  { descricao: 'Técnico de som', valor: '300.00', responsavel: 'Carlos' },
  { descricao: 'Roadie', valor: '200.00', responsavel: 'Paulo' },
  { descricao: 'Marketing', valor: '150.00', responsavel: 'Fernanda' },
  { descricao: 'Impressão de material', valor: '100.00', responsavel: 'Ricardo' }
];

// Itens de viagem
const itensViagem = [
  { descricao: 'Passagem aérea', valor: '800.00', responsavelCusto: 'João' },
  { descricao: 'Aluguel de van', valor: '350.00', responsavelCusto: 'Maria' },
  { descricao: 'Combustível', valor: '200.00', responsavelCusto: 'Pedro' },
  { descricao: 'Pedágio', valor: '50.00', responsavelCusto: 'Ana' },
  { descricao: 'Táxi/Uber', valor: '100.00', responsavelCusto: 'Carlos' }
];

// Função para gerar um evento de exemplo
const gerarEvento = (mes: number, indice: number): Evento => {
  // Determina o tipo de evento com base no índice para garantir distribuição
  const tiposEvento: TipoEvento[] = ['show', 'ensaio', 'reuniao'];
  const tipo = tiposEvento[indice % 3];
  
  // Data base: primeiro dia do mês especificado
  const dataBase = addMonths(new Date(2025, 0, 1), mes);
  // Adiciona dias para distribuir os eventos ao longo do mês
  const data = addDays(dataBase, valorAleatorio(1, 28));
  
  // Status aleatório com maior probabilidade para confirmado e agendado
  const statusOptions: StatusEvento[] = ['agendado', 'confirmado', 'confirmado', 'cancelado', 'concluido'];
  const status = escolherAleatorio(statusOptions);
  
  // Local aleatório
  const local = escolherAleatorio(locais);
  
  // Banda aleatória (exceto para reuniões, que podem não ter banda)
  const bandaId = tipo === 'reuniao' && Math.random() > 0.7 ? undefined : escolherAleatorio(bandasIds);
  
  // Integrantes aleatórios (entre 2 e 8)
  const numIntegrantes = valorAleatorio(2, 8);
  const integrantesAleatorios = [...integrantesIds]
    .sort(() => Math.random() - 0.5)
    .slice(0, numIntegrantes);
  
  // Evento base
  const evento: Evento = {
    id: gerarId(),
    titulo: `${tipo === 'show' ? 'Show' : tipo === 'ensaio' ? 'Ensaio' : 'Reunião'} ${mes + 1}.${indice + 1}`,
    tipo,
    data: format(data, 'yyyy-MM-dd'),
    horaInicio: `${valorAleatorio(10, 20)}:${valorAleatorio(0, 5)}0`,
    horaFim: `${valorAleatorio(21, 23)}:${valorAleatorio(0, 5)}0`,
    local: local.nome,
    endereco: local.endereco,
    bandaId,
    integrantesIds: integrantesAleatorios,
    status,
    descricao: `Descrição do ${tipo} ${mes + 1}.${indice + 1}. Este é um evento de exemplo gerado automaticamente.`,
  };
  
  // Adiciona campos específicos com base no tipo de evento
  if (tipo === 'show') {
    // Valor do cachê entre 1000 e 5000
    const valorCache = valorAleatorio(1000, 5000);
    
    // Entre 2 e 5 custos aleatórios
    const numCustos = valorAleatorio(2, 5);
    const custos = [...tiposCustos]
      .sort(() => Math.random() - 0.5)
      .slice(0, numCustos);
    
    // Decide se tem viagem (30% de chance)
    const temViagem = Math.random() < 0.3;
    
    // Equipamentos necessários e existentes
    const numEquipNecessarios = valorAleatorio(3, 6);
    const equipamentosNecessarios = [...tiposEquipamentos]
      .sort(() => Math.random() - 0.5)
      .slice(0, numEquipNecessarios)
      .map(e => ({ ...e, quantidade: valorAleatorio(1, e.quantidade) }));
    
    const numEquipExistentes = valorAleatorio(2, 5);
    const equipamentosExistentes = [...tiposEquipamentos]
      .sort(() => Math.random() - 0.5)
      .slice(0, numEquipExistentes)
      .map(e => ({ ...e, quantidade: valorAleatorio(1, e.quantidade) }));
    
    // Adiciona campos específicos para shows
    Object.assign(evento, {
      valorCache,
      custos,
      qtdeIntegrantes: numIntegrantes,
      contatoLocal: 'Contato do Local',
      telefoneLocal: `(11) 9${valorAleatorio(1000, 9999)}-${valorAleatorio(1000, 9999)}`,
      contatoTecnico: 'Técnico de Som',
      telefoneTecnico: `(11) 9${valorAleatorio(1000, 9999)}-${valorAleatorio(1000, 9999)}`,
      observacoesShow: 'Observações específicas para este show.',
      horarioPassagemSom: `${valorAleatorio(14, 17)}:00`,
      repertorioId: escolherAleatorio(repertoriosIds),
      equipamentosNecessarios,
      equipamentosExistentes,
      temViagem,
      observacoesContato: 'Observações sobre os contatos para este evento.'
    });
    
    // Se tem viagem, adiciona itens de viagem e hospedagem
    if (temViagem) {
      const numItensViagem = valorAleatorio(2, 4);
      const itensViagemSelecionados = [...itensViagem]
        .sort(() => Math.random() - 0.5)
        .slice(0, numItensViagem)
        .map(item => ({
          ...item,
          data: evento.data,
          valor: item.valor
        }));
      
      const hospedagem = {
        local: 'Hotel Central',
        endereco: 'Rua Central, 100, Centro',
        dataCheckIn: evento.data,
        dataCheckOut: format(addDays(new Date(evento.data), 1), 'yyyy-MM-dd'),
        horaCheckIn: '14:00',
        horaCheckOut: '12:00',
        valor: valorAleatorio(300, 800),
        responsavelCusto: escolherAleatorio(integrantesAleatorios),
        quantidadeQuartos: Math.ceil(numIntegrantes / 2),
        distribuicaoQuartos: `${Math.ceil(numIntegrantes / 2)} quartos duplos`,
        incluiCafe: Math.random() > 0.3,
        observacoes: 'Observações sobre a hospedagem.',
        contatoHotel: 'Recepção',
        telefoneHotel: `(11) ${valorAleatorio(1000, 9999)}-${valorAleatorio(1000, 9999)}`
      };
      
      Object.assign(evento, {
        itensViagem: itensViagemSelecionados,
        hospedagem
      });
    }
  } else if (tipo === 'ensaio') {
    // Músicas para ensaio (entre 5 e 10)
    const numMusicas = valorAleatorio(5, 10);
    const musicasEnsaio = [...musicasIds]
      .sort(() => Math.random() - 0.5)
      .slice(0, numMusicas);
    
    // Adiciona campos específicos para ensaios
    Object.assign(evento, {
      pautaEnsaio: 'Pauta do ensaio com os principais pontos a serem trabalhados.',
      objetivosEnsaio: 'Objetivos específicos para este ensaio.',
      musicasEnsaio
    });
  } else if (tipo === 'reuniao') {
    // Decisões tomadas (entre 2 e 5)
    const numDecisoes = valorAleatorio(2, 5);
    const decisoesTomadas = Array.from({ length: numDecisoes }, (_, i) => 
      `Decisão ${i + 1}: Descrição da decisão tomada na reunião.`
    );
    
    // Adiciona campos específicos para reuniões
    Object.assign(evento, {
      pautaReuniao: 'Pauta da reunião com os tópicos a serem discutidos.',
      ataReuniao: 'Ata detalhada da reunião com os principais pontos discutidos.',
      decisoesTomadas
    });
  }
  
  return evento;
};

// Gera 30 eventos, 5 para cada mês (de janeiro a junho)
export const eventosExemplo: Evento[] = Array.from({ length: 30 }, (_, i) => {
  const mes = Math.floor(i / 5); // 5 eventos por mês
  const indice = i % 5; // Índice dentro do mês
  return gerarEvento(mes, indice);
});

// Função para popular o localStorage com os eventos de exemplo
export const popularEventosExemplo = () => {
  // Verifica se já existem eventos no localStorage
  const eventosAtuais = localStorage.getItem('eventos');
  const eventos = eventosAtuais ? JSON.parse(eventosAtuais) : [];
  
  // Se não houver eventos ou houver poucos, adiciona os eventos de exemplo
  if (eventos.length < 5) {
    localStorage.setItem('eventos', JSON.stringify(eventosExemplo));
    return true;
  }
  
  return false;
}; 