'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Musica } from '@/lib/types';
import { TrashIcon } from '@heroicons/react/24/outline';

const presetSchema = z.object({
  id: z.string().optional(),
  identificador: z.string().min(1),
  tipo: z.enum(['Clean', 'Drive', 'Distortion', 'Fuzz', 'Solo']),
  descricao: z.string().min(1, 'A descrição é obrigatória'),
  musicas: z.array(z.string())
});

const bancoSchema = z.object({
  id: z.string().optional(),
  numero: z.number().min(1).max(999),
  descricao: z.string().min(1, 'A descrição é obrigatória'),
  presets: z.array(presetSchema)
});

const pedaleiraSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, 'O nome é obrigatório'),
  usaLetras: z.boolean().default(false),
  bancos: z.array(bancoSchema)
});

type PedaleiraFormData = z.infer<typeof pedaleiraSchema>;

interface PedaleiraFormProps {
  onSubmit: (data: PedaleiraFormData) => void;
  onCancel: () => void;
  musicas: Musica[];
  initialData?: PedaleiraFormData;
}

export function PedaleiraForm({ onSubmit, onCancel, musicas, initialData }: PedaleiraFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<PedaleiraFormData>({
    resolver: zodResolver(pedaleiraSchema),
    defaultValues: initialData || {
      nome: '',
      usaLetras: false,
      bancos: []
    }
  });

  const { fields: bancosFields, append: appendBanco, remove: removeBanco } = useFieldArray({
    control,
    name: 'bancos'
  });

  const adicionarBanco = () => {
    appendBanco({
      numero: bancosFields.length + 1,
      descricao: '',
      presets: []
    });
  };

  const adicionarPreset = (bancoIndex: number) => {
    const presets = watch(`bancos.${bancoIndex}.presets`) || [];
    const usaLetras = watch('usaLetras');
    
    setValue(`bancos.${bancoIndex}.presets`, [
      ...presets,
      {
        identificador: usaLetras 
          ? String.fromCharCode(65 + presets.length) 
          : (presets.length + 1).toString(),
        tipo: 'Clean',
        descricao: '',
        musicas: []
      }
    ]);
  };

  const toggleMusica = (bancoIndex: number, presetIndex: number, musicaId: string) => {
    const presets = watch(`bancos.${bancoIndex}.presets`) || [];
    const preset = presets[presetIndex];
    const musicas = preset.musicas || [];
    
    const novasMusicas = musicas.includes(musicaId)
      ? musicas.filter(id => id !== musicaId)
      : [...musicas, musicaId];
    
    setValue(`bancos.${bancoIndex}.presets.${presetIndex}.musicas`, novasMusicas);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
            Nome da Pedaleira
          </label>
          <input
            type="text"
            id="nome"
            {...register('nome')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.nome && (
            <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="usaLetras"
              {...register('usaLetras')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="usaLetras" className="text-sm font-medium text-gray-700">
              Usar Letras nos Presets
            </label>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {watch('usaLetras') 
              ? 'Os presets serão identificados por letras (A, B, C...)' 
              : 'Os presets serão identificados por números (1, 2, 3...)'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Bancos</h3>
          <button
            type="button"
            onClick={adicionarBanco}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Adicionar Banco
          </button>
        </div>

        {bancosFields.map((banco, bancoIndex) => (
          <div key={banco.id} className="border rounded-md p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Banco
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="999"
                      {...register(`bancos.${bancoIndex}.numero` as const, { valueAsNumber: true })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-10">
                    <label className="block text-sm font-medium text-gray-700">
                      Descrição do Banco
                    </label>
                    <input
                      type="text"
                      {...register(`bancos.${bancoIndex}.descricao` as const)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-900">Presets</h4>
                    <button
                      type="button"
                      onClick={() => adicionarPreset(bancoIndex)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      Adicionar Preset
                    </button>
                  </div>

                  {watch(`bancos.${bancoIndex}.presets`)?.map((preset: any, presetIndex: number) => (
                    <div key={presetIndex} className="border rounded p-4 space-y-4">
                      <div className="space-y-4">
                        <div className="flex gap-6 items-start">
                          <div className="w-16">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {watch('usaLetras') ? 'Letra' : 'Número'}
                            </label>
                            <input
                              type={watch('usaLetras') ? 'text' : 'number'}
                              maxLength={watch('usaLetras') ? 1 : undefined}
                              min={watch('usaLetras') ? undefined : 1}
                              max={watch('usaLetras') ? undefined : 99}
                              {...register(`bancos.${bancoIndex}.presets.${presetIndex}.identificador` as const)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm uppercase text-center"
                            />
                          </div>
                          <div className="w-40">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tipo
                            </label>
                            <select
                              {...register(`bancos.${bancoIndex}.presets.${presetIndex}.tipo` as const)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                              <option value="Clean">Clean</option>
                              <option value="Drive">Drive</option>
                              <option value="Distortion">Distortion</option>
                              <option value="Fuzz">Fuzz</option>
                              <option value="Solo">Solo</option>
                            </select>
                          </div>
                          <div className="flex-grow flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                const presets = watch(`bancos.${bancoIndex}.presets`) || [];
                                setValue(
                                  `bancos.${bancoIndex}.presets`,
                                  presets.filter((_, i) => i !== presetIndex)
                                );
                              }}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                              title="Remover Preset"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descrição do Preset
                          </label>
                          <input
                            type="text"
                            {...register(`bancos.${bancoIndex}.presets.${presetIndex}.descricao` as const)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Músicas do Preset
                        </label>
                        <div className="border rounded-md p-3">
                          <div className="h-[72px] overflow-y-auto pr-2">
                            <div className="space-y-2">
                              {musicas.map((musica) => {
                                const isSelected = watch(`bancos.${bancoIndex}.presets.${presetIndex}.musicas`)?.includes(musica.id);
                                return (
                                  <div key={musica.id} className="flex items-center py-0.5">
                                    <input
                                      type="checkbox"
                                      id={`musica-${bancoIndex}-${presetIndex}-${musica.id}`}
                                      checked={isSelected}
                                      onChange={() => toggleMusica(bancoIndex, presetIndex, musica.id)}
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label
                                      htmlFor={`musica-${bancoIndex}-${presetIndex}-${musica.id}`}
                                      className="ml-2 text-sm text-gray-900 truncate"
                                    >
                                      {musica.nome} - {musica.artista}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeBanco(bancoIndex)}
                className="ml-4 p-1 text-red-600 hover:text-red-800 transition-colors"
                title="Remover Banco"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Salvar
        </button>
      </div>
    </form>
  );
} 