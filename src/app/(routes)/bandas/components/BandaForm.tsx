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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg p-4">
        <div className="mb-5">
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <UserGroupIcon className="h-5 w-5 mr-2 text-purple-600" />
            Nome
          </label>
          <input
            type="text"
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm py-2 px-3 border"
            placeholder="Nome da banda"
            required
          />
        </div>

        <div className="mb-5">
          <label htmlFor="genero" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <MusicalNoteIcon className="h-5 w-5 mr-2 text-purple-600" />
            Gênero
          </label>
          <input
            type="text"
            id="genero"
            value={formData.genero}
            onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm py-2 px-3 border"
            placeholder="Rock, Pop, Jazz, etc."
            required
          />
        </div>

        <div className="mb-2">
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2 text-purple-600" />
            Descrição
          </label>
          <textarea
            id="descricao"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm py-2 px-3 border"
            rows={4}
            placeholder="Descreva a banda, sua história, estilo musical, etc."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </Button>
        <Button 
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {banda ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
  );
} 