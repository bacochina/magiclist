'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Banda } from '@/lib/types';

const blocoSchema = z.object({
  nome: z.string().min(1, 'O nome do bloco é obrigatório'),
  descricao: z.string().optional(),
  bandaId: z.string().min(1, 'A banda é obrigatória'),
});

type BlocoFormData = z.infer<typeof blocoSchema>;

interface BlocoFormProps {
  onSubmit: (data: BlocoFormData) => void;
  onCancel: () => void;
  initialData?: {
    id: string;
    nome: string;
    descricao?: string;
    bandaId?: string;
    musicas: {
      id: string;
      nome: string;
      artista: string;
      tom: string;
    }[];
  } | null;
}

export function BlocoForm({ onSubmit, onCancel, initialData }: BlocoFormProps) {
  const [bandas, setBandas] = useState<Banda[]>([]);
  const [carregando, setCarregando] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BlocoFormData>({
    resolver: zodResolver(blocoSchema),
    defaultValues: initialData || undefined,
  });

  useEffect(() => {
    const carregarBandas = async () => {
      try {
        const response = await fetch('/api/bandas');
        if (!response.ok) {
          throw new Error('Erro ao carregar bandas');
        }
        const data = await response.json();
        setBandas(data.bandas || []);
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setCarregando(false);
      }
    };

    carregarBandas();
  }, []);

  if (carregando) {
    return <div>Carregando bandas...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
          Nome do Bloco
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="nome"
            {...register('nome')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Ex: Abertura, Romântico, Dançante..."
          />
          {errors.nome && (
            <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="bandaId" className="block text-sm font-medium text-gray-700">
          Banda
        </label>
        <div className="mt-1">
          <select
            id="bandaId"
            {...register('bandaId')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Selecione uma banda</option>
            {bandas.map((banda) => (
              <option key={banda.id} value={banda.id}>
                {banda.nome}
              </option>
            ))}
          </select>
          {errors.bandaId && (
            <p className="mt-1 text-sm text-red-600">{errors.bandaId.message}</p>
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
            {...register('descricao')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Descreva o propósito deste bloco..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
} 