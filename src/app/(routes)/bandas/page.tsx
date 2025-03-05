'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { BandaForm } from './components/BandaForm';
import { Banda } from '@/lib/types';
import { Button } from '@/components/ui/button';

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

  const handleSeed = async () => {
    try {
      const response = await fetch('/api/bandas/seed', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Erro ao adicionar bandas');
      }

      const data = await response.json();
      console.log('Bandas adicionadas:', data);
      
      // Recarrega as bandas
      await carregarBandas();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao adicionar bandas');
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
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Minhas Bandas</h1>
          <div className="space-x-4">
            <Button onClick={() => setMostraForm(true)}>
              Nova Banda
            </Button>
          </div>
        </div>

        {erro && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{erro}</span>
          </div>
        )}

        {bandas.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {bandas.map((banda) => (
                <li key={banda.id} className="px-6 py-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{banda.nome}</h3>
                        <p className="text-sm text-gray-500">{banda.genero}</p>
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleEditar(banda)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleExcluir(banda.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Excluir
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
          <div className="text-center py-12">
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
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setBandaEditando(undefined);
        }}
        title={bandaEditando ? 'Editar Banda' : 'Nova Banda'}
      >
        <BandaForm
          banda={bandaEditando}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setBandaEditando(undefined);
          }}
        />
      </Modal>

      {mostraForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Nova Banda</h2>
            <BandaForm
              banda={bandaEditando}
              onSubmit={handleSubmit}
              onCancel={() => {
                setMostraForm(false);
                setBandaEditando(undefined);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
} 