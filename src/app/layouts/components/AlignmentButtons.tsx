import React from 'react';

interface AlignmentButtonsProps {
  currentAlignment: string;
  onAlignmentChange: (alignment: 'left' | 'center' | 'right') => void;
}

export function AlignmentButtons({ currentAlignment, onAlignmentChange }: AlignmentButtonsProps) {
  return (
    <div className="flex gap-1">
      <button
        onClick={() => onAlignmentChange('left')}
        className={`p-1 rounded ${currentAlignment === 'left' ? 'bg-indigo-100' : 'hover:bg-gray-50'}`}
        title="Alinhar à esquerda"
      >
        <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h12" />
        </svg>
      </button>
      <button
        onClick={() => onAlignmentChange('center')}
        className={`p-1 rounded ${currentAlignment === 'center' ? 'bg-indigo-100' : 'hover:bg-gray-50'}`}
        title="Centralizar"
      >
        <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M6 18h12" />
        </svg>
      </button>
      <button
        onClick={() => onAlignmentChange('right')}
        className={`p-1 rounded ${currentAlignment === 'right' ? 'bg-indigo-100' : 'hover:bg-gray-50'}`}
        title="Alinhar à direita"
      >
        <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M8 18h12" />
        </svg>
      </button>
    </div>
  );
} 