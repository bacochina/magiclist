import React, { useState } from 'react';
import { Musica } from '@/lib/types';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

interface ModalSelecionarMusicaProps {
  musicas: Musica[];
  onSelecionar: (musicaId: string) => void;
  onCriarNova: () => void;
  onFechar: () => void;
}

export default function ModalSelecionarMusica({
  musicas,
  onSelecionar,
  onCriarNova,
  onFechar
}: ModalSelecionarMusicaProps) {
  const [busca, setBusca] = useState('');
  
  const musicasFiltradas = Array.isArray(musicas) 
    ? musicas.filter(musica => 
        musica.nome.toLowerCase().includes(busca.toLowerCase()) ||
        (musica.artista && musica.artista.toLowerCase().includes(busca.toLowerCase()))
      )
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Adicionar Música ao Bloco</h3>
        <p className="mt-1 text-sm text-gray-500">
          Selecione uma música existente ou crie uma nova
        </p>
      </div>
      
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar músicas..."
          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-800"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>
      
      <div className="border border-gray-200 rounded-md divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {musicasFiltradas.length > 0 ? (
          musicasFiltradas.map(musica => (
            <button
              key={musica.id}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out"
              onClick={() => onSelecionar(musica.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{musica.nome}</h4>
                  <p className="text-xs text-gray-500">
                    {musica.artista} {musica.tom ? `- ${musica.tom}` : ''}
                  </p>
                </div>
                <span className="text-xs text-indigo-600 font-medium hover:text-indigo-900">
                  Selecionar
                </span>
              </div>
            </button>
          ))
        ) : (
          <div className="px-4 py-6 text-center">
            <p className="text-sm text-gray-500">
              {!Array.isArray(musicas) 
                ? "Nenhuma música disponível" 
                : busca 
                  ? `Nenhuma música encontrada com "${busca}".`
                  : "Nenhuma música cadastrada."}
            </p>
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          className="mr-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={onCriarNova}
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Nova Música
        </button>
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={onFechar}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
} 