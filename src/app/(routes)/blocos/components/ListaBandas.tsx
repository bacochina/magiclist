'use client';

import { Banda } from '@/lib/types';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface ListaBandasProps {
  bandas: Banda[];
  onSelectBanda: (banda: Banda) => void;
  bandaSelecionada?: Banda;
}

export function ListaBandas({ bandas, onSelectBanda, bandaSelecionada }: ListaBandasProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Minhas Bandas</h3>
        <p className="mt-1 text-sm text-gray-500">Selecione uma banda para ver seus blocos</p>
      </div>
      <div className="border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {bandas.map((banda) => (
            <li key={banda.id}>
              <button
                onClick={() => onSelectBanda(banda)}
                className={`w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 ${
                  bandaSelecionada?.id === banda.id ? 'bg-indigo-50' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">{banda.nome}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {banda.genero}
                      </p>
                    </div>
                  </div>
                  {banda.descricao && (
                    <p className="mt-1 text-sm text-gray-500 truncate">{banda.descricao}</p>
                  )}
                </div>
                <ChevronRightIcon className="ml-4 h-5 w-5 text-gray-400" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 