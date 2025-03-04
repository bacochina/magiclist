'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { PedaleiraForm } from './components/PedaleiraForm';
import { Pedaleira, Musica } from '@/lib/types';

const mockMusicas: Musica[] = [
  {
    id: '1',
    nome: 'Sweet Child O Mine',
    artista: 'Guns N Roses',
    tom: 'C#',
    bpm: 120
  },
  {
    id: '2',
    nome: 'Nothing Else Matters',
    artista: 'Metallica',
    tom: 'Em',
    bpm: 92
  },
  {
    id: '3',
    nome: 'Stairway to Heaven',
    artista: 'Led Zeppelin',
    tom: 'Am',
    bpm: 85
  }
];

const mockPedaleiras: Pedaleira[] = [
  {
    id: '1',
    nome: 'Pedaleira 1',
    bancos: [
      {
        id: '1',
        numero: 1,
        descricao: 'Banco Principal',
        patches: [
          {
            id: '1',
            numero: 1,
            letra: 'A',
            tipo: 'Clean',
            descricao: 'Clean Cristalino',
            musicas: ['1', '2']
          }
        ]
      }
    ]
  }
];

export default function PedaleirasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pedaleiraEditando, setPedaleiraEditando] = useState<Pedaleira | null>(null);
  const [pedaleiras, setPedaleiras] = useState<Pedaleira[]>(mockPedaleiras);

  const handleSubmit = (data: any) => {
    const novaPedaleira = {
      ...data,
      id: pedaleiraEditando?.id || (pedaleiras.length + 1).toString(),
      bancos: data.bancos.map((banco: any, index: number) => ({
        ...banco,
        id: banco.id || (index + 1).toString(),
        patches: banco.patches.map((patch: any, pIndex: number) => ({
          ...patch,
          id: patch.id || `${index + 1}-${pIndex + 1}`
        }))
      }))
    };

    if (pedaleiraEditando) {
      setPedaleiras(pedaleiras.map(p => 
        p.id === pedaleiraEditando.id ? novaPedaleira : p
      ));
    } else {
      setPedaleiras([...pedaleiras, novaPedaleira]);
    }
    setPedaleiraEditando(null);
    setIsModalOpen(false);
  };

  const handleEditar = (pedaleira: Pedaleira) => {
    setPedaleiraEditando(pedaleira);
    setIsModalOpen(true);
  };

  const handleExcluir = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta pedaleira?')) {
      setPedaleiras(pedaleiras.filter(p => p.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Minhas Pedaleiras</h1>
          <button
            onClick={() => {
              setPedaleiraEditando(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Nova Pedaleira
          </button>
        </div>

        {pedaleiras.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pedaleiras.map((pedaleira) => (
              <div
                key={pedaleira.id}
                className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">{pedaleira.nome}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {pedaleira.bancos.length} banco(s)
                  </p>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Bancos:</h4>
                    <ul className="mt-2 divide-y divide-gray-200">
                      {pedaleira.bancos.map((banco) => (
                        <li key={banco.id} className="py-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Banco {banco.numero}</span>
                            <span className="text-sm text-gray-500">
                              {banco.patches.length} patch(es)
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">{banco.descricao}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleEditar(pedaleira)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleExcluir(pedaleira.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhuma pedaleira cadastrada
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece criando sua primeira pedaleira.
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPedaleiraEditando(null);
        }}
        title={pedaleiraEditando ? 'Editar Pedaleira' : 'Nova Pedaleira'}
      >
        <PedaleiraForm
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setPedaleiraEditando(null);
          }}
          initialData={pedaleiraEditando}
          musicas={mockMusicas}
        />
      </Modal>
    </div>
  );
} 