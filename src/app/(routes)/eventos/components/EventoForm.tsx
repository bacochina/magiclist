'use client';

import { useState, useEffect } from 'react';
import { Evento, TipoEvento, StatusEvento, Banda, Integrante, Musica } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  quantidadeQuartos: number;
  distribuicaoQuartos: string;
  incluiCafe: boolean;
  observacoes: string;
  contatoHotel: string;
  telefoneHotel: string;
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
  const [titulo, setTitulo] = useState(evento?.titulo || '');
  const [tipo, setTipo] = useState<TipoEvento>(evento?.tipo || 'show');
  const [data, setData] = useState(evento?.data || format(new Date(), 'yyyy-MM-dd'));
  const [horaInicio, setHoraInicio] = useState(evento?.horaInicio || '19:00');
  const [horaFim, setHoraFim] = useState(evento?.horaFim || '22:00');
  const [local, setLocal] = useState(evento?.local || '');
  const [endereco, setEndereco] = useState(evento?.endereco || '');
  const [bandaId, setBandaId] = useState(evento?.bandaId || '');
  const [integrantesIds, setIntegrantesIds] = useState<string[]>(evento?.integrantesIds || []);
  const [status, setStatus] = useState<StatusEvento>(evento?.status || 'agendado');
  const [descricao, setDescricao] = useState(evento?.descricao || '');
  
  // Campos específicos para shows
  const [valorCache, setValorCache] = useState(evento?.valorCache?.toString() || '');
  const [custos, setCustos] = useState<Custo[]>(evento?.custos || [{ descricao: '', valor: '' }]);
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
  const [temViagem, setTemViagem] = useState(evento?.temViagem || false);
  const [itensViagem, setItensViagem] = useState<ItemViagem[]>(
    evento?.itensViagem ? evento.itensViagem.map(item => ({
      ...item,
      valor: item.valor.toString()
    })) : [{ data: format(new Date(), 'yyyy-MM-dd'), descricao: '', valor: '', responsavelCusto: '' }]
  );

  // Novo campo para observações de contato
  const [observacoesContato, setObservacoesContato] = useState(evento?.observacoesContato || '');

  const [hospedagem, setHospedagem] = useState<Hospedagem>({
    local: evento?.hospedagem?.local || '',
    endereco: evento?.hospedagem?.endereco || '',
    dataCheckIn: evento?.hospedagem?.dataCheckIn || format(new Date(), 'yyyy-MM-dd'),
    dataCheckOut: evento?.hospedagem?.dataCheckOut || format(new Date(), 'yyyy-MM-dd'),
    horaCheckIn: evento?.hospedagem?.horaCheckIn || '14:00',
    horaCheckOut: evento?.hospedagem?.horaCheckOut || '12:00',
    valor: evento?.hospedagem?.valor?.toString() || '',
    responsavelCusto: evento?.hospedagem?.responsavelCusto || '',
    quantidadeQuartos: evento?.hospedagem?.quantidadeQuartos || 1,
    distribuicaoQuartos: evento?.hospedagem?.distribuicaoQuartos || '',
    incluiCafe: evento?.hospedagem?.incluiCafe || false,
    observacoes: evento?.hospedagem?.observacoes || '',
    contatoHotel: evento?.hospedagem?.contatoHotel || '',
    telefoneHotel: evento?.hospedagem?.telefoneHotel || ''
  });

  // Cálculos financeiros
  const totalCustos = custos.reduce((total, custo) => {
    const valor = parseFloat(custo.valor) || 0;
    return total + valor;
  }, 0);

  const cacheLiquido = (parseFloat(valorCache) || 0) - totalCustos;

  // Função para formatar valores monetários
  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Funções para gerenciar custos
  const handleAddCusto = () => {
    setCustos([...custos, { descricao: '', valor: '' }]);
  };

  const handleRemoveCusto = (index: number) => {
    const novosCustos = [...custos];
    novosCustos.splice(index, 1);
    setCustos(novosCustos);
  };

  const handleChangeCusto = (index: number, campo: 'descricao' | 'valor', valor: string) => {
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
    if (tipo === 'show' && temViagem) {
      const totalViagem = calcularTotalGastosViagem();
      
      // Procura se já existe um custo de viagem
      const custoViagemIndex = custos.findIndex(c => c.descricao === 'Gastos com Viagem');
      
      if (custoViagemIndex >= 0) {
        // Atualiza o custo existente
        const novosCustos = [...custos];
        novosCustos[custoViagemIndex] = {
          descricao: 'Gastos com Viagem',
          valor: totalViagem.toString()
        };
        setCustos(novosCustos);
      } else if (totalViagem > 0) {
        // Adiciona novo custo
        setCustos([
          ...custos,
          {
            descricao: 'Gastos com Viagem',
            valor: totalViagem.toString()
          }
        ]);
      }
    } else {
      // Remove o custo de viagem se não houver viagem
      setCustos(custos.filter(c => c.descricao !== 'Gastos com Viagem'));
    }
  }, [tipo, temViagem, itensViagem, hospedagem.valor]);

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
      setCustos(evento.custos || [{ descricao: '', valor: '' }]);
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
      setTemViagem(evento.temViagem || false);
      setItensViagem(
        evento.itensViagem ? evento.itensViagem.map(item => ({
          ...item,
          valor: item.valor.toString()
        })) : [{ data: format(new Date(), 'yyyy-MM-dd'), descricao: '', valor: '', responsavelCusto: '' }]
      );

      // Novo campo para observações de contato
      setObservacoesContato(evento.observacoesContato || '');

      setHospedagem({
        local: evento.hospedagem?.local || '',
        endereco: evento.hospedagem?.endereco || '',
        dataCheckIn: evento.hospedagem?.dataCheckIn || format(new Date(), 'yyyy-MM-dd'),
        dataCheckOut: evento.hospedagem?.dataCheckOut || format(new Date(), 'yyyy-MM-dd'),
        horaCheckIn: evento.hospedagem?.horaCheckIn || '14:00',
        horaCheckOut: evento.hospedagem?.horaCheckOut || '12:00',
        valor: evento.hospedagem?.valor?.toString() || '',
        responsavelCusto: evento.hospedagem?.responsavelCusto || '',
        quantidadeQuartos: evento.hospedagem?.quantidadeQuartos || 1,
        distribuicaoQuartos: evento.hospedagem?.distribuicaoQuartos || '',
        incluiCafe: evento.hospedagem?.incluiCafe || false,
        observacoes: evento.hospedagem?.observacoes || '',
        contatoHotel: evento.hospedagem?.contatoHotel || '',
        telefoneHotel: evento.hospedagem?.telefoneHotel || ''
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
      eventoData.custos = custos.filter(c => c.descricao.trim() !== '' || c.valor.trim() !== '');
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
      eventoData.temViagem = temViagem;
      if (temViagem) {
        eventoData.itensViagem = itensViagem
          .filter(item => item.descricao.trim() !== '' || item.valor.trim() !== '')
          .map(item => ({
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
            quantidadeQuartos: hospedagem.quantidadeQuartos,
            distribuicaoQuartos: hospedagem.distribuicaoQuartos || undefined,
            incluiCafe: hospedagem.incluiCafe,
            observacoes: hospedagem.observacoes || undefined,
            contatoHotel: hospedagem.contatoHotel || undefined,
            telefoneHotel: hospedagem.telefoneHotel || undefined
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
            Título *
          </label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de Evento *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setTipo('show')}
              className={`p-2 rounded-lg border-2 transition-all ${
                tipo === 'show'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex flex-col items-center space-y-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${tipo === 'show' ? 'text-indigo-600' : 'text-gray-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <span className={`text-sm font-medium ${tipo === 'show' ? 'text-indigo-600' : 'text-gray-900'}`}>
                  Show
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTipo('ensaio')}
              className={`p-2 rounded-lg border-2 transition-all ${
                tipo === 'ensaio'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex flex-col items-center space-y-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${tipo === 'ensaio' ? 'text-indigo-600' : 'text-gray-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
                <span className={`text-sm font-medium ${tipo === 'ensaio' ? 'text-indigo-600' : 'text-gray-900'}`}>
                  Ensaio
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTipo('reuniao')}
              className={`p-2 rounded-lg border-2 transition-all ${
                tipo === 'reuniao'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex flex-col items-center space-y-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${tipo === 'reuniao' ? 'text-indigo-600' : 'text-gray-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                <span className={`text-sm font-medium ${tipo === 'reuniao' ? 'text-indigo-600' : 'text-gray-900'}`}>
                  Reunião
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="data" className="block text-sm font-medium text-gray-700">
            Data *
          </label>
          <input
            type="date"
            id="data"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="horaInicio" className="block text-sm font-medium text-gray-700">
            Hora de Início *
          </label>
          <input
            type="time"
            id="horaInicio"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="horaFim" className="block text-sm font-medium text-gray-700">
            Hora de Término *
          </label>
          <input
            type="time"
            id="horaFim"
            value={horaFim}
            onChange={(e) => setHoraFim(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="local" className="block text-sm font-medium text-gray-700">
            Local *
          </label>
          <input
            type="text"
            id="local"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="endereco" className="block text-sm font-medium text-gray-700">
            Endereço
          </label>
          <input
            type="text"
            id="endereco"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status *
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusEvento)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="agendado">Agendado</option>
          <option value="confirmado">Confirmado</option>
          <option value="cancelado">Cancelado</option>
          <option value="concluido">Concluído</option>
        </select>
      </div>

      <div>
        <label htmlFor="banda" className="block text-sm font-medium text-gray-700">
          Banda
        </label>
        <select
          id="banda"
          value={bandaId}
          onChange={(e) => setBandaId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Selecione uma banda</option>
          {bandas.map((banda) => (
            <option key={banda.id} value={banda.id}>
              {banda.nome}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Integrantes
        </label>
        <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
          {integrantes.map((integrante) => (
            <div key={integrante.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`integrante-${integrante.id}`}
                checked={integrantesIds.includes(integrante.id)}
                onChange={() => handleToggleIntegrante(integrante.id)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor={`integrante-${integrante.id}`} className="ml-2 block text-sm text-gray-900">
                {integrante.nome} <span className="text-gray-500 text-xs">({integrante.funcao})</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Campos específicos para shows */}
      {tipo === 'show' && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informações do Show</h3>
          
          <div className="space-y-6">
            {/* Seção de Cachê */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-md font-medium text-gray-900 mb-4">Informações Financeiras</h4>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="valorCacheBruto" className="block text-sm font-medium text-gray-700">
                    Cachê Bruto (R$)
                  </label>
                  <input
                    type="number"
                    id="valorCacheBruto"
                    value={valorCache}
                    onChange={(e) => setValorCache(e.target.value)}
                    step="0.01"
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custos do Show
                  </label>
                  <div className="space-y-2">
                    {custos.map((custo, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={custo.descricao}
                          onChange={(e) => handleChangeCusto(index, 'descricao', e.target.value)}
                          placeholder="Descrição do custo"
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <input
                          type="number"
                          value={custo.valor}
                          onChange={(e) => handleChangeCusto(index, 'valor', e.target.value)}
                          placeholder="Valor"
                          step="0.01"
                          min="0"
                          className="w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCusto(index)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddCusto}
                      className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      + Adicionar Custo
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Total de Custos:</span>
                    <span>R$ {formatarMoeda(totalCustos)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium mt-2">
                    <span>Cachê Líquido:</span>
                    <span>R$ {formatarMoeda(cacheLiquido)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <label htmlFor="qtdeIntegrantes" className="block text-sm font-medium text-gray-700">
                    Quantidade de Integrantes no Show
                  </label>
                  <input
                    type="number"
                    id="qtdeIntegrantes"
                    value={qtdeIntegrantes}
                    onChange={(e) => setQtdeIntegrantes(Number(e.target.value))}
                    min="1"
                    className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {qtdeIntegrantes > 0 && cacheLiquido > 0 && (
                    <div className="mt-2 p-2 bg-indigo-50 rounded-md">
                      <span className="text-sm font-medium text-indigo-700">
                        Cachê por Integrante: R$ {formatarMoeda(cacheLiquido / qtdeIntegrantes)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Seção de Contatos */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-md font-medium text-gray-900 mb-4">Contatos</h4>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="horarioPassagemSom" className="block text-sm font-medium text-gray-700">
                    Horário da Passagem de Som
                  </label>
                  <input
                    type="time"
                    id="horarioPassagemSom"
                    value={horarioPassagemSom}
                    onChange={(e) => setHorarioPassagemSom(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Local do Show</h5>
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="contatoLocal" className="block text-sm text-gray-500">
                          Nome do Contato
                        </label>
                        <input
                          type="text"
                          id="contatoLocal"
                          value={contatoLocal}
                          onChange={(e) => setContatoLocal(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="telefoneLocal" className="block text-sm text-gray-500">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          id="telefoneLocal"
                          value={telefoneLocal}
                          onChange={(e) => setTelefoneLocal(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Técnico de Som</h5>
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="contatoTecnico" className="block text-sm text-gray-500">
                          Nome do Técnico
                        </label>
                        <input
                          type="text"
                          id="contatoTecnico"
                          value={contatoTecnico}
                          onChange={(e) => setContatoTecnico(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="telefoneTecnico" className="block text-sm text-gray-500">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          id="telefoneTecnico"
                          value={telefoneTecnico}
                          onChange={(e) => setTelefoneTecnico(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <label htmlFor="observacoesContato" className="block text-sm font-medium text-gray-700">
                    Observações de Contato
                  </label>
                  <textarea
                    id="observacoesContato"
                    value={observacoesContato}
                    onChange={(e) => setObservacoesContato(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Observações adicionais sobre os contatos..."
                  />
                </div>
              </div>
            </div>

            {/* Seção de Equipamentos */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-md font-medium text-gray-900 mb-4">Equipamentos</h4>
              
              <div className="space-y-6">
                {/* Equipamentos Necessários */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Equipamentos Necessários
                    <span className="text-xs text-gray-500 ml-2">(a serem providenciados)</span>
                  </h5>
                  <div className="space-y-2">
                    {equipamentosNecessarios.map((equipamento, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={equipamento.descricao}
                          onChange={(e) => handleChangeEquipamentoNecessario(index, 'descricao', e.target.value)}
                          placeholder="Descrição do equipamento"
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <input
                          type="number"
                          value={equipamento.quantidade}
                          onChange={(e) => handleChangeEquipamentoNecessario(index, 'quantidade', parseInt(e.target.value))}
                          placeholder="Qtd"
                          min="1"
                          className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveEquipamentoNecessario(index)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddEquipamentoNecessario}
                      className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      + Adicionar Equipamento
                    </button>
                  </div>
                </div>

                {/* Equipamentos Existentes */}
                <div className="pt-4 border-t border-gray-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Equipamentos Existentes
                    <span className="text-xs text-gray-500 ml-2">(já disponíveis)</span>
                  </h5>
                  <div className="space-y-2">
                    {equipamentosExistentes.map((equipamento, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={equipamento.descricao}
                          onChange={(e) => handleChangeEquipamentoExistente(index, 'descricao', e.target.value)}
                          placeholder="Descrição do equipamento"
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <input
                          type="number"
                          value={equipamento.quantidade}
                          onChange={(e) => handleChangeEquipamentoExistente(index, 'quantidade', parseInt(e.target.value))}
                          placeholder="Qtd"
                          min="1"
                          className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveEquipamentoExistente(index)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddEquipamentoExistente}
                      className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      + Adicionar Equipamento
                    </button>
                  </div>
                </div>

                {/* Observações de Equipamentos */}
                <div className="pt-4 border-t border-gray-200">
                  <label htmlFor="observacoesEquipamentos" className="block text-sm font-medium text-gray-700">
                    Observações sobre Equipamentos
                  </label>
                  <textarea
                    id="observacoesEquipamentos"
                    value={observacoesEquipamentos}
                    onChange={(e) => setObservacoesEquipamentos(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Observações adicionais sobre os equipamentos..."
                  />
                </div>
              </div>
            </div>

            {/* Seção de Viagem */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-900">Informações de Viagem</h4>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="temViagem"
                    checked={temViagem}
                    onChange={(e) => setTemViagem(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="temViagem" className="ml-2 block text-sm text-gray-900">
                    Este show inclui viagem
                  </label>
                </div>
              </div>

              {temViagem && (
                <div className="space-y-4">
                  {itensViagem.map((item, index) => (
                    <div key={index} className="flex items-start gap-2 bg-white p-3 rounded-md shadow-sm">
                      <div className="flex-1 space-y-3">
                        {/* Primeira linha: Data e Descrição */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500">Data</label>
                            <input
                              type="date"
                              value={item.data}
                              onChange={(e) => handleChangeItemViagem(index, 'data', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500">Descrição</label>
                            <input
                              type="text"
                              value={item.descricao}
                              onChange={(e) => handleChangeItemViagem(index, 'descricao', e.target.value)}
                              placeholder="Descrição do item"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        {/* Segunda linha: Valor e Responsável */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500">Valor (R$)</label>
                            <input
                              type="number"
                              value={item.valor}
                              onChange={(e) => handleChangeItemViagem(index, 'valor', e.target.value)}
                              placeholder="0,00"
                              step="0.01"
                              min="0"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500">Responsável pelo Custo</label>
                            <input
                              type="text"
                              value={item.responsavelCusto}
                              onChange={(e) => handleChangeItemViagem(index, 'responsavelCusto', e.target.value)}
                              placeholder="Nome do responsável"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItemViagem(index)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddItemViagem}
                    className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    + Adicionar Item de Viagem
                  </button>

                  <div className="mt-4 p-3 bg-indigo-50 rounded-md">
                    <div className="text-sm font-medium text-indigo-700">
                      Total de Gastos com Viagem: R$ {formatarMoeda(calcularTotalGastosViagem())}
                      <div className="text-xs text-indigo-600 mt-1">
                        (Este valor será automaticamente incluído nos custos do show)
                      </div>
                    </div>
                  </div>

                  {/* Seção de Hospedagem */}
                  <div className="mt-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h5 className="text-lg font-semibold text-gray-900">Informações de Hospedagem</h5>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="incluiCafe"
                          checked={hospedagem.incluiCafe}
                          onChange={(e) => setHospedagem({ ...hospedagem, incluiCafe: e.target.checked })}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="incluiCafe" className="ml-2 text-sm text-gray-700">
                          Inclui café da manhã
                        </label>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Local e Endereço */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Local</label>
                          <input
                            type="text"
                            value={hospedagem.local}
                            onChange={(e) => setHospedagem({ ...hospedagem, local: e.target.value })}
                            placeholder="Nome do hotel/pousada"
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Endereço</label>
                          <input
                            type="text"
                            value={hospedagem.endereco}
                            onChange={(e) => setHospedagem({ ...hospedagem, endereco: e.target.value })}
                            placeholder="Endereço completo"
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      {/* Check-in e Check-out */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Check-in</label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Data</label>
                              <input
                                type="date"
                                value={hospedagem.dataCheckIn}
                                onChange={(e) => setHospedagem({ ...hospedagem, dataCheckIn: e.target.value })}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Hora</label>
                              <input
                                type="time"
                                value={hospedagem.horaCheckIn}
                                onChange={(e) => setHospedagem({ ...hospedagem, horaCheckIn: e.target.value })}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-xs"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Check-out</label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Data</label>
                              <input
                                type="date"
                                value={hospedagem.dataCheckOut}
                                onChange={(e) => setHospedagem({ ...hospedagem, dataCheckOut: e.target.value })}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Hora</label>
                              <input
                                type="time"
                                value={hospedagem.horaCheckOut}
                                onChange={(e) => setHospedagem({ ...hospedagem, horaCheckOut: e.target.value })}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Informações Financeiras e Quartos */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Valor Total (R$)</label>
                            <input
                              type="number"
                              value={hospedagem.valor}
                              onChange={(e) => setHospedagem({ ...hospedagem, valor: e.target.value })}
                              placeholder="0,00"
                              step="0.01"
                              min="0"
                              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Responsável pelo Custo</label>
                            <input
                              type="text"
                              value={hospedagem.responsavelCusto}
                              onChange={(e) => setHospedagem({ ...hospedagem, responsavelCusto: e.target.value })}
                              placeholder="Nome do responsável"
                              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Quantidade de Quartos</label>
                            <input
                              type="number"
                              value={hospedagem.quantidadeQuartos}
                              onChange={(e) => setHospedagem({ ...hospedagem, quantidadeQuartos: parseInt(e.target.value) })}
                              min="1"
                              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Distribuição dos Quartos</label>
                            <input
                              type="text"
                              value={hospedagem.distribuicaoQuartos}
                              onChange={(e) => setHospedagem({ ...hospedagem, distribuicaoQuartos: e.target.value })}
                              placeholder="Ex: 2 duplos, 1 triplo"
                              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Contatos do Hotel */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Contato do Hotel</label>
                          <input
                            type="text"
                            value={hospedagem.contatoHotel}
                            onChange={(e) => setHospedagem({ ...hospedagem, contatoHotel: e.target.value })}
                            placeholder="Nome do contato"
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Telefone do Hotel</label>
                          <input
                            type="tel"
                            value={hospedagem.telefoneHotel}
                            onChange={(e) => setHospedagem({ ...hospedagem, telefoneHotel: e.target.value })}
                            placeholder="(00) 0000-0000"
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      {/* Observações */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Observações</label>
                        <textarea
                          value={hospedagem.observacoes}
                          onChange={(e) => setHospedagem({ ...hospedagem, observacoes: e.target.value })}
                          rows={3}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Observações adicionais sobre a hospedagem..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Campos específicos para ensaios */}
      {tipo === 'ensaio' && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informações do Ensaio</h3>
          
          <div>
            <label htmlFor="pautaEnsaio" className="block text-sm font-medium text-gray-700">
              Pauta do Ensaio
            </label>
            <textarea
              id="pautaEnsaio"
              value={pautaEnsaio}
              onChange={(e) => setPautaEnsaio(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Tópicos a serem abordados no ensaio"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="objetivosEnsaio" className="block text-sm font-medium text-gray-700">
              Objetivos do Ensaio
            </label>
            <textarea
              id="objetivosEnsaio"
              value={objetivosEnsaio}
              onChange={(e) => setObjetivosEnsaio(e.target.value)}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="O que se espera alcançar neste ensaio"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Músicas a Ensaiar
            </label>
            <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
              {musicas.map((musica) => (
                <div key={musica.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`musica-${musica.id}`}
                    checked={musicasEnsaio.includes(musica.id)}
                    onChange={() => handleToggleMusica(musica.id)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`musica-${musica.id}`} className="ml-2 block text-sm text-gray-900">
                    {musica.nome} - {musica.artista} <span className="text-gray-500 text-xs">(Tom: {musica.tom}, BPM: {musica.bpm})</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Campos específicos para reuniões */}
      {tipo === 'reuniao' && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informações da Reunião</h3>
          
          <div>
            <label htmlFor="pautaReuniao" className="block text-sm font-medium text-gray-700">
              Pauta da Reunião
            </label>
            <textarea
              id="pautaReuniao"
              value={pautaReuniao}
              onChange={(e) => setPautaReuniao(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Tópicos a serem discutidos na reunião"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="ataReuniao" className="block text-sm font-medium text-gray-700">
              Ata da Reunião
            </label>
            <textarea
              id="ataReuniao"
              value={ataReuniao}
              onChange={(e) => setAtaReuniao(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Registro dos assuntos discutidos (preencher após a reunião)"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Decisões Tomadas
            </label>
            {decisoesTomadas.map((decisao, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={decisao}
                  onChange={(e) => handleChangeDecisao(index, e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder={`Decisão ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveDecisao(index)}
                  className="ml-2 text-red-600 hover:text-red-800"
                  disabled={decisoesTomadas.length === 1}
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddDecisao}
              className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              + Adicionar Decisão
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {evento ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
} 