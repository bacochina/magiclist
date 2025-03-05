interface ElementSettingsProps {
  element: any;
  onUpdate: (id: number, updates: any) => void;
}

export function ElementSettings({ element, onUpdate }: ElementSettingsProps) {
  const handleChange = (field: string, value: string) => {
    onUpdate(element.id, { [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Campos específicos por tipo */}
      {element.type === 'title' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome da Banda</label>
            <input
              type="text"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              value={element.bandName || ''}
              onChange={(e) => handleChange('bandName', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Título do Show</label>
            <input
              type="text"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              value={element.showTitle || ''}
              onChange={(e) => handleChange('showTitle', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data</label>
            <input
              type="text"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              value={element.date || ''}
              onChange={(e) => handleChange('date', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Página Atual</label>
              <input
                type="number"
                min="1"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                value={element.currentPage || '1'}
                onChange={(e) => handleChange('currentPage', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total de Páginas</label>
              <input
                type="number"
                min="1"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                value={element.totalPages || '1'}
                onChange={(e) => handleChange('totalPages', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {element.type === 'blocks' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome do Bloco</label>
          <input
            type="text"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            value={element.blockName || ''}
            onChange={(e) => handleChange('blockName', e.target.value)}
          />
        </div>
      )}

      {element.type === 'tips' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Texto da Dica</label>
          <textarea
            className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            value={element.tipText || ''}
            onChange={(e) => handleChange('tipText', e.target.value)}
            rows={3}
          />
        </div>
      )}

      {element.type === 'details' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Número</label>
            <input
              type="text"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              value={element.number || ''}
              onChange={(e) => handleChange('number', e.target.value)}
              placeholder="01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome da Música</label>
            <input
              type="text"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              value={element.songName || ''}
              onChange={(e) => handleChange('songName', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tom</label>
            <input
              type="text"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              value={element.key || ''}
              onChange={(e) => handleChange('key', e.target.value)}
              placeholder="Em"
            />
          </div>
        </div>
      )}

      <hr className="border-gray-200" />

      {/* Configurações gerais de estilo */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Fonte</label>
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            value={element.fontFamily || 'Arial'}
            onChange={(e) => handleChange('fontFamily', e.target.value)}
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Verdana">Verdana</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tamanho da Fonte</label>
          <input
            type="number"
            min="8"
            max="72"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            value={element.fontSize || '12'}
            onChange={(e) => handleChange('fontSize', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cor do Texto</label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="color"
              className="h-8 w-8 rounded cursor-pointer"
              value={element.color || '#000000'}
              onChange={(e) => handleChange('color', e.target.value)}
            />
            <input
              type="number"
              min="0"
              max="100"
              className="block w-20 pl-3 pr-10 py-2 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              value={element.opacity || '100'}
              onChange={(e) => handleChange('opacity', e.target.value)}
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fundo</label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={element.hasBackground || false}
              onChange={(e) => handleChange('hasBackground', e.target.checked.toString())}
            />
            <span className="text-sm text-gray-700">Mostrar fundo</span>
          </div>
          {element.hasBackground && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="h-8 w-8 rounded cursor-pointer"
                  value={element.backgroundColor || '#F3F4F6'}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="block w-20 pl-3 pr-10 py-2 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                  value={element.backgroundOpacity || '100'}
                  onChange={(e) => handleChange('backgroundOpacity', e.target.value)}
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Alinhamento</label>
          <div className="mt-1 flex gap-2">
            <button
              type="button"
              className={`p-2 rounded ${
                element.alignment === 'left' ? 'bg-indigo-100' : 'hover:bg-gray-100'
              }`}
              onClick={() => handleChange('alignment', 'left')}
            >
              <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
              </svg>
            </button>
            <button
              type="button"
              className={`p-2 rounded ${
                element.alignment === 'center' ? 'bg-indigo-100' : 'hover:bg-gray-100'
              }`}
              onClick={() => handleChange('alignment', 'center')}
            >
              <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" />
              </svg>
            </button>
            <button
              type="button"
              className={`p-2 rounded ${
                element.alignment === 'right' ? 'bg-indigo-100' : 'hover:bg-gray-100'
              }`}
              onClick={() => handleChange('alignment', 'right')}
            >
              <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 