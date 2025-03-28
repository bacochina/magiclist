'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bloco, Banda, Musica } from '@/lib/types';
import { useState, useEffect } from 'react';
import { MusicalNoteIcon } from '@heroicons/react/24/outline';

const blocoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
});

type BlocoFormData = z.infer<typeof blocoSchema>;

interface BlocoFormProps {
  bloco?: Bloco;
  bandas: Banda[];
  musicas: Musica[];
  bandaSelecionada?: string;
  onSubmit: (data: Partial<Bloco>) => void;
  onCancel?: () => void;
}

export function BlocoForm({ bloco, bandas, musicas, bandaSelecionada, onSubmit, onCancel }: BlocoFormProps) {
  const [musicasSelecionadas, setMusicasSelecionadas] = useState<string[]>(bloco?.musicas || []);
  const [bandaId, setBandaId] = useState<string | undefined>(bloco?.bandaId || bandaSelecionada);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BlocoFormData>({
    resolver: zodResolver(blocoSchema),
    defaultValues: {
      nome: bloco?.nome || '',
      descricao: bloco?.descricao || '',
    },
  });

  const handleToggleMusica = (musicaId: string) => {
    setMusicasSelecionadas(prev => 
      prev.includes(musicaId)
        ? prev.filter(id => id !== musicaId)
        : [...prev, musicaId]
    );
  };

  const onFormSubmit = (data: BlocoFormData) => {
    onSubmit({
      ...data,
      musicas: musicasSelecionadas,
      bandaId: bandaId
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
          Nome
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="nome"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            {...register('nome')}
          />
          {errors.nome && (
            <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <div className="mt-1">
          <textarea
            id="descricao"
            rows={3}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            {...register('descricao')}
          />
        </div>
      </div>

      <div>
        <label htmlFor="banda" className="block text-sm font-medium text-gray-700">
          Banda
        </label>
        <div className="mt-1">
          <select
            id="banda"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={bandaId || ''}
            onChange={(e) => setBandaId(e.target.value || undefined)}
          >
            <option value="">Selecione uma banda</option>
            {Array.isArray(bandas) && bandas.map((banda) => (
              <option key={banda.id} value={banda.id}>
                {banda.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Músicas
        </label>
        <div className="mt-1 border border-gray-300 rounded-md p-2 max-h-60 overflow-y-auto">
          {musicas.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {musicas.map((musica) => (
                <li key={musica.id} className="py-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`musica-${musica.id}`}
                      checked={musicasSelecionadas.includes(musica.id)}
                      onChange={() => handleToggleMusica(musica.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`musica-${musica.id}`} className="ml-3 block text-sm text-gray-700">
                      <div className="flex items-center">
                        <MusicalNoteIcon className="h-4 w-4 mr-1 text-indigo-500" />
                        <span className="font-medium">{musica.nome}</span>
                        <span className="ml-2 text-gray-500 text-xs">
                          {musica.artista} - {musica.tom}
                        </span>
                      </div>
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              Nenhuma música disponível
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isSubmitting ? 'Salvando...' : bloco ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
} 