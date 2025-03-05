'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Banda } from '@/lib/types';

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
          Nome
        </label>
        <input
          type="text"
          id="nome"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="genero" className="block text-sm font-medium text-gray-700">
          Gênero
        </label>
        <input
          type="text"
          id="genero"
          value={formData.genero}
          onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {banda ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
  );
} 