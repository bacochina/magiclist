'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Musica } from '@/lib/types';

const musicaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  artista: z.string().min(1, 'Artista é obrigatório'),
  tom: z.string().min(1, 'Tom é obrigatório'),
  bpm: z.number().min(1, 'BPM é obrigatório'),
  observacoes: z.string().optional(),
});

type MusicaFormData = z.infer<typeof musicaSchema>;

interface MusicaFormProps {
  musica?: Musica;
  onSubmit: (data: MusicaFormData) => void;
}

export function MusicaForm({ musica, onSubmit }: MusicaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MusicaFormData>({
    resolver: zodResolver(musicaSchema),
    defaultValues: {
      nome: musica?.nome || '',
      artista: musica?.artista || '',
      tom: musica?.tom || '',
      bpm: musica?.bpm || 0,
      observacoes: musica?.observacoes || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
        <label htmlFor="artista" className="block text-sm font-medium text-gray-700">
          Artista
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="artista"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            {...register('artista')}
          />
          {errors.artista && (
            <p className="mt-1 text-sm text-red-600">{errors.artista.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="tom" className="block text-sm font-medium text-gray-700">
          Tom
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="tom"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            {...register('tom')}
          />
          {errors.tom && (
            <p className="mt-1 text-sm text-red-600">{errors.tom.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="bpm" className="block text-sm font-medium text-gray-700">
          BPM
        </label>
        <div className="mt-1">
          <input
            type="number"
            id="bpm"
            min="1"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            {...register('bpm', { valueAsNumber: true })}
          />
          {errors.bpm && (
            <p className="mt-1 text-sm text-red-600">{errors.bpm.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700">
          Observações
        </label>
        <div className="mt-1">
          <textarea
            id="observacoes"
            rows={3}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            {...register('observacoes')}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isSubmitting ? 'Salvando...' : musica ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
} 