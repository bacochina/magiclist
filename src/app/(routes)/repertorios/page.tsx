'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Banda, Repertorio } from '@/lib/types';
import { useHydratedLocalStorage } from '@/hooks/useHydratedLocalStorage';
import { RepertorioForm } from './components/RepertorioForm';
import { ClientOnly } from '../blocos/components/ClientOnly';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  CalendarIcon,
  ViewColumnsIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';
import { confirmar, alertaSucesso, alertaErro } from '@/lib/sweetalert';

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
    } catch (error) {
      console.error('Erro ao salvar repertório:', error);
      alert(`Erro ao ${repertorioEmEdicao ? 'atualizar' : 'criar'} repertório. Por favor, tente novamente.`);
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

  return (
    <div className="min-h-screen relative">
      {/* Background específico para repertórios */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-green-900 via-teal-900 to-emerald-900"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M30 20h4v4h-4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM6 20h4v4H6v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Conteúdo da página */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white mb-6 flex items-center">
                <CalendarIcon className="h-8 w-8 mr-2" />
                Repertórios
              </h1>
            </div>

            <div className="px-4 py-6 sm:px-0">
              <div className="bg-gray-800/90 backdrop-blur-lg rounded-lg p-6 shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-1.5 text-emerald-400" />
                    <span className="text-lg font-semibold text-gray-100">Meus Repertórios</span>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {/* Campo de busca */}
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar..."
                        className="bg-gray-700/50 border border-gray-600 text-white rounded-md pl-7 pr-2 py-1.5 w-48 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    
                    {/* Filtro de bandas */}
                    <select
                      value={bandaSelecionada || ''}
                      onChange={(e) => setBandaSelecionada(e.target.value || null)}
                      className="bg-gray-700/50 border border-gray-600 text-white rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Todas</option>
                      {Array.isArray(bandas) && bandas.map((banda) => (
                        <option key={banda.id} value={banda.id}>
                          {banda.nome}
                        </option>
                      ))}
                    </select>
                    
                    {/* Botões de visualização */}
                    <div className="flex items-center">
                      <button
                        onClick={() => setModoVisualizacao('lista')}
                        className={`p-1.5 rounded-l-md ${
                          modoVisualizacao === 'lista'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        title="Visualização em lista"
                      >
                        <TableCellsIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setModoVisualizacao('cartoes')}
                        className={`p-1.5 rounded-r-md ${
                          modoVisualizacao === 'cartoes'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        title="Visualização em cartões"
                      >
                        <ViewColumnsIcon className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <button
                      onClick={handleAdicionarRepertorio}
                      className="inline-flex items-center px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Novo
                    </button>
                  </div>
                </div>

                {/* Conteúdo principal */}
                {carregando ? (
                  <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="h-12 w-12 bg-gray-700 rounded-full mb-4"></div>
                      <div className="h-4 bg-gray-700 rounded w-48 mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-32"></div>
                    </div>
                    <p className="mt-4 text-gray-400">Carregando repertórios...</p>
                  </div>
                ) : erro ? (
                  <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="text-red-500 mb-2">⚠️</div>
                    <h3 className="text-lg font-medium text-gray-200 mb-2">Erro ao carregar dados</h3>
                    <p className="text-gray-400">{erro}</p>
                    <button
                      onClick={buscarRepertorios}
                      className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
                    >
                      Tentar novamente
                    </button>
                  </div>
                ) : repertoriosFiltrados.length > 0 ? (
                  modoVisualizacao === 'lista' ? (
                    <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md border border-gray-700">
                      <ul className="divide-y divide-gray-700">
                        {repertoriosFiltrados.map((repertorio) => (
                          <li key={repertorio.id} className="px-6 py-4 hover:bg-gray-700 transition-colors duration-150">
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
                                    className="p-2 text-emerald-400 hover:text-emerald-300 rounded-full hover:bg-emerald-900/50"
                                    title="Editar repertório"
                                  >
                                    <PencilIcon className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => handleExcluirRepertorio(repertorio.id)}
                                    className="p-2 text-red-400 hover:text-red-300 rounded-full hover:bg-red-900/50"
                                    title="Excluir repertório"
                                  >
                                    <TrashIcon className="h-5 w-5" />
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
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {repertoriosFiltrados.map((repertorio) => (
                        <div 
                          key={repertorio.id} 
                          className="bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden rounded-lg border border-gray-700"
                        >
                          <div className="px-4 py-3 sm:px-6 flex justify-between items-start bg-emerald-900">
                            <div className="flex items-center">
                              <CalendarIcon className="h-5 w-5 text-emerald-300" />
                              <h3 className="ml-2 text-lg leading-6 font-medium text-white truncate max-w-[200px]">{repertorio.nome}</h3>
                            </div>
                          </div>
                          <div className="border-t border-gray-700 px-4 py-5 sm:p-6">
                            <div className="space-y-3">
                              {repertorio.descricao && (
                                <p className="text-sm text-gray-300">{repertorio.descricao}</p>
                              )}
                              
                              <div className="flex flex-wrap gap-2">
                                {repertorio.bandaId && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                                    Banda: {Array.isArray(bandas) ? bandas.find(b => b.id === repertorio.bandaId)?.nome || 'Desconhecida' : 'Desconhecida'}
                                  </span>
                                )}
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                                  Criado em: {formatarData(repertorio.createdAt)}
                                </span>
                              </div>
                              
                              {repertorio.blocos && repertorio.blocos.length > 0 ? (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-300 mb-2">Blocos:</h4>
                                  <div className="text-sm text-gray-400">
                                    {repertorio.blocos.length} {repertorio.blocos.length === 1 ? 'bloco' : 'blocos'} neste repertório
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">Nenhum bloco adicionado a este repertório</p>
                              )}
                            </div>
                          </div>
                          <div className="border-t border-gray-700 px-4 py-4 sm:px-6 flex justify-end items-center bg-gray-900">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditarRepertorio(repertorio)}
                                className="inline-flex items-center px-2 py-1 border border-gray-700 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-200 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
                                title="Editar repertório"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleExcluirRepertorio(repertorio.id)}
                                className="inline-flex items-center px-2 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-200 bg-red-900 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                title="Excluir repertório"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                    <CalendarIcon className="mx-auto h-12 w-12 text-gray-500" />
                    <h3 className="mt-2 text-sm font-medium text-gray-200">Nenhum repertório encontrado</h3>
                    <p className="mt-1 text-sm text-gray-400">
                      {busca || bandaSelecionada
                        ? 'Tente ajustar os filtros ou fazer uma busca diferente.'
                        : 'Comece adicionando seu primeiro repertório.'}
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={handleAdicionarRepertorio}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                      >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Novo Repertório
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

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
        </div>
      </div>
    </div>
  );
} 