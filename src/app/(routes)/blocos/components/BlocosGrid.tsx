import { Bloco, Banda, Musica } from '@/lib/types';
import React, { useCallback, useEffect, useState } from 'react';
import DraggableBlocoItem from './DraggableBlocoItem';
import { updateBlocosOrder } from '@/lib/actions';

interface BlocosGridProps {
  blocos: Bloco[];
  bandas: Banda[];
  musicas: Musica[];
  onDragEnd: (result: any) => void;
  onEditarBloco: (bloco: Bloco) => void;
  onExcluirBloco: (blocoId: string) => void;
  onAdicionarMusica: (blocoId: string) => void;
}

export default function BlocosGrid({
  blocos,
  bandas,
  musicas,
  onDragEnd,
  onEditarBloco,
  onExcluirBloco,
  onAdicionarMusica,
}: BlocosGridProps) {
  // Estado local para manter a ordem dos blocos
  const [localBlocos, setLocalBlocos] = useState<Bloco[]>(blocos);
  
  // Atualiza o estado local quando os blocos mudam
  useEffect(() => {
    setLocalBlocos(blocos);
  }, [blocos]);
  
  // Função para mover um bloco de um índice para outro
  const handleMoveBloco = useCallback((dragIndex: number, hoverIndex: number) => {
    // Atualiza o estado local imediatamente para melhor UX
    setLocalBlocos(prevBlocos => {
      const updatedBlocos = [...prevBlocos];
      const [movedBloco] = updatedBlocos.splice(dragIndex, 1);
      updatedBlocos.splice(hoverIndex, 0, movedBloco);
      return updatedBlocos;
    });

    // Cria um resultado simulado no formato esperado pelo onDragEnd
    const result = {
      source: { index: dragIndex, droppableId: 'blocos-grid' },
      destination: { index: hoverIndex, droppableId: 'blocos-grid' },
      draggableId: blocos[dragIndex]?.id || '',
      type: 'DEFAULT',
      mode: 'FLUID',
      combine: null,
      reason: 'DROP'
    };
    
    // Chama onDragEnd diretamente para aplicar a reordenação
    onDragEnd(result);
    
    // Salva a nova ordem no backend
    const updatedBlocos = [...blocos];
    const [movedBloco] = updatedBlocos.splice(dragIndex, 1);
    updatedBlocos.splice(hoverIndex, 0, movedBloco);
    
    updateBlocosOrder(updatedBlocos).catch(error => {
      console.error("Erro ao salvar a ordem dos blocos no grid:", error);
    });
  }, [blocos, onDragEnd]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {localBlocos.map((bloco, index) => (
        <DraggableBlocoItem
          key={bloco.id}
          bloco={bloco}
          index={index}
          bandas={bandas}
          musicas={musicas}
          modoVisualizacao="cartoes"
          onMoveBloco={handleMoveBloco}
          onEditarBloco={onEditarBloco}
          onExcluirBloco={onExcluirBloco}
          onAdicionarMusica={onAdicionarMusica}
        />
      ))}
    </div>
  );
} 