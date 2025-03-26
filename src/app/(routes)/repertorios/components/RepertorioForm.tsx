'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
<<<<<<< HEAD
import { BlocosOrdenados } from './BlocosOrdenados';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Modal } from '@/components/ui/Modal';

const repertorioSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório'),
  data: z.string().min(1, 'A data é obrigatória'),
  bandaId: z.string().min(1, 'A banda é obrigatória'),
  observacoes: z.string().optional(),
=======
import { Banda, Repertorio, Bloco } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Plus, X } from 'lucide-react';

const repertorioSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório'),
  descricao: z.string().optional(),
  bandaId: z.string().optional(),
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6
});

type RepertorioFormData = z.infer<typeof repertorioSchema>;

<<<<<<< HEAD
interface Banda {
  id: string;
  nome: string;
}

interface Musica {
  id: string;
  nome: string;
  artista: string;
  tom: string;
  bpm?: string;
  dicas?: string[];
}

interface Bloco {
  id: string;
  nome: string;
  descricao?: string;
  musicas: Musica[];
}

interface RepertorioFormProps {
  onSubmit: (data: RepertorioFormData & { blocos: Bloco[] }) => void;
  onCancel: () => void;
  bandasDisponiveis: Banda[];
  initialData?: RepertorioFormData & { blocos: Bloco[] };
}

export function RepertorioForm({ onSubmit, onCancel, bandasDisponiveis, initialData }: RepertorioFormProps) {
  const [blocosSelecionados, setBlocosSelecionados] = useState<Bloco[]>(
    initialData?.blocos || []
  );
  const [isModalBlocosOpen, setIsModalBlocosOpen] = useState(false);
  const [dicaAtual, setDicaAtual] = useState('');
  const [musicaEditandoIndex, setMusicaEditandoIndex] = useState<{ blocoIndex: number; musicaIndex: number } | null>(null);
  const [blocosDisponiveis, setBlocosDisponiveis] = useState<Bloco[]>([]);
  const [isLoadingBlocos, setIsLoadingBlocos] = useState(false);
  const [errorBlocos, setErrorBlocos] = useState<string | null>(null);
=======
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
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6

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
<<<<<<< HEAD
    const fetchBlocosDaBanda = async () => {
=======
    const buscarBlocosDaBanda = async () => {
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6
      if (!bandaIdSelecionada) {
        setBlocosDisponiveis([]);
        return;
      }

<<<<<<< HEAD
      setIsLoadingBlocos(true);
      setErrorBlocos(null);
=======
      setCarregandoBlocos(true);
      setErroBlocos(null);
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6

      try {
        const response = await fetch(`/api/bandas/${bandaIdSelecionada}/blocos`);
        if (!response.ok) {
          throw new Error('Erro ao carregar blocos');
        }
        const data = await response.json();
<<<<<<< HEAD
        setBlocosDisponiveis(data.blocos);
      } catch (error) {
        console.error('Erro ao carregar blocos:', error);
        setErrorBlocos('Não foi possível carregar os blocos desta banda.');
      } finally {
        setIsLoadingBlocos(false);
      }
    };

    fetchBlocosDaBanda();
  }, [bandaIdSelecionada]);

  const blocosFiltrados = bandaIdSelecionada
    ? blocosDisponiveis.filter(bloco => !blocosSelecionados.some(b => b.id === bloco.id))
=======
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
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6
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
<<<<<<< HEAD
    setBlocosSelecionados(blocosSelecionados.filter((b) => b.id !== blocoId));
  };

  const handleReordenarBlocos = (novosBlocos: Bloco[]) => {
    setBlocosSelecionados(novosBlocos);
  };

  const handleAtualizarBlocos = (novosBlocos: Bloco[]) => {
    setBlocosSelecionados(novosBlocos);
  };

  const adicionarDica = (blocoIndex: number, musicaIndex: number) => {
    if (dicaAtual.trim()) {
      const novosBlocos = [...blocosSelecionados];
      if (!novosBlocos[blocoIndex].musicas[musicaIndex].dicas) {
        novosBlocos[blocoIndex].musicas[musicaIndex].dicas = [];
      }
      novosBlocos[blocoIndex].musicas[musicaIndex].dicas?.push(dicaAtual.trim());
      setBlocosSelecionados(novosBlocos);
      setDicaAtual('');
      setMusicaEditandoIndex(null);
    }
  };

  const removerDica = (blocoIndex: number, musicaIndex: number, dicaIndex: number) => {
    const novosBlocos = [...blocosSelecionados];
    novosBlocos[blocoIndex].musicas[musicaIndex].dicas?.splice(dicaIndex, 1);
    setBlocosSelecionados(novosBlocos);
=======
    setBlocosSelecionados(blocosSelecionados.filter(id => id !== blocoId));
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6
  };

  const handleDuplicarBloco = (bloco: Bloco) => {
    const novoBloco = {
      ...bloco,
      id: String(Date.now()),
      nome: `${bloco.nome} (Cópia)`,
    };
    
    const index = blocosSelecionados.findIndex(b => b.id === bloco.id);
    const novosBlocos = [...blocosSelecionados];
    novosBlocos.splice(index + 1, 0, novoBloco);
    setBlocosSelecionados(novosBlocos);
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
<<<<<<< HEAD
        <label htmlFor="bandaId" className="block text-sm font-medium text-gray-700">
          Banda
        </label>
        <select
          id="bandaId"
          {...register('bandaId')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Selecione uma banda</option>
          {bandasDisponiveis.map((banda) => (
            <option key={banda.id} value={banda.id}>
              {banda.nome}
            </option>
          ))}
        </select>
        {errors.bandaId && (
          <p className="mt-1 text-sm text-red-600">{errors.bandaId.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700">
          Observações
=======
        <label htmlFor="bandaId" className="block text-sm font-medium text-gray-900">
          Banda
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6
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
<<<<<<< HEAD
            onClick={() => setIsModalBlocosOpen(true)}
            disabled={!bandaIdSelecionada}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
=======
            onClick={() => setModalBlocosAberto(true)}
            disabled={!bandaIdSelecionada}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Bloco
          </button>
        </div>

<<<<<<< HEAD
        {/* Lista de blocos selecionados com ordenação */}
        <BlocosOrdenados
          blocos={blocosSelecionados}
          onRemoverBloco={handleRemoverBloco}
          onReordenarBlocos={handleReordenarBlocos}
          onDuplicarBloco={handleDuplicarBloco}
          onAtualizarBlocos={handleAtualizarBlocos}
        />
      </div>

      {/* Modal de Seleção de Blocos */}
      <Modal
        isOpen={isModalBlocosOpen}
        onClose={() => setIsModalBlocosOpen(false)}
        title="Adicionar Blocos"
      >
        <div className="space-y-4">
          <div className="bg-white">
            {isLoadingBlocos ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : errorBlocos ? (
              <div className="text-center p-8">
                <p className="text-red-600">{errorBlocos}</p>
              </div>
            ) : (
              <>
                <ul className="divide-y divide-gray-200">
                  {blocosFiltrados.map((bloco) => (
                    <li
                      key={bloco.id}
                      className="py-4 flex items-center justify-between hover:bg-gray-50 px-4 cursor-pointer"
                      onClick={() => {
                        handleAdicionarBloco(bloco.id);
                      }}
                    >
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{bloco.nome}</h4>
                        <p className="text-sm text-gray-500">
                          {bloco.musicas.length} músicas • {bloco.descricao}
                        </p>
                      </div>
                      <PlusIcon className="h-5 w-5 text-indigo-600" />
                    </li>
                  ))}
                </ul>
                {blocosFiltrados.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-8">
                    Não há blocos disponíveis para esta banda.
                  </p>
                )}
              </>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsModalBlocosOpen(false)}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Fechar
            </button>
          </div>
        </div>
      </Modal>
=======
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
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6

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