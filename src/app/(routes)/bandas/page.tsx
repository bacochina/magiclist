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
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function BandasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bandaEditando, setBandaEditando] = useState<Banda | undefined>(undefined);
  const [bandas, setBandas] = useState<Banda[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [mostraForm, setMostraForm] = useState(false);

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

  const handleExcluir = async (bandaId: string) => {
    if (confirm('Tem certeza que deseja excluir esta banda?')) {
      try {
        setErro(null);
        const res = await fetch(`/api/bandas?id=${bandaId}`, {
          method: 'DELETE',
        });

        if (!res.ok) throw new Error('Erro ao excluir banda');

        setBandas(bandas.filter(banda => banda.id !== bandaId));
      } catch (error) {
        console.error('Erro ao excluir banda:', error);
        setErro('Erro ao excluir banda. Por favor, tente novamente.');
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
              <div className="bg-white/90 backdrop-blur-lg rounded-lg p-6 shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                    <MusicalNoteIcon className="h-6 w-6 mr-2 text-purple-600" />
                    Minhas Bandas
                  </h2>
                  <div className="space-x-4">
                    <button 
                      onClick={() => {
                        console.log("Botão Nova Banda clicado");
                        setMostraForm(true);
                      }} 
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Nova Banda
                    </button>
                  </div>
                </div>

                {erro && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{erro}</span>
                  </div>
                )}

                {bandas.length > 0 ? (
                  <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
                    <ul className="divide-y divide-gray-200">
                      {bandas.map((banda) => (
                        <li key={banda.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">{banda.nome}</h3>
                                <p className="text-sm text-gray-500">{banda.genero}</p>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditar(banda)}
                                  className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                                  title="Editar banda"
                                >
                                  <PencilIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleExcluir(banda.id)}
                                  className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                                  title="Excluir banda"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                            
                            {banda.descricao && (
                              <p className="text-sm text-gray-600">{banda.descricao}</p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
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
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma banda cadastrada</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Comece criando sua primeira banda para gerenciar seus repertórios.
                    </p>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          console.log("Botão Criar Banda clicado");
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