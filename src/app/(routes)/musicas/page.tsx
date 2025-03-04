'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { MusicaForm } from './components/MusicaForm';
import { MusicaDetalhes } from './components/MusicaDetalhes';
import { MusicalNoteIcon } from '@heroicons/react/24/outline';

// Dados de exemplo
const musicasExemplo = [
  {
    id: '1',
    nome: 'Evidências',
    artista: 'Chitãozinho & Xororó',
    tom: 'C',
    bpm: '120',
    cifra: `[Intro] C  G/B  Am  Em/G  F  C/E  Dm  G
C                G/B
Quando eu digo que deixei de te amar
Am                   Em/G
É porque eu te amo
F              C/E
Quando eu digo que não quero mais você
Dm          G
É porque eu te quero`,
    letra: `Quando eu digo que deixei de te amar
É porque eu te amo
Quando eu digo que não quero mais você
É porque eu te quero

Eu tenho medo de te dar meu coração
E confiar em você
Eu tenho medo de viver uma ilusão
E sofrer`,
    observacoes: 'Música muito pedida em todos os shows. Boa para encerramento.',
  },
  {
    id: '2',
    nome: 'Sweet Child O\' Mine',
    artista: 'Guns N\' Roses',
    tom: 'D',
    bpm: '126',
    cifra: `[Intro] D  C  G  D

D              C              G
She's got a smile that it seems to me
D              C              G
Reminds me of childhood memories
D              C              G
Where everything was as fresh as the bright blue sky`,
    letra: `She's got a smile that it seems to me
Reminds me of childhood memories
Where everything was as fresh as the bright blue sky

Now and then when I see her face
She takes me away to that special place
And if I stare too long, I'd probably break down and cry`,
    observacoes: 'Solo complexo, precisa ensaiar bem. Público sempre canta junto.',
  },
];

export default function MusicasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [musicaSelecionada, setMusicaSelecionada] = useState<typeof musicasExemplo[0] | null>(null);
  const [isDetalhesOpen, setIsDetalhesOpen] = useState(false);
  const [isEditando, setIsEditando] = useState(false);
  const [musicaParaExcluir, setMusicaParaExcluir] = useState<string | null>(null);
  const [musicas, setMusicas] = useState(musicasExemplo);

  const handleSubmit = async (data: any) => {
    if (isEditando && musicaSelecionada) {
      // Atualizar música existente
      setMusicas(musicas.map(musica => 
        musica.id === musicaSelecionada.id 
          ? { ...musica, ...data }
          : musica
      ));
    } else {
      // Adicionar nova música
      const novaMusica = {
        id: String(Date.now()),
        ...data
      };
      setMusicas([...musicas, novaMusica]);
    }
    setIsModalOpen(false);
    setIsEditando(false);
    setMusicaSelecionada(null);
  };

  const handleEditar = (musica: typeof musicasExemplo[0]) => {
    setMusicaSelecionada(musica);
    setIsEditando(true);
    setIsModalOpen(true);
  };

  const handleExcluir = (musicaId: string) => {
    setMusicas(musicas.filter(musica => musica.id !== musicaId));
    setMusicaParaExcluir(null);
  };

  const handleVerDetalhes = (musica: typeof musicasExemplo[0]) => {
    setMusicaSelecionada(musica);
    setIsDetalhesOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Minhas Músicas</h1>
          <button
            onClick={() => {
              setIsEditando(false);
              setMusicaSelecionada(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Nova Música
          </button>
        </div>

        {/* Lista de Músicas */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {musicas.map((musica) => (
              <li key={musica.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{musica.nome}</h3>
                    <p className="text-sm text-gray-500">
                      {musica.artista} • Tom: {musica.tom} • BPM: {musica.bpm}
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleVerDetalhes(musica)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Ver Detalhes
                    </button>
                    <button
                      onClick={() => handleEditar(musica)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setMusicaParaExcluir(musica.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Mensagem quando não há músicas */}
        {musicas.length === 0 && (
          <div className="text-center py-12">
            <MusicalNoteIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma música cadastrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece adicionando suas músicas para criar repertórios.
            </p>
          </div>
        )}
      </div>

      {/* Modal de Nova Música/Edição */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditando(false);
          setMusicaSelecionada(null);
        }}
        title={isEditando ? "Editar Música" : "Nova Música"}
      >
        <MusicaForm
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setIsEditando(false);
            setMusicaSelecionada(null);
          }}
          initialData={isEditando ? musicaSelecionada : undefined}
        />
      </Modal>

      {/* Modal de Detalhes da Música */}
      {musicaSelecionada && (
        <MusicaDetalhes
          isOpen={isDetalhesOpen}
          onClose={() => setIsDetalhesOpen(false)}
          musica={musicaSelecionada}
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={!!musicaParaExcluir}
        onClose={() => setMusicaParaExcluir(null)}
        title="Confirmar Exclusão"
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Tem certeza que deseja excluir esta música? Esta ação não pode ser desfeita.
          </p>
        </div>

        <div className="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            onClick={() => setMusicaParaExcluir(null)}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
            onClick={() => musicaParaExcluir && handleExcluir(musicaParaExcluir)}
          >
            Excluir
          </button>
        </div>
      </Modal>
    </div>
  );
} 