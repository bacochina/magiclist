'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const ConversoresPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-6">
        <Link 
          href="/ferramentas" 
          className="flex items-center text-sm text-gray-400 hover:text-gray-300 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar para Ferramentas
        </Link>
        
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-500 text-transparent bg-clip-text">
          Conversores
        </h1>
        <p className="text-gray-400 max-w-3xl">
          Ferramentas para converter formatos, tons e outros elementos musicais importantes.
        </p>
      </div>

      {/* Conteúdo em construção */}
      <div className="bg-gray-900/60 border border-white/10 rounded-xl p-8 text-center">
        <h2 className="text-xl font-semibold mb-4 text-white">Funcionalidade em Desenvolvimento</h2>
        <p className="text-gray-400 max-w-lg mx-auto mb-6">
          Estamos trabalhando para implementar conversores úteis para auxiliar nas necessidades da sua banda. Esta funcionalidade estará disponível em breve.
        </p>
        <div className="inline-block relative">
          <div className="h-2 w-48 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 w-1/3 rounded-full animate-pulse-slow"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversoresPage; 