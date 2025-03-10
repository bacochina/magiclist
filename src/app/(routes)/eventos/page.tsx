'use client';

import { useState, useEffect, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Evento, TipoEvento, StatusEvento, Banda, Integrante, Musica } from '@/lib/types';
import { useHydratedLocalStorage } from '@/hooks/useHydratedLocalStorage';
import { ClientOnly } from '../blocos/components/ClientOnly';
import { EventoForm } from './components/EventoForm';
import { format, parseISO, isAfter, isBefore, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  DocumentTextIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as ClockIconSolid,
  MusicalNoteIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function EventosPage() {
  const [eventos, setEventos] = useHydratedLocalStorage<Evento[]>('eventos', []);
  const [bandas] = useHydratedLocalStorage<Banda[]>('bandas', []);
  const [integrantes] = useHydratedLocalStorage<Integrante[]>('integrantes', []);
  const [musicas] = useHydratedLocalStorage<Musica[]>('musicas', []);
  const [repertorios] = useHydratedLocalStorage<{ id: string; nome: string; musicas: string[] }[]>('repertorios', []);
  
  const [modalAberto, setModalAberto] = useState(false);
  const [eventoEmEdicao, setEventoEmEdicao] = useState<Evento | undefined>();
  const [modalRelatorioAberto, setModalRelatorioAberto] = useState(false);
  const [eventoParaRelatorio, setEventoParaRelatorio] = useState<Evento | undefined>();
  
  // Filtros
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<TipoEvento | 'todos'>('todos');
  const [filtroStatus, setFiltroStatus] = useState<StatusEvento | 'todos'>('todos');
  const [filtroBanda, setFiltroBanda] = useState<string>('');
  const [filtroPeriodo, setFiltroPeriodo] = useState<'todos' | 'passados' | 'hoje' | 'futuros'>('todos');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Ordenação
  const [ordenacao, setOrdenacao] = useState<'data-asc' | 'data-desc' | 'titulo-asc' | 'titulo-desc'>('data-asc');

  // Filtra eventos baseado nos critérios
  const eventosFiltrados = useMemo(() => {
    return eventos
      .filter(evento => {
        // Filtro de busca
        const termoBusca = busca.toLowerCase();
        const matchBusca = 
          evento.titulo.toLowerCase().includes(termoBusca) || 
          evento.local.toLowerCase().includes(termoBusca) ||
          (evento.descricao && evento.descricao.toLowerCase().includes(termoBusca));
        
        // Filtro de tipo
        const matchTipo = filtroTipo === 'todos' || evento.tipo === filtroTipo;
        
        // Filtro de status
        const matchStatus = filtroStatus === 'todos' || evento.status === filtroStatus;
        
        // Filtro de banda
        const matchBanda = !filtroBanda || evento.bandaId === filtroBanda;
        
        // Filtro de período
        let matchPeriodo = true;
        if (filtroPeriodo !== 'todos') {
          const dataEvento = parseISO(evento.data);
          const hoje = new Date();
          
          if (filtroPeriodo === 'passados') {
            matchPeriodo = isBefore(dataEvento, hoje) && !isToday(dataEvento);
          } else if (filtroPeriodo === 'hoje') {
            matchPeriodo = isToday(dataEvento);
          } else if (filtroPeriodo === 'futuros') {
            matchPeriodo = isAfter(dataEvento, hoje) && !isToday(dataEvento);
          }
        }
        
        return matchBusca && matchTipo && matchStatus && matchBanda && matchPeriodo;
      })
      .sort((a, b) => {
        // Ordenação
        if (ordenacao === 'data-asc') {
          return a.data.localeCompare(b.data) || a.horaInicio.localeCompare(b.horaInicio);
        } else if (ordenacao === 'data-desc') {
          return b.data.localeCompare(a.data) || b.horaInicio.localeCompare(a.horaInicio);
        } else if (ordenacao === 'titulo-asc') {
          return a.titulo.localeCompare(b.titulo);
        } else {
          return b.titulo.localeCompare(a.titulo);
        }
      });
  }, [eventos, busca, filtroTipo, filtroStatus, filtroBanda, filtroPeriodo, ordenacao]);

  const handleAdicionarEvento = () => {
    setEventoEmEdicao(undefined);
    setModalAberto(true);
  };

  const handleEditarEvento = (evento: Evento) => {
    setEventoEmEdicao(evento);
    setModalAberto(true);
  };

  const handleExcluirEvento = (eventoId: string) => {
    const evento = eventos.find(e => e.id === eventoId);
    if (evento && confirm(`Tem certeza que deseja excluir o evento "${evento.titulo}"?`)) {
      setEventos(eventos.filter((e) => e.id !== eventoId));
    }
  };

  const handleGerarRelatorio = (evento: Evento) => {
    setEventoParaRelatorio(evento);
    setModalRelatorioAberto(true);
  };

  const handleSubmit = (data: Partial<Evento>) => {
    if (eventoEmEdicao) {
      setEventos(
        eventos.map((e) =>
          e.id === eventoEmEdicao.id
            ? { ...e, ...data }
            : e
        )
      );
    } else {
      const novoEvento: Evento = {
        id: Math.random().toString(36).substr(2, 9),
        titulo: data.titulo || '',
        tipo: data.tipo || 'ensaio',
        data: data.data || format(new Date(), 'yyyy-MM-dd'),
        horaInicio: data.horaInicio || '19:00',
        horaFim: data.horaFim || '22:00',
        local: data.local || '',
        endereco: data.endereco,
        bandaId: data.bandaId,
        integrantesIds: data.integrantesIds || [],
        status: data.status || 'agendado',
        descricao: data.descricao,
        
        // Campos específicos para shows
        valorCache: data.valorCache,
        contatoLocal: data.contatoLocal,
        telefoneLocal: data.telefoneLocal,
        observacoesShow: data.observacoesShow,
        repertorioId: data.repertorioId,
        
        // Campos específicos para ensaios
        pautaEnsaio: data.pautaEnsaio,
        objetivosEnsaio: data.objetivosEnsaio,
        musicasEnsaio: data.musicasEnsaio,
        
        // Campos específicos para reuniões
        pautaReuniao: data.pautaReuniao,
        ataReuniao: data.ataReuniao,
        decisoesTomadas: data.decisoesTomadas,
      };
      setEventos([...eventos, novoEvento]);
    }
    setModalAberto(false);
    setEventoEmEdicao(undefined);
  };

  // Função para obter o nome da banda a partir do ID
  const getNomeBanda = (bandaId?: string) => {
    if (!bandaId) return '';
    const banda = bandas.find(b => b.id === bandaId);
    return banda ? banda.nome : '';
  };

  // Função para obter o ícone do tipo de evento
  const getIconeTipoEvento = (tipo: TipoEvento) => {
    switch (tipo) {
      case 'show':
        return <MusicalNoteIcon className="h-5 w-5 text-purple-500" />;
      case 'ensaio':
        return <ClockIconSolid className="h-5 w-5 text-blue-500" />;
      case 'reuniao':
        return <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-500" />;
      default:
        return <CalendarIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Função para obter a cor de fundo com base no status
  const getCorStatus = (status: StatusEvento) => {
    switch (status) {
      case 'agendado':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmado':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      case 'concluido':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para formatar a data
  const formatarData = (dataISO: string) => {
    return format(parseISO(dataISO), 'dd/MM/yyyy', { locale: ptBR });
  };

  return (
    <div className="min-h-screen relative">
      {/* Background específico para eventos */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Conteúdo da página */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
            <h1 className="text-3xl font-bold text-white mb-6">Eventos</h1>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <p className="text-gray-600">Gerencie shows, ensaios e reuniões da sua banda</p>
              </div>
              <button
                onClick={handleAdicionarEvento}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Novo Evento
              </button>
            </div>

            <div className="mb-8 bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Filtros e Busca</h2>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                  <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      placeholder="Buscar eventos por título, local ou descrição..."
                      className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm shadow-sm"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <select
                      value={ordenacao}
                      onChange={(e) => setOrdenacao(e.target.value as any)}
                      className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm shadow-sm"
                    >
                      <option value="data-asc">Data (mais próxima)</option>
                      <option value="data-desc">Data (mais distante)</option>
                      <option value="titulo-asc">Título (A-Z)</option>
                      <option value="titulo-desc">Título (Z-A)</option>
                    </select>
                    
                    <button
                      onClick={() => setMostrarFiltros(!mostrarFiltros)}
                      className={`inline-flex items-center p-2 rounded-md transition-colors duration-200 ${
                        mostrarFiltros
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title="Filtros avançados"
                    >
                      <AdjustmentsHorizontalIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {mostrarFiltros && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <label htmlFor="filtroTipo" className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Evento
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setFiltroTipo('todos')}
                          className={`px-3 py-1 rounded-full text-sm ${
                            filtroTipo === 'todos' 
                              ? 'bg-gray-900 text-white' 
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          Todos
                        </button>
                        <button
                          onClick={() => setFiltroTipo('show')}
                          className={`px-3 py-1 rounded-full text-sm flex items-center ${
                            filtroTipo === 'show' 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                          }`}
                        >
                          <MusicalNoteIcon className="h-4 w-4 mr-1" />
                          Shows
                        </button>
                        <button
                          onClick={() => setFiltroTipo('ensaio')}
                          className={`px-3 py-1 rounded-full text-sm flex items-center ${
                            filtroTipo === 'ensaio' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          }`}
                        >
                          <ClockIconSolid className="h-4 w-4 mr-1" />
                          Ensaios
                        </button>
                        <button
                          onClick={() => setFiltroTipo('reuniao')}
                          className={`px-3 py-1 rounded-full text-sm flex items-center ${
                            filtroTipo === 'reuniao' 
                              ? 'bg-green-600 text-white' 
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                          Reuniões
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="filtroStatus" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setFiltroStatus('todos')}
                          className={`px-3 py-1 rounded-full text-sm ${
                            filtroStatus === 'todos' 
                              ? 'bg-gray-900 text-white' 
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          Todos
                        </button>
                        <button
                          onClick={() => setFiltroStatus('agendado')}
                          className={`px-3 py-1 rounded-full text-sm ${
                            filtroStatus === 'agendado' 
                              ? 'bg-yellow-500 text-white' 
                              : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                          }`}
                        >
                          Agendado
                        </button>
                        <button
                          onClick={() => setFiltroStatus('confirmado')}
                          className={`px-3 py-1 rounded-full text-sm ${
                            filtroStatus === 'confirmado' 
                              ? 'bg-green-600 text-white' 
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          Confirmado
                        </button>
                        <button
                          onClick={() => setFiltroStatus('cancelado')}
                          className={`px-3 py-1 rounded-full text-sm ${
                            filtroStatus === 'cancelado' 
                              ? 'bg-red-600 text-white' 
                              : 'bg-red-50 text-red-700 hover:bg-red-100'
                          }`}
                        >
                          Cancelado
                        </button>
                        <button
                          onClick={() => setFiltroStatus('concluido')}
                          className={`px-3 py-1 rounded-full text-sm ${
                            filtroStatus === 'concluido' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          }`}
                        >
                          Concluído
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="filtroBanda" className="block text-sm font-medium text-gray-700 mb-1">
                        Banda
                      </label>
                      <select
                        id="filtroBanda"
                        value={filtroBanda}
                        onChange={(e) => setFiltroBanda(e.target.value)}
                        className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm shadow-sm"
                      >
                        <option value="">Todas as bandas</option>
                        {bandas.map((banda) => (
                          <option key={banda.id} value={banda.id}>
                            {banda.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="filtroPeriodo" className="block text-sm font-medium text-gray-700 mb-1">
                        Período
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setFiltroPeriodo('todos')}
                          className={`px-3 py-1 rounded-full text-sm ${
                            filtroPeriodo === 'todos' 
                              ? 'bg-gray-900 text-white' 
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          Todos
                        </button>
                        <button
                          onClick={() => setFiltroPeriodo('passados')}
                          className={`px-3 py-1 rounded-full text-sm ${
                            filtroPeriodo === 'passados' 
                              ? 'bg-gray-600 text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Passados
                        </button>
                        <button
                          onClick={() => setFiltroPeriodo('hoje')}
                          className={`px-3 py-1 rounded-full text-sm ${
                            filtroPeriodo === 'hoje' 
                              ? 'bg-indigo-600 text-white' 
                              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                          }`}
                        >
                          Hoje
                        </button>
                        <button
                          onClick={() => setFiltroPeriodo('futuros')}
                          className={`px-3 py-1 rounded-full text-sm ${
                            filtroPeriodo === 'futuros' 
                              ? 'bg-teal-600 text-white' 
                              : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                          }`}
                        >
                          Futuros
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Estatísticas rápidas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 border-b border-gray-200">
                <div className="p-4 text-center">
                  <p className="text-sm font-medium text-gray-500">Total de Eventos</p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">{eventos.length}</p>
                </div>
                <div className="p-4 text-center">
                  <p className="text-sm font-medium text-gray-500">Eventos Futuros</p>
                  <p className="mt-1 text-3xl font-semibold text-indigo-600">
                    {eventos.filter(e => {
                      const dataEvento = parseISO(e.data);
                      const hoje = new Date();
                      return isAfter(dataEvento, hoje) && !isToday(dataEvento);
                    }).length}
                  </p>
                </div>
                <div className="p-4 text-center">
                  <p className="text-sm font-medium text-gray-500">Hoje</p>
                  <p className="mt-1 text-3xl font-semibold text-green-600">
                    {eventos.filter(e => isToday(parseISO(e.data))).length}
                  </p>
                </div>
                <div className="p-4 text-center">
                  <p className="text-sm font-medium text-gray-500">Concluídos</p>
                  <p className="mt-1 text-3xl font-semibold text-blue-600">
                    {eventos.filter(e => e.status === 'concluido').length}
                  </p>
                </div>
              </div>
            </div>

            {eventosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventosFiltrados.map((evento) => (
                  <div 
                    key={evento.id} 
                    className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden rounded-lg border border-gray-100"
                  >
                    <div className={`px-4 py-3 sm:px-6 flex justify-between items-start ${
                      evento.tipo === 'show' ? 'bg-purple-50' : 
                      evento.tipo === 'ensaio' ? 'bg-blue-50' : 
                      'bg-green-50'
                    }`}>
                      <div className="flex items-center">
                        {getIconeTipoEvento(evento.tipo)}
                        <h3 className="ml-2 text-lg leading-6 font-medium text-gray-900 truncate max-w-[200px]">{evento.titulo}</h3>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCorStatus(evento.status)}`}>
                        {evento.status === 'agendado' && 'Agendado'}
                        {evento.status === 'confirmado' && 'Confirmado'}
                        {evento.status === 'cancelado' && 'Cancelado'}
                        {evento.status === 'concluido' && 'Concluído'}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          <p className="text-gray-700 font-medium">{formatarData(evento.data)}</p>
                        </div>
                        <div className="flex items-center text-sm">
                          <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          <p className="text-gray-700">{evento.horaInicio} às {evento.horaFim}</p>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          <p className="text-gray-700 truncate max-w-[250px]">{evento.local}</p>
                        </div>
                        {evento.bandaId && (
                          <div className="flex items-center text-sm">
                            <UserGroupIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            <p className="text-gray-700">Banda: {getNomeBanda(evento.bandaId)}</p>
                          </div>
                        )}
                        {evento.descricao && (
                          <div className="mt-2 text-sm text-gray-500 line-clamp-2">
                            {evento.descricao}
                          </div>
                        )}
                        
                        {/* Informações específicas por tipo de evento */}
                        {evento.tipo === 'show' && evento.valorCache && (
                          <div className="flex items-center text-sm mt-2 pt-2 border-t border-gray-100">
                            <span className="text-gray-700 font-medium">Cachê: </span>
                            <span className="ml-1 text-green-600 font-medium">R$ {evento.valorCache.toFixed(2)}</span>
                          </div>
                        )}
                        
                        {evento.tipo === 'ensaio' && evento.musicasEnsaio && evento.musicasEnsaio.length > 0 && (
                          <div className="flex items-center text-sm mt-2 pt-2 border-t border-gray-100">
                            <span className="text-gray-700 font-medium">Músicas: </span>
                            <span className="ml-1 text-gray-600">{evento.musicasEnsaio.length} selecionadas</span>
                          </div>
                        )}
                        
                        {evento.tipo === 'reuniao' && evento.pautaReuniao && (
                          <div className="flex items-center text-sm mt-2 pt-2 border-t border-gray-100">
                            <span className="text-gray-700 font-medium">Pauta definida</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-4 sm:px-6 flex justify-between items-center bg-gray-50">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">
                          {evento.integrantesIds.length} integrante{evento.integrantesIds.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleGerarRelatorio(evento)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                          title="Gerar relatório"
                        >
                          <DocumentTextIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditarEvento(evento)}
                          className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                          title="Editar evento"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleExcluirEvento(evento.id)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                          title="Excluir evento"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white shadow overflow-hidden sm:rounded-lg">
                <CalendarIcon className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum evento encontrado</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                  {busca || filtroTipo !== 'todos' || filtroStatus !== 'todos' || filtroBanda || filtroPeriodo !== 'todos'
                    ? 'Tente ajustar os filtros para encontrar o que está procurando.'
                    : 'Comece criando seu primeiro evento para gerenciar shows, ensaios e reuniões da sua banda.'}
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleAdicionarEvento}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Novo Evento
                  </button>
                </div>
              </div>
            )}

            {/* Modal de Edição/Criação de Evento */}
            <Modal
              title={eventoEmEdicao ? 'Editar Evento' : 'Novo Evento'}
              isOpen={modalAberto}
              onClose={() => {
                setModalAberto(false);
                setEventoEmEdicao(undefined);
              }}
            >
              <EventoForm
                evento={eventoEmEdicao}
                bandas={bandas}
                integrantes={integrantes}
                musicas={musicas}
                repertorios={repertorios.map(r => ({ id: r.id, nome: r.nome }))}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setModalAberto(false);
                  setEventoEmEdicao(undefined);
                }}
              />
            </Modal>

            {/* Modal de Relatório */}
            <Modal
              title={`Relatório: ${eventoParaRelatorio?.titulo || ''}`}
              isOpen={modalRelatorioAberto}
              onClose={() => {
                setModalRelatorioAberto(false);
                setEventoParaRelatorio(undefined);
              }}
            >
              {eventoParaRelatorio && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-500">
                    Escolha o formato do relatório para o evento <strong>{eventoParaRelatorio.titulo}</strong>.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Visualizar Relatório</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Visualize o relatório completo no navegador antes de baixar.
                      </p>
                      <button
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                      >
                        <DocumentTextIcon className="h-5 w-5 mr-2" />
                        Visualizar PDF
                      </button>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Baixar Relatório</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Baixe o relatório diretamente para o seu dispositivo.
                      </p>
                      <button
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                      >
                        <DocumentTextIcon className="h-5 w-5 mr-2" />
                        Baixar PDF
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Opções Adicionais</h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="incluirIntegrantes"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="incluirIntegrantes" className="ml-2 block text-sm text-gray-900">
                          Incluir lista de integrantes
                        </label>
                      </div>
                      
                      {eventoParaRelatorio.tipo === 'show' && (
                        <div className="flex items-center">
                          <input
                            id="incluirRepertorio"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            defaultChecked
                          />
                          <label htmlFor="incluirRepertorio" className="ml-2 block text-sm text-gray-900">
                            Incluir repertório completo
                          </label>
                        </div>
                      )}
                      
                      {eventoParaRelatorio.tipo === 'ensaio' && (
                        <div className="flex items-center">
                          <input
                            id="incluirObjetivos"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            defaultChecked
                          />
                          <label htmlFor="incluirObjetivos" className="ml-2 block text-sm text-gray-900">
                            Incluir objetivos e pauta do ensaio
                          </label>
                        </div>
                      )}
                      
                      {eventoParaRelatorio.tipo === 'reuniao' && (
                        <div className="flex items-center">
                          <input
                            id="incluirAta"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            defaultChecked
                          />
                          <label htmlFor="incluirAta" className="ml-2 block text-sm text-gray-900">
                            Incluir ata completa da reunião
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
} 