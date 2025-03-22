'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import YouTubePlayer from './YouTubePlayer';

export default function YouTubeTabs() {
  const [tabs, setTabs] = useState<{ id: string; url: string; videoId: string | null }[]>([
    { id: '1', url: '', videoId: null }
  ]);
  const [activeTabId, setActiveTabId] = useState('1');

  // Extrai o ID do vídeo do YouTube a partir da URL
  const extractVideoId = (url: string): string | null => {
    if (!url) return null;
    
    // Padrão para URLs do YouTube
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Adiciona uma nova aba
  const addTab = () => {
    const newId = String(Date.now());
    setTabs([...tabs, { id: newId, url: '', videoId: null }]);
    setActiveTabId(newId);
  };

  // Remove uma aba
  const removeTab = (id: string) => {
    if (tabs.length <= 1) return;
    
    const newTabs = tabs.filter(tab => tab.id !== id);
    setTabs(newTabs);
    
    // Se a aba ativa foi removida, seleciona a primeira aba
    if (activeTabId === id) {
      setActiveTabId(newTabs[0].id);
    }
  };

  // Atualiza a URL de uma aba e extrai o ID do vídeo
  const updateTabUrl = (id: string, url: string) => {
    const videoId = extractVideoId(url);
    setTabs(tabs.map(tab => 
      tab.id === id ? { ...tab, url, videoId } : tab
    ));
  };

  // Encontra a aba ativa
  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-white mb-4">Vídeos do YouTube</h3>
      
      {/* Abas */}
      <div className="flex border-b border-gray-700 mb-4">
        {tabs.map((tab, index) => (
          <div 
            key={tab.id}
            className={`relative px-4 py-2 cursor-pointer ${
              activeTabId === tab.id 
                ? 'bg-gray-800 text-white border-t border-l border-r border-gray-700 rounded-t-md' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTabId(tab.id)}
          >
            <div className="flex items-center space-x-2">
              <span>Vídeo {index + 1}</span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTab(tab.id);
                  }}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          onClick={addTab}
          className="px-3 py-2 text-purple-400 hover:text-purple-300"
        >
          <Plus size={16} />
        </button>
      </div>
      
      {/* Conteúdo da aba ativa */}
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="text-gray-300 text-sm mr-2">Link do YouTube:</span>
          <input
            type="url"
            value={activeTab.url}
            onChange={(e) => updateTabUrl(activeTab.id, e.target.value)}
            placeholder="Cole a URL do vídeo aqui (ex: https://www.youtube.com/watch?v=...)"
            className="flex-grow bg-gray-900 text-white rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>
        
        {/* Player */}
        {activeTab.videoId && <YouTubePlayer videoId={activeTab.videoId} />}
      </div>
    </div>
  );
} 