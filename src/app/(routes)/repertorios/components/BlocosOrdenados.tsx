'use client';

import { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Bloco {
  id: string;
  nome: string;
  descricao?: string;
  musicas: Array<{
    id: string;
    nome: string;
    artista: string;
    tom: string;
    bpm?: string;
  }>;
}

interface BlocosOrdenadosProps {
  blocos: Bloco[];
  onRemoverBloco: (blocoId: string) => void;
  onReordenarBlocos: (blocos: Bloco[]) => void;
}

export function BlocosOrdenados({ blocos, onRemoverBloco, onReordenarBlocos }: BlocosOrdenadosProps) {
  const moverBloco = (e: React.MouseEvent, index: number, direcao: 'cima' | 'baixo') => {
    e.preventDefault();
    e.stopPropagation();
    
    const novoIndex = direcao === 'cima' ? index - 1 : index + 1;
    if (novoIndex < 0 || novoIndex >= blocos.length) return;

    const novosBlocos = [...blocos];
    const temp = novosBlocos[index];
    novosBlocos[index] = novosBlocos[novoIndex];
    novosBlocos[novoIndex] = temp;

    onReordenarBlocos(novosBlocos);
  };

  const handleRemoverBloco = (e: React.MouseEvent, blocoId: string) => {
    e.preventDefault();
    e.stopPropagation();
    onRemoverBloco(blocoId);
  };

  const calcularDuracao = (musicas: Bloco['musicas']) => {
    // Assumindo média de 4 minutos por música
    const minutos = musicas.length * 4;
    if (minutos < 60) {
      return `${minutos} minutos`;
    }
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    return `${horas}h${minutosRestantes > 0 ? ` ${minutosRestantes}min` : ''}`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Blocos do Repertório</h3>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {blocos.map((bloco, index) => (
            <li key={bloco.id} className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900">{bloco.nome}</h4>
                  <p className="text-sm text-gray-500">
                    {bloco.musicas.length} músicas • {calcularDuracao(bloco.musicas)}
                  </p>
                  {bloco.descricao && (
                    <p className="mt-1 text-sm text-gray-500">{bloco.descricao}</p>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={(e) => moverBloco(e, index, 'cima')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-500 disabled:opacity-50"
                      type="button"
                    >
                      <ChevronUpIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => moverBloco(e, index, 'baixo')}
                      disabled={index === blocos.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-500 disabled:opacity-50"
                      type="button"
                    >
                      <ChevronDownIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <button
                    onClick={(e) => handleRemoverBloco(e, bloco.id)}
                    className="p-1 text-red-400 hover:text-red-500"
                    type="button"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Lista de músicas do bloco */}
              <div className="mt-2">
                <ul className="pl-4 space-y-1">
                  {bloco.musicas.map((musica) => (
                    <li key={musica.id} className="text-sm text-gray-600">
                      {musica.nome} - {musica.artista} (Tom: {musica.tom})
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {blocos.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          Nenhum bloco adicionado ao repertório. Adicione blocos para organizar suas músicas.
        </p>
      )}
    </div>
  );
} 