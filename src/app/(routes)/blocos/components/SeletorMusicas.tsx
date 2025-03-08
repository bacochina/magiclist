'use client';

import { useState, useEffect, useMemo } from 'react';
import { Musica } from '@/lib/types';
import { useHydratedLocalStorage } from '@/hooks/useHydratedLocalStorage';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SeletorMusicasProps {
  bandaId: string;
  musicasSelecionadas: Musica[];
  onAdicionarMusica: (musica: Musica) => void;
  onEditarMusica?: (musica: Musica) => void;
  onRemoverMusica?: (musica: Musica) => void;
}

interface FiltrosBPM {
  min?: number;
  max?: number;
}

// Faixas de BPM pré-definidas
const faixasBPM = [
  { label: 'Lenta (< 90 BPM)', min: 0, max: 90 },
  { label: 'Moderada (90-120 BPM)', min: 90, max: 120 },
  { label: 'Rápida (120-150 BPM)', min: 120, max: 150 },
  { label: 'Muito Rápida (> 150 BPM)', min: 150, max: 999 },
];

export function SeletorMusicas({
  bandaId,
  musicasSelecionadas,
  onAdicionarMusica,
  onEditarMusica,
  onRemoverMusica,
}: SeletorMusicasProps) {
  const [todasMusicas] = useHydratedLocalStorage<Musica[]>('musicas', []);
  const [busca, setBusca] = useState('');
  const [buscaArtista, setBuscaArtista] = useState('');
  const [filtroTom, setFiltroTom] = useState<string>('');
  const [filtroBPM, setFiltroBPM] = useState<FiltrosBPM>({ min: undefined, max: undefined });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const handleRemoverMusica = (musica: Musica) => {
    if (confirm(`Tem certeza que deseja remover a música "${musica.nome}"?`)) {
      onRemoverMusica?.(musica);
    }
  };

  const handleLimparFiltros = () => {
    setBusca('');
    setBuscaArtista('');
    setFiltroTom('');
    setFiltroBPM({ min: undefined, max: undefined });
  };

  // Lista única de tons para o filtro
  const tons = useMemo(() => {
    return Array.from(new Set(todasMusicas.map(m => m.tom))).sort();
  }, [todasMusicas]);

  // Filtra músicas baseado em todos os critérios
  const musicasFiltradas = useMemo(() => {
    const musicasDisponiveis = todasMusicas.filter(
      (musica) => !musicasSelecionadas.some((m) => m.id === musica.id)
    );

    const filtradas = musicasDisponiveis.filter((musica) => {
      const termoBusca = busca.toLowerCase();
      const termoArtista = buscaArtista.toLowerCase();
      const matchNome = musica.nome.toLowerCase().includes(termoBusca);
      const matchArtista = musica.artista.toLowerCase().includes(termoArtista);
      const matchTom = !filtroTom || musica.tom === filtroTom;
      const matchBPM = (!filtroBPM.min || musica.bpm >= filtroBPM.min) &&
                      (!filtroBPM.max || musica.bpm <= filtroBPM.max);

      return matchNome && matchArtista && matchTom && matchBPM;
    });

    // Ordena por nome
    return [...filtradas].sort((a, b) => a.nome.localeCompare(b.nome));
  }, [busca, buscaArtista, filtroTom, filtroBPM, todasMusicas, musicasSelecionadas]);

  const temFiltrosAtivos = busca || buscaArtista || filtroTom || filtroBPM.min || filtroBPM.max;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex-1 space-y-2">
          {/* Campo de busca por nome */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome da música..."
              className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Campo de busca por artista */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={buscaArtista}
              onChange={(e) => setBuscaArtista(e.target.value)}
              placeholder="Buscar por artista..."
              className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {temFiltrosAtivos && (
            <button
              onClick={handleLimparFiltros}
              className="inline-flex items-center p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
              title="Limpar filtros"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className={`inline-flex items-center p-2 rounded-md ${
              mostrarFiltros
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Mostrar filtros avançados"
          >
            <FunnelIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filtros avançados */}
      {mostrarFiltros && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-md">
          <div>
            <label htmlFor="tom" className="block text-sm font-medium text-gray-700 mb-1">
              Tom
            </label>
            <select
              id="tom"
              value={filtroTom}
              onChange={(e) => setFiltroTom(e.target.value)}
              className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Todos</option>
              {tons.map((tom) => (
                <option key={tom} value={tom}>
                  {tom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Faixas de BPM
            </label>
            <div className="grid grid-cols-2 gap-2">
              {faixasBPM.map((faixa) => (
                <button
                  key={faixa.label}
                  onClick={() => setFiltroBPM({ min: faixa.min, max: faixa.max })}
                  className={`p-2 text-sm rounded-md transition-colors duration-200 ${
                    filtroBPM.min === faixa.min && filtroBPM.max === faixa.max
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {faixa.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              BPM Personalizado
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filtroBPM.min || ''}
                onChange={(e) => setFiltroBPM({ ...filtroBPM, min: e.target.value ? Number(e.target.value) : undefined })}
                className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filtroBPM.max || ''}
                onChange={(e) => setFiltroBPM({ ...filtroBPM, max: e.target.value ? Number(e.target.value) : undefined })}
                className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      )}

      <div className="max-h-96 overflow-y-auto">
        {musicasFiltradas.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {musicasFiltradas.map((musica) => (
              <li
                key={musica.id}
                className="flex items-center justify-between py-3 hover:bg-gray-50 px-3 rounded-md"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {musica.nome} - {musica.artista}
                  </p>
                  <p className="text-sm text-gray-500">
                    Tom: {musica.tom} | BPM: {musica.bpm}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {onEditarMusica && (
                    <button
                      onClick={() => onEditarMusica(musica)}
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-full p-2 transition-colors duration-200"
                      title="Editar música"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  )}
                  {onRemoverMusica && (
                    <button
                      onClick={() => handleRemoverMusica(musica)}
                      className="inline-flex items-center text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-full p-2 transition-colors duration-200"
                      title="Remover música"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">
              {temFiltrosAtivos
                ? 'Nenhuma música encontrada para os filtros selecionados'
                : 'Nenhuma música disponível'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 