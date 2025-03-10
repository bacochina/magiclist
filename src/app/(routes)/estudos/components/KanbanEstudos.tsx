'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { EstudoModal } from './EstudoModal';
import { v4 as uuidv4 } from 'uuid';

interface Estudo {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: 'baixa' | 'media' | 'alta';
  dataLimite?: string;
  cor: 'vermelho' | 'laranja' | 'amarelo' | 'verde';
}

interface Coluna {
  id: string;
  titulo: string;
  cards: Estudo[];
}

const COLUNAS_INICIAIS: Coluna[] = [
  {
    id: 'estudar',
    titulo: 'Estudar',
    cards: []
  },
  {
    id: 'em-andamento',
    titulo: 'Em Andamento',
    cards: []
  },
  {
    id: 'concluido',
    titulo: 'Concluído',
    cards: []
  }
];

export function KanbanEstudos() {
  const [colunas, setColunas] = useState<Coluna[]>(COLUNAS_INICIAIS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [estudoEmEdicao, setEstudoEmEdicao] = useState<Estudo | undefined>(undefined);
  const [colunaAtual, setColunaAtual] = useState<string>('');

  // Carregar dados do localStorage
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('kanban-estudos');
    if (dadosSalvos) {
      setColunas(JSON.parse(dadosSalvos));
    }
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('kanban-estudos', JSON.stringify(colunas));
  }, [colunas]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      // Reordenar na mesma coluna
      const coluna = colunas.find(col => col.id === source.droppableId);
      if (!coluna) return;

      const novasCards = Array.from(coluna.cards);
      const [cardRemovido] = novasCards.splice(source.index, 1);
      novasCards.splice(destination.index, 0, cardRemovido);

      const novasColunas = colunas.map(col =>
        col.id === source.droppableId ? { ...col, cards: novasCards } : col
      );

      setColunas(novasColunas);
    } else {
      // Mover entre colunas
      const colunaOrigem = colunas.find(col => col.id === source.droppableId);
      const colunaDestino = colunas.find(col => col.id === destination.droppableId);
      if (!colunaOrigem || !colunaDestino) return;

      const cardsOrigem = Array.from(colunaOrigem.cards);
      const cardsDestino = Array.from(colunaDestino.cards);
      const [cardRemovido] = cardsOrigem.splice(source.index, 1);
      cardsDestino.splice(destination.index, 0, cardRemovido);

      const novasColunas = colunas.map(col => {
        if (col.id === source.droppableId) {
          return { ...col, cards: cardsOrigem };
        }
        if (col.id === destination.droppableId) {
          return { ...col, cards: cardsDestino };
        }
        return col;
      });

      setColunas(novasColunas);
    }
  };

  const handleAddCard = (colunaId: string) => {
    setEstudoEmEdicao(undefined);
    setColunaAtual(colunaId);
    setIsModalOpen(true);
  };

  const handleEditCard = (estudo: Estudo, colunaId: string) => {
    setEstudoEmEdicao(estudo);
    setColunaAtual(colunaId);
    setIsModalOpen(true);
  };

  const handleDeleteCard = (estudoId: string, colunaId: string) => {
    const novasColunas = colunas.map(col => {
      if (col.id === colunaId) {
        return {
          ...col,
          cards: col.cards.filter(card => card.id !== estudoId)
        };
      }
      return col;
    });
    setColunas(novasColunas);
  };

  const handleSaveEstudo = (dadosEstudo: Omit<Estudo, 'id'>) => {
    const novasColunas = colunas.map(col => {
      if (col.id === colunaAtual) {
        if (estudoEmEdicao) {
          // Editando um estudo existente
          return {
            ...col,
            cards: col.cards.map(card =>
              card.id === estudoEmEdicao.id
                ? { ...dadosEstudo, id: card.id }
                : card
            )
          };
        } else {
          // Adicionando um novo estudo
          return {
            ...col,
            cards: [...col.cards, { ...dadosEstudo, id: uuidv4() }]
          };
        }
      }
      return col;
    });

    setColunas(novasColunas);
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {colunas.map(coluna => (
            <div
              key={coluna.id}
              className="bg-gray-50 rounded-lg p-4 min-h-[500px]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {coluna.titulo}
                  <span className="ml-2 text-sm text-gray-500">
                    {coluna.cards.length}
                  </span>
                </h3>
                <button
                  onClick={() => handleAddCard(coluna.id)}
                  className="p-1 hover:bg-gray-200 rounded-full"
                >
                  <PlusIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <Droppable droppableId={coluna.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-3"
                  >
                    {coluna.cards.map((card, index) => (
                      <Draggable
                        key={card.id}
                        draggableId={card.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${
                              card.cor === 'vermelho' ? 'border-red-500 bg-red-100/85' :
                              card.cor === 'laranja' ? 'border-orange-500 bg-orange-100/75' :
                              card.cor === 'amarelo' ? 'border-yellow-500 bg-yellow-100/75' :
                              'border-green-500 bg-green-100/75'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900">
                                {card.titulo}
                              </h4>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditCard(card, coluna.id)}
                                  className="p-1 hover:bg-gray-100 rounded"
                                >
                                  <PencilIcon className="h-4 w-4 text-gray-600" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCard(card.id, coluna.id)}
                                  className="p-1 hover:bg-gray-100 rounded"
                                >
                                  <TrashIcon className="h-4 w-4 text-red-600" />
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">
                              {card.descricao}
                            </p>
                            {card.dataLimite && (
                              <div className="mt-2 text-xs text-gray-500">
                                Prazo: {new Date(card.dataLimite).toLocaleDateString()}
                              </div>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs
                                ${card.prioridade === 'alta' ? 'bg-red-100 text-red-800' : 
                                  card.prioridade === 'media' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-green-100 text-green-800'}`}
                              >
                                {card.prioridade.charAt(0).toUpperCase() + card.prioridade.slice(1)}
                              </div>
                              <div className="flex space-x-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const novasColunas = colunas.map(col => ({
                                      ...col,
                                      cards: col.cards.map(c => 
                                        c.id === card.id ? { ...c, cor: 'vermelho' as const } : c
                                      )
                                    }));
                                    setColunas(novasColunas);
                                  }}
                                  className={`w-5 h-5 rounded-full bg-red-500 ${
                                    card.cor === 'vermelho' ? 'ring-2 ring-offset-1 ring-red-500' : ''
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const novasColunas = colunas.map(col => ({
                                      ...col,
                                      cards: col.cards.map(c => 
                                        c.id === card.id ? { ...c, cor: 'laranja' as const } : c
                                      )
                                    }));
                                    setColunas(novasColunas);
                                  }}
                                  className={`w-5 h-5 rounded-full bg-orange-500 ${
                                    card.cor === 'laranja' ? 'ring-2 ring-offset-1 ring-orange-500' : ''
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const novasColunas = colunas.map(col => ({
                                      ...col,
                                      cards: col.cards.map(c => 
                                        c.id === card.id ? { ...c, cor: 'amarelo' as const } : c
                                      )
                                    }));
                                    setColunas(novasColunas);
                                  }}
                                  className={`w-5 h-5 rounded-full bg-yellow-500 ${
                                    card.cor === 'amarelo' ? 'ring-2 ring-offset-1 ring-yellow-500' : ''
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const novasColunas = colunas.map(col => ({
                                      ...col,
                                      cards: col.cards.map(c => 
                                        c.id === card.id ? { ...c, cor: 'verde' as const } : c
                                      )
                                    }));
                                    setColunas(novasColunas);
                                  }}
                                  className={`w-5 h-5 rounded-full bg-green-500 ${
                                    card.cor === 'verde' ? 'ring-2 ring-offset-1 ring-green-500' : ''
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <EstudoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEstudo}
        estudo={estudoEmEdicao}
      />
    </>
  );
} 