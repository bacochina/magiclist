import { useDrop } from 'react-dnd';
import { useRef, useState } from 'react';
import { DroppedElement } from './DroppedElement';
import { AlignmentButtons } from './AlignmentButtons';

interface DroppableAreaProps {
  elements: any[];
  onDrop: (item: any, cellIndex: number) => void;
  selectedElement: number | null;
  onElementSelect: (id: number | null) => void;
  paperType: 'A4' | 'Carta' | 'Ofício';
  orientation: 'portrait' | 'landscape';
  onElementUpdate: (id: number, updates: any) => void;
  onCopyFormat: (format: any) => void;
  onPasteFormat: () => any;
}

interface SectionConfig {
  cells: number;
  label: string;
  fullWidth?: boolean;
}

const sectionConfig: Record<string, SectionConfig> = {
  header: { cells: 5, label: 'Cabeçalho' },
  block: { cells: 2, label: 'Blocos' },
  tip: { cells: 2, label: 'Dicas' },
  detail: { cells: 4, label: 'Detalhes' },
  footer: { cells: 1, label: 'Rodapé', fullWidth: true },
};

const typeToSection = {
  'title-band': 'header',
  'title-show': 'header',
  'title-date': 'header',
  'title-page': 'header',
  'title-text': 'header',
  'block': 'block',
  'block-text': 'block',
  'tip': 'tip',
  'tip-text': 'tip',
  'detail-number': 'detail',
  'detail-song': 'detail',
  'detail-key': 'detail',
  'detail-text': 'detail',
  'footer-text': 'footer',
};

export function DroppableArea({
  elements,
  onDrop,
  selectedElement,
  onElementSelect,
  paperType,
  orientation,
  onElementUpdate,
  onCopyFormat,
  onPasteFormat,
}: DroppableAreaProps) {
  const [sectionAlignments, setSectionAlignments] = useState<Record<string, 'left' | 'center' | 'right'>>(() => {
    const savedAlignments = localStorage.getItem('sectionAlignments');
    return savedAlignments ? JSON.parse(savedAlignments) : {
      header: 'left',
      block: 'left',
      tip: 'left',
      detail: 'left',
      footer: 'left',
    };
  });

  const handleAlignmentChange = (section: string, alignment: 'left' | 'center' | 'right') => {
    const newAlignments = { ...sectionAlignments, [section]: alignment };
    setSectionAlignments(newAlignments);
    localStorage.setItem('sectionAlignments', JSON.stringify(newAlignments));
  };

  const renderDroppableCell = (section: string, cellIndex: number) => {
    const [{ isOver }, drop] = useDrop({
      accept: ['DRAGGABLE_ELEMENT', 'DROPPED_ELEMENT'],
      drop: (item: any) => {
        onDrop(item, cellIndex);
      },
      collect: monitor => ({
        isOver: monitor.isOver(),
      }),
    });

    const cellElements = elements.filter(el => {
      const elementSection = typeToSection[el.type as keyof typeof typeToSection];
      return elementSection === section && el.cellIndex === cellIndex;
    });

    return (
      <div
        ref={drop}
        className={`min-h-[50px] rounded-lg p-2 border-2 border-dashed transition-colors ${
          isOver ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        {cellElements.map(element => (
          <DroppedElement
            key={element.id}
            element={element}
            onClick={() => onElementSelect(element.id)}
            isSelected={selectedElement === element.id}
            isDraggable={true}
            alignment={sectionAlignments[section]}
            onCopyFormat={onCopyFormat}
            onPasteFormat={onPasteFormat}
          />
        ))}
      </div>
    );
  };

  const renderSection = (section: string) => {
    const config = sectionConfig[section];
    const startIndex = Object.keys(sectionConfig)
      .slice(0, Object.keys(sectionConfig).indexOf(section))
      .reduce((acc, key) => acc + sectionConfig[key].cells, 0);

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">{config.label}</h3>
          <AlignmentButtons
            currentAlignment={sectionAlignments[section]}
            onAlignmentChange={(alignment) => handleAlignmentChange(section, alignment)}
          />
        </div>
        <div 
          className="grid gap-2"
          style={{
            gridTemplateColumns: config.fullWidth ? '1fr' : `repeat(${config.cells}, 1fr)`,
          }}
        >
          {Array.from({ length: config.cells }).map((_, index) => (
            <div key={startIndex + index} className="w-full">
              {renderDroppableCell(section, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const paperSize = orientation === 'portrait'
    ? { width: '210mm', height: '297mm' }
    : { width: '297mm', height: '210mm' };

  const scale = orientation === 'portrait' ? 0.8 : 0.7;

  return (
    <div className="flex justify-center overflow-auto">
      <div
        style={{
          ...paperSize,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          padding: '20mm',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        }}
        className="relative"
      >
        {renderSection('header')}
        {renderSection('block')}
        {renderSection('tip')}
        {renderSection('detail')}
        {renderSection('footer')}
      </div>
    </div>
  );
} 