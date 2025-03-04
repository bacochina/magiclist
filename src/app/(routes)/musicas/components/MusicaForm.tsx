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
  bpm: z.string().optional(),
  cifra: z.string().optional(),
  letra: z.string().optional(),
  observacoes: z.string().optional(),
});

type MusicaFormData = z.infer<typeof musicaSchema>;

interface MusicaFormProps {
  onSubmit: (data: MusicaFormData & {
    arquivoLetra?: File;
    arquivoCifra?: File;
    arquivoAudioOriginal?: File;
    arquivoAudioVs?: File;
  }) => void;
  onCancel: () => void;
  initialData?: MusicaFormData;
}

export function MusicaForm({ onSubmit, onCancel, initialData }: MusicaFormProps) {
  const [arquivoLetra, setArquivoLetra] = useState<File | null>(null);
  const [arquivoCifra, setArquivoCifra] = useState<File | null>(null);
  const [arquivoAudioOriginal, setArquivoAudioOriginal] = useState<File | null>(null);
  const [arquivoAudioVs, setArquivoAudioVs] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const letraInputRef = useRef<HTMLInputElement>(null);
  const cifraInputRef = useRef<HTMLInputElement>(null);
  const audioOriginalInputRef = useRef<HTMLInputElement>(null);
  const audioVsInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MusicaFormData>({
    resolver: zodResolver(musicaSchema),
    defaultValues: initialData,
  });

  const handleDocumentRead = async (file: File, tipo: 'letra' | 'cifra') => {
    setIsLoading(true);
    try {
      const extension = file.name.split('.').pop()?.toLowerCase();
      let conteudo = '';

      if (extension === 'pdf') {
        // Ler PDF
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;
        const textContent = [];
        
        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item: any) => item.str).join(' ');
          textContent.push(pageText);
        }
        
        conteudo = textContent.join('\n\n');
      } else if (extension === 'docx') {
        // Ler DOCX
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        conteudo = result.value;
      } else if (extension === 'doc') {
        // Mensagem de aviso para arquivos .doc
        alert('Arquivos .doc antigos não são suportados. Por favor, converta para .docx ou outro formato.');
        return;
      } else {
        // Ler TXT e outros formatos de texto
        conteudo = await file.text();
      }

      setValue(tipo, conteudo);
    } catch (error) {
      console.error('Erro ao ler arquivo:', error);
      alert('Erro ao ler o arquivo. Por favor, tente novamente ou use outro formato.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleArquivoLetra = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArquivoLetra(file);
      await handleDocumentRead(file, 'letra');
    }
  };

  const handleArquivoCifra = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArquivoCifra(file);
      await handleDocumentRead(file, 'cifra');
    }
  };

  const handleArquivoAudioOriginal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArquivoAudioOriginal(file);
    }
  };

  const handleArquivoAudioVs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArquivoAudioVs(file);
    }
  };

  const onFormSubmit = (data: MusicaFormData) => {
    onSubmit({
      ...data,
      arquivoLetra: arquivoLetra || undefined,
      arquivoCifra: arquivoCifra || undefined,
      arquivoAudioOriginal: arquivoAudioOriginal || undefined,
      arquivoAudioVs: arquivoAudioVs || undefined,
    });
  };

  const tons = [
    'C', 'Cm', 'C#', 'C#m', 'D', 'Dm', 'D#', 'D#m',
    'E', 'Em', 'F', 'Fm', 'F#', 'F#m', 'G', 'Gm',
    'G#', 'G#m', 'A', 'Am', 'A#', 'A#m', 'B', 'Bm'
  ];

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
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
        <label htmlFor="bpm" className="block text-sm font-medium text-gray-700">
          BPM
        </label>
        <input
          type="text"
          id="bpm"
          {...register('bpm')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.bpm && (
          <p className="mt-1 text-sm text-red-600">{errors.bpm.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Cifra
        </label>
        <div className="mt-1 space-y-2">
          <textarea
            id="cifra"
            rows={6}
            {...register('cifra')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => cifraInputRef.current?.click()}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
              {isLoading ? 'Importando...' : 'Importar Cifra'}
            </button>
            {arquivoCifra && (
              <span className="text-sm text-gray-500">
                Arquivo: {arquivoCifra.name}
              </span>
            )}
          </div>
          <input
            type="file"
            ref={cifraInputRef}
            onChange={handleArquivoCifra}
            accept=".txt,.rtf,.doc,.docx,.pdf"
            className="hidden"
          />
          <p className="text-sm text-gray-500">
            Formatos aceitos: TXT, RTF, DOC, DOCX, PDF
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Letra
        </label>
        <div className="mt-1 space-y-2">
          <textarea
            id="letra"
            rows={6}
            {...register('letra')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => letraInputRef.current?.click()}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
              {isLoading ? 'Importando...' : 'Importar Letra'}
            </button>
            {arquivoLetra && (
              <span className="text-sm text-gray-500">
                Arquivo: {arquivoLetra.name}
              </span>
            )}
          </div>
          <input
            type="file"
            ref={letraInputRef}
            onChange={handleArquivoLetra}
            accept=".txt,.rtf,.doc,.docx,.pdf"
            className="hidden"
          />
          <p className="text-sm text-gray-500">
            Formatos aceitos: TXT, RTF, DOC, DOCX, PDF
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Áudio Original
        </label>
        <div className="mt-1 space-y-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => audioOriginalInputRef.current?.click()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <MusicalNoteIcon className="h-5 w-5 mr-2" />
              Importar Áudio Original
            </button>
            {arquivoAudioOriginal && (
              <span className="text-sm text-gray-500">
                Arquivo: {arquivoAudioOriginal.name}
              </span>
            )}
          </div>
          <input
            type="file"
            ref={audioOriginalInputRef}
            onChange={handleArquivoAudioOriginal}
            accept="audio/*"
            className="hidden"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Áudio VS
        </label>
        <div className="mt-1 space-y-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => audioVsInputRef.current?.click()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <MusicalNoteIcon className="h-5 w-5 mr-2" />
              Importar Áudio VS
            </button>
            {arquivoAudioVs && (
              <span className="text-sm text-gray-500">
                Arquivo: {arquivoAudioVs.name}
              </span>
            )}
          </div>
          <input
            type="file"
            ref={audioVsInputRef}
            onChange={handleArquivoAudioVs}
            accept="audio/*"
            className="hidden"
          />
        </div>
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

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
} 