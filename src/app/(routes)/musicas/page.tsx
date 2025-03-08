'use client';

import { useState, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Musica } from '@/lib/types';
import { useHydratedLocalStorage } from '@/hooks/useHydratedLocalStorage';
import { MusicaForm } from '../blocos/components/MusicaForm';
import { ClientOnly } from '../blocos/components/ClientOnly';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/outline';

interface FiltrosBPM {
  min?: number;
  max?: number;
}

// Faixas de BPM pré-definidas
const faixasBPM = [
  { label: 'Lenta', descricao: '< 90 BPM', min: 0, max: 90 },
  { label: 'Moderada', descricao: '90-120 BPM', min: 90, max: 120 },
  { label: 'Rápida', descricao: '120-150 BPM', min: 120, max: 150 },
  { label: 'Muito Rápida', descricao: '> 150 BPM', min: 150, max: 999 },
];

// Lista de tons musicais comuns
const tonsComuns = [
  'C', 'Cm', 'C#', 'C#m', 
  'D', 'Dm', 'D#', 'D#m', 
  'E', 'Em', 
  'F', 'Fm', 'F#', 'F#m', 
  'G', 'Gm', 'G#', 'G#m', 
  'A', 'Am', 'A#', 'A#m', 
  'B', 'Bm'
];

export default function MusicasPage() {
  const [musicas, setMusicas] = useHydratedLocalStorage<Musica[]>('musicas', []);
  const [modalAberto, setModalAberto] = useState(false);
  const [musicaEmEdicao, setMusicaEmEdicao] = useState<Musica | undefined>();
  
  // Estados para filtros e pesquisa
  const [busca, setBusca] = useState('');
  const [filtroTom, setFiltroTom] = useState<string>('');
  const [filtroBPM, setFiltroBPM] = useState<FiltrosBPM>({ min: undefined, max: undefined });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleAdicionarMusica = () => {
    setMusicaEmEdicao(undefined);
    setModalAberto(true);
  };

  const handleEditarMusica = (musica: Musica) => {
    setMusicaEmEdicao(musica);
    setModalAberto(true);
  };

  const handleExcluirMusica = (musica: Musica) => {
    if (confirm(`Tem certeza que deseja excluir a música "${musica.nome}"?`)) {
      setMusicas(musicas.filter(m => m.id !== musica.id));
    }
  };

  const handleSubmit = (data: Partial<Musica>) => {
    if (musicaEmEdicao) {
      setMusicas(
        musicas.map((m) =>
          m.id === musicaEmEdicao.id
            ? { ...m, ...data }
            : m
        )
      );
    } else {
      const novaMusica: Musica = {
        id: Math.random().toString(36).substr(2, 9),
        nome: data.nome || '',
        artista: data.artista || '',
        tom: data.tom || '',
        bpm: data.bpm || 0,
        observacoes: data.observacoes,
      };
      setMusicas([...musicas, novaMusica]);
    }
    setModalAberto(false);
    setMusicaEmEdicao(undefined);
  };

  const handleLimparFiltros = () => {
    setBusca('');
    setFiltroTom('');
    setFiltroBPM({ min: undefined, max: undefined });
  };

  // Lista única de tons para o filtro
  const tons = useMemo(() => {
    const tonsNasMusicas = Array.from(new Set(musicas.map(m => m.tom))).sort();
    // Combina os tons das músicas com os tons comuns, removendo duplicatas
    return Array.from(new Set([...tonsNasMusicas, ...tonsComuns])).sort();
  }, [musicas]);

  // Filtra músicas baseado em todos os critérios
  const musicasFiltradas = useMemo(() => {
    const termoBusca = busca.toLowerCase();
    
    const filtradas = musicas.filter((musica) => {
      const matchBusca = 
        musica.nome.toLowerCase().includes(termoBusca) || 
        musica.artista.toLowerCase().includes(termoBusca);
      const matchTom = !filtroTom || musica.tom === filtroTom;
      const matchBPM = (!filtroBPM.min || musica.bpm >= filtroBPM.min) &&
                      (!filtroBPM.max || musica.bpm <= filtroBPM.max);

      return matchBusca && matchTom && matchBPM;
    });

    // Ordena por nome
    return [...filtradas].sort((a, b) => a.nome.localeCompare(b.nome));
  }, [busca, filtroTom, filtroBPM, musicas]);

  const temFiltrosAtivos = busca || filtroTom || filtroBPM.min || filtroBPM.max;

  return (
    <ClientOnly>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Minhas Músicas</h1>
          <button
            onClick={handleAdicionarMusica}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nova Música
          </button>
        </div>

        {/* Barra de pesquisa unificada */}
        <div className="mb-6">
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por música ou artista..."
              className="block w-full rounded-md border-gray-300 pl-10 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-12"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
              {temFiltrosAtivos && (
                <button
                  onClick={handleLimparFiltros}
                  className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  title="Limpar filtros"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className={`p-1.5 rounded-md ${
                  mostrarFiltros
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
                title="Filtros avançados"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filtros avançados */}
        {mostrarFiltros && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Filtro de Tom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MusicalNoteIcon className="h-4 w-4 mr-1 text-indigo-500" />
                  Tom
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFiltroTom('')}
                    className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                      !filtroTom 
                        ? 'bg-indigo-100 text-indigo-700 font-medium' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Todos
                  </button>
                  {tons.map((tom) => (
                    <button
                      key={tom}
                      onClick={() => setFiltroTom(tom)}
                      className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                        filtroTom === tom 
                          ? 'bg-indigo-100 text-indigo-700 font-medium' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {tom}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtro de BPM */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Velocidade (BPM)
                </label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFiltroBPM({ min: undefined, max: undefined })}
                      className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                        !filtroBPM.min && !filtroBPM.max
                          ? 'bg-indigo-100 text-indigo-700 font-medium' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Todos
                    </button>
                    {faixasBPM.map((faixa) => (
                      <button
                        key={faixa.label}
                        onClick={() => setFiltroBPM({ min: faixa.min, max: faixa.max })}
                        className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                          filtroBPM.min === faixa.min && filtroBPM.max === faixa.max
                            ? 'bg-indigo-100 text-indigo-700 font-medium' 
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                        title={faixa.descricao}
                      >
                        {faixa.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min BPM"
                      value={filtroBPM.min || ''}
                      onChange={(e) => setFiltroBPM({ ...filtroBPM, min: e.target.value ? Number(e.target.value) : undefined })}
                      className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max BPM"
                      value={filtroBPM.max || ''}
                      onChange={(e) => setFiltroBPM({ ...filtroBPM, max: e.target.value ? Number(e.target.value) : undefined })}
                      className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resultados e estatísticas */}
        <div className="flex justify-between items-center mb-3 text-sm text-gray-500">
          <div>
            {musicasFiltradas.length} {musicasFiltradas.length === 1 ? 'música encontrada' : 'músicas encontradas'}
            {temFiltrosAtivos && ' com os filtros aplicados'}
          </div>
          {temFiltrosAtivos && (
            <button
              onClick={handleLimparFiltros}
              className="text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Limpar filtros
            </button>
          )}
        </div>

        {/* Lista de músicas */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {musicasFiltradas.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {musicasFiltradas.map((musica) => (
                <li key={musica.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-indigo-600 truncate mr-2">
                          {musica.nome}
                        </p>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                          {musica.tom}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {musica.artista}
                      </p>
                      <div className="mt-1 flex items-center">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          BPM: {musica.bpm}
                        </span>
                        {musica.observacoes && (
                          <p className="ml-2 text-xs text-gray-500 truncate">
                            {musica.observacoes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditarMusica(musica)}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-full p-2 transition-colors duration-200"
                        title="Editar música"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleExcluirMusica(musica)}
                        className="inline-flex items-center text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-full p-2 transition-colors duration-200"
                        title="Excluir música"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <MusicalNoteIcon className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">
                {temFiltrosAtivos
                  ? 'Nenhuma música encontrada com os filtros aplicados'
                  : 'Nenhuma música cadastrada. Clique em "Nova Música" para começar.'}
              </p>
              {temFiltrosAtivos && (
                <button
                  onClick={handleLimparFiltros}
                  className="mt-3 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          )}
        </div>

        {/* Modal de Edição/Criação de Música */}
        <Modal
          title={musicaEmEdicao ? 'Editar Música' : 'Nova Música'}
          isOpen={modalAberto}
          onClose={() => {
            setModalAberto(false);
            setMusicaEmEdicao(undefined);
          }}
        >
          <MusicaForm
            musica={musicaEmEdicao}
            onSubmit={handleSubmit}
          />
        </Modal>
      </div>
    </ClientOnly>
  );
} 