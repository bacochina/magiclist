'use client';

import { Bloco, Musica } from '@/lib/types';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { QueueListIcon, Bars3Icon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface BlocoPreviewProps {
  bloco: Bloco;
  onReordenarMusicas?: (musicas: Musica[]) => void;
  onEditarMusica?: (musica: Musica) => void;
  onRemoverMusica?: (musicaId: string) => void;
  onEditarMusicaCompleta?: (musica: Musica) => void;
  onExcluirMusicaCompleta?: (musica: Musica) => void;
}

export function BlocoPreview({ 
  bloco, 
  onReordenarMusicas,
  onEditarMusica,
  onRemoverMusica,
  onEditarMusicaCompleta,
  onExcluirMusicaCompleta
}: BlocoPreviewProps) {
  // Garantir que bloco.musicas sempre seja um array
  const musicas = bloco.musicas || [];
  
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onReordenarMusicas) return;

    const items = Array.from(musicas);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Atualiza a ordem das músicas
    onReordenarMusicas(items);
  };

  const handleRemoverMusica = (musica: Musica) => {
    if (confirm(`Tem certeza que deseja remover a música "${musica.nome}" do bloco?`)) {
      onRemoverMusica?.(musica.id);
    }
  };

  const handleExcluirMusicaCompleta = (musica: Musica) => {
    if (confirm(`Tem certeza que deseja excluir completamente a música "${musica.nome}"?\nEla será removida de todos os blocos.`)) {
      onExcluirMusicaCompleta?.(musica);
    }
  };

  if (musicas.length === 0) {
    return (
      <div className="text-center py-6">
        <QueueListIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma música adicionada</h3>
        <p className="mt-1 text-sm text-gray-500">
          Clique em editar para adicionar músicas a este bloco.
        </p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={`musicas-${bloco.id}`}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {musicas.map((musica, index) => (
              <Draggable
                key={musica.id}
                draggableId={`${bloco.id}-${musica.id}`}
                index={index}
                isDragDisabled={!onReordenarMusicas}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`flex items-center space-x-4 p-3 rounded-md transition-all duration-200 ${
                      snapshot.isDragging 
                        ? 'bg-indigo-50 shadow-md' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div
                      {...provided.dragHandleProps}
                      className="cursor-move"
                      title="Arraste para reordenar"
                    >
                      <Bars3Icon className="h-5 w-5 text-gray-400" />
                    </div>
                    <span className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium shadow-sm transition-all duration-200 ${
                      snapshot.isDragging 
                        ? 'bg-indigo-200 text-indigo-800 scale-110' 
                        : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {musica.nome} - {musica.artista}
                      </p>
                      <p className="text-sm text-gray-500">
                        Tom: {musica.tom} | BPM: {musica.bpm}
                        {musica.observacoes && ` | ${musica.observacoes}`}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {onEditarMusicaCompleta && (
                        <button
                          onClick={() => onEditarMusicaCompleta(musica)}
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-full p-2 transition-colors duration-200"
                          title="Editar música no cadastro"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                      )}
                      {onRemoverMusica && (
                        <button
                          onClick={() => handleRemoverMusica(musica)}
                          className="inline-flex items-center text-orange-600 hover:text-orange-900 bg-orange-50 hover:bg-orange-100 rounded-full p-2 transition-colors duration-200"
                          title="Remover música do bloco"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                      {onExcluirMusicaCompleta && (
                        <button
                          onClick={() => handleExcluirMusicaCompleta(musica)}
                          className="inline-flex items-center text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-full p-2 transition-colors duration-200"
                          title="Excluir música do cadastro"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
} 