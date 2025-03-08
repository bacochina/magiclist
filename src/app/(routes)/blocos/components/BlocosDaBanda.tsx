import { Banda, Bloco, Musica } from '@/lib/types';
import { BlocoPreview } from './BlocoPreview';
import { 
  PlusIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  Bars3Icon,
  MusicalNoteIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useState } from 'react';

interface BlocosDaBandaProps {
  banda: Banda;
  blocos: Bloco[];
  onAdicionarBloco: () => void;
  onEditarBloco: (bloco: Bloco) => void;
  onExcluirBloco: (blocoId: string) => void;
  onReordenarBlocos: (blocos: Bloco[]) => void;
  onReordenarMusicas: (blocoId: string, musicas: Musica[]) => void;
  onAdicionarMusica: (blocoId: string) => void;
  onEditarMusicaCompleta?: (musica: Musica) => void;
  onExcluirMusicaCompleta?: (musica: Musica) => void;
}

export function BlocosDaBanda({
  banda,
  blocos,
  onAdicionarBloco,
  onEditarBloco,
  onExcluirBloco,
  onReordenarBlocos,
  onReordenarMusicas,
  onAdicionarMusica,
  onEditarMusicaCompleta,
  onExcluirMusicaCompleta,
}: BlocosDaBandaProps) {
  const [blocosExpandidos, setBlocosExpandidos] = useState<Record<string, boolean>>(
    blocos.reduce((acc, bloco) => ({ ...acc, [bloco.id]: true }), {})
  );

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(blocos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Atualiza a ordem dos blocos
    onReordenarBlocos(items);
  };

  const toggleBloco = (blocoId: string) => {
    setBlocosExpandidos(prev => ({
      ...prev,
      [blocoId]: !prev[blocoId]
    }));
  };

  const handleExcluirBloco = (blocoId: string, blocoNome: string) => {
    if (confirm(`Tem certeza que deseja excluir o bloco "${blocoNome}"?`)) {
      onExcluirBloco(blocoId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Blocos de {banda.nome}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {blocos.length} {blocos.length === 1 ? 'bloco' : 'blocos'} cadastrados
          </p>
        </div>
        <button
          onClick={onAdicionarBloco}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Novo Bloco
        </button>
      </div>
      <div className="border-t border-gray-200">
        {blocos.length > 0 ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="blocos">
              {(provided) => (
                <ul
                  role="list"
                  className="divide-y divide-gray-200"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {blocos.map((bloco, index) => (
                    <Draggable key={bloco.id} draggableId={bloco.id} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="p-4 hover:bg-gray-50"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-move"
                                title="Arraste para reordenar"
                              >
                                <Bars3Icon className="h-5 w-5 text-gray-400" />
                              </div>
                              <span className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full font-medium">
                                {index + 1}
                              </span>
                              <div>
                                <h4 className="text-lg font-medium text-gray-900">{bloco.nome}</h4>
                                {bloco.descricao && (
                                  <p className="text-sm text-gray-500">{bloco.descricao}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() => toggleBloco(bloco.id)}
                                className="text-gray-400 hover:text-gray-600"
                                title={blocosExpandidos[bloco.id] ? "Recolher músicas" : "Expandir músicas"}
                              >
                                {blocosExpandidos[bloco.id] ? (
                                  <ChevronUpIcon className="h-5 w-5" />
                                ) : (
                                  <ChevronDownIcon className="h-5 w-5" />
                                )}
                              </button>
                              <button
                                onClick={() => onEditarBloco(bloco)}
                                className="inline-flex items-center text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-full p-2 transition-colors duration-200"
                                title="Editar nome e descrição do bloco"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => onAdicionarMusica(bloco.id)}
                                className="inline-flex items-center text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-full p-2 transition-colors duration-200"
                                title="Adicionar música"
                              >
                                <MusicalNoteIcon className="h-5 w-5" />
                                <PlusIcon className="h-4 w-4 -ml-1" />
                              </button>
                              <button
                                onClick={() => handleExcluirBloco(bloco.id, bloco.nome)}
                                className="inline-flex items-center text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-full p-2 transition-colors duration-200"
                                title="Excluir bloco"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                          {blocosExpandidos[bloco.id] && (
                            <div className="mt-4">
                              <BlocoPreview 
                                bloco={bloco} 
                                onReordenarMusicas={(musicas) => onReordenarMusicas(bloco.id, musicas)}
                                onEditarMusicaCompleta={onEditarMusicaCompleta}
                                onExcluirMusicaCompleta={onExcluirMusicaCompleta}
                              />
                            </div>
                          )}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">
              Esta banda ainda não possui blocos cadastrados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 