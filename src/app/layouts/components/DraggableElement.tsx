import { useDrag } from 'react-dnd';
import { useRef } from 'react';

interface DraggableElementProps {
  type: string;
  title: string;
}

export function DraggableElement({ type, title }: DraggableElementProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'DRAGGABLE_ELEMENT',
    item: { type, title },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Conecta o ref do drag ao elemento
  drag(ref);

  return (
    <div
      ref={ref}
      className={`border p-2 rounded cursor-move hover:bg-gray-50 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );
} 