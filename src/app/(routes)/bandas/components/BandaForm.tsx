'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Banda } from '@/lib/types';
import { MusicalNoteIcon, UserGroupIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface BandaFormProps {
  banda?: Banda;
  onSubmit: (banda: Omit<Banda, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function BandaForm({ banda, onSubmit, onCancel }: BandaFormProps) {
  const [formData, setFormData] = useState({
    nome: banda?.nome || '',
    genero: banda?.genero || '',
    descricao: banda?.descricao || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white max-w-[120%] mx-auto p-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-6 space-y-2">
          <label htmlFor="nome" className="block text-sm font-medium text-white flex items-center">
            <UserGroupIcon className="h-5 w-5 mr-2 text-purple-400" />
            Nome *
          </label>
          <input
            type="text"
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
            placeholder="Nome da banda"
            required
          />
        </div>

        <div className="md:col-span-6 space-y-2">
          <label htmlFor="genero" className="block text-sm font-medium text-white flex items-center">
            <MusicalNoteIcon className="h-5 w-5 mr-2 text-purple-400" />
            Gênero *
          </label>
          <input
            type="text"
            id="genero"
            value={formData.genero}
            onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
            placeholder="Rock, Pop, Jazz, etc."
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="descricao" className="block text-sm font-medium text-white flex items-center">
          <DocumentTextIcon className="h-5 w-5 mr-2 text-purple-400" />
          Descrição
        </label>
        <textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                   focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                   transition-all duration-200 ease-in-out px-3 py-2"
          rows={4}
          placeholder="Descreva a banda, sua história, estilo musical, etc."
        />
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-white/20 text-sm text-white hover:bg-white/10
                   focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 ease-in-out
                   font-medium flex items-center justify-center"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-indigo-500 text-sm text-white hover:bg-indigo-600
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900
                   transition-all duration-200 ease-in-out font-medium shadow-lg shadow-indigo-500/20
                   flex items-center justify-center"
        >
          {banda ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
} 