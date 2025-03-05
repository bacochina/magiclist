import { useDrag } from 'react-dnd';
import { useState, CSSProperties, useEffect } from 'react';
import { TextFormatMenu } from './TextFormatMenu';

interface DroppedElementProps {
  element: any;
  onClick: () => void;
  isSelected: boolean;
  isDraggable?: boolean;
  alignment?: 'left' | 'center' | 'right';
  onCopyFormat?: (format: any) => void;
  onPasteFormat?: () => any;
}

export function DroppedElement({
  element,
  onClick,
  isSelected,
  isDraggable = false,
  alignment = 'left',
  onCopyFormat,
  onPasteFormat,
}: DroppedElementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(element.text || '');
  const [line1, setLine1] = useState(element.line1 || '');
  const [line2, setLine2] = useState(element.line2 || '');
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [styles, setStyles] = useState({
    fontFamily: element.fontFamily || 'Calibri',
    fontSize: element.fontSize || '12',
    color: element.color || '#000000',
    backgroundColor: element.backgroundColor || 'transparent',
    bold: element.bold || false,
    italic: element.italic || false,
    underline: element.underline || false,
    subscript: element.subscript || false,
    superscript: element.superscript || false,
    borderStyle: element.borderStyle || 'none',
    borderWidth: element.borderWidth || '1px',
    borderColor: element.borderColor || '#000000',
  });

  const [{ isDragging }, dragRef] = useDrag({
    type: 'DROPPED_ELEMENT',
    item: { ...element, type: element.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isDraggable,
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowFormatMenu(true);
  };

  const handleStyleChange = (newStyles: Partial<typeof styles>) => {
    const updatedStyles = { ...styles, ...newStyles };
    setStyles(updatedStyles);
    if (element.onUpdate) {
      element.onUpdate({ ...element, ...updatedStyles });
    }
  };

  const handleCopyFormat = () => {
    if (onCopyFormat) {
      onCopyFormat(styles);
    }
    setShowFormatMenu(false);
  };

  const handlePasteFormat = () => {
    if (onPasteFormat) {
      const pastedStyles = onPasteFormat();
      if (pastedStyles) {
        handleStyleChange(pastedStyles);
      }
    }
    setShowFormatMenu(false);
  };

  const dragTargetRef = (el: HTMLDivElement | null) => {
    dragRef(el);
  };

  const handleDoubleClick = () => {
    if (element.type === 'footer-text' || 
        element.type === 'title-text' || 
        element.type === 'block-text' || 
        element.type === 'tip-text' || 
        element.type === 'detail-text') {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (element.onUpdate) {
      if (element.type === 'footer-text') {
        element.onUpdate({ ...element, line1, line2 });
      } else {
        element.onUpdate({ ...element, text });
      }
    }
  };

  const renderEditableText = () => {
    if (isEditing) {
      if (element.type === 'footer-text') {
        return (
          <div className="space-y-2 w-full">
            <input
              type="text"
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              onBlur={handleBlur}
              className="w-full border-gray-300 rounded-md text-sm"
              placeholder="Primeira linha do rodapé"
              autoFocus
            />
            <input
              type="text"
              value={line2}
              onChange={(e) => setLine2(e.target.value)}
              onBlur={handleBlur}
              className="w-full border-gray-300 rounded-md text-sm"
              placeholder="Segunda linha do rodapé"
            />
          </div>
        );
      } else {
        return (
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            className="w-full border-gray-300 rounded-md text-sm"
            placeholder={getPlaceholder()}
            autoFocus
          />
        );
      }
    }

    if (element.type === 'footer-text') {
      return (
        <div className="text-sm space-y-1">
          <p>{line1 || 'Primeira linha do rodapé'}</p>
          <p>{line2 || 'Segunda linha do rodapé'}</p>
        </div>
      );
    }

    return text || getPlaceholder();
  };

  const getPlaceholder = () => {
    switch (element.type) {
      case 'title-band':
        return 'Nome da Banda';
      case 'title-show':
        return 'Título do Show';
      case 'title-date':
        return 'Data';
      case 'title-page':
        return 'Página';
      case 'title-text':
        return 'Texto do Título';
      case 'block':
        return 'Nome do Bloco';
      case 'block-text':
        return 'Texto do Bloco';
      case 'tip':
        return 'Dica';
      case 'tip-text':
        return 'Texto da Dica';
      case 'detail-number':
        return 'Número';
      case 'detail-song':
        return 'Nome da Música';
      case 'detail-key':
        return 'Tom';
      case 'detail-text':
        return 'Texto dos Detalhes';
      default:
        return element.type;
    }
  };

  const getElementStyle = (): CSSProperties => {
    const baseStyle: CSSProperties = {
      padding: '0.5rem',
      backgroundColor: isSelected ? 'rgb(243, 244, 246)' : styles.backgroundColor,
      border: isSelected 
        ? '2px solid rgb(99, 102, 241)' 
        : styles.borderStyle !== 'none' 
          ? `${styles.borderWidth} ${styles.borderStyle} ${styles.borderColor}`
          : '2px solid transparent',
      borderRadius: '0.375rem',
      cursor: 'pointer',
      opacity: isDragging ? 0.5 : 1,
      fontFamily: styles.fontFamily,
      fontSize: `${styles.fontSize}px`,
      color: styles.color,
      textAlign: alignment,
      display: 'inline-block',
      width: element.type === 'footer-text' ? '100%' : 'auto',
      fontWeight: styles.bold ? 'bold' : 'normal',
      fontStyle: styles.italic ? 'italic' : 'normal',
      textDecoration: styles.underline ? 'underline' : 'none',
      verticalAlign: styles.subscript ? 'sub' : styles.superscript ? 'super' : 'baseline',
    };

    if (element.type === 'footer-text') {
      return {
        ...baseStyle,
        borderBottom: '1px solid #e5e7eb',
      };
    }

    return baseStyle;
  };

  const getElementClass = () => {
    switch (element.type) {
      case 'title-band':
        return 'text-xl font-bold';
      case 'title-show':
        return 'text-lg';
      case 'title-date':
        return 'text-sm text-gray-600';
      case 'title-page':
        return 'text-sm text-gray-500';
      case 'title-text':
        return 'text-base';
      case 'block':
        return 'font-semibold bg-gray-100 p-2';
      case 'block-text':
        return 'text-base';
      case 'tip':
        return 'text-sm italic text-gray-600 border-l-4 border-gray-300 pl-3';
      case 'tip-text':
        return 'text-base italic';
      case 'detail-number':
        return 'text-gray-600 w-8 inline-block';
      default:
        return '';
    }
  };

  return (
    <>
      {showFormatMenu && isSelected && (
        <TextFormatMenu
          initialStyles={styles}
          onStyleChange={handleStyleChange}
          onCopyFormat={handleCopyFormat}
          onPasteFormat={handlePasteFormat}
        />
      )}
      <div
        ref={dragTargetRef}
        style={getElementStyle()}
        onClick={onClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        className={`transition-all duration-200 ease-in-out ${getElementClass()}`}
      >
        {renderEditableText()}
      </div>
    </>
  );
} 