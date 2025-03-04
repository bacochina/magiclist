'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Musica } from '@/lib/types';

const pedaleiraSchema = z.object({
  nome: z.string().min(1, 'O nome da pedaleira é obrigatório'),
});

const bancoSchema = z.object({
  numero: z.number().min(1).max(999),
  descricao: z.string().optional(),
});

const patchSchema = z.object({
  numero: z.number().min(1).max(9),
  letra: z.string().length(1).regex(/^[A-Z]$/),
  tipo: z.enum(['Clean', 'Drive', 'Distortion', 'Fuzz', 'Solo']),
  descricao: z.string().optional(),
});

type PedaleiraFormData = z.infer<typeof pedaleiraSchema>;
type BancoFormData = z.infer<typeof bancoSchema>;
type PatchFormData = z.infer<typeof patchSchema>;

interface PedaleiraFormProps {
  onSubmit: (data: PedaleiraFormData & {
    bancos: (BancoFormData & {
      patches: (PatchFormData & {
        musicas: Musica[];
      })[];
    })[];
  }) => void;
  onCancel: () => void;
  musicas: Musica[];
  initialData?: PedaleiraFormData & {
    bancos: (BancoFormData & {
      patches: (PatchFormData & {
        musicas: Musica[];
      })[];
    })[];
  };
}

export function PedaleiraForm({ onSubmit, onCancel, musicas, initialData }: PedaleiraFormProps) {
  const [bancos, setBancos] = useState<(BancoFormData & {
    patches: (PatchFormData & { musicas: Musica[] })[];
  })[]>(initialData?.bancos || []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PedaleiraFormData>({
    resolver: zodResolver(pedaleiraSchema),
    defaultValues: initialData,
  });

  const [novoBanco, setNovoBanco] = useState<BancoFormData>({
    numero: 1,
    descricao: '',
  });

  const [novoPatch, setNovoPatch] = useState<PatchFormData & { bancoIndex?: number }>({
    numero: 1,
    letra: 'A',
    tipo: 'Clean',
    descricao: '',
  });

  const handleAdicionarBanco = () => {
    if (novoBanco.numero >= 1 && novoBanco.numero <= 999) {
      setBancos([...bancos, { ...novoBanco, patches: [] }]);
      setNovoBanco({ numero: novoBanco.numero + 1, descricao: '' });
    }
  };

  const handleAdicionarPatch = (bancoIndex: number) => {
    if (novoPatch.numero >= 1 && novoPatch.numero <= 9 && /^[A-Z]$/.test(novoPatch.letra)) {
      const novosBancos = [...bancos];
      novosBancos[bancoIndex].patches.push({ ...novoPatch, musicas: [] });
      setBancos(novosBancos);
      setNovoPatch({
        numero: 1,
        letra: 'A',
        tipo: 'Clean',
        descricao: '',
      });
    }
  };

  const handleRemoverBanco = (index: number) => {
    setBancos(bancos.filter((_, i) => i !== index));
  };

  const handleRemoverPatch = (bancoIndex: number, patchIndex: number) => {
    const novosBancos = [...bancos];
    novosBancos[bancoIndex].patches.splice(patchIndex, 1);
    setBancos(novosBancos);
  };

  const handleAdicionarMusica = (bancoIndex: number, patchIndex: number, musica: Musica) => {
    const novosBancos = [...bancos];
    if (!novosBancos[bancoIndex].patches[patchIndex].musicas.some(m => m.id === musica.id)) {
      novosBancos[bancoIndex].patches[patchIndex].musicas.push(musica);
      setBancos(novosBancos);
    }
  };

  const handleRemoverMusica = (bancoIndex: number, patchIndex: number, musicaId: string) => {
    const novosBancos = [...bancos];
    novosBancos[bancoIndex].patches[patchIndex].musicas = 
      novosBancos[bancoIndex].patches[patchIndex].musicas.filter(m => m.id !== musicaId);
    setBancos(novosBancos);
  };

  const onFormSubmit = (data: PedaleiraFormData) => {
    onSubmit({
      ...data,
      bancos,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
          Nome da Pedaleira
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

      {/* Seção de Bancos */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Bancos</h3>
        
        {/* Formulário para adicionar banco */}
        <div className="flex items-end gap-4 p-4 bg-gray-50 rounded-md">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Número do Banco (1-999)
            </label>
            <input
              type="number"
              min="1"
              max="999"
              value={novoBanco.numero}
              onChange={(e) => setNovoBanco({ ...novoBanco, numero: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Descrição do Banco
            </label>
            <input
              type="text"
              value={novoBanco.descricao || ''}
              onChange={(e) => setNovoBanco({ ...novoBanco, descricao: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="button"
            onClick={handleAdicionarBanco}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Adicionar Banco
          </button>
        </div>

        {/* Lista de bancos */}
        <div className="space-y-4">
          {bancos.map((banco, bancoIndex) => (
            <div key={bancoIndex} className="border rounded-md p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-medium">Banco {banco.numero}</h4>
                  {banco.descricao && (
                    <p className="text-sm text-gray-500">{banco.descricao}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoverBanco(bancoIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Formulário para adicionar patch */}
              <div className="flex items-end gap-4 p-4 bg-gray-50 rounded-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Número (1-9)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="9"
                    value={novoPatch.numero}
                    onChange={(e) => setNovoPatch({ ...novoPatch, numero: parseInt(e.target.value) })}
                    className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Letra (A-Z)
                  </label>
                  <input
                    type="text"
                    maxLength={1}
                    value={novoPatch.letra}
                    onChange={(e) => setNovoPatch({ ...novoPatch, letra: e.target.value.toUpperCase() })}
                    className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tipo
                  </label>
                  <select
                    value={novoPatch.tipo}
                    onChange={(e) => setNovoPatch({ ...novoPatch, tipo: e.target.value as any })}
                    className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="Clean">Clean</option>
                    <option value="Drive">Drive</option>
                    <option value="Distortion">Distortion</option>
                    <option value="Fuzz">Fuzz</option>
                    <option value="Solo">Solo</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={novoPatch.descricao || ''}
                    onChange={(e) => setNovoPatch({ ...novoPatch, descricao: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAdicionarPatch(bancoIndex)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Adicionar Patch
                </button>
              </div>

              {/* Lista de patches */}
              <div className="space-y-2">
                {banco.patches.map((patch, patchIndex) => (
                  <div key={patchIndex} className="flex items-start gap-4 p-4 bg-white border rounded-md">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{patch.numero}{patch.letra}</span>
                        <span className="text-sm text-gray-500">{patch.tipo}</span>
                        {patch.descricao && (
                          <span className="text-sm text-gray-600">{patch.descricao}</span>
                        )}
                      </div>
                      
                      {/* Lista de músicas do patch */}
                      <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Músicas
                        </label>
                        <select
                          onChange={(e) => {
                            const musica = musicas.find(m => m.id === e.target.value);
                            if (musica) {
                              handleAdicionarMusica(bancoIndex, patchIndex, musica);
                            }
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="">Selecione uma música...</option>
                          {musicas.map((musica) => (
                            <option key={musica.id} value={musica.id}>
                              {musica.nome} - {musica.artista}
                            </option>
                          ))}
                        </select>
                        
                        <div className="mt-2 space-y-1">
                          {patch.musicas.map((musica) => (
                            <div key={musica.id} className="flex items-center justify-between text-sm">
                              <span>{musica.nome} - {musica.artista}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoverMusica(bancoIndex, patchIndex, musica.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoverPatch(bancoIndex, patchIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
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