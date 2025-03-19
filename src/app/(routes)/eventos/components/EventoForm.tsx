'use client';

import { useState, useEffect, useMemo } from 'react';
import { Evento, TipoEvento, StatusEvento, Banda, Integrante, Musica } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { HomeIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';

interface EventoFormProps {
  evento?: Evento;
  bandas: Banda[];
  integrantes: Integrante[];
  musicas: Musica[];
  repertorios: { id: string; nome: string }[];
  onSubmit: (data: Partial<Evento>) => void;
  onCancel: () => void;
}

interface Custo {
  descricao: string;
  valor: string;
  responsavel: string;
}

interface Equipamento {
  descricao: string;
  quantidade: number;
}

interface ItemViagem {
  data: string;
  descricao: string;
  valor: string;
  responsavelCusto: string;
}

interface Hospedagem {
  local: string;
  endereco: string;
  dataCheckIn: string;
  dataCheckOut: string;
  horaCheckIn: string;
  horaCheckOut: string;
  valor: string;
  responsavelCusto: string;
  numeroRecepcao: string;
  incluiCafe: boolean;
  horarioCafeInicio?: string;
  horarioCafeFim?: string;
  incluiAlmoco: boolean;
  horarioAlmocoInicio?: string;
  horarioAlmocoFim?: string;
  incluiJantar: boolean;
  horarioJantarInicio?: string;
  horarioJantarFim?: string;
  observacoes: string;
  contatoHotel: string;
  telefoneHotel: string;
  redeWifi?: string;
  senhaWifi?: string;
  quartos?: {
    numero: string;
    andar: string;
    ocupantes: string[];
  }[];
}

export function EventoForm({ 
  evento, 
  bandas, 
  integrantes, 
  musicas,
  repertorios,
  onSubmit, 
  onCancel 
}: EventoFormProps) {
  // Estados para campos básicos
  const [titulo, setTitulo] = useState(evento?.titulo || '');
  const [tipo, setTipo] = useState<TipoEvento>(evento?.tipo || 'show');
  const [data, setData] = useState(evento?.data || '');
  const [horaInicio, setHoraInicio] = useState(evento?.horaInicio || '');
  const [horaFim, setHoraFim] = useState(evento?.horaFim || '');
  const [local, setLocal] = useState(evento?.local || '');
  const [endereco, setEndereco] = useState(evento?.endereco || '');
  const [bandaId, setBandaId] = useState(evento?.bandaId || '');
  const [integrantesIds, setIntegrantesIds] = useState<string[]>(evento?.integrantesIds || []);
  const [status, setStatus] = useState<StatusEvento>(evento?.status || 'agendado');
  const [descricao, setDescricao] = useState(evento?.descricao || '');
  
  // Estado para pesquisa de integrantes
  const [pesquisaIntegrantes, setPesquisaIntegrantes] = useState('');
  const integrantesFiltrados = useMemo(() => {
    return integrantes.filter(integrante => 
      integrante.nome.toLowerCase().includes(pesquisaIntegrantes.toLowerCase()) ||
      integrante.funcao.toLowerCase().includes(pesquisaIntegrantes.toLowerCase())
    );
  }, [integrantes, pesquisaIntegrantes]);
  
  // Estado para o modal de rotas
  const [mostrarModalRotas, setMostrarModalRotas] = useState(false);
  const [origemRota, setOrigemRota] = useState('');
  const [tempoEstimado, setTempoEstimado] = useState('');
  const [distanciaEstimada, setDistanciaEstimada] = useState('');
  
  // Campos específicos para shows
  const [valorCache, setValorCache] = useState(evento?.valorCache?.toString() || '');
  const [custos, setCustos] = useState<Custo[]>(
    evento?.custos?.map((c: any) => ({ 
      descricao: c.descricao || '', 
      valor: c.valor || '', 
      responsavel: c.responsavel || '' 
    })) || 
    [{ descricao: '', valor: '', responsavel: '' }]
  );
  const [qtdeIntegrantes, setQtdeIntegrantes] = useState<number>(evento?.qtdeIntegrantes || 1);
  const [contatoLocal, setContatoLocal] = useState(evento?.contatoLocal || '');
  const [telefoneLocal, setTelefoneLocal] = useState(evento?.telefoneLocal || '');
  const [contatoTecnico, setContatoTecnico] = useState(evento?.contatoTecnico || '');
  const [telefoneTecnico, setTelefoneTecnico] = useState(evento?.telefoneTecnico || '');
  const [observacoesShow, setObservacoesShow] = useState(evento?.observacoesShow || '');
  const [horarioPassagemSom, setHorarioPassagemSom] = useState(evento?.horarioPassagemSom || '');
  const [repertorioId, setRepertorioId] = useState(evento?.repertorioId || '');
  const [equipamentosNecessarios, setEquipamentosNecessarios] = useState<Equipamento[]>(
    evento?.equipamentosNecessarios || [{ descricao: '', quantidade: 1 }]
  );
  const [equipamentosExistentes, setEquipamentosExistentes] = useState<Equipamento[]>(
    evento?.equipamentosExistentes || [{ descricao: '', quantidade: 1 }]
  );
  
  // Campos específicos para ensaios
  const [pautaEnsaio, setPautaEnsaio] = useState(evento?.pautaEnsaio || '');
  const [objetivosEnsaio, setObjetivosEnsaio] = useState(evento?.objetivosEnsaio || '');
  const [musicasEnsaio, setMusicasEnsaio] = useState<string[]>(evento?.musicasEnsaio || []);
  
  // Campos específicos para reuniões
  const [pautaReuniao, setPautaReuniao] = useState(evento?.pautaReuniao || '');
  const [ataReuniao, setAtaReuniao] = useState(evento?.ataReuniao || '');
  const [decisoesTomadas, setDecisoesTomadas] = useState<string[]>(evento?.decisoesTomadas || ['']);

  // Novos campos para observações de equipamentos e informações de viagem
  const [observacoesEquipamentos, setObservacoesEquipamentos] = useState(evento?.observacoesEquipamentos || '');
  const [itensViagem, setItensViagem] = useState<ItemViagem[]>(
    evento?.itensViagem ? evento.itensViagem.map(item => ({
      ...item,
      valor: item.valor.toString()
    })) : [{ data: format(new Date(), 'yyyy-MM-dd'), descricao: '', valor: '', responsavelCusto: '' }]
  );

  // Novo campo para observações de contato
  const [observacoesContato, setObservacoesContato] = useState(evento?.observacoesContato || '');

  // Estados para hospedagem
  const [hospedagem, setHospedagem] = useState<Hospedagem>({
    local: evento?.hospedagem?.local || '',
    endereco: evento?.hospedagem?.endereco || '',
    dataCheckIn: evento?.hospedagem?.dataCheckIn || '',
    dataCheckOut: evento?.hospedagem?.dataCheckOut || '',
    horaCheckIn: evento?.hospedagem?.horaCheckIn || '',
    horaCheckOut: evento?.hospedagem?.horaCheckOut || '',
    valor: evento?.hospedagem?.valor?.toString() || '',
    responsavelCusto: evento?.hospedagem?.responsavelCusto || '',
    numeroRecepcao: evento?.hospedagem?.numeroRecepcao || '',
    incluiCafe: evento?.hospedagem?.incluiCafe || false,
    horarioCafeInicio: evento?.hospedagem?.horarioCafeInicio || '',
    horarioCafeFim: evento?.hospedagem?.horarioCafeFim || '',
    incluiAlmoco: evento?.hospedagem?.incluiAlmoco || false,
    horarioAlmocoInicio: evento?.hospedagem?.horarioAlmocoInicio || '',
    horarioAlmocoFim: evento?.hospedagem?.horarioAlmocoFim || '',
    incluiJantar: evento?.hospedagem?.incluiJantar || false,
    horarioJantarInicio: evento?.hospedagem?.horarioJantarInicio || '',
    horarioJantarFim: evento?.hospedagem?.horarioJantarFim || '',
    observacoes: evento?.hospedagem?.observacoes || '',
    contatoHotel: evento?.hospedagem?.contatoHotel || '',
    telefoneHotel: evento?.hospedagem?.telefoneHotel || '',
    redeWifi: evento?.hospedagem?.redeWifi || '',
    senhaWifi: evento?.hospedagem?.senhaWifi || '',
  });

  // Estado para controlar a visibilidade da seção de equipamentos
  const [mostrarEquipamentos, setMostrarEquipamentos] = useState(true);

  // Estado para controlar a visibilidade da seção de contatos
  const [mostrarContatos, setMostrarContatos] = useState(true);

  // Estado para controlar a visibilidade da seção de informações do show
  const [mostrarInfoShow, setMostrarInfoShow] = useState(true);
  
  // Estado para controlar a visibilidade da seção de viagem
  const [mostrarViagem, setMostrarViagem] = useState(true);
  
  // Estado para controlar a visibilidade da seção de estatísticas
  const [mostrarEstatisticas, setMostrarEstatisticas] = useState(true);

  // Cálculos financeiros
  const totalCustos = custos.reduce((total, custo) => {
    const valor = parseFloat(custo.valor) || 0;
    return total + valor;
  }, 0);

  const cacheLiquido = (parseFloat(valorCache) || 0) - totalCustos;
  
  // Cálculo do cachê por integrante
  const cachePorIntegrante = qtdeIntegrantes > 0 ? cacheLiquido / qtdeIntegrantes : 0;

  // Função para formatar valores monetários
  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Função para formatar números com separador de milhares
  const formatarNumero = (valor: number) => {
    return valor.toLocaleString('pt-BR');
  };

  // Funções para gerenciar custos
  const handleAddCusto = () => {
    setCustos([...custos, { descricao: '', valor: '', responsavel: '' }]);
  };

  const handleRemoveCusto = (index: number) => {
    const novosCustos = [...custos];
    novosCustos.splice(index, 1);
    setCustos(novosCustos);
  };

  const handleChangeCusto = (index: number, campo: 'descricao' | 'valor' | 'responsavel', valor: string) => {
    const novosCustos = [...custos];
    novosCustos[index] = {
      ...novosCustos[index],
      [campo]: valor
    };
    setCustos(novosCustos);
  };

  // Funções para gerenciar equipamentos necessários
  const handleAddEquipamentoNecessario = () => {
    setEquipamentosNecessarios([...equipamentosNecessarios, { descricao: '', quantidade: 1 }]);
  };

  const handleRemoveEquipamentoNecessario = (index: number) => {
    const novosEquipamentos = [...equipamentosNecessarios];
    novosEquipamentos.splice(index, 1);
    setEquipamentosNecessarios(novosEquipamentos);
  };

  const handleChangeEquipamentoNecessario = (index: number, campo: keyof Equipamento, valor: string | number) => {
    const novosEquipamentos = [...equipamentosNecessarios];
    novosEquipamentos[index] = {
      ...novosEquipamentos[index],
      [campo]: valor
    };
    setEquipamentosNecessarios(novosEquipamentos);
  };

  // Funções para gerenciar equipamentos existentes
  const handleAddEquipamentoExistente = () => {
    setEquipamentosExistentes([...equipamentosExistentes, { descricao: '', quantidade: 1 }]);
  };

  const handleRemoveEquipamentoExistente = (index: number) => {
    const novosEquipamentos = [...equipamentosExistentes];
    novosEquipamentos.splice(index, 1);
    setEquipamentosExistentes(novosEquipamentos);
  };

  const handleChangeEquipamentoExistente = (index: number, campo: keyof Equipamento, valor: string | number) => {
    const novosEquipamentos = [...equipamentosExistentes];
    novosEquipamentos[index] = {
      ...novosEquipamentos[index],
      [campo]: valor
    };
    setEquipamentosExistentes(novosEquipamentos);
  };

  // Funções para gerenciar itens de viagem
  const handleAddItemViagem = () => {
    setItensViagem([...itensViagem, { 
      data: format(new Date(), 'yyyy-MM-dd'),
      descricao: '',
      valor: '',
      responsavelCusto: ''
    }]);
  };

  const handleRemoveItemViagem = (index: number) => {
    const novosItens = [...itensViagem];
    novosItens.splice(index, 1);
    setItensViagem(novosItens);
  };

  const handleChangeItemViagem = (index: number, campo: keyof ItemViagem, valor: string) => {
    const novosItens = [...itensViagem];
    novosItens[index] = {
      ...novosItens[index],
      [campo]: valor
    };
    setItensViagem(novosItens);
  };

  // Função para calcular o total de gastos com viagem
  const calcularTotalGastosViagem = () => {
    const totalItensViagem = itensViagem.reduce((total, item) => total + (parseFloat(item.valor) || 0), 0);
    const valorHospedagem = parseFloat(hospedagem.valor) || 0;
    return totalItensViagem + valorHospedagem;
  };

  // Atualiza os custos quando os gastos com viagem mudam
  useEffect(() => {
      const totalViagem = calcularTotalGastosViagem();
      
    if (totalViagem > 0) {
      // Verifica se já existe um custo para viagem
      const custoViagemIndex = custos.findIndex(c => c.descricao === 'Gastos com Viagem');
      
      if (custoViagemIndex >= 0) {
        // Atualiza o custo existente
        const novosCustos = [...custos];
        novosCustos[custoViagemIndex] = {
          descricao: 'Gastos com Viagem',
          valor: totalViagem.toString(),
          responsavel: 'Banda'
        };
        setCustos(novosCustos);
      } else {
        // Adiciona novo custo
        setCustos([
          ...custos,
          {
            descricao: 'Gastos com Viagem',
            valor: totalViagem.toString(),
            responsavel: 'Banda'
          }
        ]);
      }
    } else {
      // Remove o custo de viagem se não houver mais gastos
      const novosCustos = custos.filter(c => c.descricao !== 'Gastos com Viagem');
      if (novosCustos.length !== custos.length) {
        setCustos(novosCustos);
      }
    }
  }, [itensViagem, hospedagem.valor]);

  // Atualiza o formulário quando o evento muda
  useEffect(() => {
    if (evento) {
      setTitulo(evento.titulo);
      setTipo(evento.tipo);
      setData(evento.data);
      setHoraInicio(evento.horaInicio);
      setHoraFim(evento.horaFim);
      setLocal(evento.local);
      setEndereco(evento.endereco || '');
      setBandaId(evento.bandaId || '');
      setIntegrantesIds(evento.integrantesIds || []);
      setStatus(evento.status);
      setDescricao(evento.descricao || '');
      
      // Campos específicos para shows
      setValorCache(evento.valorCache?.toString() || '');
      setCustos(evento.custos?.map((c: any) => ({ 
        descricao: c.descricao || '', 
        valor: c.valor || '', 
        responsavel: c.responsavel || '' 
      })) || [{ descricao: '', valor: '', responsavel: '' }]);
      setQtdeIntegrantes(evento.qtdeIntegrantes || 1);
      setContatoLocal(evento.contatoLocal || '');
      setTelefoneLocal(evento.telefoneLocal || '');
      setContatoTecnico(evento.contatoTecnico || '');
      setTelefoneTecnico(evento.telefoneTecnico || '');
      setObservacoesShow(evento.observacoesShow || '');
      setHorarioPassagemSom(evento.horarioPassagemSom || '');
      setRepertorioId(evento.repertorioId || '');
      setEquipamentosNecessarios(evento.equipamentosNecessarios || [{ descricao: '', quantidade: 1 }]);
      setEquipamentosExistentes(evento.equipamentosExistentes || [{ descricao: '', quantidade: 1 }]);
      
      // Campos específicos para ensaios
      setPautaEnsaio(evento.pautaEnsaio || '');
      setObjetivosEnsaio(evento.objetivosEnsaio || '');
      setMusicasEnsaio(evento.musicasEnsaio || []);
      
      // Campos específicos para reuniões
      setPautaReuniao(evento.pautaReuniao || '');
      setAtaReuniao(evento.ataReuniao || '');
      setDecisoesTomadas(evento.decisoesTomadas || ['']);

      // Novos campos para observações de equipamentos e informações de viagem
      setObservacoesEquipamentos(evento.observacoesEquipamentos || '');
      setItensViagem(
        evento.itensViagem ? evento.itensViagem.map(item => ({
          ...item,
          valor: item.valor.toString()
        })) : [{ data: format(new Date(), 'yyyy-MM-dd'), descricao: '', valor: '', responsavelCusto: '' }]
      );

      // Novo campo para observações de contato
      setObservacoesContato(evento.observacoesContato || '');

      // Atualizar hospedagem
      setHospedagem({
        local: evento.hospedagem?.local || '',
        endereco: evento.hospedagem?.endereco || '',
        dataCheckIn: evento.hospedagem?.dataCheckIn || '',
        dataCheckOut: evento.hospedagem?.dataCheckOut || '',
        horaCheckIn: evento.hospedagem?.horaCheckIn || '',
        horaCheckOut: evento.hospedagem?.horaCheckOut || '',
        valor: evento.hospedagem?.valor?.toString() || '',
        responsavelCusto: evento.hospedagem?.responsavelCusto || '',
        numeroRecepcao: evento.hospedagem?.numeroRecepcao || '',
        incluiCafe: evento.hospedagem?.incluiCafe || false,
        horarioCafeInicio: evento.hospedagem?.horarioCafeInicio || '',
        horarioCafeFim: evento.hospedagem?.horarioCafeFim || '',
        incluiAlmoco: evento.hospedagem?.incluiAlmoco || false,
        horarioAlmocoInicio: evento.hospedagem?.horarioAlmocoInicio || '',
        horarioAlmocoFim: evento.hospedagem?.horarioAlmocoFim || '',
        incluiJantar: evento.hospedagem?.incluiJantar || false,
        horarioJantarInicio: evento.hospedagem?.horarioJantarInicio || '',
        horarioJantarFim: evento.hospedagem?.horarioJantarFim || '',
        observacoes: evento.hospedagem?.observacoes || '',
        contatoHotel: evento.hospedagem?.contatoHotel || '',
        telefoneHotel: evento.hospedagem?.telefoneHotel || '',
        redeWifi: evento.hospedagem?.redeWifi || '',
        senhaWifi: evento.hospedagem?.senhaWifi || '',
      });
    }
  }, [evento]);

  // Quando a banda é selecionada, pré-seleciona os integrantes dessa banda
  useEffect(() => {
    if (bandaId) {
      const integrantesDaBanda = integrantes.filter(
        integrante => integrante.bandasIds.includes(bandaId)
      ).map(integrante => integrante.id);
      
      setIntegrantesIds(integrantesDaBanda);
    }
  }, [bandaId, integrantes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventoData: Partial<Evento> = {
      titulo,
      tipo,
      data,
      horaInicio,
      horaFim,
      local,
      endereco: endereco || undefined,
      bandaId: bandaId || undefined,
      integrantesIds,
      status,
      descricao: descricao || undefined,
    };
    
    // Adiciona campos específicos com base no tipo de evento
    if (tipo === 'show') {
      eventoData.valorCache = valorCache ? parseFloat(valorCache) : undefined;
      eventoData.custos = custos
        .filter(c => c.descricao.trim() !== '' || c.valor.trim() !== '')
        .map(c => ({
          descricao: c.descricao,
          valor: c.valor,
          responsavel: c.responsavel
        }));
      eventoData.qtdeIntegrantes = qtdeIntegrantes;
      eventoData.contatoLocal = contatoLocal || undefined;
      eventoData.telefoneLocal = telefoneLocal || undefined;
      eventoData.contatoTecnico = contatoTecnico || undefined;
      eventoData.telefoneTecnico = telefoneTecnico || undefined;
      eventoData.observacoesShow = observacoesShow || undefined;
      eventoData.horarioPassagemSom = horarioPassagemSom || undefined;
      eventoData.repertorioId = repertorioId || undefined;
      eventoData.equipamentosNecessarios = equipamentosNecessarios.filter(e => e.descricao.trim() !== '');
      eventoData.equipamentosExistentes = equipamentosExistentes.filter(e => e.descricao.trim() !== '');
      eventoData.observacoesEquipamentos = observacoesEquipamentos || undefined;
      
      // Processar itens de viagem se houver algum preenchido
      const itensViagemPreenchidos = itensViagem.filter(item => 
        item.descricao.trim() !== '' || item.valor.trim() !== '' || item.responsavelCusto.trim() !== ''
      );
      
      if (itensViagemPreenchidos.length > 0 || hospedagem.local.trim() !== '') {
        eventoData.itensViagem = itensViagemPreenchidos.map(item => ({
            data: item.data,
            descricao: item.descricao,
            valor: parseFloat(item.valor) || 0,
            responsavelCusto: item.responsavelCusto
          }));

        if (hospedagem.local.trim() !== '') {
          eventoData.hospedagem = {
            local: hospedagem.local,
            endereco: hospedagem.endereco || undefined,
            dataCheckIn: hospedagem.dataCheckIn,
            dataCheckOut: hospedagem.dataCheckOut,
            horaCheckIn: hospedagem.horaCheckIn,
            horaCheckOut: hospedagem.horaCheckOut,
            valor: parseFloat(hospedagem.valor) || 0,
            responsavelCusto: hospedagem.responsavelCusto,
            numeroRecepcao: hospedagem.numeroRecepcao || undefined,
            incluiCafe: hospedagem.incluiCafe,
            horarioCafeInicio: hospedagem.horarioCafeInicio || '08:00',
            horarioCafeFim: hospedagem.horarioCafeFim || '10:00',
            incluiAlmoco: hospedagem.incluiAlmoco,
            horarioAlmocoInicio: hospedagem.horarioAlmocoInicio || '12:00',
            horarioAlmocoFim: hospedagem.horarioAlmocoFim || '14:00',
            incluiJantar: hospedagem.incluiJantar,
            horarioJantarInicio: hospedagem.horarioJantarInicio || '18:00',
            horarioJantarFim: hospedagem.horarioJantarFim || '20:00',
            observacoes: hospedagem.observacoes || undefined,
            contatoHotel: hospedagem.contatoHotel || undefined,
            telefoneHotel: hospedagem.telefoneHotel || undefined,
            redeWifi: hospedagem.redeWifi || undefined,
            senhaWifi: hospedagem.senhaWifi || undefined,
            quartos: hospedagem.quartos || [],
          };
        }
      }
      eventoData.observacoesContato = observacoesContato || undefined;
    } else if (tipo === 'ensaio') {
      eventoData.pautaEnsaio = pautaEnsaio || undefined;
      eventoData.objetivosEnsaio = objetivosEnsaio || undefined;
      eventoData.musicasEnsaio = musicasEnsaio.length > 0 ? musicasEnsaio : undefined;
    } else if (tipo === 'reuniao') {
      eventoData.pautaReuniao = pautaReuniao || undefined;
      eventoData.ataReuniao = ataReuniao || undefined;
      eventoData.decisoesTomadas = decisoesTomadas.filter(d => d.trim() !== '').length > 0 
        ? decisoesTomadas.filter(d => d.trim() !== '') 
        : undefined;
    }
    
    onSubmit(eventoData);
  };

  const handleToggleIntegrante = (integranteId: string) => {
    setIntegrantesIds(prev => 
      prev.includes(integranteId)
        ? prev.filter(id => id !== integranteId)
        : [...prev, integranteId]
    );
  };

  const handleToggleMusica = (musicaId: string) => {
    setMusicasEnsaio(prev => 
      prev.includes(musicaId)
        ? prev.filter(id => id !== musicaId)
        : [...prev, musicaId]
    );
  };

  const handleAddDecisao = () => {
    setDecisoesTomadas([...decisoesTomadas, '']);
  };

  const handleChangeDecisao = (index: number, value: string) => {
    const novasDecisoes = [...decisoesTomadas];
    novasDecisoes[index] = value;
    setDecisoesTomadas(novasDecisoes);
  };

  const handleRemoveDecisao = (index: number) => {
    const novasDecisoes = [...decisoesTomadas];
    novasDecisoes.splice(index, 1);
    setDecisoesTomadas(novasDecisoes);
  };

  // Função para converter dados do evento para o formato correto
  const converterDadosEvento = (eventoData: any): Partial<Evento> => {
    const dadosEvento: Partial<Evento> = { ...eventoData };
    
    if (tipo === 'show') {
      dadosEvento.valorCache = valorCache ? parseFloat(valorCache) : undefined;
      dadosEvento.custos = custos.map(c => ({
        descricao: c.descricao,
        valor: c.valor,
        responsavel: c.responsavel
      }));
      // ... existing code ...
    }
    
    // ... existing code ...
    
    return dadosEvento;
  };

  // Função para calcular tempo e distância estimados usando Google Maps API
  const calcularTempoEDistancia = async (lat: number, lng: number) => {
    if (!endereco && !local) return;
    
    const origem = origemRota || `${lat},${lng}`;
    const destino = endereco || local;
    
    try {
      // Em uma aplicação real, esta chamada seria feita através de um backend para proteger a chave API
      // Aqui estamos simulando a resposta para fins de demonstração
      
      // Simulação de chamada à API do Google Maps Distance Matrix
      console.log(`Calculando rota de ${origem} para ${destino}`);
      
      // Simular um pequeno atraso como se estivéssemos fazendo uma chamada de API real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Obter valores mais realistas baseados no destino
      // Em uma implementação real, estes valores viriam da resposta da API
      let distanciaKm = 0;
      let tempoMinutos = 0;
      
      // Simular diferentes distâncias baseadas no destino para parecer mais realista
      if (destino.toLowerCase().includes('são paulo') || destino.toLowerCase().includes('sao paulo')) {
        distanciaKm = 15.5;
        tempoMinutos = 35;
      } else if (destino.toLowerCase().includes('rio')) {
        distanciaKm = 435.8;
        tempoMinutos = 320;
      } else if (destino.toLowerCase().includes('belo horizonte') || destino.toLowerCase().includes('bh')) {
        distanciaKm = 580.2;
        tempoMinutos = 420;
      } else {
        // Valores aleatórios mais realistas para outros destinos
        distanciaKm = Math.floor(Math.random() * 100) + Math.random() * 0.9 + 5;
        tempoMinutos = distanciaKm * 1.2 + Math.floor(Math.random() * 15);
      }
      
      const horas = Math.floor(tempoMinutos / 60);
      const minutos = Math.floor(tempoMinutos % 60);
      
      setTempoEstimado(`${horas}:${minutos.toString().padStart(2, '0')}`);
      setDistanciaEstimada(`${distanciaKm.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`);
      
      console.log(`Rota calculada: ${distanciaKm.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}km, ${horas}h${minutos}min`);
    } catch (error) {
      console.error('Erro ao calcular rota:', error);
      alert('Não foi possível calcular a rota. Por favor, tente novamente.');
    }
  };

  // Funções para verificar se as seções estão preenchidas
  const verificarEquipamentosPreenchidos = () => {
    return equipamentosNecessarios.some(eq => eq.descricao.trim() !== '') || 
           equipamentosExistentes.some(eq => eq.descricao.trim() !== '') ||
           observacoesEquipamentos.trim() !== '';
  };
  
  const verificarContatosPreenchidos = () => {
    return contatoLocal.trim() !== '' || 
           telefoneLocal.trim() !== '' || 
           contatoTecnico.trim() !== '' || 
           telefoneTecnico.trim() !== '' || 
           horarioPassagemSom.trim() !== '' ||
           observacoesContato.trim() !== '';
  };
  
  const verificarInfoShowPreenchida = () => {
    return valorCache.trim() !== '' || 
           custos.some(custo => custo.descricao.trim() !== '' || custo.valor.trim() !== '' || custo.responsavel.trim() !== '');
  };
  
  const verificarViagemPreenchida = () => {
    return itensViagem.some(item => item.descricao.trim() !== '' || item.valor.trim() !== '' || item.responsavelCusto.trim() !== '') ||
           hospedagem.local.trim() !== '' ||
           hospedagem.endereco.trim() !== '';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white max-w-[120%] mx-auto p-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="md:col-span-2 space-y-2">
          <label htmlFor="titulo" className="block text-sm font-medium text-white">
            Título *
          </label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
            placeholder="Digite o título do evento"
          />
        </div>

        <div className="md:col-span-4">
          <label className="block text-sm font-medium text-white mb-2">
            Tipo de Evento *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['show', 'ensaio', 'reuniao'].map((tipoEvento) => (
            <button
                key={tipoEvento}
              type="button"
                onClick={() => setTipo(tipoEvento as TipoEvento)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ease-in-out flex items-center justify-center h-8
                          ${tipo === tipoEvento
                            ? tipoEvento === 'show' 
                              ? 'bg-green-600 text-white shadow-lg shadow-green-500/20' 
                              : tipoEvento === 'ensaio' 
                                ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20' 
                                : 'bg-yellow-600 text-white shadow-lg shadow-yellow-500/20'
                            : tipoEvento === 'show'
                              ? 'bg-green-800/50 text-green-300 hover:bg-green-700/50 border border-white/10'
                              : tipoEvento === 'ensaio'
                                ? 'bg-orange-800/50 text-orange-300 hover:bg-orange-700/50 border border-white/10'
                                : 'bg-yellow-800/50 text-yellow-300 hover:bg-yellow-700/50 border border-white/10'
                          }`}
              >
                {tipoEvento === 'show' ? 'Show' : tipoEvento === 'ensaio' ? 'Ensaio' : 'Reunião'}
            </button>
            ))}
              </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-2 space-y-2">
          <label htmlFor="data" className="block text-sm font-medium text-white">
            Data *
          </label>
          <input
            type="date"
            id="data"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label htmlFor="horaInicio" className="block text-sm font-medium text-white">
            Hora de Início *
          </label>
          <input
            type="time"
            id="horaInicio"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            required
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label htmlFor="horaFim" className="block text-sm font-medium text-white">
            Hora de Término
          </label>
          <input
            type="time"
            id="horaFim"
            value={horaFim}
            onChange={(e) => setHoraFim(e.target.value)}
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
          />
        </div>
        
        <div className="md:col-span-2 space-y-2">
          <label htmlFor="horarioPassagemSom" className="block text-sm font-medium text-white">
            Passagem de Som
          </label>
          <input
            type="time"
            id="horarioPassagemSom"
            value={horarioPassagemSom}
            onChange={(e) => setHorarioPassagemSom(e.target.value)}
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
          />
      </div>

        <div className="md:col-span-4 space-y-2">
          <label htmlFor="bandaId" className="block text-sm font-medium text-white mb-2">
            Banda *
          </label>
          <select
            id="bandaId"
            value={bandaId}
            onChange={(e) => setBandaId(e.target.value)}
            required
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
          >
            <option value="">Selecione uma banda</option>
            {bandas.map((banda) => (
              <option key={banda.id} value={banda.id}>
                {banda.nome}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-5 space-y-2">
          <label htmlFor="local" className="block text-sm font-medium text-white">
            Local *
          </label>
          <input
            type="text"
            id="local"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            required
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
            placeholder="Nome do local"
          />
        </div>

        <div className="md:col-span-7 space-y-2">
          <label htmlFor="endereco" className="block text-sm font-medium text-white">
            Endereço
          </label>
          <div className="flex space-x-2">
          <input
            type="text"
            id="endereco"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
              className="flex-1 rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
            placeholder="Endereço completo"
          />
            <button
              type="button"
              onClick={() => setMostrarModalRotas(!mostrarModalRotas)}
              disabled={!endereco && !local}
              className="inline-flex items-center justify-center px-4 py-2 border border-indigo-500 text-xs font-medium rounded-xl
                       text-indigo-200 hover:bg-indigo-600/40 focus:outline-none focus:ring-2 focus:ring-indigo-500
                     shadow-sm transition-all duration-200 ease-in-out h-9 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" />
              </svg>
              Rota
            </button>
          </div>
        </div>
      </div>

          {/* Seção expandida de Rotas */}
          {mostrarModalRotas && (
        <div className="mt-2 bg-gray-800/50 rounded-xl border border-white/10 p-4 animate-fadeIn">
              <h3 className="text-sm font-semibold text-white mb-4">Criar Rota</h3>
              
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
                  <label className="block text-xs font-medium text-white mb-1">
                    Sua localização
        </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={origemRota}
                      onChange={(e) => setOrigemRota(e.target.value)}
                      placeholder="Digite seu endereço atual"
                      className="flex-1 rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                              focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                              transition-all duration-200 ease-in-out px-3 py-2 h-9"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              setOrigemRota(`${position.coords.latitude},${position.coords.longitude}`);
                              // Calcular tempo e distância estimados
                              calcularTempoEDistancia(position.coords.latitude, position.coords.longitude);
                            },
                            (error) => {
                              console.error("Erro ao obter localização:", error);
                              alert("Não foi possível obter sua localização atual. Por favor, digite manualmente.");
                            }
                          );
                        } else {
                          alert("Geolocalização não é suportada pelo seu navegador. Por favor, digite manualmente.");
                        }
                      }}
                      className="px-3 py-2 h-9 text-xs text-indigo-300 hover:text-indigo-200 bg-gray-800/70 rounded-xl border border-white/10 hover:bg-gray-700/70"
                    >
                      Localização Atual
                    </button>
                  </div>
            </div>
            
            <div className="md:col-span-6 flex items-end space-x-2">
                  {origemRota && !tempoEstimado && (
                      <button
                        type="button"
                        onClick={() => {
                          if (origemRota) {
                            // Usar o endereço digitado para calcular a rota
                            calcularTempoEDistancia(0, 0); // Os parâmetros lat/lng são ignorados quando origemRota está preenchido
                          } else {
                            alert("Por favor, informe sua localização de origem.");
                          }
                        }}
                        className="px-3 py-2 h-8 text-xs text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
                      >
                        Confirmar
                      </button>
                  )}
            </div>
      </div>

      <div>
                  <label className="block text-xs font-medium text-white mb-1">
                    Destino
                  </label>
                  <input
                    type="text"
                    value={endereco || local}
                    disabled
                    className="w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                            transition-all duration-200 ease-in-out px-3 py-2 h-9 opacity-70"
                  />
                </div>

                {(tempoEstimado || distanciaEstimada) && (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="bg-gray-800/70 rounded-xl border border-white/10 p-3 flex flex-col items-center">
                      <span className="text-xs text-gray-400 mb-1">Tempo estimado</span>
                      <span className="text-sm text-white font-medium">{tempoEstimado}</span>
                    </div>
                    <div className="bg-gray-800/70 rounded-xl border border-white/10 p-3 flex flex-col items-center">
                      <span className="text-xs text-gray-400 mb-1">Distância</span>
                      <span className="text-sm text-white font-medium">{distanciaEstimada}</span>
                    </div>
                  </div>
                )}
                
                <div>
                  <p className="text-xs text-white mb-2">Mostrar rota em:</p>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (origemRota) {
                          const destino = encodeURIComponent(endereco || local);
                          const origem = encodeURIComponent(origemRota);
                          window.open(`https://www.google.com/maps/dir/${origem}/${destino}`, '_blank');
                        } else {
                          alert("Por favor, informe sua localização de origem.");
                        }
                      }}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-800/70 border border-white/10 hover:bg-gray-700/70 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" viewBox="0 0 24 24" fill="#4285F4">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      <span className="text-xs text-white">Google Maps</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        if (origemRota) {
                          const destino = encodeURIComponent(endereco || local);
                          window.open(`https://waze.com/ul?navigate=yes&q=${destino}`, '_blank');
                        } else {
                          alert("Por favor, informe sua localização de origem.");
                        }
                      }}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-800/70 border border-white/10 hover:bg-gray-700/70 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" viewBox="0 0 24 24" fill="#33CCFF">
                        <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12S6.2 22.5 12 22.5 22.5 17.8 22.5 12 17.8 1.5 12 1.5zM12 4c1.5 0 2.7 1.2 2.7 2.7 0 1.5-1.2 2.7-2.7 2.7-1.5 0-2.7-1.2-2.7-2.7C9.3 5.2 10.5 4 12 4zM6 15c0-2 4-3.1 6-3.1s6 1.1 6 3.1c0 1.2-2.7 2.7-6 2.7S6 16.2 6 15z"/>
                      </svg>
                      <span className="text-xs text-white">Waze</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        if (origemRota) {
                          const destino = encodeURIComponent(endereco || local);
                          const origem = encodeURIComponent(origemRota);
                          window.open(`https://maps.apple.com/?saddr=${origem}&daddr=${destino}`, '_blank');
                        } else {
                          alert("Por favor, informe sua localização de origem.");
                        }
                      }}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-800/70 border border-white/10 hover:bg-gray-700/70 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" viewBox="0 0 24 24" fill="#5FC9F8">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                      </svg>
                      <span className="text-xs text-white">Apple Maps</span>
                    </button>
                </div>
              </div>
            </div>
          )}

      {/* Seção de Banda e Integrantes */}
      <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg">
        <h4 className="text-base font-semibold text-white mb-4">Banda e Integrantes</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor="banda" className="block text-sm font-medium text-white">
          Banda
        </label>
        <select
          id="banda"
          value={bandaId}
          onChange={(e) => setBandaId(e.target.value)}
              className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                       transition-all duration-200 ease-in-out px-3 py-2 h-9"
            >
              <option value="">Selecione uma banda</option>
              {Array.isArray(bandas) ? bandas.map((banda) => (
                <option key={banda.id} value={banda.id}>
              {banda.nome}
            </option>
              )) : null}
        </select>
      </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-white">
          Integrantes
        </label>
            <div className="mt-1 max-h-48 overflow-y-auto rounded-xl bg-gray-800/50 border border-white/20 p-3">
              <div className="grid grid-cols-2 gap-2">
          {integrantes.map((integrante) => (
                <div key={integrante.id} className="flex items-center space-x-3 py-2">
              <input
                type="checkbox"
                id={`integrante-${integrante.id}`}
                checked={integrantesIds.includes(integrante.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setIntegrantesIds([...integrantesIds, integrante.id]);
                      } else {
                        setIntegrantesIds(integrantesIds.filter(id => id !== integrante.id));
                      }
                    }}
                    className="h-4 w-4 text-indigo-500 focus:ring-indigo-500 border-white rounded"
                  />
                  <label htmlFor={`integrante-${integrante.id}`} className="text-white">
                    {integrante.nome}
              </label>
            </div>
          ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Status e Descrição */}
      <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg">
        <h4 className="text-base font-semibold text-white mb-4">Status e Descrição</h4>
        
        <div className="space-y-6">
      <div>
            <div className="grid grid-cols-3 gap-3">
              <button
                key="agendado"
                type="button"
                onClick={() => setStatus('agendado')}
                className={`h-10 w-full rounded-xl text-[10px] font-normal transition-all duration-200 ease-in-out flex items-center justify-center px-1
                          ${status === 'agendado'
                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-white/10'
                          }`}
              >
                Agendado
              </button>
              <button
                key="confirmado"
                type="button"
                onClick={() => setStatus('confirmado')}
                className={`h-10 w-full rounded-xl text-[10px] font-normal transition-all duration-200 ease-in-out flex items-center justify-center px-1
                          ${status === 'confirmado'
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-white/10'
                          }`}
              >
                Confirmado
              </button>
              <button
                key="cancelado"
                type="button"
                onClick={() => setStatus('cancelado')}
                className={`h-10 w-full rounded-xl text-[10px] font-normal transition-all duration-200 ease-in-out flex items-center justify-center px-1
                          ${status === 'cancelado'
                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-white/10'
                          }`}
              >
                Cancelado
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-white mb-2">
          Descrição
        </label>
        <textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
              className="w-full h-20 rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm transition-all duration-200 ease-in-out px-3 py-2"
              placeholder="Descrição do evento"
        />
          </div>
        </div>
      </div>

      {/* Campos específicos para shows */}
      {tipo === 'show' && (
        <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h4 className="text-base font-semibold text-white">Informações do Show</h4>
              {verificarInfoShowPreenchida() && (
                <span className="ml-3 px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-md">
                  Preenchido
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setMostrarInfoShow(!mostrarInfoShow)}
              className="flex items-center justify-center h-8 w-8 text-indigo-400 hover:text-indigo-300 focus:outline-none transition-colors rounded-full hover:bg-indigo-500/10"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform duration-300 ${mostrarInfoShow ? 'rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {mostrarInfoShow && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="valorCache" className="block text-sm font-medium text-white">
                    Valor do Cache (R$)
                  </label>
                  <input
                    type="number"
                    id="valorCache"
                    value={valorCache}
                    onChange={(e) => setValorCache(e.target.value)}
                    step="0.01"
                    min="0"
                    className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                             transition-all duration-200 ease-in-out px-3 py-2 h-9"
                    placeholder="0,00"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="qtdeIntegrantes" className="block text-sm font-medium text-white">
                    Qtde
                  </label>
                  <input
                    type="number"
                    id="qtdeIntegrantes"
                    value={qtdeIntegrantes}
                    onChange={(e) => setQtdeIntegrantes(parseInt(e.target.value))}
                    min="1"
                    className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                             transition-all duration-200 ease-in-out px-3 py-2 h-9"
                  />
                </div>
              </div>

              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-white">
                      Custos do Show
                    </label>
                    <button
                      type="button"
                      onClick={handleAddCusto}
                    className="inline-flex items-center justify-center px-4 py-2 border border-indigo-500 text-xs font-medium rounded-xl
                             text-indigo-200 hover:bg-indigo-600/40 focus:outline-none focus:ring-2 focus:ring-indigo-500
                             shadow-sm transition-all duration-200 ease-in-out h-8"
                    >
                      + Adicionar Custo
                    </button>
                  </div>

                <div className="space-y-4">
                    {custos.map((custo, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-4">
                        <input
                          type="text"
                          value={custo.descricao}
                          onChange={(e) => handleChangeCusto(index, 'descricao', e.target.value)}
                          placeholder="Descrição do custo"
                          className="flex-1 rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                   focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                   transition-all duration-200 ease-in-out px-3 py-2 h-9"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCusto(index)}
                          className="flex items-center justify-center h-9 w-9 text-red-400 hover:text-red-300 focus:outline-none transition-colors rounded-full hover:bg-red-500/10"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center gap-4 pl-2">
                        <input
                          type="text"
                          value={custo.responsavel}
                          onChange={(e) => handleChangeCusto(index, 'responsavel', e.target.value)}
                          placeholder="Responsável"
                          className="w-40 rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                   focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                   transition-all duration-200 ease-in-out px-3 py-2 h-9"
                        />
                        <input
                          type="number"
                          value={custo.valor}
                          onChange={(e) => handleChangeCusto(index, 'valor', e.target.value)}
                          placeholder="Valor"
                          step="0.01"
                          min="0"
                          className="w-32 rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                   focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                   transition-all duration-200 ease-in-out px-3 py-2 h-9"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {custos.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-800/60 rounded-xl">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="text-sm font-semibold text-white">Estatísticas Financeiras</h5>
                        <button
                          type="button"
                        onClick={() => setMostrarEstatisticas(!mostrarEstatisticas)}
                        className="flex items-center justify-center h-7 w-7 text-indigo-400 hover:text-indigo-300 focus:outline-none transition-colors rounded-full hover:bg-indigo-500/10"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-5 w-5 transition-transform duration-300 ${mostrarEstatisticas ? 'rotate-180' : ''}`} 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                  </div>

                    {mostrarEstatisticas && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-white">Total de Custos:</span>
                          <span className="text-sm font-bold text-red-400">R$ {formatarMoeda(totalCustos)}</span>
                    </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm font-semibold text-white">Cache Líquido:</span>
                          <span className="text-sm font-bold text-indigo-400">R$ {formatarMoeda(cacheLiquido)}</span>
                    </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm font-semibold text-white">Cache por Integrante:</span>
                          <span className="text-sm font-bold text-green-400">R$ {formatarMoeda(cachePorIntegrante)}</span>
                  </div>
                      </>
                    )}
                </div>
                )}
              </div>
            </>
          )}
            </div>
      )}

            {/* Seção de Contatos */}
      {tipo === 'show' && (
        <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h4 className="text-base font-semibold text-white">Contatos</h4>
              {verificarContatosPreenchidos() && (
                <span className="ml-3 px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-md">
                  Preenchido
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setMostrarContatos(!mostrarContatos)}
              className="flex items-center justify-center h-8 w-8 text-indigo-400 hover:text-indigo-300 focus:outline-none transition-colors rounded-full hover:bg-indigo-500/10"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform duration-300 ${mostrarContatos ? 'rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {mostrarContatos && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-4">
                <div>
                    <label htmlFor="contatoLocal" className="block text-sm font-medium text-white">
                      Contato do Local
                        </label>
                        <input
                          type="text"
                          id="contatoLocal"
                          value={contatoLocal}
                          onChange={(e) => setContatoLocal(e.target.value)}
                      className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                               focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                               transition-all duration-200 ease-in-out px-3 py-2 h-9"
                      placeholder="Nome do contato"
                        />
                      </div>

                      <div>
                    <label htmlFor="telefoneLocal" className="block text-sm font-medium text-white">
                      Telefone do Local
                        </label>
                        <input
                          type="tel"
                          id="telefoneLocal"
                          value={telefoneLocal}
                          onChange={(e) => setTelefoneLocal(e.target.value)}
                      className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                               focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                               transition-all duration-200 ease-in-out px-3 py-2 h-9"
                      placeholder="(00) 0000-0000"
                    />
                  </div>

                  <div>
                    <label htmlFor="contatoTecnico" className="block text-sm font-medium text-white">
                      Contato Técnico
                        </label>
                        <input
                          type="text"
                          id="contatoTecnico"
                          value={contatoTecnico}
                          onChange={(e) => setContatoTecnico(e.target.value)}
                      className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                               focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                               transition-all duration-200 ease-in-out px-3 py-2 h-9"
                      placeholder="Nome do técnico"
                        />
                      </div>

                      <div>
                    <label htmlFor="telefoneTecnico" className="block text-sm font-medium text-white">
                      Telefone do Técnico
                        </label>
                        <input
                          type="tel"
                          id="telefoneTecnico"
                          value={telefoneTecnico}
                          onChange={(e) => setTelefoneTecnico(e.target.value)}
                      className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                               focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                               transition-all duration-200 ease-in-out px-3 py-2 h-9"
                      placeholder="(00) 0000-0000"
                    />
                    </div>
                  </div>
                </div>

              <div className="mt-6">
                <label htmlFor="observacoesContato" className="block text-sm font-medium text-white">
                    Observações de Contato
                  </label>
                  <textarea
                    id="observacoesContato"
                    value={observacoesContato}
                    onChange={(e) => setObservacoesContato(e.target.value)}
                    rows={3}
                  className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                           transition-all duration-200 ease-in-out px-3 py-2"
                  placeholder="Observações adicionais sobre os contatos..."
                  />
                </div>
            </>
          )}
              </div>
      )}

            {/* Seção de Equipamentos */}
      {tipo === 'show' && (
        <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h4 className="text-base font-semibold text-white">Equipamentos</h4>
              {verificarEquipamentosPreenchidos() && (
                <span className="ml-3 px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-md">
                  Preenchido
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setMostrarEquipamentos(!mostrarEquipamentos)}
              className="flex items-center justify-center h-8 w-8 text-indigo-400 hover:text-indigo-300 focus:outline-none transition-colors rounded-full hover:bg-indigo-500/10"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform duration-300 ${mostrarEquipamentos ? 'rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {mostrarEquipamentos && (
            <div className="space-y-8">
                {/* Equipamentos Necessários */}
                <div>
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-sm font-semibold text-white">
                    Equipamentos Necessários
                    <span className="text-xs text-white/80 ml-2">(a serem providenciados)</span>
                  </h5>
                  <button
                    type="button"
                    onClick={handleAddEquipamentoNecessario}
                    className="inline-flex items-center justify-center px-3 py-2 border border-indigo-500 text-xs font-medium rounded-xl
                             text-indigo-200 hover:bg-indigo-600/40 focus:outline-none focus:ring-2 focus:ring-indigo-500
                             shadow-sm transition-all duration-200 ease-in-out h-8"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Adicionar
                  </button>
                </div>
                <div className="space-y-3">
                    {equipamentosNecessarios.map((equipamento, index) => (
                    <div key={index} className="flex items-center gap-4">
                        <input
                          type="text"
                          value={equipamento.descricao}
                          onChange={(e) => handleChangeEquipamentoNecessario(index, 'descricao', e.target.value)}
                          placeholder="Descrição do equipamento"
                        className="flex-1 rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                 transition-all duration-200 ease-in-out px-3 py-2 h-9"
                        />
                        <input
                          type="number"
                          value={equipamento.quantidade}
                          onChange={(e) => handleChangeEquipamentoNecessario(index, 'quantidade', parseInt(e.target.value))}
                          placeholder="Qtd"
                          min="1"
                        className="w-24 rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                 transition-all duration-200 ease-in-out px-3 py-2 h-9"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveEquipamentoNecessario(index)}
                        className="p-2 text-red-400 hover:text-red-300 focus:outline-none transition-colors"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Equipamentos Existentes */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-sm font-semibold text-white">
                    Equipamentos Existentes
                    <span className="text-xs text-white/80 ml-2">(já disponíveis)</span>
                  </h5>
                  <button
                    type="button"
                    onClick={handleAddEquipamentoExistente}
                    className="inline-flex items-center justify-center px-3 py-2 border border-indigo-500 text-xs font-medium rounded-xl
                             text-indigo-200 hover:bg-indigo-600/40 focus:outline-none focus:ring-2 focus:ring-indigo-500
                             shadow-sm transition-all duration-200 ease-in-out h-8"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Adicionar
                  </button>
                </div>
                <div className="space-y-3">
                    {equipamentosExistentes.map((equipamento, index) => (
                    <div key={index} className="flex items-center gap-4">
                        <input
                          type="text"
                          value={equipamento.descricao}
                          onChange={(e) => handleChangeEquipamentoExistente(index, 'descricao', e.target.value)}
                          placeholder="Descrição do equipamento"
                        className="flex-1 rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                 transition-all duration-200 ease-in-out px-3 py-2 h-9"
                        />
                        <input
                          type="number"
                          value={equipamento.quantidade}
                          onChange={(e) => handleChangeEquipamentoExistente(index, 'quantidade', parseInt(e.target.value))}
                          placeholder="Qtd"
                          min="1"
                        className="w-24 rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                 transition-all duration-200 ease-in-out px-3 py-2 h-9"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveEquipamentoExistente(index)}
                        className="p-2 text-red-400 hover:text-red-300 focus:outline-none transition-colors"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Observações de Equipamentos */}
              <div className="mt-4">
                <label htmlFor="observacoesEquipamentos" className="block text-sm font-medium text-white mb-2">
                    Observações sobre Equipamentos
                  </label>
                  <textarea
                    id="observacoesEquipamentos"
                    value={observacoesEquipamentos}
                    onChange={(e) => setObservacoesEquipamentos(e.target.value)}
                    rows={3}
                  className="w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                           transition-all duration-200 ease-in-out px-3 py-2"
                  placeholder="Observações adicionais sobre equipamentos..."
                  />
                </div>
              </div>
          )}
        </div>
      )}

      {/* Seção de Viagem */}
      {tipo === 'show' && (
        <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h4 className="text-base font-semibold text-white">Informações de Viagem</h4>
              {verificarViagemPreenchida() && (
                <span className="ml-3 px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-md">
                  Preenchido
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setMostrarViagem(!mostrarViagem)}
              className="flex items-center justify-center h-8 w-8 text-indigo-400 hover:text-indigo-300 focus:outline-none transition-colors rounded-full hover:bg-indigo-500/10"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform duration-300 ${mostrarViagem ? 'rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {mostrarViagem && (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-sm font-semibold text-white">Itens de Viagem</h5>
                  <button
                    type="button"
                    onClick={handleAddItemViagem}
                    className="inline-flex items-center justify-center px-4 py-2 border border-indigo-500 text-xs font-medium rounded-xl
                             text-indigo-200 hover:bg-indigo-600/40 focus:outline-none focus:ring-2 focus:ring-indigo-500
                             shadow-sm transition-all duration-200 ease-in-out h-8"
                  >
                    + Adicionar Item
                  </button>
                </div>

            <div className="space-y-4">
              {itensViagem.map((item, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={item.descricao}
                          onChange={(e) => handleChangeItemViagem(index, 'descricao', e.target.value)}
                          placeholder="Descrição do item"
                          className="flex-1 rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                   focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                   transition-all duration-200 ease-in-out px-3 py-2 h-9"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveItemViagem(index)}
                          className="flex items-center justify-center h-9 w-9 text-red-400 hover:text-red-300 focus:outline-none transition-colors rounded-full hover:bg-red-500/10"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={item.responsavelCusto}
                          onChange={(e) => handleChangeItemViagem(index, 'responsavelCusto', e.target.value)}
                          placeholder="Responsável"
                          className="rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                   focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                   transition-all duration-200 ease-in-out px-3 py-2 h-9"
                        />
                        <input
                          type="number"
                          value={item.valor}
                          onChange={(e) => handleChangeItemViagem(index, 'valor', e.target.value)}
                          placeholder="Valor"
                          step="0.01"
                          min="0"
                          className="rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                   focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                   transition-all duration-200 ease-in-out px-3 py-2 h-9"
                        />
                      </div>
                </div>
              ))}
                </div>
              </div>

              <div className="mt-8 p-6 bg-gray-900 rounded-2xl border border-white/20">
                <div className="mb-6">
                  <h5 className="text-xl font-bold text-white border-b border-indigo-500/30 pb-2 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Informações de Hospedagem
                  </h5>
                </div>
                
                <div className="space-y-6">
                  {/* Local e Endereço */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">Local</label>
                      <input
                        type="text"
                        value={hospedagem.local}
                        onChange={(e) => setHospedagem({ ...hospedagem, local: e.target.value })}
                        placeholder="Nome do hotel/pousada"
                        className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                 transition-all duration-200 ease-in-out px-3 py-2 h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">Endereço</label>
                      <input
                        type="text"
                        value={hospedagem.endereco}
                        onChange={(e) => setHospedagem({ ...hospedagem, endereco: e.target.value })}
                        placeholder="Endereço completo"
                        className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                 transition-all duration-200 ease-in-out px-3 py-2 h-9"
                      />
                    </div>
                  </div>

                  {/* Check-in e Check-out */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-800/40 rounded-xl">
                        <div>
                      <h6 className="text-sm font-semibold text-indigo-400 mb-3">Check-in</h6>
                      <div className="space-y-4">
                    <div className="space-y-2">
                          <label className="block text-sm font-medium text-white">Data</label>
                          <input
                            type="date"
                            value={hospedagem.dataCheckIn}
                            onChange={(e) => setHospedagem({ ...hospedagem, dataCheckIn: e.target.value })}
                        className="block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                 transition-all duration-200 ease-in-out px-3 py-2 h-9"
                          />
                        </div>
                    <div className="space-y-2">
                          <label className="block text-sm font-medium text-white">Hora</label>
                          <input
                            type="time"
                            value={hospedagem.horaCheckIn}
                            onChange={(e) => setHospedagem({ ...hospedagem, horaCheckIn: e.target.value })}
                        className="block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                 transition-all duration-200 ease-in-out px-3 py-2 h-9"
                          />
                        </div>
                      </div>
                    </div>
                        <div>
                      <h6 className="text-sm font-semibold text-indigo-400 mb-3">Check-out</h6>
                      <div className="space-y-4">
                    <div className="space-y-2">
                          <label className="block text-sm font-medium text-white">Data</label>
                          <input
                            type="date"
                            value={hospedagem.dataCheckOut}
                            onChange={(e) => setHospedagem({ ...hospedagem, dataCheckOut: e.target.value })}
                        className="block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                 transition-all duration-200 ease-in-out px-3 py-2 h-9"
                          />
                        </div>
                    <div className="space-y-2">
                          <label className="block text-sm font-medium text-white">Hora</label>
                          <input
                            type="time"
                            value={hospedagem.horaCheckOut}
                            onChange={(e) => setHospedagem({ ...hospedagem, horaCheckOut: e.target.value })}
                        className="block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                 transition-all duration-200 ease-in-out px-3 py-2 h-9"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seção de refeições incluídas */}
                  <div className="p-4 bg-gray-800/40 rounded-xl">
                    <h6 className="text-sm font-semibold text-blue-400 mb-4">Refeições Incluídas</h6>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {/* Card de Café da Manhã */}
                      <div className={`relative p-4 rounded-xl transition-all duration-300 ${hospedagem.incluiCafe 
                        ? 'bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-2 border-blue-500/40 shadow-lg shadow-blue-900/20' 
                        : 'bg-gray-800/60 border border-gray-700 opacity-75 hover:opacity-90'}`}>
                        
                        {/* Cabeçalho com Checkbox */}
                        <div className="flex items-center mb-2.5">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="incluiCafe"
                              checked={hospedagem.incluiCafe}
                              onChange={(e) => setHospedagem({ ...hospedagem, incluiCafe: e.target.checked })}
                              className="h-5 w-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-800"
                            />
                            <label htmlFor="incluiCafe" className="ml-2.5 text-sm font-bold text-white select-none cursor-pointer">
                              Café da Manhã
                            </label>
                          </div>
                        </div>
                        
                        {/* Conteúdo condicional - só aparece quando selecionado */}
                  {hospedagem.incluiCafe && (
                          <div className="mt-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h6 className="text-xs font-semibold text-blue-400 mb-2">Início</h6>
                      <div className="space-y-2">
                        <input
                          type="time"
                                    id="horarioCafeInicio"
                                    value={hospedagem.horarioCafeInicio || ''}
                          onChange={(e) => setHospedagem({ ...hospedagem, horarioCafeInicio: e.target.value })}
                                    className="block w-full rounded-lg bg-gray-800/70 border border-blue-500/40 text-sm text-white
                                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm
                                            px-2.5 py-1.5 text-sm"
                        />
                      </div>
                              </div>
                              <div>
                                <h6 className="text-xs font-semibold text-blue-400 mb-2">Término</h6>
                      <div className="space-y-2">
                        <input
                          type="time"
                                    id="horarioCafeFim"
                                    value={hospedagem.horarioCafeFim || ''}
                          onChange={(e) => setHospedagem({ ...hospedagem, horarioCafeFim: e.target.value })}
                                    className="block w-full rounded-lg bg-gray-800/70 border border-blue-500/40 text-sm text-white
                                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm
                                            px-2.5 py-1.5 text-sm"
                                  />
                                </div>
                              </div>
                      </div>
                    </div>
                  )}
                      </div>

                      {/* Card de Almoço */}
                      <div className={`relative p-4 rounded-xl transition-all duration-300 ${hospedagem.incluiAlmoco 
                        ? 'bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-2 border-blue-500/40 shadow-lg shadow-blue-900/20' 
                        : 'bg-gray-800/60 border border-gray-700 opacity-75 hover:opacity-90'}`}>
                        
                        {/* Cabeçalho com Checkbox */}
                        <div className="flex items-center mb-2.5">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="incluiAlmoco"
                              checked={hospedagem.incluiAlmoco}
                              onChange={(e) => setHospedagem({ ...hospedagem, incluiAlmoco: e.target.checked })}
                              className="h-5 w-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-800"
                            />
                            <label htmlFor="incluiAlmoco" className="ml-2.5 text-sm font-bold text-white select-none cursor-pointer">
                              Almoço
                            </label>
                          </div>
                        </div>
                        
                        {/* Conteúdo condicional - só aparece quando selecionado */}
                        {hospedagem.incluiAlmoco && (
                          <div className="mt-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h6 className="text-xs font-semibold text-blue-400 mb-2">Início</h6>
                                <div className="space-y-2">
                                  <input
                                    type="time"
                                    id="horarioAlmocoInicio"
                                    value={hospedagem.horarioAlmocoInicio || ''}
                                    onChange={(e) => setHospedagem({ ...hospedagem, horarioAlmocoInicio: e.target.value })}
                                    className="block w-full rounded-lg bg-gray-800/70 border border-blue-500/40 text-sm text-white
                                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm
                                            px-2.5 py-1.5 text-sm"
                                  />
                                </div>
                              </div>
                              <div>
                                <h6 className="text-xs font-semibold text-blue-400 mb-2">Término</h6>
                                <div className="space-y-2">
                                  <input
                                    type="time"
                                    id="horarioAlmocoFim"
                                    value={hospedagem.horarioAlmocoFim || ''}
                                    onChange={(e) => setHospedagem({ ...hospedagem, horarioAlmocoFim: e.target.value })}
                                    className="block w-full rounded-lg bg-gray-800/70 border border-blue-500/40 text-sm text-white
                                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm
                                            px-2.5 py-1.5 text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card de Jantar */}
                      <div className={`relative p-4 rounded-xl transition-all duration-300 ${hospedagem.incluiJantar 
                        ? 'bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-2 border-blue-500/40 shadow-lg shadow-blue-900/20' 
                        : 'bg-gray-800/60 border border-gray-700 opacity-75 hover:opacity-90'}`}>
                        
                        {/* Cabeçalho com Checkbox */}
                        <div className="flex items-center mb-2.5">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="incluiJantar"
                              checked={hospedagem.incluiJantar}
                              onChange={(e) => setHospedagem({ ...hospedagem, incluiJantar: e.target.checked })}
                              className="h-5 w-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-800"
                            />
                            <label htmlFor="incluiJantar" className="ml-2.5 text-sm font-bold text-white select-none cursor-pointer">
                              Jantar
                            </label>
                          </div>
                        </div>
                        
                        {/* Conteúdo condicional - só aparece quando selecionado */}
                        {hospedagem.incluiJantar && (
                          <div className="mt-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h6 className="text-xs font-semibold text-blue-400 mb-2">Início</h6>
                                <div className="space-y-2">
                                  <input
                                    type="time"
                                    id="horarioJantarInicio"
                                    value={hospedagem.horarioJantarInicio || ''}
                                    onChange={(e) => setHospedagem({ ...hospedagem, horarioJantarInicio: e.target.value })}
                                    className="block w-full rounded-lg bg-gray-800/70 border border-blue-500/40 text-sm text-white
                                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm
                                            px-2.5 py-1.5 text-sm"
                                  />
                                </div>
                              </div>
                              <div>
                                <h6 className="text-xs font-semibold text-blue-400 mb-2">Término</h6>
                                <div className="space-y-2">
                                  <input
                                    type="time"
                                    id="horarioJantarFim"
                                    value={hospedagem.horarioJantarFim || ''}
                                    onChange={(e) => setHospedagem({ ...hospedagem, horarioJantarFim: e.target.value })}
                                    className="block w-full rounded-lg bg-gray-800/70 border border-blue-500/40 text-sm text-white
                                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm
                                            px-2.5 py-1.5 text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-800/60 rounded-xl space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Valor Total (R$)</label>
                        <input
                          type="number"
                          value={hospedagem.valor}
                          onChange={(e) => setHospedagem({ ...hospedagem, valor: e.target.value })}
                          placeholder="0,00"
                          step="0.01"
                          min="0"
                          className="block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                   focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                   transition-all duration-200 ease-in-out px-3 py-2 h-9"
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-gray-800/60 rounded-xl space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Responsável pelo Custo</label>
                        <input
                          type="text"
                          value={hospedagem.responsavelCusto}
                          onChange={(e) => setHospedagem({ ...hospedagem, responsavelCusto: e.target.value })}
                          placeholder="Nome do responsável"
                          className="block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                   focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                   transition-all duration-200 ease-in-out px-3 py-2 h-9"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-gray-800/60 rounded-xl space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Número da Recepção</label>
                        <input
                          type="text"
                          value={hospedagem.numeroRecepcao}
                          onChange={(e) => setHospedagem({ ...hospedagem, numeroRecepcao: e.target.value })}
                          placeholder="Ex: +55 11 99999-9999"
                          className="block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                   focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                   transition-all duration-200 ease-in-out px-3 py-2 h-9"
                        />
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-800/60 rounded-xl space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">Observações</label>
                        <input
                          type="text"
                          value={hospedagem.observacoes}
                          onChange={(e) => setHospedagem({ ...hospedagem, observacoes: e.target.value })}
                          placeholder="Informações adicionais"
                          className="block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                   focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                   transition-all duration-200 ease-in-out px-3 py-2 h-9"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Informações de WiFi */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-800/60 rounded-xl">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">Rede WiFi</label>
                      <input
                        type="text"
                        value={hospedagem.redeWifi || ''}
                        onChange={(e) => setHospedagem({ ...hospedagem, redeWifi: e.target.value })}
                        placeholder="Nome da rede WiFi"
                        className="block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                 transition-all duration-200 ease-in-out px-3 py-2 h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">Senha WiFi</label>
                      <input
                        type="text"
                        value={hospedagem.senhaWifi || ''}
                        onChange={(e) => setHospedagem({ ...hospedagem, senhaWifi: e.target.value })}
                        placeholder="Senha da rede WiFi"
                        className="block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                 transition-all duration-200 ease-in-out px-3 py-2 h-9"
                      />
                  </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">Contato do Hotel</label>
                      <input
                        type="text"
                        value={hospedagem.contatoHotel}
                        onChange={(e) => setHospedagem({ ...hospedagem, contatoHotel: e.target.value })}
                        placeholder="Nome do contato"
                        className="block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                 transition-all duration-200 ease-in-out px-3 py-2 h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white">Telefone do Hotel</label>
                      <input
                        type="tel"
                        value={hospedagem.telefoneHotel}
                        onChange={(e) => setHospedagem({ ...hospedagem, telefoneHotel: e.target.value })}
                        placeholder="(00) 0000-0000"
                        className="block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                 transition-all duration-200 ease-in-out px-3 py-2 h-9"
                      />
                    </div>
                  </div>

                  {/* Gerenciamento de Quartos */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h6 className="text-sm font-semibold text-white">Detalhes dos Quartos</h6>
                      <button
                        type="button"
                        onClick={() => {
                          const novosQuartos = [...(hospedagem.quartos || []), { numero: '', andar: '', ocupantes: [''] }];
                          setHospedagem({ ...hospedagem, quartos: novosQuartos });
                        }}
                        className="inline-flex items-center justify-center px-4 py-2 border border-indigo-500 text-xs font-medium rounded-xl
                                 text-indigo-200 hover:bg-indigo-600/40 focus:outline-none focus:ring-2 focus:ring-indigo-500
                                 shadow-sm transition-all duration-200 ease-in-out h-8"
                      >
                        + Adicionar Quarto
                      </button>
                    </div>

                    {(hospedagem.quartos || []).map((quarto, quartoIndex) => (
                      <div key={quartoIndex} className="p-4 bg-gray-800/60 rounded-xl space-y-4 border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                          <h6 className="text-sm font-medium text-white">Quarto {quartoIndex + 1}</h6>
                          <button
                            type="button"
                            onClick={() => {
                              const novosQuartos = [...(hospedagem.quartos || [])];
                              novosQuartos.splice(quartoIndex, 1);
                              setHospedagem({ ...hospedagem, quartos: novosQuartos });
                            }}
                            className="flex items-center justify-center h-8 w-8 text-red-400 hover:text-red-300 focus:outline-none transition-colors rounded-full hover:bg-red-500/10"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                            <label className="block text-sm font-medium text-white">Número do Quarto</label>
                            <input
                              type="text"
                              value={quarto.numero}
                              onChange={(e) => {
                                const novosQuartos = [...(hospedagem.quartos || [])];
                                novosQuartos[quartoIndex] = { ...quarto, numero: e.target.value };
                                setHospedagem({ ...hospedagem, quartos: novosQuartos });
                              }}
                              placeholder="Ex: 101"
                              className="block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                       transition-all duration-200 ease-in-out px-3 py-2 h-9"
                    />
                  </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-white">Andar</label>
                            <input
                              type="text"
                              value={quarto.andar}
                              onChange={(e) => {
                                const novosQuartos = [...(hospedagem.quartos || [])];
                                novosQuartos[quartoIndex] = { ...quarto, andar: e.target.value };
                                setHospedagem({ ...hospedagem, quartos: novosQuartos });
                              }}
                              placeholder="Ex: 1"
                              className="block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                       transition-all duration-200 ease-in-out px-3 py-2 h-9"
                            />
                </div>
              </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-white">Ocupantes</label>
                            <button
                              type="button"
                              onClick={() => {
                                const novosQuartos = [...(hospedagem.quartos || [])];
                                novosQuartos[quartoIndex] = { 
                                  ...quarto, 
                                  ocupantes: [...quarto.ocupantes, ''] 
                                };
                                setHospedagem({ ...hospedagem, quartos: novosQuartos });
                              }}
                              className="inline-flex items-center justify-center px-3 py-1 border border-indigo-500 text-xs font-medium rounded-xl
                                       text-indigo-200 hover:bg-indigo-600/40 focus:outline-none focus:ring-2 focus:ring-indigo-500
                                       shadow-sm transition-all duration-200 ease-in-out h-7"
                            >
                              + Ocupante
                            </button>
            </div>

                          {quarto.ocupantes.map((ocupante, ocupanteIndex) => (
                            <div key={ocupanteIndex} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={ocupante}
                                onChange={(e) => {
                                  const novosQuartos = [...(hospedagem.quartos || [])];
                                  const novosOcupantes = [...quarto.ocupantes];
                                  novosOcupantes[ocupanteIndex] = e.target.value;
                                  novosQuartos[quartoIndex] = { ...quarto, ocupantes: novosOcupantes };
                                  setHospedagem({ ...hospedagem, quartos: novosQuartos });
                                }}
                                placeholder="Nome do ocupante"
                                className="flex-1 rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                                         focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                                         transition-all duration-200 ease-in-out px-3 py-2 h-9"
                              />
                              {quarto.ocupantes.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const novosQuartos = [...(hospedagem.quartos || [])];
                                    const novosOcupantes = [...quarto.ocupantes];
                                    novosOcupantes.splice(ocupanteIndex, 1);
                                    novosQuartos[quartoIndex] = { ...quarto, ocupantes: novosOcupantes };
                                    setHospedagem({ ...hospedagem, quartos: novosQuartos });
                                  }}
                                  className="flex items-center justify-center h-9 w-9 text-red-400 hover:text-red-300 focus:outline-none transition-colors rounded-full hover:bg-red-500/10"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Campos específicos para ensaios */}
      {tipo === 'ensaio' && (
        <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg">
          <h4 className="text-base font-semibold text-white mb-4">Informações do Ensaio</h4>
          
          <div className="space-y-6">
          <div>
            <label htmlFor="pautaEnsaio" className="block text-sm font-medium text-white">
              Pauta do Ensaio
            </label>
            <textarea
              id="pautaEnsaio"
              value={pautaEnsaio}
              onChange={(e) => setPautaEnsaio(e.target.value)}
              rows={3}
                className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                         focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                         transition-all duration-200 ease-in-out px-3 py-2 h-9"
              placeholder="Tópicos a serem abordados no ensaio"
            />
          </div>

            <div>
            <label htmlFor="objetivosEnsaio" className="block text-sm font-medium text-white">
              Objetivos do Ensaio
            </label>
            <textarea
              id="objetivosEnsaio"
              value={objetivosEnsaio}
              onChange={(e) => setObjetivosEnsaio(e.target.value)}
              rows={2}
                className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                         focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                         transition-all duration-200 ease-in-out px-3 py-2 h-9"
              placeholder="O que se espera alcançar neste ensaio"
            />
          </div>
          </div>
        </div>
      )}

      {/* Campos específicos para reuniões */}
      {tipo === 'reuniao' && (
        <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg">
          <h4 className="text-base font-semibold text-white mb-4">Informações da Reunião</h4>
          
          <div className="space-y-6">
          <div>
            <label htmlFor="pautaReuniao" className="block text-sm font-medium text-white">
              Pauta da Reunião
            </label>
            <textarea
              id="pautaReuniao"
              value={pautaReuniao}
              onChange={(e) => setPautaReuniao(e.target.value)}
              rows={3}
                className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                         focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                         transition-all duration-200 ease-in-out px-3 py-2 h-9"
              placeholder="Tópicos a serem discutidos na reunião"
            />
          </div>

            <div>
            <label htmlFor="ataReuniao" className="block text-sm font-medium text-white">
              Ata da Reunião
            </label>
            <textarea
              id="ataReuniao"
              value={ataReuniao}
              onChange={(e) => setAtaReuniao(e.target.value)}
              rows={4}
                className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                         focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                         transition-all duration-200 ease-in-out px-3 py-2 h-9"
              placeholder="Registro dos assuntos discutidos (preencher após a reunião)"
            />
          </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-white/20 text-sm text-white hover:bg-white/10
                   focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 ease-in-out
                   font-medium flex items-center justify-center"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-indigo-500 text-sm text-white hover:bg-indigo-600
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900
                   transition-all duration-200 ease-in-out font-medium shadow-lg shadow-indigo-500/20
                   flex items-center justify-center"
        >
          {evento ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
} 