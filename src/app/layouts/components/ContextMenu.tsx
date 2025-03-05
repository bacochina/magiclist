import React, { useEffect, useRef, useState } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onStyleChange: (style: {
    fontFamily?: string;
    fontSize?: string;
    color?: string;
  }) => void;
}

export function ContextMenu({ x, y, onClose, onStyleChange }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [selectedSize, setSelectedSize] = useState('12');
  const [selectedColor, setSelectedColor] = useState('#000000');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    // Ajusta a posição do menu se estiver fora da tela
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (rect.right > viewportWidth) {
        menuRef.current.style.left = `${viewportWidth - rect.width - 10}px`;
      }
      if (rect.bottom > viewportHeight) {
        menuRef.current.style.top = `${y - rect.height - 10}px`;
      }
    }
  }, [x, y]);

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    onStyleChange({ fontFamily: font });
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    onStyleChange({ fontSize: size });
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onStyleChange({ color });
  };

  return (
    <div
      ref={menuRef}
      className="fixed bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50"
      style={{ 
        top: y,
        left: x,
        minWidth: '200px',
      }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fonte
          </label>
          <select
            value={selectedFont}
            onChange={(e) => handleFontChange(e.target.value)}
            className="w-full text-sm border-gray-300 rounded-md"
          >
            <option value="Arial">Arial</option>
            <option value="Roboto">Roboto</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Courier New">Courier New</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tamanho
          </label>
          <select
            value={selectedSize}
            onChange={(e) => handleSizeChange(e.target.value)}
            className="w-full text-sm border-gray-300 rounded-md"
          >
            {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36].map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cor
          </label>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-full h-8 rounded-md cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
} 