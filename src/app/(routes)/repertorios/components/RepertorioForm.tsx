'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BlocosOrdenados } from './BlocosOrdenados';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Modal } from '@/components/ui/Modal';

const repertorioSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório'),
  data: z.string().min(1, 'A data é obrigatória'),
  bandaId: z.string().min(1, 'A banda é obrigatória'),
  observacoes: z.string().optional(),
});

type RepertorioFormData = z.infer<typeof repertorioSchema>;

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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RepertorioFormData>({
    resolver: zodResolver(repertorioSchema),
    defaultValues: initialData,
  });

  const bandaIdSelecionada = watch('bandaId');

  useEffect(() => {
    const fetchBlocosDaBanda = async () => {
      if (!bandaIdSelecionada) {
        setBlocosDisponiveis([]);
        return;
      }

      setIsLoadingBlocos(true);
      setErrorBlocos(null);

      try {
        const response = await fetch(`/api/bandas/${bandaIdSelecionada}/blocos`);
        if (!response.ok) {
          throw new Error('Erro ao carregar blocos');
        }
        const data = await response.json();
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
    : [];

  const onFormSubmit = (data: RepertorioFormData) => {
    onSubmit({
      ...data,
      blocos: blocosSelecionados,
    });
  };

  const handleAdicionarBloco = (blocoId: string) => {
    const bloco = blocosDisponiveis.find((b) => b.id === blocoId);
    if (bloco && !blocosSelecionados.some((b) => b.id === blocoId)) {
      const novoBloco = {
        ...bloco,
        musicas: bloco.musicas.map(musica => ({ ...musica, dicas: [] }))
      };
      setBlocosSelecionados([...blocosSelecionados, novoBloco]);
    }
  };

  const handleRemoverBloco = (blocoId: string) => {
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
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
          Nome do Repertório
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
        <label htmlFor="data" className="block text-sm font-medium text-gray-700">
          Data do Evento
        </label>
        <input
          type="date"
          id="data"
          {...register('data')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.data && (
          <p className="mt-1 text-sm text-red-600">{errors.data.message}</p>
        )}
      </div>

      <div>
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

      {/* Seleção de Blocos */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Blocos</h3>
          <button
            type="button"
            onClick={() => setIsModalBlocosOpen(true)}
            disabled={!bandaIdSelecionada}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Adicionar Bloco
          </button>
        </div>

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

      {/* Botões */}
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
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
} 