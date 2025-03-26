import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

interface NovoBlocoProps {
  onClick: () => void;
}

export default function NovoBloco({ onClick }: NovoBlocoProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors duration-200"
    >
      <div className="text-center">
        <PlusIcon className="h-10 w-10 mx-auto text-gray-400" />
        <span className="mt-2 block text-sm font-medium text-gray-300">
          Adicionar Novo Bloco
        </span>
      </div>
    </button>
  );
} 