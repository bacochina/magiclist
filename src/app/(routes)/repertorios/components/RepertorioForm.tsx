'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Banda, Repertorio, Bloco } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Plus, X } from 'lucide-react';

const repertorioSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório'),
  descricao: z.string().optional(),
  bandaId: z.string().optional(),
});

type RepertorioFormData = z.infer<typeof repertorioSchema>;

interface RepertorioFormProps {
  repertorio?: Repertorio;
  bandas: Banda[];
  onSubmit: (data: Partial<Repertorio>) => void;
  onCancel?: () => void;
}

export function RepertorioForm({ repertorio, bandas, onSubmit, onCancel }: RepertorioFormProps) {
  const [blocosSelecionados, setBlocosSelecionados] = useState<string[]>(
    repertorio?.blocos || []
  );
  const [modalBlocosAberto, setModalBlocosAberto] = useState(false);
  const [blocosDisponiveis, setBlocosDisponiveis] = useState<Bloco[]>([]);
  const [carregandoBlocos, setCarregandoBlocos] = useState(false);
  const [erroBlocos, setErroBlocos] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RepertorioFormData>({
    resolver: zodResolver(repertorioSchema),
    defaultValues: {
      nome: repertorio?.nome || '',
      descricao: repertorio?.descricao || '',
      bandaId: repertorio?.bandaId || '',
    },
  });

  const bandaIdSelecionada = watch('bandaId');

  useEffect(() => {
    const buscarBlocosDaBanda = async () => {
      if (!bandaIdSelecionada) {
        setBlocosDisponiveis([]);
        return;
      }

      setCarregandoBlocos(true);
      setErroBlocos(null);

      try {
        const response = await fetch(`/api/bandas/${bandaIdSelecionada}/blocos`);
        if (!response.ok) {
          throw new Error('Erro ao carregar blocos');
        }
        const data = await response.json();
        setBlocosDisponiveis(data);
      } catch (error) {
        console.error('Erro ao carregar blocos:', error);
        setErroBlocos('Não foi possível carregar os blocos desta banda.');
      } finally {
        setCarregandoBlocos(false);
      }
    };

    buscarBlocosDaBanda();
  }, [bandaIdSelecionada]);

  const blocosFiltrados = bandaIdSelecionada
    ? blocosDisponiveis.filter(bloco => !blocosSelecionados.includes(bloco.id))
    : [];

  const onFormSubmit = (data: RepertorioFormData) => {
    onSubmit({
      ...data,
      blocos: blocosSelecionados,
    });
  };

  const handleAdicionarBloco = (blocoId: string) => {
    if (!blocosSelecionados.includes(blocoId)) {
      setBlocosSelecionados([...blocosSelecionados, blocoId]);
    }
  };

  const handleRemoverBloco = (blocoId: string) => {
    setBlocosSelecionados(blocosSelecionados.filter(id => id !== blocoId));
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-900">
          Nome do Repertório
        </label>
        <input
          type="text"
          id="nome"
          {...register('nome')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
        />
        {errors.nome && (
          <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-900">
          Descrição
        </label>
        <textarea
          id="descricao"
          rows={3}
          {...register('descricao')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="bandaId" className="block text-sm font-medium text-gray-900">
          Banda
        </label>
        <select
          id="bandaId"
          {...register('bandaId')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
        >
          <option value="">Selecione uma banda</option>
          {Array.isArray(bandas) ? bandas.map((banda) => (
            <option key={banda.id} value={banda.id}>
              {banda.nome}
            </option>
          )) : null}
        </select>
      </div>

      {/* Seleção de Blocos */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Blocos</h3>
          <button
            type="button"
            onClick={() => setModalBlocosAberto(true)}
            disabled={!bandaIdSelecionada}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Bloco
          </button>
        </div>

        {/* Lista de blocos selecionados */}
        <div className="border rounded-md p-4 bg-gray-50">
          {blocosSelecionados.length > 0 ? (
            <ul className="space-y-2">
              {blocosSelecionados.map((blocoId) => {
                const bloco = blocosDisponiveis.find(b => b.id === blocoId);
                return (
                  <li key={blocoId} className="flex justify-between items-center p-2 bg-white rounded-md border">
                    <span>{bloco?.nome || `Bloco ID: ${blocoId}`}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoverBloco(blocoId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">
              {bandaIdSelecionada
                ? 'Nenhum bloco selecionado. Clique em "Adicionar Bloco" para começar.'
                : 'Selecione uma banda para adicionar blocos.'}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          {isSubmitting ? 'Salvando...' : repertorio ? 'Atualizar' : 'Criar'}
        </button>
      </div>

      {/* Modal para adicionar blocos */}
      <Modal
        isOpen={modalBlocosAberto}
        onClose={() => setModalBlocosAberto(false)}
        title="Adicionar Blocos"
      >
        <div className="space-y-4">
          {carregandoBlocos ? (
            <div className="flex justify-center items-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : erroBlocos ? (
            <div className="text-center p-4">
              <p className="text-red-600">{erroBlocos}</p>
            </div>
          ) : blocosFiltrados.length > 0 ? (
            <div>
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {blocosFiltrados.map((bloco) => (
                  <li key={bloco.id} className="flex justify-between items-center p-2 bg-white rounded-md border">
                    <span>{bloco.nome}</span>
                    <button
                      type="button"
                      onClick={() => handleAdicionarBloco(bloco.id)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Não há blocos disponíveis para adicionar.
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setModalBlocosAberto(false)}
              className="py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Fechar
            </button>
          </div>
        </div>
      </Modal>
    </form>
  );
} 