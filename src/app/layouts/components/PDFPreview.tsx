import React from 'react';
import { DroppedElement } from './DroppedElement';

interface PDFPreviewProps {
  elements: any[];
  paperType: string;
  orientation: 'portrait' | 'landscape';
  sectionAlignments: Record<string, 'left' | 'center' | 'right'>;
}

const paperSizes = {
  A4: {
    portrait: { width: '210mm', height: '297mm' },
    landscape: { width: '297mm', height: '210mm' },
  },
  Carta: {
    portrait: { width: '216mm', height: '279mm' },
    landscape: { width: '279mm', height: '216mm' },
  },
  Ofício: {
    portrait: { width: '216mm', height: '330mm' },
    landscape: { width: '330mm', height: '216mm' },
  },
};

interface SectionConfig {
  cells: number;
  label: string;
  fullWidth?: boolean;
}

const sectionConfig: Record<string, SectionConfig> = {
  title: { cells: 5, label: 'Cabeçalho' },
  block: { cells: 2, label: 'Blocos' },
  tip: { cells: 2, label: 'Dicas' },
  detail: { cells: 4, label: 'Detalhes' },
  footer: { cells: 1, label: 'Rodapé', fullWidth: true },
};

export function PDFPreview({ elements, paperType, orientation, sectionAlignments }: PDFPreviewProps) {
  const paperSize = paperSizes[paperType as keyof typeof paperSizes][orientation];
  const scale = orientation === 'portrait' ? 0.75 : 0.65;

  const renderSection = (sectionType: string, startIndex: number) => {
    const config = sectionConfig[sectionType as keyof typeof sectionConfig];
    const sectionElements = elements.filter(element => 
      element.type.startsWith(sectionType)
    );

    return (
      <div 
        className="mb-8"
        style={{ textAlign: sectionAlignments[sectionType] }}
      >
        <div 
          className="grid gap-2" 
          style={{ 
            gridTemplateColumns: config.fullWidth ? '1fr' : `repeat(${config.cells}, 1fr)`,
          }}
        >
          {Array.from({ length: config.cells }).map((_, index) => {
            const cellIndex = startIndex + index;
            const element = sectionElements.find(el => el.cellIndex === cellIndex);
            if (!element) return <div key={cellIndex} />;
            
            return (
              <div key={cellIndex} className="min-h-[24px]">
                <DroppedElement
                  element={element}
                  onClick={() => {}}
                  isSelected={false}
                  isDraggable={false}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center overflow-auto bg-gray-100 p-8">
      <div
        style={{
          width: paperSize.width,
          height: paperSize.height,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          backgroundColor: 'white',
          padding: '20mm',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          margin: '0 auto',
        }}
        className="pdf-preview"
      >
        {renderSection('title', 0)}
        {renderSection('block', 5)}
        {renderSection('tip', 7)}
        {renderSection('detail', 9)}
        {renderSection('footer', 13)}
      </div>
    </div>
  );
} 