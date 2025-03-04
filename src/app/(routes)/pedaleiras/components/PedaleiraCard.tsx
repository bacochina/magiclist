'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Pedaleira } from '@/lib/types';

interface PedaleiraCardProps {
  pedaleira: Pedaleira;
  onEdit: (pedaleira: Pedaleira) => void;
  onDelete: (pedaleira: Pedaleira) => void;
}

export function PedaleiraCard({ pedaleira, onEdit, onDelete }: PedaleiraCardProps) {
  const [expandido, setExpandido] = useState(false);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{pedaleira.nome}</h3>
            <p className="text-sm text-gray-500">
              {pedaleira.bancos.length} banco{pedaleira.bancos.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(pedaleira)}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(pedaleira)}
              className="p-2 text-gray-400 hover:text-red-500"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setExpandido(!expandido)}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              {expandido ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {expandido && (
        <div className="border-t border-gray-200">
          {pedaleira.bancos.map((banco, bancoIndex) => (
            <div key={bancoIndex} className="border-b border-gray-200 last:border-b-0">
              <div className="p-4">
                <h4 className="font-medium text-gray-900">
                  Banco {banco.numero}
                  {banco.descricao && (
                    <span className="ml-2 text-sm text-gray-500">
                      {banco.descricao}
                    </span>
                  )}
                </h4>
                <div className="mt-2 space-y-2">
                  {banco.patches.map((patch, patchIndex) => (
                    <div key={patchIndex} className="pl-4">
                      <div className="flex items-start">
                        <span className="font-medium text-gray-900">
                          {patch.numero}{patch.letra}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          {patch.tipo}
                        </span>
                        {patch.descricao && (
                          <span className="ml-2 text-sm text-gray-500">
                            - {patch.descricao}
                          </span>
                        )}
                      </div>
                      {patch.musicas.length > 0 && (
                        <div className="mt-1 pl-4">
                          <p className="text-sm text-gray-500">
                            Músicas: {patch.musicas.map(m => m.nome).join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 