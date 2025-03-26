'use client';

import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableElement } from './DraggableElement';
import { DroppableArea } from './DroppableArea';
import { ElementSettings } from './ElementSettings';
import { DroppedElement } from './DroppedElement';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface LayoutElement {
  id: number;
  type: string;
  cellIndex: number;
  text: string;
  line1: string;
  line2: string;
}

export function LayoutClient() {
  const [elements, setElements] = useLocalStorage<LayoutElement[]>('layoutElements', []);
  const [selectedElement, setSelectedElement] = useState<number | null>(null);
  const [paperType, setPaperType] = useState<'A4' | 'Carta' | 'Ofício'>('A4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [showPreview, setShowPreview] = useState(false);
  const [layoutName, setLayoutName] = useState('');
  const [copiedFormat, setCopiedFormat] = useState<any>(null);

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

  type PreviewDataType = {
    [key: string]: {
      text?: string;
      currentPage?: string;
      totalPages?: string;
    };
  };

  const previewData: PreviewDataType = {
    'title-band': { text: 'Iron Maiden' },
    'title-show': { text: 'Legacy of the Beast Tour' },
    'title-date': { text: '01/05/2024' },
    'title-page': { currentPage: '1', totalPages: '3' },
    'block': { text: 'Clássicos dos Anos 80' },
    'tip': { text: 'Atenção ao solo de guitarra após o refrão' },
    'detail-number': { text: '01' },
    'detail-song': { text: 'The Trooper' },
    'detail-key': { text: 'Em' },
  };

  const getPreviewElement = (element: any) => {
    const previewValues = previewData[element.type] || {};
    return {
      ...element,
      text: previewValues.text || element.text,
      currentPage: previewValues.currentPage || element.currentPage,
      totalPages: previewValues.totalPages || element.totalPages,
    };
  };

  const handleDrop = (item: any, cellIndex: number) => {
    if (item.id) {
      // Atualiza a posição de um elemento existente
      setElements(prevElements =>
        prevElements.map(element =>
          element.id === item.id
            ? { ...element, cellIndex }
            : element
        )
      );
    } else {
      // Adiciona um novo elemento
      const newElement = {
        id: Date.now(),
        type: item.type,
        cellIndex,
        text: '',
        line1: '',
        line2: '',
      };
      setElements(prevElements => [...prevElements, newElement]);
    }
  };

  const handleElementUpdate = (id: number, updates: any) => {
    setElements(elements.map(element => 
      element.id === id ? { ...element, ...updates } : element
    ));
  };

  const handleElementMove = (id: number, position: { x: number, y: number }) => {
    handleElementUpdate(id, { position });
  };

  const handleElementClick = (element: any) => {
    setSelectedElement(element.id);
  };

  const handleSaveLayout = () => {
    if (!layoutName) {
      alert('Por favor, dê um nome ao layout antes de salvar.');
      return;
    }
    // TODO: Implementar salvamento do layout
    const layoutData = {
      name: layoutName,
      orientation,
      paperType,
      elements: elements,
    };
    console.log('Layout salvo:', layoutData);
  };

  const handleCopyFormat = (format: any) => {
    setCopiedFormat(format);
  };

  const handlePasteFormat = () => {
    return copiedFormat;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Cabeçalho com título e controles de design */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">
                  Gerador de Layouts
                </h1>
                <div className="flex items-center gap-4">
                  {/* Design Controls */}
                  <div className="flex items-center gap-4 bg-white p-2 rounded-lg shadow">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        className={`p-2 rounded ${
                          showPreview ? 'bg-indigo-100' : 'hover:bg-gray-50'
                        }`}
                        title="Pré-visualização"
                      >
                        <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setOrientation('landscape')}
                        className={`p-2 rounded ${
                          orientation === 'landscape' ? 'bg-indigo-100' : 'hover:bg-gray-50'
                        }`}
                        title="Paisagem"
                      >
                        <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setOrientation('portrait')}
                        className={`p-2 rounded ${
                          orientation === 'portrait' ? 'bg-indigo-100' : 'hover:bg-gray-50'
                        }`}
                        title="Retrato"
                      >
                        <svg className="h-6 w-6 text-gray-600 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </button>
                    </div>
                    <select
                      value={paperType}
                      onChange={(e) => setPaperType(e.target.value as 'A4' | 'Carta' | 'Ofício')}
                      className="text-sm border-gray-300 rounded-md"
                    >
                      <option>A4</option>
                      <option>Carta</option>
                      <option>Ofício</option>
                    </select>
                  </div>
                  {/* Layout Name and Save */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Nome do Layout"
                      value={layoutName}
                      onChange={(e) => setLayoutName(e.target.value)}
                      className="text-sm border-gray-300 rounded-md"
                    />
                    <button
                      onClick={handleSaveLayout}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                    >
                      Salvar Layout
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-start gap-8">
                {/* Design */}
                <div className="w-64 flex-shrink-0">
                  {/* Elementos do Layout - Coluna 1 */}
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Elementos</h2>
                    <div className="space-y-6">
                      {/* Grupo Título */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-700">Título</h3>
                        <div className="space-y-1">
                          <DraggableElement type="title-band" title="Nome da Banda" />
                          <DraggableElement type="title-show" title="Título do Show" />
                          <DraggableElement type="title-date" title="Data" />
                          <DraggableElement type="title-page" title="Página" />
                          <DraggableElement type="title-text" title="Texto do Título" />
                        </div>
                      </div>

                      {/* Grupo Blocos */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-700">Blocos</h3>
                        <div className="space-y-1">
                          <DraggableElement type="block" title="Nome do Bloco" />
                          <DraggableElement type="block-text" title="Texto do Bloco" />
                        </div>
                      </div>

                      {/* Grupo Dicas */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-700">Dicas</h3>
                        <div className="space-y-1">
                          <DraggableElement type="tip" title="Dica" />
                          <DraggableElement type="tip-text" title="Texto da Dica" />
                        </div>
                      </div>

                      {/* Grupo Detalhes */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-700">Detalhes</h3>
                        <div className="space-y-1">
                          <DraggableElement type="detail-number" title="Número" />
                          <DraggableElement type="detail-song" title="Nome da Música" />
                          <DraggableElement type="detail-key" title="Tom" />
                          <DraggableElement type="detail-text" title="Texto dos Detalhes" />
                        </div>
                      </div>

                      {/* Grupo Rodapé */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-700">Rodapé</h3>
                        <div className="space-y-1">
                          <DraggableElement type="footer-text" title="Texto do Rodapé" />
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Layout Area */}
                <div className="flex-1">
                  <div className="relative">
                    <h2 className="text-lg font-semibold mb-4">Área de Edição</h2>
                    <DroppableArea
                      elements={elements}
                      onDrop={handleDrop}
                      onElementUpdate={handleElementUpdate}
                      selectedElement={selectedElement}
                      onElementSelect={setSelectedElement}
                      paperType={paperType}
                      orientation={orientation}
                      onCopyFormat={handleCopyFormat}
                      onPasteFormat={handlePasteFormat}
                    />
                  </div>
                </div>

                {/* Preview */}
                {showPreview && (
                  <div className="w-64 flex-shrink-0">
                    <h2 className="text-lg font-semibold mb-4">Pré-visualização</h2>
                    <div
                      className="bg-gray-100 p-4 rounded-lg"
                      style={{
                        transform: `scale(${orientation === 'portrait' ? 0.3 : 0.2})`,
                        transformOrigin: 'top center',
                      }}>
                      {elements.map((element) => (
                        <DroppedElement
                          key={element.id}
                          element={element}
                          onClick={() => {}}
                          isSelected={false}
                          isDraggable={false}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
} 