import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Bloco, Banda, Musica } from '@/lib/types';
import { updateBlocosOrder } from '@/lib/actions';
import { 
  PencilIcon, 
  TrashIcon, 
  MusicalNoteIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

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
    end: (item, monitor) => {
      // Quando o arrasto termina, aplica a mudança final
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        // Se o item não foi solto em um destino válido, não fazemos nada
        return;
      }
      
      // Verifica se o item foi realmente movido
      const dropResult = monitor.getDropResult() as { id: string } | null;
      if (dropResult && dropResult.id !== bloco.id) {
        console.log(`Item ${item.id} foi movido para ${dropResult.id}`);
      }
    }
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
      
      // Obtenha o meio vertical
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      // Determine a posição do mouse
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) {
        return;
      }
      
      // Obtenha pixels até o topo
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      
      // Arrastando para baixo
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      
      // Arrastando para cima
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      
      // Hora de executar a ação
      onMoveBloco(dragIndex, hoverIndex);
      
      // Atualiza o índice para o novo
      item.index = hoverIndex;
    },
    drop: (item: { id: string, index: number }) => {
      // Confirma a operação ao soltar
      // Não precisamos fazer mais nada aqui porque a atualização
      // já aconteceu durante o hover, mas este evento é importante
      // para finalizar o processo de drag and drop
      
      // Chama a função onDrop do componente pai, se fornecida
      if (item.index !== index) {
        console.log(`Item ${item.id} foi movido do índice ${item.index} para ${index}`);
      }
      
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
        className={`bg-gray-800 border border-gray-700 rounded-lg shadow-md overflow-hidden mb-4
          ${isDragging ? 'opacity-50 ring-2 ring-indigo-500 shadow-xl z-50' : 'opacity-100'}
          ${dropTargetClass}`}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
          <div className="flex items-center gap-3">
            {/* Ícone de numeração */}
            <div className="flex items-center justify-center w-6 h-6 bg-indigo-900 rounded-full border border-indigo-700 flex-shrink-0">
              <span className="text-sm font-semibold text-indigo-200">{index + 1}</span>
            </div>
            
            <h3 className="text-lg font-medium text-gray-100 truncate">{bloco.nome}</h3>
          </div>
          
          <div
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-300 p-1.5 rounded hover:bg-gray-800"
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
            <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
              <MusicalNoteIcon className="h-4 w-4 mr-1 text-indigo-400" />
              Músicas:
            </h4>
            {Array.isArray(bloco.musicas) && bloco.musicas.length > 0 ? (
              <ul className="ml-2 space-y-1 border-l-2 border-gray-700 pl-3">
                {bloco.musicas.slice(0, 3).map((musicaId) => {
                  const musica = Array.isArray(musicas) ? musicas.find(m => m.id === musicaId) : null;
                  return musica ? (
                    <li key={musicaId} className="text-sm text-gray-400 flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                      <span className="truncate">{musica.nome}</span>
                    </li>
                  ) : null;
                })}
                {bloco.musicas.length > 3 && (
                  <li className="text-xs text-gray-500 pl-3">
                    +{bloco.musicas.length - 3} mais músicas
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 pl-2 italic">
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
    );
  } else {
    // Modo de visualização em lista
    return (
      <div 
        ref={ref}
        className={`px-6 py-4 bg-gray-800 hover:bg-gray-700 transition-colors duration-150 border-b border-gray-700
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
                <Bars3Icon className="h-5 w-5" />
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
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => onAdicionarMusica(bloco.id)}
                className="p-2 text-indigo-400 hover:text-indigo-300 rounded-full hover:bg-indigo-900/50"
                title="Adicionar música"
              >
                <MusicalNoteIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => onExcluirBloco(bloco.id)}
                className="p-2 text-red-400 hover:text-red-300 rounded-full hover:bg-red-900/50"
                title="Excluir bloco"
              >
                <TrashIcon className="h-5 w-5" />
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
                      <MusicalNoteIcon className="h-4 w-4 mr-1 text-indigo-400 flex-shrink-0" />
                      <span>{musica.nome} - {musica.artista || ''} {musica.tom ? `(${musica.tom})` : ''}</span>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-2">Nenhuma música adicionada a este bloco</p>
          )}
          
          {/* Banda do bloco */}
          {bloco.bandaId && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                Banda: {Array.isArray(bandas) ? bandas.find(b => b.id === bloco.bandaId)?.nome || 'Desconhecida' : 'Desconhecida'}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default DraggableBlocoItem; 