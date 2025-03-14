'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { BandaForm } from './components/BandaForm';
import { Banda } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  MusicalNoteIcon,
  UserGroupIcon,
  XMarkIcon,
  ViewColumnsIcon,
  TableCellsIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { confirmar, alertaSucesso, alertaErro } from '@/lib/sweetalert';

export default function BandasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bandaEditando, setBandaEditando] = useState<Banda | undefined>(undefined);
  const [bandas, setBandas] = useState<Banda[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [mostraForm, setMostraForm] = useState(false);
  // Modo de visualização
  const [modoVisualizacao, setModoVisualizacao] = useState<'cartoes' | 'lista'>('lista');
  // Busca
  const [busca, setBusca] = useState('');

  useEffect(() => {
    carregarBandas();
  }, []);

  const carregarBandas = async () => {
    try {
      const response = await fetch('/api/bandas');
      if (!response.ok) {
        throw new Error('Erro ao carregar bandas');
      }
      const data = await response.json();
      setBandas(data.bandas || []);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setCarregando(false);
    }
  };

  // Filtra bandas baseado na busca
  const bandasFiltradas = bandas.filter(
    (banda) =>
      banda.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (banda.genero && banda.genero.toLowerCase().includes(busca.toLowerCase())) ||
      (banda.descricao && banda.descricao.toLowerCase().includes(busca.toLowerCase()))
  );

  const handleSubmit = async (banda: Omit<Banda, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/bandas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(banda),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar banda');
      }

      await carregarBandas();
      setMostraForm(false);
      setBandaEditando(undefined);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao criar banda');
    }
  };

  const handleEditar = (banda: Banda) => {
    setBandaEditando(banda);
    setIsModalOpen(true);
  };

  const handleExcluirBanda = async (banda: Banda) => {
    const confirmado = await confirmar(
      'Excluir banda',
      'Tem certeza que deseja excluir esta banda?',
      'warning'
    );
    
    if (confirmado) {
      try {
        setErro(null);
        const res = await fetch(`/api/bandas?id=${banda.id}`, {
          method: 'DELETE',
        });

        if (!res.ok) throw new Error('Erro ao excluir banda');

        setBandas(bandas.filter(banda => banda.id !== banda.id));
        alertaSucesso('Banda excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir banda:', error);
        setErro('Erro ao excluir banda. Por favor, tente novamente.');
        alertaErro('Erro ao excluir a banda');
      }
    }
  };

  if (carregando) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background específico para bandas */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-red-900"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M15 35h30v-2H15v2zm0-8h30v-2H15v2zm0-8h30v-2H15v2zm0-8h30V9H15v2zm0-8h30V1H15v2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Conteúdo da página */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white mb-6 flex items-center">
                <UserGroupIcon className="h-8 w-8 mr-2" />
                Bandas
              </h1>
            </div>
            
            <div className="px-4 py-6 sm:px-0">
              <div className="bg-gray-800/90 backdrop-blur-lg rounded-lg p-6 shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <h2 className="text-2xl font-semibold text-gray-100 flex items-center">
                    <MusicalNoteIcon className="h-6 w-6 mr-2 text-purple-400" />
                    Minhas Bandas
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Campo de busca */}
                    <div className="relative flex-1 min-w-[200px]">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar bandas..."
                        className="block w-full rounded-md border border-gray-600 bg-gray-700 text-gray-200 pl-10 py-2 focus:border-purple-500 focus:ring-purple-500 sm:text-sm h-10"
                      />
                    </div>
                    
                    {/* Botões de visualização */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setModoVisualizacao('lista')}
                        className={`p-2 rounded-md ${
                          modoVisualizacao === 'lista'
                            ? 'bg-purple-700 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        title="Visualização em lista"
                      >
                        <TableCellsIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setModoVisualizacao('cartoes')}
                        className={`p-2 rounded-md ${
                          modoVisualizacao === 'cartoes'
                            ? 'bg-purple-700 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        title="Visualização em cartões"
                      >
                        <ViewColumnsIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => {
                          setMostraForm(true);
                        }} 
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Nova Banda
                      </button>
                    </div>
                  </div>
                </div>

                {erro && (
                  <div className="mb-6 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{erro}</span>
                  </div>
                )}

                {bandasFiltradas.length > 0 ? (
                  modoVisualizacao === 'lista' ? (
                    <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md border border-gray-700">
                      <ul className="divide-y divide-gray-700">
                        {bandasFiltradas.map((banda) => (
                          <li key={banda.id} className="px-6 py-4 hover:bg-gray-700 transition-colors duration-150">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="text-lg font-medium text-gray-100">{banda.nome}</h3>
                                  <p className="text-sm text-gray-400">{banda.genero}</p>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEditar(banda)}
                                    className="p-2 text-blue-400 hover:text-blue-300 rounded-full hover:bg-blue-900/50"
                                    title="Editar banda"
                                  >
                                    <PencilIcon className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => handleExcluirBanda(banda)}
                                    className="p-2 text-red-400 hover:text-red-300 rounded-full hover:bg-red-900/50"
                                    title="Excluir banda"
                                  >
                                    <TrashIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                              
                              {banda.descricao && (
                                <p className="text-sm text-gray-300">{banda.descricao}</p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {bandasFiltradas.map((banda) => (
                        <div 
                          key={banda.id} 
                          className="bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden rounded-lg border border-gray-700"
                        >
                          <div className="px-4 py-3 sm:px-6 flex justify-between items-start bg-purple-900">
                            <div className="flex items-center">
                              <MusicalNoteIcon className="h-5 w-5 text-purple-300" />
                              <h3 className="ml-2 text-lg leading-6 font-medium text-white truncate max-w-[200px]">{banda.nome}</h3>
                            </div>
                          </div>
                          <div className="border-t border-gray-700 px-4 py-5 sm:p-6">
                            <div className="space-y-3">
                              <div className="flex items-center text-sm">
                                <p className="text-gray-200 font-medium">Gênero: {banda.genero || 'Não especificado'}</p>
                              </div>
                              
                              {banda.descricao && (
                                <div className="mt-2 text-sm text-gray-300">
                                  {banda.descricao}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="border-t border-gray-700 px-4 py-4 sm:px-6 flex justify-end items-center bg-gray-900">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditar(banda)}
                                className="inline-flex items-center px-2 py-1 border border-gray-700 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-200 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                                title="Editar banda"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleExcluirBanda(banda)}
                                className="inline-flex items-center px-2 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-200 bg-red-900 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                title="Excluir banda"
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
                    <svg
                      className="mx-auto h-12 w-12 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-200">Nenhuma banda encontrada</h3>
                    <p className="mt-1 text-sm text-gray-400">
                      {busca ? 'Tente uma busca diferente ou ' : 'Comece criando sua primeira banda para gerenciar seus repertórios.'}
                    </p>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setMostraForm(true);
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Criar Banda
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Modal
              isOpen={isModalOpen || mostraForm}
              onClose={() => {
                setIsModalOpen(false);
                setMostraForm(false);
                setBandaEditando(undefined);
              }}
              title={bandaEditando ? 'Editar Banda' : 'Nova Banda'}
            >
              <BandaForm
                banda={bandaEditando}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsModalOpen(false);
                  setMostraForm(false);
                  setBandaEditando(undefined);
                }}
              />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
} 