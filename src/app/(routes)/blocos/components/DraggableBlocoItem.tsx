import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Bloco, Banda, Musica } from '@/lib/types';
import { updateBlocosOrder } from '@/lib/actions';
import { 
  Music, 
  Edit, 
  Trash2, 
  GripVertical,
  Plus
} from 'lucide-react';

interface DraggableBlocoItemProps {
  bloco: Bloco;
  index: number;
  bandas: Banda[];
  musicas: Musica[];
  onEditarBloco: (bloco: Bloco) => void;
  onExcluirBloco: (blocoId: string) => void;
  onAdicionarMusica: (blocoId: string) => void;
  onMoveBloco: (dragIndex: number, hoverIndex: number) => void;
  modoVisualizacao: 'cartoes' | 'lista';
}

// Identificador para o tipo de item arrastável
const ItemType = 'BLOCO';

const DraggableBlocoItem: React.FC<DraggableBlocoItemProps> = ({
  bloco,
  index,
  bandas,
  musicas,
  onEditarBloco,
  onExcluirBloco,
  onAdicionarMusica,
  onMoveBloco,
  modoVisualizacao
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: bloco.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemType,
    hover: (item: { id: string, index: number }, monitor) => {
      if (!ref.current) {
        return;
      }
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Não substitua itens por eles mesmos
      if (dragIndex === hoverIndex) {
        return;
      }
      
      // Determine o retângulo na tela
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      
      // Cálculo do centro da área do item dependendo do modo de visualização
      let hoverMiddleY, hoverMiddleX;
      if (modoVisualizacao === 'lista') {
        // Para lista, apenas consideramos movimento vertical
        hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      } else {
        // Para cartões, consideramos também movimento horizontal em grid
        hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      }
      
      // Determine a posição do mouse
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) {
        return;
      }
      
      // Obtenha pixels até o topo/esquerda
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;
      
      // Lógica de movimento adaptada para o modo de visualização
      if (modoVisualizacao === 'lista') {
        // Lógica para lista (vertical)
        // Arrastando para baixo
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        
        // Arrastando para cima
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }
      } else {
        // Lógica para cartões (grid)
        // Simplificamos a lógica para funcionar melhor em grade
        
        // Como estamos em um grid, a lógica de mudança precisa ser mais direta
        // Permitimos qualquer movimento entre itens adjacentes
      }
      
      // Hora de executar a ação
      onMoveBloco(dragIndex, hoverIndex);
      
      // Atualiza o índice para o novo
      item.index = hoverIndex;
    },
    drop: (item: { id: string, index: number }) => {
      return { id: bloco.id };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  
  // Combine as funções drag e drop
  drag(drop(ref));

  // Classe de destaque para visualizar quando o item pode ser solto aqui
  const dropTargetClass = isOver && canDrop ? 'ring-2 ring-blue-500 border-blue-500' : '';
  
  // Renderiza cartão ou item de lista dependendo do modo de visualização
  if (modoVisualizacao === 'cartoes') {
    return (
      <div 
        ref={ref}
        className={`bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-xl border border-gray-700 flex flex-col h-full hover:translate-y-[-3px] hover:border-indigo-500/50
          ${isDragging ? 'opacity-50 ring-2 ring-indigo-500 shadow-xl z-50' : 'opacity-100'}
          ${dropTargetClass}`}
      >
        {/* Cabeçalho do cartão */}
        <div className="p-3 flex flex-col bg-gradient-to-r from-indigo-800 to-indigo-900 border-b border-indigo-700">
          <div className="flex items-center w-full">
            <div className="flex items-center justify-center w-6 h-6 bg-indigo-900/60 rounded-full border border-indigo-700 flex-shrink-0 mr-2">
              <span className="text-sm font-semibold text-indigo-200">{index + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 
                className="text-base font-medium text-white leading-tight line-clamp-1 text-center"
                title={bloco.nome || ''}
              >
                {bloco.nome}
              </h3>
            </div>
            <div
              className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-100 p-1 rounded hover:bg-indigo-700/50 ml-2"
              title="Arraste para reordenar"
            >
              <GripVertical className="h-5 w-5" />
            </div>
          </div>
          
          {/* Badge da banda */}
          {bloco.bandaId && (
            <div className="mt-1 flex items-center justify-center w-full">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-800/70 text-purple-100 shadow-sm">
                {Array.isArray(bandas) ? bandas.find(b => b.id === bloco.bandaId)?.nome || 'Banda' : 'Banda'}
              </span>
            </div>
          )}
        </div>
        
        {/* Corpo do cartão */}
        <div className="px-4 py-4 flex-grow bg-gradient-to-b from-gray-800 to-gray-850">
          {/* Descrição (se houver) */}
          {bloco.descricao && (
            <div className="mb-3">
              <p className="text-xs text-gray-400 font-medium mb-0.5">Descrição</p>
              <p className="text-gray-300 text-sm line-clamp-2">{bloco.descricao}</p>
            </div>
          )}
          
          {/* Músicas do bloco */}
          <div className="flex items-start">
            <div className="bg-gray-700/50 p-1.5 rounded-lg mr-2.5 flex-shrink-0">
              <Music size={16} className="text-indigo-300" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-0.5">Músicas</p>
              {Array.isArray(bloco.musicas) && bloco.musicas.length > 0 ? (
                <div>
                  <ul className="space-y-1">
                    {bloco.musicas.slice(0, 3).map((musicaId) => {
                      const musica = Array.isArray(musicas) ? musicas.find(m => m.id === musicaId) : null;
                      return musica ? (
                        <li key={musicaId} className="text-sm text-gray-300 flex items-center">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                          <span className="truncate">{musica.nome}</span>
                        </li>
                      ) : null;
                    })}
                    {bloco.musicas.length > 3 && (
                      <li className="text-xs text-gray-500 mt-1">
                        +{bloco.musicas.length - 3} mais músicas
                      </li>
                    )}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  Nenhuma música adicionada
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Rodapé com ações */}
        <div className="px-4 py-3 bg-gray-850 border-t border-gray-700 flex justify-between">
          <button
            onClick={() => onAdicionarMusica(bloco.id)}
            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-indigo-600 hover:bg-indigo-700 text-white"
            title="Adicionar música"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Música
          </button>
          <div className="flex space-x-1">
            <button
              onClick={() => onEditarBloco(bloco)}
              className="p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300"
              title="Editar bloco"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onExcluirBloco(bloco.id)}
              className="p-1.5 rounded-md bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white"
              title="Excluir bloco"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    // Modo de visualização em lista
    return (
      <div 
        ref={ref}
        className={`px-6 py-4 bg-gray-800 hover:bg-gray-750 transition-colors duration-150 border-b border-gray-700
          ${isDragging ? 'opacity-50 ring-2 ring-indigo-500 shadow-xl z-50' : 'opacity-100'}
          ${dropTargetClass}`}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-300"
                title="Arraste para reordenar"
              >
                <GripVertical className="h-5 w-5" />
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-6 h-6 mr-2 bg-indigo-900 rounded-full border border-indigo-700 flex-shrink-0">
                  <span className="text-sm font-semibold text-indigo-200">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-100">{bloco.nome}</h3>
                  {bloco.descricao && (
                    <p className="text-sm text-gray-400">{bloco.descricao}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEditarBloco(bloco)}
                className="p-2 text-indigo-400 hover:text-indigo-300 rounded-full hover:bg-indigo-900/50"
                title="Editar bloco"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => onAdicionarMusica(bloco.id)}
                className="p-2 text-indigo-400 hover:text-indigo-300 rounded-full hover:bg-indigo-900/50"
                title="Adicionar música"
              >
                <Music className="h-5 w-5" />
              </button>
              <button
                onClick={() => onExcluirBloco(bloco.id)}
                className="p-2 text-red-400 hover:text-red-300 rounded-full hover:bg-red-900/50"
                title="Excluir bloco"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Músicas do bloco */}
          {Array.isArray(bloco.musicas) && bloco.musicas.length > 0 ? (
            <div className="mt-2">
              <h4 className="text-sm font-medium text-gray-300 mb-1">Músicas:</h4>
              <ul className="space-y-1">
                {bloco.musicas.map((musicaId) => {
                  const musica = Array.isArray(musicas) ? musicas.find((m) => m.id === musicaId) : null;
                  return musica ? (
                    <li key={musicaId} className="text-sm text-gray-400 flex items-center">
                      <Music className="h-4 w-4 mr-1 text-indigo-400 flex-shrink-0" />
                      <span>{musica.nome} - {musica.artista || ''} {musica.tom ? `(${musica.tom})` : ''}</span>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          ) : (
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <Music className="h-4 w-4 mr-1 text-gray-500" />
              <span>Nenhuma música adicionada</span>
            </div>
          )}

          {/* Badge da banda (se houver) */}
          {bloco.bandaId && (
            <div className="flex items-center mt-2">
              <span className="text-xs text-gray-400 mr-2">Banda:</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-900/60 text-indigo-300">
                {Array.isArray(bandas) ? bandas.find(b => b.id === bloco.bandaId)?.nome || 'Desconhecida' : 'Desconhecida'}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default DraggableBlocoItem; 