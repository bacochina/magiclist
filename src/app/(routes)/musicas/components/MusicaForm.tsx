'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DocumentArrowUpIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import mammoth from 'mammoth';

// Declaração de tipo para o mammoth
declare module 'mammoth' {
  interface Result {
    value: string;
    messages: any[];
  }
  
  interface Options {
    arrayBuffer: ArrayBuffer;
  }
  
  export function extractRawText(options: Options): Promise<Result>;
}

// Configurar worker do PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const musicaSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório'),
  artista: z.string().min(1, 'O artista é obrigatório'),
  tom: z.string().min(1, 'O tom é obrigatório'),
  observacoes: z.string().optional(),
});

type MusicaFormData = z.infer<typeof musicaSchema>;

interface MusicaFormProps {
  onSubmit: (data: MusicaFormData) => void;
  onCancel: () => void;
  initialData?: MusicaFormData;
}

export function MusicaForm({ onSubmit, onCancel, initialData }: MusicaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MusicaFormData>({
    resolver: zodResolver(musicaSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
          Nome
        </label>
        <input
          type="text"
          id="nome"
          {...register('nome')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.nome && (
          <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="artista" className="block text-sm font-medium text-gray-700">
          Artista
        </label>
        <input
          type="text"
          id="artista"
          {...register('artista')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.artista && (
          <p className="mt-1 text-sm text-red-600">{errors.artista.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="tom" className="block text-sm font-medium text-gray-700">
          Tom
        </label>
        <input
          type="text"
          id="tom"
          {...register('tom')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.tom && (
          <p className="mt-1 text-sm text-red-600">{errors.tom.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700">
          Observações
        </label>
        <textarea
          id="observacoes"
          rows={3}
          {...register('observacoes')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.observacoes && (
          <p className="mt-1 text-sm text-red-600">{errors.observacoes.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Salvar
        </button>
      </div>
    </form>
  );
} 