'use client';

import { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon, XMarkIcon, DocumentDuplicateIcon, QueueListIcon, PlusIcon } from '@heroicons/react/24/outline';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface Musica {
  id: string;
  nome: string;
  artista: string;
  tom: string;
  bpm?: string;
  dicas?: string[];
}

interface Bloco {
  id: string;
  nome: string;
  descricao?: string;
  musicas: Musica[];
}

interface BlocosOrdenadosProps {
  blocos: Bloco[];
  onRemoverBloco: (blocoId: string) => void;
  onReordenarBlocos: (blocos: Bloco[]) => void;
  onDuplicarBloco: (bloco: Bloco) => void;
  onAtualizarBlocos: (blocos: Bloco[]) => void;
}

export function BlocosOrdenados({ blocos, onRemoverBloco, onReordenarBlocos, onDuplicarBloco, onAtualizarBlocos }: BlocosOrdenadosProps) {
  const [dicaAtual, setDicaAtual] = useState('');
  const [musicaEditandoIndex, setMusicaEditandoIndex] = useState<{ blocoIndex: number; musicaIndex: number } | null>(null);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(blocos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReordenarBlocos(items);
  };

  const handleRemoverBloco = (e: React.MouseEvent, blocoId: string) => {
    e.preventDefault();
    e.stopPropagation();
    onRemoverBloco(blocoId);
  };

  const handleDuplicarBloco = (e: React.MouseEvent, bloco: Bloco) => {
    e.preventDefault();
    e.stopPropagation();
    onDuplicarBloco(bloco);
  };

  const adicionarDica = (blocoIndex: number, musicaIndex: number) => {
    if (dicaAtual.trim()) {
      const novosBlocos = [...blocos];
      if (!novosBlocos[blocoIndex].musicas[musicaIndex].dicas) {
        novosBlocos[blocoIndex].musicas[musicaIndex].dicas = [];
      }
      novosBlocos[blocoIndex].musicas[musicaIndex].dicas?.push(dicaAtual.trim());
      onAtualizarBlocos(novosBlocos);
      setDicaAtual('');
      setMusicaEditandoIndex(null);
    }
  };

  const removerDica = (blocoIndex: number, musicaIndex: number, dicaIndex: number) => {
    const novosBlocos = [...blocos];
    novosBlocos[blocoIndex].musicas[musicaIndex].dicas?.splice(dicaIndex, 1);
    onAtualizarBlocos(novosBlocos);
  };

  const calcularDuracao = (musicas: Bloco['musicas']) => {
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
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Blocos do Repertório</h3>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="blocos">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="bg-white shadow overflow-hidden sm:rounded-lg"
            >
              <ul className="divide-y divide-gray-200">
                {blocos.map((bloco, blocoIndex) => (
                  <Draggable key={bloco.id} draggableId={bloco.id} index={blocoIndex}>
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`px-4 py-4 ${snapshot.isDragging ? 'bg-gray-50 shadow-lg ring-2 ring-indigo-500' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab hover:text-indigo-500"
                            >
                              <QueueListIcon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900">{bloco.nome}</h4>
                              <p className="text-sm text-gray-500">
                                {bloco.musicas.length} músicas • {calcularDuracao(bloco.musicas)}
                              </p>
                              {bloco.descricao && (
                                <p className="mt-1 text-sm text-gray-500">{bloco.descricao}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={(e) => handleDuplicarBloco(e, bloco)}
                              className="p-1 text-indigo-600 hover:text-indigo-900"
                              type="button"
                            >
                              <DocumentDuplicateIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={(e) => handleRemoverBloco(e, bloco.id)}
                              className="p-1 text-red-400 hover:text-red-500"
                              type="button"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Lista de músicas do bloco */}
                        <div className="mt-2">
                          <ul className="pl-4 space-y-2">
                            {bloco.musicas.map((musica, musicaIndex) => (
                              <li key={musica.id} className="text-sm">
                                {/* Lista de Dicas da Música */}
                                <div className="space-y-2 mb-1">
                                  <ul className="space-y-1">
                                    {musica.dicas?.map((dica, dicaIndex) => (
                                      <li key={dicaIndex} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                        <span className="text-gray-600">{dica}</span>
                                        <button
                                          type="button"
                                          onClick={() => removerDica(blocoIndex, musicaIndex, dicaIndex)}
                                          className="text-red-600 hover:text-red-800"
                                        >
                                          Remover
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Adicionar Nova Dica para a Música */}
                                {musicaEditandoIndex?.blocoIndex === blocoIndex && 
                                 musicaEditandoIndex?.musicaIndex === musicaIndex && (
                                  <div className="flex gap-2 mb-2">
                                    <input
                                      type="text"
                                      value={dicaAtual}
                                      onChange={(e) => setDicaAtual(e.target.value)}
                                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                      placeholder="Digite a dica"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => adicionarDica(blocoIndex, musicaIndex)}
                                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                      Adicionar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setMusicaEditandoIndex(null);
                                        setDicaAtual('');
                                      }}
                                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                      Cancelar
                                    </button>
                                  </div>
                                )}

                                {/* Nome da Música */}
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600 flex items-center">
                                    <button
                                      type="button"
                                      onClick={() => setMusicaEditandoIndex({ blocoIndex, musicaIndex })}
                                      className="mr-2 text-indigo-600 hover:text-indigo-800"
                                    >
                                      <PlusIcon className="h-4 w-4" />
                                    </button>
                                    {musica.nome} - {musica.artista} (Tom: {musica.tom})
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {blocos.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          Nenhum bloco adicionado ao repertório. Adicione blocos para organizar suas músicas.
        </p>
      )}
    </div>
  );
} 