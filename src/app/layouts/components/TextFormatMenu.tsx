import React, { useState } from 'react';

interface TextFormatMenuProps {
  initialStyles: {
    fontFamily: string;
    fontSize: string;
    color: string;
    backgroundColor: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    subscript: boolean;
    superscript: boolean;
    borderStyle: string;
    borderWidth: string;
    borderColor: string;
  };
  onStyleChange: (styles: Partial<TextFormatMenuProps['initialStyles']>) => void;
  onCopyFormat?: () => void;
  onPasteFormat?: () => void;
}

const fontFamilies = [
  'Calibri',
  'Arial',
  'Roboto',
  'Times New Roman',
  'Helvetica',
  'Georgia',
  'Verdana',
  'Tahoma',
];

const fontSizes = [
  '8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24', '26', '28', '36', '48', '72'
];

const borderStyles = [
  { value: 'none', label: 'Sem borda' },
  { value: 'solid', label: 'Sólida' },
  { value: 'dashed', label: 'Tracejada' },
  { value: 'dotted', label: 'Pontilhada' },
  { value: 'double', label: 'Dupla' },
];

const borderWidths = [
  { value: '1px', label: '1px' },
  { value: '2px', label: '2px' },
  { value: '3px', label: '3px' },
  { value: '4px', label: '4px' },
];

export function TextFormatMenu({ initialStyles, onStyleChange, onCopyFormat, onPasteFormat }: TextFormatMenuProps) {
  const [showFontFamily, setShowFontFamily] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showBorderMenu, setShowBorderMenu] = useState(false);
  const [customFontSize, setCustomFontSize] = useState(initialStyles.fontSize);

  const handleFontFamilyChange = (font: string) => {
    onStyleChange({ fontFamily: font });
    setShowFontFamily(false);
  };

  const handleFontSizeChange = (size: string) => {
    onStyleChange({ fontSize: size });
    setCustomFontSize(size);
    setShowFontSize(false);
  };

  const handleCustomFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomFontSize(value);
    if (value && !isNaN(Number(value))) {
      onStyleChange({ fontSize: value });
    }
  };

  const handleColorChange = (color: string) => {
    onStyleChange({ color });
    setShowColorPicker(false);
  };

  const handleBgColorChange = (color: string) => {
    onStyleChange({ backgroundColor: color });
    setShowBgColorPicker(false);
  };

  const handleBorderStyleChange = (style: string) => {
    onStyleChange({ borderStyle: style });
  };

  const handleBorderWidthChange = (width: string) => {
    onStyleChange({ borderWidth: width });
  };

  const handleBorderColorChange = (color: string) => {
    onStyleChange({ borderColor: color });
  };

  const toggleStyle = (style: keyof Omit<TextFormatMenuProps['initialStyles'], 'fontFamily' | 'fontSize' | 'color' | 'backgroundColor' | 'borderStyle' | 'borderWidth' | 'borderColor'>) => {
    onStyleChange({ [style]: !initialStyles[style] });
  };

  return (
    <div className="fixed z-50 bg-white shadow-xl rounded-lg border border-gray-200 p-3">
      <div className="flex flex-wrap gap-2">
        {/* Primeira linha */}
        <div className="flex items-center space-x-2 w-full">
          {/* Font Family Dropdown */}
          <div className="relative flex-grow">
            <button
              onClick={() => setShowFontFamily(!showFontFamily)}
              className="w-full px-3 py-1.5 border rounded hover:bg-gray-50 text-left flex items-center justify-between"
            >
              <span style={{ fontFamily: initialStyles.fontFamily }}>{initialStyles.fontFamily}</span>
              <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {showFontFamily && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
                {fontFamilies.map((font) => (
                  <button
                    key={font}
                    onClick={() => handleFontFamilyChange(font)}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-50"
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font Size Input/Dropdown */}
          <div className="relative w-24">
            <div className="flex">
              <input
                type="text"
                value={customFontSize}
                onChange={handleCustomFontSizeChange}
                className="w-16 px-2 py-1.5 border rounded-l text-center"
                onFocus={() => setShowFontSize(false)}
              />
              <button
                onClick={() => setShowFontSize(!showFontSize)}
                className="px-2 border-l-0 border rounded-r hover:bg-gray-50"
              >
                <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            {showFontSize && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
                {fontSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFontSizeChange(size)}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-50"
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Segunda linha */}
        <div className="flex items-center space-x-2 w-full">
          {/* Formatação de Texto */}
          <div className="flex items-center space-x-1 p-1 bg-gray-50 rounded">
            <button
              onClick={() => toggleStyle('bold')}
              className={`p-1.5 rounded hover:bg-gray-200 ${initialStyles.bold ? 'bg-gray-200' : ''}`}
              title="Negrito"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"/>
              </svg>
            </button>
            <button
              onClick={() => toggleStyle('italic')}
              className={`p-1.5 rounded hover:bg-gray-200 ${initialStyles.italic ? 'bg-gray-200' : ''}`}
              title="Itálico"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 5v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V5h-8z"/>
              </svg>
            </button>
            <button
              onClick={() => toggleStyle('underline')}
              className={`p-1.5 rounded hover:bg-gray-200 ${initialStyles.underline ? 'bg-gray-200' : ''}`}
              title="Sublinhado"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/>
              </svg>
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <button
              onClick={() => toggleStyle('subscript')}
              className={`p-1.5 rounded hover:bg-gray-200 ${initialStyles.subscript ? 'bg-gray-200' : ''}`}
              title="Subscrito"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 18h-2v1h3v1h-4v-2.5c0-.55.45-1 1-1h2v-1h-3v-1h3c.55 0 1 .45 1 1v1c0 .55-.45 1-1 1zM5.88 18h2.66l3.4-5.42h.12l3.4 5.42h2.66l-4.65-7.27L17.81 4h-2.68l-3.07 4.99h-.12L8.85 4H6.19l4.32 6.73L5.88 18z"/>
              </svg>
            </button>
            <button
              onClick={() => toggleStyle('superscript')}
              className={`p-1.5 rounded hover:bg-gray-200 ${initialStyles.superscript ? 'bg-gray-200' : ''}`}
              title="Sobrescrito"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 7h-2v1h3v1h-4V6.5c0-.55.45-1 1-1h2v-1h-3v-1h3c.55 0 1 .45 1 1v1c0 .55-.45 1-1 1zM5.88 18h2.66l3.4-5.42h.12l3.4 5.42h2.66l-4.65-7.27L17.81 4h-2.68l-3.07 4.99h-.12L8.85 4H6.19l4.32 6.73L5.88 18z"/>
              </svg>
            </button>
          </div>

          {/* Cores */}
          <div className="flex items-center space-x-1 p-1 bg-gray-50 rounded">
            {/* Cor do Texto */}
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-1.5 rounded hover:bg-gray-200 flex items-center"
                title="Cor do Texto"
              >
                <div className="w-4 h-4 border border-gray-300" style={{ backgroundColor: initialStyles.color }} />
              </button>
              {showColorPicker && (
                <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 grid grid-cols-8 gap-1 z-50">
                  {[
                    '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef',
                    '#f3f3f3', '#ffffff', '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff',
                    '#4a86e8', '#0000ff', '#9900ff', '#ff00ff'
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className="w-6 h-6 border border-gray-300 hover:border-gray-500"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Cor de Fundo */}
            <div className="relative">
              <button
                onClick={() => setShowBgColorPicker(!showBgColorPicker)}
                className="p-1.5 rounded hover:bg-gray-200 flex items-center"
                title="Cor de Fundo"
              >
                <div className="w-4 h-4 border border-gray-300" style={{ backgroundColor: initialStyles.backgroundColor }}>
                  <div className="w-4 h-0.5 bg-red-500 transform rotate-45 translate-y-1.5" />
                </div>
              </button>
              {showBgColorPicker && (
                <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 grid grid-cols-8 gap-1 z-50">
                  {[
                    'transparent', '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd', '#6c757d',
                    '#ffc9c9', '#ffd8a8', '#ffe066', '#d8f5a2', '#b2f2bb', '#99e9f2', '#a5d8ff', '#d0bfff'
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => handleBgColorChange(color)}
                      className="w-6 h-6 border border-gray-300 hover:border-gray-500"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bordas */}
          <div className="flex items-center space-x-1 p-1 bg-gray-50 rounded">
            <button
              onClick={() => setShowBorderMenu(!showBorderMenu)}
              className="p-1.5 rounded hover:bg-gray-200 flex items-center"
              title="Bordas"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
            </button>
            {showBorderMenu && (
              <div className="absolute mt-1 bg-white border rounded-lg shadow-lg p-2 z-50">
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estilo</label>
                    <select
                      value={initialStyles.borderStyle}
                      onChange={(e) => handleBorderStyleChange(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 text-sm"
                    >
                      {borderStyles.map(style => (
                        <option key={style.value} value={style.value}>{style.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Largura</label>
                    <select
                      value={initialStyles.borderWidth}
                      onChange={(e) => handleBorderWidthChange(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 text-sm"
                    >
                      {borderWidths.map(width => (
                        <option key={width.value} value={width.value}>{width.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cor</label>
                    <div className="mt-1 grid grid-cols-8 gap-1">
                      {[
                        '#000000', '#666666', '#999999', '#cccccc',
                        '#ff0000', '#ff9900', '#ffff00', '#00ff00'
                      ].map((color) => (
                        <button
                          key={color}
                          onClick={() => handleBorderColorChange(color)}
                          className="w-6 h-6 border border-gray-300 hover:border-gray-500"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Copiar/Colar Formatação */}
          <div className="flex items-center space-x-1 p-1 bg-gray-50 rounded">
            <button
              onClick={onCopyFormat}
              className="p-1.5 rounded hover:bg-gray-200"
              title="Copiar Formatação"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
            </button>
            <button
              onClick={onPasteFormat}
              className="p-1.5 rounded hover:bg-gray-200"
              title="Colar Formatação"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 