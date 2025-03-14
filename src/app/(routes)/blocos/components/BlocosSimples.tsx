import { Bloco, Banda, Musica } from '@/lib/types';
import { 
  PencilIcon, 
  TrashIcon, 
  MusicalNoteIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';

interface BlocosGridProps {
  blocos: Bloco[];
  bandas: Banda[];
  musicas: Musica[];
  onDragEnd: (result: {source: {index: number}, destination: {index: number}}) => void;
  onEditarBloco: (bloco: Bloco) => void;
  onExcluirBloco: (blocoId: string) => void;
  onAdicionarMusica: (blocoId: string) => void;
}

export default function BlocosSimples({
  blocos,
  bandas,
  musicas,
  onDragEnd,
  onEditarBloco,
  onExcluirBloco,
  onAdicionarMusica,
}: BlocosGridProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  // Manipuladores de eventos para drag and drop
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    
    // Necessário para o Firefox
    try {
      e.dataTransfer.setData('text/plain', index.toString());
    } catch (err) {
      console.error('Erro ao configurar os dados de transferência:', err);
    }
    
    // Adiciona uma classe ao elemento arrastado
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add('dragging');
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault(); // Permite o drop
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndex !== null && draggedIndex !== index) {
      // Adiciona uma classe para indicar onde o item será solto
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.classList.add('drag-over');
      }
    }
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    // Remove a classe quando o arrasto sai do elemento
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('drag-over');
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    // Remove a classe de destino
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('drag-over');
    }
    
    // Se tivermos um índice válido e ele for diferente do destino
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onDragEnd({
        source: { index: draggedIndex },
        destination: { index: dropIndex }
      });
    }
    
    setDraggedIndex(null);
  };
  
  const handleDragEnd = (e: React.DragEvent) => {
    // Remove a classe do elemento arrastado
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('dragging');
    }
    
    // Limpa o estado se não houve um drop bem-sucedido
    if (draggedIndex !== null) {
      setDraggedIndex(null);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {blocos.map((bloco, index) => (
        <div
          key={bloco.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={`bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden transition-all
            ${draggedIndex === index ? 'opacity-60 ring-2 ring-indigo-500 shadow-xl' : ''}
          `}
          style={{
            cursor: 'grab'
          }}
        >
          <div className="flex justify-between items-center px-4 py-3 bg-gray-900">
            <h3 className="text-lg font-medium text-gray-100 truncate">{bloco.nome}</h3>
            <div
              className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-300 p-1.5"
              title="Arraste para reordenar"
            >
              <Bars3Icon className="h-5 w-5" />
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            {bloco.descricao && (
              <p className="text-sm text-gray-400">
                {bloco.descricao}
              </p>
            )}
            
            {/* Banda do bloco */}
            {bloco.bandaId && (
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                  Banda: {Array.isArray(bandas) ? bandas.find(b => b.id === bloco.bandaId)?.nome || 'Desconhecida' : 'Desconhecida'}
                </span>
              </div>
            )}
            
            {/* Músicas do bloco */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Músicas:</h4>
              {bloco.musicas && bloco.musicas.length > 0 ? (
                <ul className="space-y-1">
                  {bloco.musicas.slice(0, 3).map((musicaId) => {
                    const musica = musicas.find(m => m.id === musicaId);
                    return musica ? (
                      <li key={musicaId} className="text-sm text-gray-400 flex items-center">
                        <MusicalNoteIcon className="h-4 w-4 mr-1 text-indigo-400 flex-shrink-0" />
                        <span className="truncate">{musica.nome}</span>
                      </li>
                    ) : null;
                  })}
                  {bloco.musicas.length > 3 && (
                    <li className="text-xs text-gray-500">
                      +{bloco.musicas.length - 3} mais músicas
                    </li>
                  )}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  Nenhuma música adicionada
                </p>
              )}
            </div>
            
            {/* Botões de ação */}
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => onAdicionarMusica(bloco.id)}
                className="inline-flex items-center px-2 py-1 border border-gray-700 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-200 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                title="Adicionar música"
              >
                <MusicalNoteIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => onEditarBloco(bloco)}
                className="inline-flex items-center px-2 py-1 border border-gray-700 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-200 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                title="Editar bloco"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => onExcluirBloco(bloco.id)}
                className="inline-flex items-center px-2 py-1 border border-gray-700 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-200 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                title="Excluir bloco"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 