'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Banda, Repertorio } from '@/lib/types';
import { useHydratedLocalStorage } from '@/hooks/useHydratedLocalStorage';
import { RepertorioForm } from './components/RepertorioForm';
import { ClientOnly } from '../blocos/components/ClientOnly';
import Link from 'next/link';
import { 
  Calendar,
  Search, 
  Filter, 
  Plus,
  Edit,
  Trash2,
  List,
  Grid,
  Music,
  Users
} from 'lucide-react';
import { confirmar, alertaSucesso, alertaErro } from '@/lib/sweetalert';

// Card de estatísticas para a página de repertórios
const RepertorioStatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
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

export default function RepertoriosPage() {
  const [bandas, setBandas] = useHydratedLocalStorage<Banda[]>('bandas', []);
  const [repertorios, setRepertorios] = useState<Repertorio[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [repertorioEmEdicao, setRepertorioEmEdicao] = useState<Repertorio | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [bandaSelecionada, setBandaSelecionada] = useState<string | null>(null);
  const [modoVisualizacao, setModoVisualizacao] = useState<'cartoes' | 'lista'>('lista');

  // Função para buscar bandas da API
  const buscarBandas = async () => {
    try {
      const response = await fetch('/api/bandas');
      if (!response.ok) {
        throw new Error('Erro ao buscar bandas');
      }
      const data = await response.json();
      setBandas(data);
    } catch (error) {
      console.error('Erro ao buscar bandas:', error);
      setErro('Não foi possível carregar as bandas. Por favor, tente novamente.');
    }
  };

  // Função para buscar repertórios da API
  const buscarRepertorios = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const response = await fetch('/api/repertorios');
      if (!response.ok) {
        throw new Error('Erro ao buscar repertórios');
      }
      const data = await response.json();
      setRepertorios(data);
    } catch (error) {
      console.error('Erro ao buscar repertórios:', error);
      setErro('Não foi possível carregar os repertórios. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    buscarBandas();
    buscarRepertorios();
  }, []);

  const handleAdicionarRepertorio = () => {
    setRepertorioEmEdicao(null);
    setModalAberto(true);
  };

  const handleEditarRepertorio = (repertorio: Repertorio) => {
    setRepertorioEmEdicao(repertorio);
    setModalAberto(true);
  };

  const handleExcluirRepertorio = async (repertorioId: string) => {
    const confirmado = await confirmar(
      'Excluir repertório',
      'Tem certeza que deseja excluir este repertório?',
      'warning'
    );
    
    if (confirmado) {
      try {
        const response = await fetch(`/api/repertorios/${repertorioId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Erro ao excluir repertório');
        }
        
        // Atualiza a lista de repertórios após excluir
        buscarRepertorios();
        alertaSucesso('Repertório excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir repertório:', error);
        alertaErro('Erro ao excluir o repertório');
      }
    }
  };

  const handleSubmit = async (data: Partial<Repertorio>) => {
    try {
      const url = repertorioEmEdicao
        ? `/api/repertorios/${repertorioEmEdicao.id}`
        : '/api/repertorios';
      
      const method = repertorioEmEdicao ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao ${repertorioEmEdicao ? 'atualizar' : 'criar'} repertório`);
      }
      
      // Atualiza a lista de repertórios após criar/editar
      buscarRepertorios();
      setModalAberto(false);
      setRepertorioEmEdicao(null);
      alertaSucesso(`Repertório ${repertorioEmEdicao ? 'atualizado' : 'criado'} com sucesso!`);
    } catch (error) {
      console.error('Erro ao salvar repertório:', error);
      alertaErro(`Erro ao ${repertorioEmEdicao ? 'atualizar' : 'criar'} repertório. Por favor, tente novamente.`);
    }
  };

  // Ordenar repertórios por data (mais recentes primeiro)
  const repertoriosOrdenados = [...repertorios].sort((a, b) => {
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  // Filtrar repertórios
  const repertoriosFiltrados = repertoriosOrdenados.filter(repertorio => {
    const matchBusca = repertorio.nome.toLowerCase().includes(busca.toLowerCase());
    const matchBanda = !bandaSelecionada || repertorio.bandaId === bandaSelecionada;
    return matchBusca && matchBanda;
  });

  // Formatar data para exibição
  const formatarData = (dataString?: string) => {
    if (!dataString) return 'Data não disponível';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Calcular estatísticas
  const totalRepertorios = repertorios.length;
  const bandasComRepertorios = new Set(
    repertorios
      .filter(rep => rep.bandaId)
      .map(rep => rep.bandaId)
  ).size;
  const blocosEmRepertorios = repertorios.reduce(
    (total, rep) => total + (rep.blocos?.length || 0), 
    0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Repertórios</h1>
          <p className="text-gray-400">Organize seus repertórios para shows e ensaios</p>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <RepertorioStatCard 
          title="Total de Repertórios" 
          value={totalRepertorios} 
          icon={<Calendar size={20} />}
        />
        <RepertorioStatCard 
          title="Bandas com Repertórios" 
          value={bandasComRepertorios} 
          icon={<Users size={20} />}
        />
        <RepertorioStatCard 
          title="Blocos em Repertórios" 
          value={blocosEmRepertorios} 
          icon={<Music size={20} />}
        />
      </div>

      {carregando ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
          {/* Filtros e Busca */}
          <div className="p-4 border-b border-gray-700 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[250px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar repertórios..."
                className="bg-gray-900 text-white pl-10 pr-4 py-2 rounded-md border border-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Filter size={18} className="text-gray-400" />
                <select
                  value={bandaSelecionada || ''}
                  onChange={(e) => setBandaSelecionada(e.target.value || null)}
                  className="bg-gray-900 text-white px-3 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Todas as bandas</option>
                  {Array.isArray(bandas) && bandas.map((banda) => (
                    <option key={banda.id} value={banda.id}>
                      {banda.nome}
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
                    
              <button
                onClick={handleAdicionarRepertorio}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center space-x-1"
              >
                <Plus size={16} />
                <span>Novo Repertório</span>
              </button>
            </div>
          </div>

          {/* Conteúdo principal */}
          {erro ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-2 text-4xl">⚠️</div>
              <h3 className="mt-2 text-lg font-medium text-gray-200">Erro ao carregar dados</h3>
              <p className="mt-1 text-sm text-gray-400">{erro}</p>
              <button
                onClick={buscarRepertorios}
                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
              >
                Tentar novamente
              </button>
            </div>
          ) : repertoriosFiltrados.length > 0 ? (
            modoVisualizacao === 'lista' ? (
              /* Visualização em Lista */
              <div className="p-6 space-y-4">
                {repertoriosFiltrados.map((repertorio) => (
                  <div 
                    key={repertorio.id} 
                    className="px-6 py-4 bg-gray-800 hover:bg-gray-750 transition-colors duration-150 border-b border-gray-700"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-100">{repertorio.nome}</h3>
                          {repertorio.descricao && (
                            <p className="text-sm text-gray-400">{repertorio.descricao}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditarRepertorio(repertorio)}
                            className="p-2 text-indigo-400 hover:text-indigo-300 rounded-full hover:bg-indigo-900/50"
                            title="Editar repertório"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleExcluirRepertorio(repertorio.id)}
                            className="p-2 text-red-400 hover:text-red-300 rounded-full hover:bg-red-900/50"
                            title="Excluir repertório"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {repertorio.bandaId && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                            Banda: {Array.isArray(bandas) ? bandas.find(b => b.id === repertorio.bandaId)?.nome || 'Desconhecida' : 'Desconhecida'}
                          </span>
                        )}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                          Criado em: {formatarData(repertorio.createdAt)}
                        </span>
                        {repertorio.blocos && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                            {repertorio.blocos.length} {repertorio.blocos.length === 1 ? 'bloco' : 'blocos'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Visualização em Cartões */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-900/30 rounded-lg">
                {repertoriosFiltrados.map((repertorio) => (
                  <div 
                    key={repertorio.id} 
                    className="bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-xl border border-gray-700 flex flex-col h-full hover:translate-y-[-3px] hover:border-indigo-500/50"
                  >
                    {/* Cabeçalho do cartão */}
                    <div className="p-3 flex flex-col bg-gradient-to-r from-indigo-800 to-indigo-900 border-b border-indigo-700">
                      <div className="flex items-center w-full">
                        <div className="flex-1 min-w-0">
                          <h3 
                            className="text-base font-medium text-white leading-tight line-clamp-2 text-center"
                            title={repertorio.nome || ''}
                          >
                            {repertorio.nome}
                          </h3>
                        </div>
                      </div>
                      {repertorio.bandaId && (
                        <div className="mt-1 flex items-center justify-center w-full">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-800/70 text-purple-100 shadow-sm">
                            {Array.isArray(bandas) ? bandas.find(b => b.id === repertorio.bandaId)?.nome || 'Banda' : 'Banda'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Corpo do cartão */}
                    <div className="px-4 py-4 flex-grow bg-gradient-to-b from-gray-800 to-gray-850">
                      {/* Descrição (se houver) */}
                      {repertorio.descricao && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-400 font-medium mb-0.5">Descrição</p>
                          <p className="text-gray-300 text-sm line-clamp-2">{repertorio.descricao}</p>
                        </div>
                      )}
                      
                      {/* Data de criação */}
                      <div className="flex items-start mb-3">
                        <div className="bg-gray-700/50 p-1.5 rounded-lg mr-2.5 flex-shrink-0">
                          <Calendar size={16} className="text-indigo-300" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium mb-0.5">Criado em</p>
                          <p className="text-gray-300 text-sm">{formatarData(repertorio.createdAt)}</p>
                        </div>
                      </div>
                      
                      {/* Blocos */}
                      <div className="flex items-start">
                        <div className="bg-gray-700/50 p-1.5 rounded-lg mr-2.5 flex-shrink-0">
                          <Music size={16} className="text-indigo-300" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium mb-0.5">Blocos</p>
                          {repertorio.blocos && repertorio.blocos.length > 0 ? (
                            <p className="text-gray-300 text-sm">{repertorio.blocos.length} {repertorio.blocos.length === 1 ? 'bloco' : 'blocos'}</p>
                          ) : (
                            <p className="text-gray-500 text-sm">Nenhum bloco adicionado</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Rodapé com ações */}
                    <div className="px-4 py-3 bg-gray-850 border-t border-gray-700 flex justify-end">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditarRepertorio(repertorio)}
                          className="p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300"
                          title="Editar repertório"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleExcluirRepertorio(repertorio.id)}
                          className="p-1.5 rounded-md bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white"
                          title="Excluir repertório"
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
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-200">Nenhum repertório encontrado</h3>
              <p className="mt-1 text-sm text-gray-400">
                {busca || bandaSelecionada
                  ? 'Tente ajustar os filtros ou fazer uma busca diferente.'
                  : 'Comece adicionando seu primeiro repertório.'}
              </p>
              <div className="mt-6">
                <button
                  onClick={handleAdicionarRepertorio}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Novo Repertório
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <Modal
        title={repertorioEmEdicao ? 'Editar Repertório' : 'Novo Repertório'}
        isOpen={modalAberto}
        onClose={() => {
          setModalAberto(false);
          setRepertorioEmEdicao(null);
        }}
      >
        <RepertorioForm
          repertorio={repertorioEmEdicao || undefined}
          bandas={bandas}
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalAberto(false);
            setRepertorioEmEdicao(null);
          }}
        />
      </Modal>
    </div>
  );
} 