'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  Users, 
  MoreHorizontal, 
  FileEdit, 
  Trash2, 
  Eye,
  List,
  Grid,
  FileText
} from 'lucide-react';
import { Evento, Banda, TipoEvento } from '@/lib/types';
import { useRouter } from 'next/navigation';

// Definindo interface temporária para compatibilidade com os dados mockados
interface EventoDisplay extends Omit<Evento, 'bandaId'> {
  nome?: string; // Alias para 'titulo'
  hora_inicio?: string; // Alias para 'horaInicio'
  hora_termino?: string; // Alias para 'horaFim'
  banda?: { id: string; nome: string }; // Para substituir bandaId
  tipo: TipoEvento; // Garantindo que o tipo seja corretamente definido
}

// Card de estatísticas para a página de reuniões
const ReuniaoStatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
  <div className="stat-card p-5">
    <div className="flex items-center space-x-3 mb-2">
      <div className="p-2 rounded-md bg-gray-700 text-purple-400">
        {icon}
      </div>
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
  </div>
);

// Componente de tabela de reuniões
const ReunioesTable = ({ eventos, onDelete, onView, onEdit }: { 
  eventos: EventoDisplay[]; 
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}) => {
  const formatarData = (data: string) => {
    const date = new Date(data);
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  const [sortColumn, setSortColumn] = useState<string>('data');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [eventosFiltrados, setEventosFiltrados] = useState<EventoDisplay[]>(eventos);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroBanda, setFiltroBanda] = useState<string>('todas');
  const [modoVisualizacao, setModoVisualizacao] = useState<'lista' | 'cartoes'>('lista');

  useEffect(() => {
    // Filtrar por busca e banda
    let filtered = eventos;
    
    if (searchTerm) {
      filtered = filtered.filter(evento => 
        (evento.titulo || evento.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (evento.local || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (evento.banda?.nome || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filtroBanda !== 'todas') {
      filtered = filtered.filter(evento => 
        evento.banda?.nome === filtroBanda
      );
    }
    
    // Ordenar
    filtered = [...filtered].sort((a, b) => {
      if (sortColumn === 'data') {
        const dateA = new Date(a.data);
        const dateB = new Date(b.data);
        return sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      }
      if (sortColumn === 'nome') {
        const nomeA = (a.titulo || a.nome || '');
        const nomeB = (b.titulo || b.nome || '');
        return sortDirection === 'asc' 
          ? nomeA.localeCompare(nomeB) 
          : nomeB.localeCompare(nomeA);
      }
      if (sortColumn === 'local') {
        const localA = a.local || '';
        const localB = b.local || '';
        return sortDirection === 'asc' 
          ? localA.localeCompare(localB) 
          : localB.localeCompare(localA);
      }
      if (sortColumn === 'banda') {
        const bandaA = a.banda?.nome || '';
        const bandaB = b.banda?.nome || '';
        return sortDirection === 'asc' 
          ? bandaA.localeCompare(bandaB) 
          : bandaB.localeCompare(bandaA);
      }
      return 0;
    });
    
    setEventosFiltrados(filtered);
  }, [eventos, sortColumn, sortDirection, searchTerm, filtroBanda]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Extrair lista única de bandas para o filtro
  const bandas = ['todas', ...new Set(eventos.map(e => e.banda?.nome).filter(Boolean) as string[])];

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
      {/* Filtros e Busca */}
      <div className="p-4 border-b border-gray-700 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar reuniões..." 
            className="bg-gray-900 text-white pl-10 pr-4 py-2 rounded-md border border-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-400" />
            <select
              className="bg-gray-900 text-white px-3 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={filtroBanda}
              onChange={(e) => setFiltroBanda(e.target.value)}
            >
              {bandas.map(banda => (
                <option key={banda} value={banda}>
                  {banda === 'todas' ? 'Todas as bandas' : banda}
                </option>
              ))}
            </select>
          </div>
          
          {/* Botões de visualização - Lista primeiro, depois cartões */}
          <div className="flex items-center space-x-1 ml-auto">
            <button
              type="button"
              className={`p-2 rounded-l ${
                modoVisualizacao === 'lista'
                  ? 'bg-gray-700 text-gray-100'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setModoVisualizacao('lista')}
              title="Visualização em Lista"
            >
              <List size={18} />
            </button>
            <button
              type="button"
              className={`p-2 rounded-r ${
                modoVisualizacao === 'cartoes'
                  ? 'bg-gray-700 text-gray-100'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setModoVisualizacao('cartoes')}
              title="Visualização em Cartões"
            >
              <Grid size={18} />
            </button>
          </div>

          <Link href="/eventos/reunioes/nova" className="btn-primary">
            <Plus size={18} className="mr-1" />
            Nova Reunião
          </Link>
        </div>
      </div>
      
      {eventosFiltrados.length > 0 ? (
        modoVisualizacao === 'lista' ? (
          /* Tabela */
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th 
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer ${sortColumn === 'data' ? 'text-white' : ''}`}
                    onClick={() => handleSort('data')}
                  >
                    <div className="flex items-center">
                      <span>Data</span>
                      {sortColumn === 'data' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer ${sortColumn === 'nome' ? 'text-white' : ''}`}
                    onClick={() => handleSort('nome')}
                  >
                    <div className="flex items-center">
                      <span>Título</span>
                      {sortColumn === 'nome' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer ${sortColumn === 'local' ? 'text-white' : ''}`}
                    onClick={() => handleSort('local')}
                  >
                    <div className="flex items-center">
                      <span>Local</span>
                      {sortColumn === 'local' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer ${sortColumn === 'banda' ? 'text-white' : ''}`}
                    onClick={() => handleSort('banda')}
                  >
                    <div className="flex items-center">
                      <span>Banda</span>
                      {sortColumn === 'banda' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {eventosFiltrados.map((evento) => (
                  <tr key={evento.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex flex-col">
                        <span className="font-medium">{formatarData(evento.data)}</span>
                        <span className="text-gray-400 text-xs flex items-center mt-1">
                          <Clock size={12} className="mr-1" />
                          {evento.horaInicio || evento.hora_inicio || '--:--'} - {evento.horaFim || evento.hora_termino || '--:--'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {evento.titulo || evento.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {evento.local || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <span className="px-2 py-1 bg-purple-900 bg-opacity-40 text-purple-300 rounded-full text-xs">
                        {evento.banda?.nome || 'Sem banda'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onView(evento.id)}
                          className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Visualizar"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => onEdit(evento.id)}
                          className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                          title="Editar"
                        >
                          <FileEdit size={18} />
                        </button>
                        <button
                          onClick={() => onDelete(evento.id)}
                          className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Visualização em Cartões */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-900/30 rounded-lg">
            {eventosFiltrados.map((evento) => (
              <div 
                key={evento.id} 
                className="bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-xl border border-gray-700 flex flex-col h-full hover:translate-y-[-3px] hover:border-indigo-500/50"
              >
                {/* Cabeçalho do cartão */}
                <div className="p-3 flex flex-col bg-gradient-to-r from-purple-800 to-purple-900 border-b border-purple-700">
                  <div className="flex items-center w-full">
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="text-base font-medium text-white leading-tight line-clamp-1 text-center"
                        title={evento.titulo || evento.nome || ''}
                      >
                        {evento.titulo || evento.nome}
                      </h3>
                    </div>
                  </div>
                  <div className="mt-1 flex items-center justify-center w-full">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-800/70 text-purple-100 shadow-sm">
                      {evento.banda?.nome || 'Sem banda'}
                    </span>
                  </div>
                </div>
                
                {/* Corpo do cartão */}
                <div className="px-4 py-4 flex-grow bg-gradient-to-b from-gray-800 to-gray-850">
                  <div className="space-y-3">
                    {/* Data */}
                    <div className="flex items-start">
                      <div className="bg-gray-700/50 p-1.5 rounded-lg mr-2.5 flex-shrink-0">
                        <Calendar size={16} className="text-purple-300" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium mb-0.5">Data</p>
                        <p className="text-gray-200 text-sm">
                          {formatarData(evento.data)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Horário */}
                    <div className="flex items-start">
                      <div className="bg-gray-700/50 p-1.5 rounded-lg mr-2.5 flex-shrink-0">
                        <Clock size={16} className="text-purple-300" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium mb-0.5">Horário</p>
                        <p className="text-gray-200 text-sm">
                          {evento.horaInicio || evento.hora_inicio || '--:--'} - {evento.horaFim || evento.hora_termino || '--:--'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Local */}
                    <div className="flex items-start">
                      <div className="bg-gray-700/50 p-1.5 rounded-lg mr-2.5 flex-shrink-0">
                        <MapPin size={16} className="text-purple-300" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium mb-0.5">Local</p>
                        <p className="text-gray-200 text-sm">
                          {evento.local || 'Não definido'}
                        </p>
                      </div>
                    </div>

                    {/* Pauta (específico para reunião) */}
                    {evento.pautaReuniao && (
                      <div className="flex items-start">
                        <div className="bg-gray-700/50 p-1.5 rounded-lg mr-2.5 flex-shrink-0">
                          <FileText size={16} className="text-purple-300" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium mb-0.5">Pauta</p>
                          <p className="text-gray-200 text-sm line-clamp-2">
                            {evento.pautaReuniao}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rodapé com ações */}
                <div className="p-3 sm:px-6 flex justify-end items-center bg-gray-850 border-t border-gray-700/50 mt-auto">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onView(evento.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-blue-300 hover:bg-blue-800/30 transition-colors duration-200"
                      title="Visualizar reunião"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(evento.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-yellow-300 hover:bg-yellow-800/30 transition-colors duration-200"
                      title="Editar reunião"
                    >
                      <FileEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(evento.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-red-300 hover:bg-red-800/30 transition-colors duration-200"
                      title="Excluir reunião"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="p-8 text-center">
          <div className="text-gray-400">Nenhuma reunião encontrada</div>
        </div>
      )}
    </div>
  );
};

export default function ReunioesPage() {
  const [eventos, setEventos] = useState<EventoDisplay[]>([]);
  const [modoVisualizacao, setModoVisualizacao] = useState<'lista' | 'cartoes'>('lista');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchReunioes() {
      setLoading(true);
      try {
        // Simular uma chamada à API com um delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Dados mockados - em produção, esses dados viriam da sua API
        const dadosMockados: EventoDisplay[] = [
          {
            id: '10',
            titulo: 'Reunião de Planejamento',
            nome: 'Reunião de Planejamento',
            tipo: 'reuniao' as TipoEvento,
            status: 'agendado',
            integrantesIds: [],
            data: '2025-06-05',
            horaInicio: '10:00',
            hora_inicio: '10:00',
            horaFim: '12:00',
            hora_termino: '12:00',
            local: 'Escritório Central',
            banda: { id: '1', nome: 'Rock Stars' },
            descricao: 'Reunião para planejamento de novo álbum',
            pautaReuniao: 'Discussão sobre orçamento, cronograma de gravação e estratégias de divulgação'
          },
          {
            id: '11',
            titulo: 'Reunião com Produtora',
            nome: 'Reunião com Produtora',
            tipo: 'reuniao' as TipoEvento,
            status: 'agendado',
            integrantesIds: [],
            data: '2025-05-25',
            horaInicio: '15:00',
            hora_inicio: '15:00',
            horaFim: '16:30',
            hora_termino: '16:30',
            local: 'Estúdio Produções',
            banda: { id: '2', nome: 'Electric Sound' },
            descricao: 'Reunião para discutir detalhes do contrato',
            pautaReuniao: 'Termos contratuais, valores, datas de shows e rider técnico'
          },
          {
            id: '12',
            titulo: 'Balanço Semestral',
            nome: 'Balanço Semestral',
            tipo: 'reuniao' as TipoEvento,
            status: 'confirmado',
            integrantesIds: [],
            data: '2025-06-15',
            horaInicio: '14:00',
            hora_inicio: '14:00',
            horaFim: '16:00',
            hora_termino: '16:00',
            local: 'Sala de Conferências',
            banda: { id: '3', nome: 'Acoustic Trio' },
            descricao: 'Avaliação dos resultados do semestre',
            pautaReuniao: 'Análise de desempenho, vendas de álbuns, público nos shows e planejamento para o próximo semestre'
          },
          {
            id: '13',
            titulo: 'Reunião de Marketing',
            nome: 'Reunião de Marketing',
            tipo: 'reuniao' as TipoEvento,
            status: 'agendado',
            integrantesIds: [],
            data: '2025-07-02',
            horaInicio: '09:00',
            hora_inicio: '09:00',
            horaFim: '11:00',
            hora_termino: '11:00',
            local: 'Agência de Marketing',
            banda: { id: '1', nome: 'Rock Stars' },
            descricao: 'Definição de estratégias para redes sociais',
            pautaReuniao: 'Calendário de posts, planejamento de conteúdo e estratégias de engajamento'
          }
        ];
        
        // Filtrar apenas eventos do tipo 'reuniao' (já está feito nos dados mockados)
        setEventos(dadosMockados);
      } catch (error) {
        console.error('Erro ao buscar reuniões:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchReunioes();
  }, []);

  const handleViewReuniao = (id: string) => {
    router.push(`/eventos/reunioes/${id}`);
  };

  const handleEditReuniao = (id: string) => {
    router.push(`/eventos/reunioes/${id}/editar`);
  };

  const handleDeleteReuniao = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta reunião?')) {
      // Aqui você chamaria sua API para excluir a reunião
      // Por enquanto, apenas atualizamos o estado localmente
      setEventos(eventos.filter(evento => evento.id !== id));
    }
  };

  // Calcular estatísticas
  const reunioesAgendadas = eventos.filter(e => e.status === 'agendado').length;
  const reunioesConfirmadas = eventos.filter(e => e.status === 'confirmado').length;
  const reunioesConcluidas = eventos.filter(e => e.status === 'concluido').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reuniões</h1>
          <p className="text-gray-400">Gerencie as reuniões da sua banda</p>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ReuniaoStatCard 
          title="Reuniões Agendadas" 
          value={reunioesAgendadas} 
          icon={<Calendar size={20} />}
        />
        <ReuniaoStatCard 
          title="Reuniões Confirmadas" 
          value={reunioesConfirmadas} 
          icon={<Calendar size={20} />}
        />
        <ReuniaoStatCard 
          title="Reuniões Concluídas" 
          value={reunioesConcluidas} 
          icon={<Calendar size={20} />}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <ReunioesTable 
          eventos={eventos} 
          onDelete={handleDeleteReuniao} 
          onView={handleViewReuniao} 
          onEdit={handleEditReuniao} 
        />
      )}
    </div>
  );
} 