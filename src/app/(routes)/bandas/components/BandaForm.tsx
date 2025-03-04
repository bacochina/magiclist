'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const bandaSchema = z.object({
  nome: z.string().min(1, 'O nome da banda é obrigatório'),
  genero: z.string().min(1, 'O gênero musical é obrigatório'),
  descricao: z.string().optional(),
});

type BandaFormData = z.infer<typeof bandaSchema>;

interface BandaFormProps {
  onSubmit: (data: BandaFormData) => void;
  onCancel: () => void;
  initialData?: BandaFormData;
}

export function BandaForm({ onSubmit, onCancel, initialData }: BandaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BandaFormData>({
    resolver: zodResolver(bandaSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
          Nome da Banda
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="nome"
            {...register('nome')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.nome && (
            <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="genero" className="block text-sm font-medium text-gray-700">
          Gênero Musical
        </label>
        <div className="mt-1">
          <select
            id="genero"
            {...register('genero')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Selecione um gênero</option>
            <option value="rock">Rock</option>
            <option value="pop">Pop</option>
            <option value="sertanejo">Sertanejo</option>
            <option value="mpb">MPB</option>
            <option value="jazz">Jazz</option>
            <option value="blues">Blues</option>
            <option value="outro">Outro</option>
          </select>
          {errors.genero && (
            <p className="mt-1 text-sm text-red-600">{errors.genero.message}</p>
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