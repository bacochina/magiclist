'use client';

import { Dialog } from '@headlessui/react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface Musica {
  id: string;
  nome: string;
  artista: string;
  tom: string;
  bpm?: string;
}

interface BlocoDetalhesProps {
  isOpen: boolean;
  onClose: () => void;
  bloco: {
    id: string;
    nome: string;
    descricao?: string;
    musicas: Musica[];
  };
  musicasDisponiveis: Musica[];
  onAdicionarMusica: (musicaId: string) => void;
  onRemoverMusica: (musicaId: string) => void;
}

export function BlocoDetalhes({
  isOpen,
  onClose,
  bloco,
  musicasDisponiveis,
  onAdicionarMusica,
  onRemoverMusica,
}: BlocoDetalhesProps) {
  const [isAdicionandoMusica, setIsAdicionandoMusica] = useState(false);

  const calcularDuracao = (musicas: Musica[]) => {
    // Assumindo média de 4 minutos por música
    const minutos = musicas.length * 4;
    if (minutos < 60) {
      return `${minutos} minutos`;
    }
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    return `${horas}h${minutosRestantes > 0 ? ` ${minutosRestantes}min` : ''}`;
  };

  return (
    <Dialog as="div" className="relative z-10" onClose={onClose} open={isOpen}>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                onClick={onClose}
              >
                <span className="sr-only">Fechar</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div>
              <div className="mt-3 sm:mt-5">
                <Dialog.Title as="h3" className="text-2xl font-semibold leading-6 text-gray-900 mb-1">
                  {bloco.nome}
                </Dialog.Title>
                <p className="text-sm text-gray-500 mb-2">
                  {bloco.musicas.length} músicas • {calcularDuracao(bloco.musicas)}
                </p>
                {bloco.descricao && (
                  <p className="text-sm text-gray-600 mb-6">{bloco.descricao}</p>
                )}

                {/* Lista de Músicas do Bloco */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Músicas no Bloco</h4>
                    <button
                      type="button"
                      onClick={() => setIsAdicionandoMusica(!isAdicionandoMusica)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
                    >
                      <PlusIcon className="h-5 w-5 mr-1" />
                      Adicionar Música
                    </button>
                  </div>

                  {/* Lista de Músicas Atual */}
                  <ul className="divide-y divide-gray-200 bg-gray-50 rounded-md">
                    {bloco.musicas.map((musica) => (
                      <li key={musica.id} className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium text-gray-900">{musica.nome}</h5>
                          <p className="text-sm text-gray-500">
                            {musica.artista} • Tom: {musica.tom}
                            {musica.bpm ? ` • ${musica.bpm} BPM` : ''}
                          </p>
                        </div>
                        <button
                          onClick={() => onRemoverMusica(musica.id)}
                          className="text-sm text-red-600 hover:text-red-900"
                        >
                          Remover
                        </button>
                      </li>
                    ))}
                  </ul>

                  {/* Seletor de Músicas */}
                  {isAdicionandoMusica && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Adicionar Músicas</h5>
                      <ul className="divide-y divide-gray-200 bg-white border rounded-md">
                        {musicasDisponiveis
                          .filter((m) => !bloco.musicas.some((bm) => bm.id === m.id))
                          .map((musica) => (
                            <li key={musica.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                              <div>
                                <h5 className="text-sm font-medium text-gray-900">{musica.nome}</h5>
                                <p className="text-sm text-gray-500">
                                  {musica.artista} • Tom: {musica.tom}
                                  {musica.bpm ? ` • ${musica.bpm} BPM` : ''}
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  onAdicionarMusica(musica.id);
                                  setIsAdicionandoMusica(false);
                                }}
                                className="text-sm text-indigo-600 hover:text-indigo-900"
                              >
                                Adicionar
                              </button>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                onClick={onClose}
              >
                Fechar
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
} 