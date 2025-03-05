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
    nome: 'Take On Me',
    artista: 'a-ha',
    tom: 'A',
    observacoes: 'Atenção ao falsete no refrão. Sintetizadores são essenciais.',
  },
  {
    id: '2',
    nome: 'Sweet Dreams (Are Made of This)',
    artista: 'Eurythmics',
    tom: 'Cm',
    observacoes: 'Base de sintetizador marcante. Manter o groove da música.',
  },
  {
    id: '3',
    nome: 'Billie Jean',
    artista: 'Michael Jackson',
    tom: 'F#m',
    observacoes: 'Linha de baixo característica. Dança opcional mas recomendada.',
  },
  {
    id: '4',
    nome: 'Girls Just Want to Have Fun',
    artista: 'Cyndi Lauper',
    tom: 'F',
    observacoes: 'Energia alta do início ao fim. Ótima para animar o público.',
  },
  {
    id: '5',
    nome: 'Every Breath You Take',
    artista: 'The Police',
    tom: 'Ab',
    observacoes: 'Atenção ao padrão do arpejo da guitarra. Manter a dinâmica suave.',
  },
  {
    id: '6',
    nome: 'Another One Bites the Dust',
    artista: 'Queen',
    tom: 'Em',
    observacoes: 'Linha de baixo é a alma da música. Manter o groove funkeado.',
  },
  {
    id: '7',
    nome: 'Beat It',
    artista: 'Michael Jackson',
    tom: 'Em',
    observacoes: 'Solo de guitarra icônico. Manter a energia rock da música.',
  },
  {
    id: '8',
    nome: 'Like a Virgin',
    artista: 'Madonna',
    tom: 'F',
    observacoes: 'Arranjo de teclados importante. Bom para momentos dançantes.',
  },
  {
    id: '9',
    nome: 'I Wanna Dance with Somebody',
    artista: 'Whitney Houston',
    tom: 'G',
    observacoes: 'Exige bom preparo vocal. Ótima para encerramento de set.',
  },
  {
    id: '10',
    nome: 'Walk of Life',
    artista: 'Dire Straits',
    tom: 'E',
    observacoes: 'Riff de teclado característico. Manter o balanço country-rock.',
  },
  {
    id: '11',
    nome: 'Time After Time',
    artista: 'Cyndi Lauper',
    tom: 'C',
    observacoes: 'Balada emotiva. Boa para momentos mais calmos do show.',
  },
  {
    id: '12',
    nome: 'Eye of the Tiger',
    artista: 'Survivor',
    tom: 'Cm',
    observacoes: 'Riff de guitarra icônico. Energia crescente na execução.',
  },
  {
    id: '13',
    nome: 'Material Girl',
    artista: 'Madonna',
    tom: 'C',
    observacoes: 'Arranjo de metais importante. Manter o groove disco-pop.',
  },
  {
    id: '14',
    nome: 'Africa',
    artista: 'Toto',
    tom: 'F#',
    observacoes: 'Atenção às harmonias vocais. Percussão característica.',
  },
  {
    id: '15',
    nome: 'Call Me',
    artista: 'Blondie',
    tom: 'D',
    observacoes: 'Base de sintetizador e guitarra marcantes. Energia new wave.',
  },
  {
    id: '16',
    nome: 'Karma Chameleon',
    artista: 'Culture Club',
    tom: 'Bb',
    observacoes: 'Melodia de gaita característica. Manter o balanço pop.',
  },
  {
    id: '17',
    nome: 'Physical',
    artista: 'Olivia Newton-John',
    tom: 'E',
    observacoes: 'Groove dançante essencial. Boa para momentos animados.',
  },
  {
    id: '18',
    nome: 'Forever Young',
    artista: 'Alphaville',
    tom: 'C',
    observacoes: 'Sintetizadores em destaque. Atenção às dinâmicas.',
  },
  {
    id: '19',
    nome: 'Total Eclipse of the Heart',
    artista: 'Bonnie Tyler',
    tom: 'Dm',
    observacoes: 'Balada dramática. Exige bom preparo vocal.',
  },
  {
    id: '20',
    nome: 'Wake Me Up Before You Go-Go',
    artista: 'Wham!',
    tom: 'D',
    observacoes: 'Energia alta e dançante. Ótima para animar o público.',
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
                      {musica.artista} • Tom: {musica.tom}
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