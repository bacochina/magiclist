'use client';

import { Dialog } from '@headlessui/react';
import { XMarkIcon, PlusIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Bloco, Musica } from '@/lib/types';

interface BlocoDetalhesModalProps {
  isOpen: boolean;
  onClose: () => void;
  bloco: Bloco;
  musicasDisponiveis: Musica[];
  onAdicionarMusica: (musicaId: string) => void;
  onRemoverMusica: (musicaId: string) => void;
  onReordenar: (blocoId: string, musicas: Musica[]) => void;
}

export function BlocoDetalhesModal({
  isOpen,
  onClose,
  bloco,
  musicasDisponiveis,
  onAdicionarMusica,
  onRemoverMusica,
  onReordenar,
}: BlocoDetalhesModalProps) {
  const [isAdicionandoMusica, setIsAdicionandoMusica] = useState(false);
  const [musicas, setMusicas] = useState<Musica[]>(bloco.musicas);

  useEffect(() => {
    setMusicas(bloco.musicas);
  }, [bloco.musicas]);

  const calcularDuracao = (musicas: Musica[]) => {
    const minutos = musicas.length * 4;
    if (minutos < 60) {
      return `${minutos} minutos`;
    }
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    return `${horas}h${minutosRestantes > 0 ? ` ${minutosRestantes}min` : ''}`;
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(musicas);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setMusicas(items);
    onReordenar(bloco.id, items);
  };

  const handleDragStart = () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }
  };

  const handleAdicionarMusica = (musicaId: string) => {
    onAdicionarMusica(musicaId);
    const musicaAdicionada = musicasDisponiveis.find(m => m.id === musicaId);
    if (musicaAdicionada) {
      setMusicas([...musicas, musicaAdicionada]);
    }
    setIsAdicionandoMusica(false);
  };

  const handleRemoverMusica = (musicaId: string) => {
    onRemoverMusica(musicaId);
    setMusicas(musicas.filter(m => m.id !== musicaId));
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
                  {musicas.length} músicas • {calcularDuracao(musicas)}
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

                  {/* Lista de Músicas Atual com Drag and Drop */}
                  <DragDropContext 
                    onDragEnd={handleDragEnd}
                    onDragStart={handleDragStart}
                  >
                    <Droppable droppableId="musicas">
                      {(provided) => (
                        <ul 
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="divide-y divide-gray-200 bg-gray-50 rounded-md"
                        >
                          {musicas.map((musica, index) => (
                            <Draggable 
                              key={musica.id} 
                              draggableId={musica.id} 
                              index={index}
                            >
                              {(provided) => (
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                  }}
                                  className="px-4 py-3 flex items-center justify-between hover:bg-gray-100"
                                >
                                  <div className="flex items-center flex-1">
                                    <div 
                                      {...provided.dragHandleProps}
                                      className="mr-3 cursor-grab active:cursor-grabbing"
                                    >
                                      <Bars3Icon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-sm font-medium text-gray-500 w-8">
                                        {(index + 1).toString().padStart(2, '0')}
                                      </span>
                                      <div>
                                        <h5 className="text-sm font-medium text-gray-900">{musica.nome}</h5>
                                        <p className="text-sm text-gray-500">
                                          {musica.artista} • Tom: {musica.tom}
                                          {musica.bpm ? ` • ${musica.bpm} BPM` : ''}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleRemoverMusica(musica.id)}
                                    className="text-sm text-red-600 hover:text-red-900 ml-4"
                                  >
                                    Remover
                                  </button>
                                </li>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </ul>
                      )}
                    </Droppable>
                  </DragDropContext>

                  {/* Seletor de Músicas */}
                  {isAdicionandoMusica && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Adicionar Músicas</h5>
                      <ul className="divide-y divide-gray-200 bg-white border rounded-md">
                        {musicasDisponiveis
                          .filter((m) => !musicas.some((bm) => bm.id === m.id))
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
                                onClick={() => handleAdicionarMusica(musica.id)}
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