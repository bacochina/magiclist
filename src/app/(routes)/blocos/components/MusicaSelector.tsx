'use client';

import { useState } from 'react';
import { Musica } from '@/lib/types';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { QueueListIcon } from '@heroicons/react/24/outline';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface MusicaSelectorProps {
  musicas: Musica[];
  onChange: (musicas: Musica[]) => void;
}

export function MusicaSelector({ musicas = [], onChange }: MusicaSelectorProps) {
  const [todasMusicas] = useLocalStorage<Musica[]>('musicas', []);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(musicas || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange(items);
  };

  const handleRemoveMusica = (musicaId: string) => {
    onChange((musicas || []).filter((m) => m.id !== musicaId));
  };

  const handleAddMusica = () => {
    const musicasDisponiveis = todasMusicas.filter(
      (m) => !(musicas || []).some((selected) => selected.id === m.id)
    );

    if (musicasDisponiveis.length > 0) {
      onChange([...(musicas || []), musicasDisponiveis[0]]);
    }
  };

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="musicas">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {(musicas || []).map((musica, index) => (
                <Draggable
                  key={musica.id}
                  draggableId={musica.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {musica.nome} - {musica.artista}
                        </p>
                        <p className="text-sm text-gray-500">
                          Tom: {musica.tom} | BPM: {musica.bpm}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveMusica(musica.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remover
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button
        type="button"
        onClick={handleAddMusica}
        disabled={todasMusicas.length === (musicas || []).length}
        className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        Adicionar Música
      </button>
    </div>
  );
} 