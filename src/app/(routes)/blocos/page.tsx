'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { BlocoForm } from './components/BlocoForm';
import { BlocoDetalhes } from './components/BlocoDetalhes';
import { QueueListIcon } from '@heroicons/react/24/outline';

// Dados de exemplo - músicas disponíveis
const musicasDisponiveis = [
  {
    id: '1',
    nome: 'Evidências',
    artista: 'Chitãozinho & Xororó',
    tom: 'C',
    bpm: '120',
  },
  {
    id: '2',
    nome: 'Sweet Child O\' Mine',
    artista: 'Guns N\' Roses',
    tom: 'D',
    bpm: '126',
  },
  {
    id: '3',
    nome: 'Garota de Ipanema',
    artista: 'Tom Jobim',
    tom: 'F',
    bpm: '130',
  },
  {
    id: '4',
    nome: 'Wonderwall',
    artista: 'Oasis',
    tom: 'Am',
    bpm: '86',
  },
];

// Dados de exemplo - blocos
const blocosExemplo = [
  {
    id: '1',
    nome: 'Abertura',
    descricao: 'Músicas animadas para começar o show',
    musicas: [musicasDisponiveis[1], musicasDisponiveis[3]], // Sweet Child e Wonderwall
  },
  {
    id: '2',
    nome: 'Romântico',
    descricao: 'Baladas e músicas mais calmas',
    musicas: [musicasDisponiveis[0]], // Evidências
  },
  {
    id: '3',
    nome: 'MPB',
    descricao: 'Clássicos da música brasileira',
    musicas: [musicasDisponiveis[2]], // Garota de Ipanema
  },
];

export default function BlocosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blocos, setBlocos] = useState(blocosExemplo);
  const [blocoSelecionado, setBlocoSelecionado] = useState<typeof blocosExemplo[0] | null>(null);
  const [isDetalhesOpen, setIsDetalhesOpen] = useState(false);

  const handleSubmit = async (data: any) => {
    // TODO: Implementar integração com o backend
    console.log('Dados do bloco:', data);
    setIsModalOpen(false);
  };

  const handleVerDetalhes = (bloco: typeof blocosExemplo[0]) => {
    setBlocoSelecionado(bloco);
    setIsDetalhesOpen(true);
  };

  const handleAdicionarMusica = (musicaId: string) => {
    if (!blocoSelecionado) return;

    const musica = musicasDisponiveis.find((m) => m.id === musicaId);
    if (!musica) return;

    const blocoAtualizado = {
      ...blocoSelecionado,
      musicas: [...blocoSelecionado.musicas, musica],
    };

    setBlocos(blocos.map((b) => (b.id === blocoSelecionado.id ? blocoAtualizado : b)));
    setBlocoSelecionado(blocoAtualizado);
  };

  const handleRemoverMusica = (musicaId: string) => {
    if (!blocoSelecionado) return;

    const blocoAtualizado = {
      ...blocoSelecionado,
      musicas: blocoSelecionado.musicas.filter((m) => m.id !== musicaId),
    };

    setBlocos(blocos.map((b) => (b.id === blocoSelecionado.id ? blocoAtualizado : b)));
    setBlocoSelecionado(blocoAtualizado);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Meus Blocos</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Novo Bloco
          </button>
        </div>

        {/* Lista de Blocos */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {blocos.map((bloco) => (
            <div key={bloco.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <QueueListIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-lg font-medium text-gray-900 truncate">{bloco.nome}</dt>
                      <dd className="flex items-center text-sm text-gray-500">
                        {bloco.musicas.length} músicas • {bloco.musicas.length * 4} minutos
                      </dd>
                    </dl>
                  </div>
                </div>
                {bloco.descricao && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">{bloco.descricao}</p>
                  </div>
                )}
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => handleVerDetalhes(bloco)}
                    className="text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    Gerenciar Músicas
                  </button>
                  <button className="text-sm text-indigo-600 hover:text-indigo-900">
                    Editar
                  </button>
                  <button className="text-sm text-red-600 hover:text-red-900">
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensagem quando não há blocos */}
        {blocos.length === 0 && (
          <div className="text-center py-12">
            <QueueListIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum bloco cadastrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Crie blocos para organizar suas músicas em conjuntos temáticos.
            </p>
          </div>
        )}
      </div>

      {/* Modal de Novo Bloco */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Bloco"
      >
        <BlocoForm
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Modal de Detalhes do Bloco */}
      {blocoSelecionado && (
        <BlocoDetalhes
          isOpen={isDetalhesOpen}
          onClose={() => setIsDetalhesOpen(false)}
          bloco={blocoSelecionado}
          musicasDisponiveis={musicasDisponiveis}
          onAdicionarMusica={handleAdicionarMusica}
          onRemoverMusica={handleRemoverMusica}
        />
      )}
    </div>
  );
} 