'use client';

import { useState } from 'react';
import { popularDados } from '@/lib/seeds/populateData';

export function PopularDadosButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handlePopularDados = () => {
    if (window.confirm('Isso irá excluir todos os dados existentes e criar novos dados de exemplo. Deseja continuar?')) {
      setIsLoading(true);
      setMessage(null);
      
      try {
        const result = popularDados();
        setMessage({ 
          text: `Dados populados com sucesso! Bandas: ${result.bandas.length}, Músicas: ${result.musicas.length}, Blocos: ${result.blocos.length}, Integrantes: ${result.integrantes.length}`, 
          type: 'success' 
        });
        
        // Recarregar a página após 2 segundos para atualizar os dados
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        setMessage({ 
          text: `Erro ao popular dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, 
          type: 'error' 
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {message && (
        <div className={`mb-2 p-3 rounded-md shadow-lg text-sm ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      <button
        onClick={handlePopularDados}
        disabled={isLoading}
        className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md shadow-lg flex items-center space-x-2 transition-colors duration-200"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Populando...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Excluir e Popular Dados</span>
          </>
        )}
      </button>
    </div>
  );
} 