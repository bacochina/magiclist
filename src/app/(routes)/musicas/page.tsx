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
  MusicalNoteIcon,
  ViewColumnsIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';
import { confirmar, alertaSucesso, alertaErro } from '@/lib/sweetalert';

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
  // Modo de visualização
  const [modoVisualizacao, setModoVisualizacao] = useState<'cartoes' | 'lista'>('lista');

  const handleAdicionarMusica = () => {
    setMusicaEmEdicao(undefined);
    setModalAberto(true);
  };

  const handleEditarMusica = (musica: Musica) => {
    setMusicaEmEdicao(musica);
    setModalAberto(true);
  };

  const handleExcluirMusica = async (musica: Musica) => {
    const confirmado = await confirmar(
      'Excluir música',
      `Tem certeza que deseja excluir a música "${musica.nome}"?`,
      'warning'
    );
    
    if (confirmado) {
      try {
        setMusicas(musicas.filter(m => m.id !== musica.id));
        alertaSucesso('Música excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir música:', error);
        alertaErro('Erro ao excluir a música');
      }
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
    <div className="min-h-screen relative">
      {/* Background específico para músicas */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-orange-900 via-amber-900 to-yellow-900"
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
                <MusicalNoteIcon className="h-8 w-8 mr-2" />
                Músicas
              </h1>
            </div>

            <div className="px-4 py-6 sm:px-0">
              <div className="bg-gray-800/90 backdrop-blur-lg rounded-lg p-6 shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <MusicalNoteIcon className="h-6 w-6 mr-2 text-amber-400" />
                    <span className="text-xl font-semibold text-gray-100">Minhas Músicas</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Campo de busca */}
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar músicas..."
                        className="bg-gray-700/50 border border-gray-600 text-white rounded-md pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    
                    {/* Botão de filtros */}
                    <button
                      onClick={() => setMostrarFiltros(!mostrarFiltros)}
                      className={`p-2 rounded-md ${
                        mostrarFiltros
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      title="Filtros avançados"
                    >
                      <AdjustmentsHorizontalIcon className="h-5 w-5" />
                    </button>
                    
                    {/* Botões de visualização */}
                    <div className="flex items-center">
                      <button
                        onClick={() => setModoVisualizacao('lista')}
                        className={`p-2 rounded-l-md ${
                          modoVisualizacao === 'lista'
                            ? 'bg-amber-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        title="Visualização em lista"
                      >
                        <TableCellsIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setModoVisualizacao('cartoes')}
                        className={`p-2 rounded-r-md ${
                          modoVisualizacao === 'cartoes'
                            ? 'bg-amber-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        title="Visualização em cartões"
                      >
                        <ViewColumnsIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <button
                      onClick={handleAdicionarMusica}
                      className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm"
                    >
                      <PlusIcon className="h-5 w-5 mr-1" />
                      Nova Música
                    </button>
                  </div>
                </div>

                {/* Filtros avançados */}
                {mostrarFiltros && (
                  <div className="mb-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Filtro de Tom */}
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center">
                          <MusicalNoteIcon className="h-4 w-4 mr-1 text-amber-400" />
                          Tom
                        </label>
                        <select
                          value={filtroTom}
                          onChange={(e) => setFiltroTom(e.target.value)}
                          className="block w-full rounded-md border-gray-600 bg-gray-700 text-gray-200 focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        >
                          <option value="">Todos os tons</option>
                          {tons.map((tom) => (
                            <option key={tom} value={tom}>
                              {tom}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Filtro de BPM */}
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Andamento (BPM)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {faixasBPM.map((faixa) => (
                            <button
                              key={faixa.label}
                              onClick={() => setFiltroBPM({ min: faixa.min, max: faixa.max })}
                              className={`px-3 py-2 text-sm rounded-md ${
                                filtroBPM.min === faixa.min && filtroBPM.max === faixa.max
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                              }`}
                            >
                              {faixa.label} ({faixa.descricao})
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Botão para limpar filtros */}
                    {temFiltrosAtivos && (
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={handleLimparFiltros}
                          className="inline-flex items-center px-3 py-1.5 text-sm text-gray-200 bg-gray-600 hover:bg-gray-500 rounded-md"
                        >
                          <XMarkIcon className="h-4 w-4 mr-1" />
                          Limpar filtros
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Lista de músicas */}
                {musicasFiltradas.length > 0 ? (
                  modoVisualizacao === 'lista' ? (
                    <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md border border-gray-700">
                      <ul className="divide-y divide-gray-700">
                        {musicasFiltradas.map((musica) => (
                          <li key={musica.id} className="px-6 py-4 hover:bg-gray-700 transition-colors duration-150">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="text-lg font-medium text-gray-100">{musica.nome}</h3>
                                  <p className="text-sm text-gray-400">{musica.artista}</p>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEditarMusica(musica)}
                                    className="p-2 text-amber-400 hover:text-amber-300 rounded-full hover:bg-amber-900/50"
                                    title="Editar música"
                                  >
                                    <PencilIcon className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => handleExcluirMusica(musica)}
                                    className="p-2 text-red-400 hover:text-red-300 rounded-full hover:bg-red-900/50"
                                    title="Excluir música"
                                  >
                                    <TrashIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                                  Tom: {musica.tom || 'N/A'}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                                  BPM: {musica.bpm || 'N/A'}
                                </span>
                              </div>
                              
                              {musica.observacoes && (
                                <p className="text-sm text-gray-300">{musica.observacoes}</p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {musicasFiltradas.map((musica) => (
                        <div 
                          key={musica.id} 
                          className="bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden rounded-lg border border-gray-700"
                        >
                          <div className="px-4 py-3 sm:px-6 flex justify-between items-start bg-amber-900">
                            <div className="flex items-center">
                              <MusicalNoteIcon className="h-5 w-5 text-amber-300" />
                              <h3 className="ml-2 text-lg leading-6 font-medium text-white truncate max-w-[200px]">{musica.nome}</h3>
                            </div>
                          </div>
                          <div className="border-t border-gray-700 px-4 py-5 sm:p-6">
                            <div className="space-y-3">
                              <div className="flex items-center text-sm">
                                <p className="text-gray-200 font-medium">Artista: {musica.artista || 'Não especificado'}</p>
                              </div>
                              
                              <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                                  Tom: {musica.tom || 'N/A'}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                                  BPM: {musica.bpm || 'N/A'}
                                </span>
                              </div>
                              
                              {musica.observacoes && (
                                <div className="mt-2 text-sm text-gray-300">
                                  <p className="font-medium mb-1">Observações:</p>
                                  <p>{musica.observacoes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="border-t border-gray-700 px-4 py-4 sm:px-6 flex justify-end items-center bg-gray-900">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditarMusica(musica)}
                                className="inline-flex items-center px-2 py-1 border border-gray-700 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-200 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
                                title="Editar música"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleExcluirMusica(musica)}
                                className="inline-flex items-center px-2 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-200 bg-red-900 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                title="Excluir música"
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
                    <MusicalNoteIcon className="mx-auto h-12 w-12 text-gray-500" />
                    <h3 className="mt-2 text-sm font-medium text-gray-200">Nenhuma música encontrada</h3>
                    <p className="mt-1 text-sm text-gray-400">
                      {busca || filtroTom || filtroBPM.min || filtroBPM.max
                        ? 'Tente ajustar os filtros ou fazer uma busca diferente.'
                        : 'Comece adicionando sua primeira música ao catálogo.'}
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={handleAdicionarMusica}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                      >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Nova Música
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Modal
              title={musicaEmEdicao ? 'Editar Música' : 'Nova Música'}
              isOpen={modalAberto}
              onClose={() => setModalAberto(false)}
            >
              <MusicaForm
                musica={musicaEmEdicao}
                onSubmit={handleSubmit}
                onCancel={() => setModalAberto(false)}
              />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
} 