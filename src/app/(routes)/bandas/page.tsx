'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { BandaForm } from './components/BandaForm';
import { Banda } from '@/lib/types';

export default function BandasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bandaEditando, setBandaEditando] = useState<Banda | null>(null);
  const [bandas, setBandas] = useState<Banda[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const carregarBandas = async () => {
      try {
        setCarregando(true);
        setErro(null);
        const res = await fetch('/api/bandas');
        if (!res.ok) throw new Error('Erro ao carregar bandas');
        const data = await res.json();
        setBandas(data);
      } catch (error) {
        console.error('Erro ao carregar bandas:', error);
        setErro('Erro ao carregar bandas. Por favor, tente novamente.');
      } finally {
        setCarregando(false);
      }
    };

    carregarBandas();
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      setErro(null);
      if (bandaEditando) {
        // Atualizar banda existente
        const res = await fetch('/api/bandas', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            id: bandaEditando.id
          }),
        });

        if (!res.ok) throw new Error('Erro ao atualizar banda');
        
        const bandaAtualizada = await res.json();
        setBandas(bandas.map(banda => 
          banda.id === bandaAtualizada.id ? bandaAtualizada : banda
        ));
      } else {
        // Criar nova banda
        const res = await fetch('/api/bandas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error('Erro ao criar banda');
        
        const novaBanda = await res.json();
        setBandas([...bandas, novaBanda]);
      }
      setBandaEditando(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar banda:', error);
      setErro('Erro ao salvar banda. Por favor, tente novamente.');
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
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Minhas Bandas</h1>
          <button
            onClick={() => {
              setBandaEditando(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Nova Banda
          </button>
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
          setBandaEditando(null);
        }}
        title={bandaEditando ? 'Editar Banda' : 'Nova Banda'}
      >
        <BandaForm
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setBandaEditando(null);
          }}
          initialData={bandaEditando || undefined}
        />
      </Modal>
    </div>
  );
} 