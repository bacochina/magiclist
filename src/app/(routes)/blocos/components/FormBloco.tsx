import React, { useState, useEffect } from 'react';
import { Bloco, Banda } from '@/lib/types';

interface FormBlocoProps {
  bloco?: Bloco;
  bandas: Banda[];
  bandaSelecionada?: string;
  onSubmit: (data: Partial<Bloco>) => void;
  onCancel: () => void;
}

export default function FormBloco({ 
  bloco, 
  bandas, 
  bandaSelecionada, 
  onSubmit, 
  onCancel 
}: FormBlocoProps) {
  const [nome, setNome] = useState(bloco?.nome || '');
  const [descricao, setDescricao] = useState(bloco?.descricao || '');
  const [banda, setBanda] = useState(bloco?.bandaId || bandaSelecionada || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nome,
      descricao,
      bandaId: banda || undefined,
      musicas: bloco?.musicas || []
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
          Nome do Bloco
        </label>
        <input
          type="text"
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-800"
          placeholder="Ex: Rock Clássico"
        />
      </div>
      
      <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
          Descrição (opcional)
        </label>
        <textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-800"
          placeholder="Ex: Bloco com músicas clássicas do rock"
        />
      </div>
      
      <div>
        <label htmlFor="banda" className="block text-sm font-medium text-gray-700">
          Banda
        </label>
        <select
          id="banda"
          value={banda}
          onChange={(e) => setBanda(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-800"
        >
          <option value="" className="text-gray-800 font-medium">Selecione uma banda (opcional)</option>
          {Array.isArray(bandas) ? bandas.map(b => (
            <option key={b.id} value={b.id} className="text-gray-800">{b.nome}</option>
          )) : (
            <option value="" className="text-gray-800">Nenhuma banda disponível</option>
          )}
        </select>
      </div>
      
      <div className="flex justify-end pt-4 space-x-3 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {bloco ? 'Salvar' : 'Criar'}
        </button>
      </div>
    </form>
  );
} 