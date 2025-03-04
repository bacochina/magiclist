'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BlocosOrdenados } from './BlocosOrdenados';
import { PlusIcon } from '@heroicons/react/24/outline';

const repertorioSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório'),
  data: z.string().min(1, 'A data é obrigatória'),
  observacoes: z.string().optional(),
});

type RepertorioFormData = z.infer<typeof repertorioSchema>;

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
  blocosDisponiveis: Bloco[];
  initialData?: RepertorioFormData & { blocos: Bloco[] };
}

export function RepertorioForm({ onSubmit, onCancel, blocosDisponiveis, initialData }: RepertorioFormProps) {
  const [blocosSelecionados, setBlocosSelecionados] = useState<Bloco[]>(
    initialData?.blocos || []
  );
  const [isAdicionandoBloco, setIsAdicionandoBloco] = useState(false);
  const [dicaAtual, setDicaAtual] = useState('');
  const [musicaEditandoIndex, setMusicaEditandoIndex] = useState<{ blocoIndex: number; musicaIndex: number } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RepertorioFormData>({
    resolver: zodResolver(repertorioSchema),
    defaultValues: initialData,
  });

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
    setIsAdicionandoBloco(false);
  };

  const handleRemoverBloco = (blocoId: string) => {
    setBlocosSelecionados(blocosSelecionados.filter((b) => b.id !== blocoId));
  };

  const handleReordenarBlocos = (novosBlocos: Bloco[]) => {
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
            onClick={() => setIsAdicionandoBloco(!isAdicionandoBloco)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Adicionar Bloco
          </button>
        </div>

        {/* Lista de blocos disponíveis */}
        {isAdicionandoBloco && (
          <div className="mt-2 bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Blocos Disponíveis</h4>
            <ul className="divide-y divide-gray-200">
              {blocosDisponiveis
                .filter((bloco) => !blocosSelecionados.some((b) => b.id === bloco.id))
                .map((bloco) => (
                  <li
                    key={bloco.id}
                    className="py-2 flex items-center justify-between hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleAdicionarBloco(bloco.id)}
                  >
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">{bloco.nome}</h5>
                      <p className="text-sm text-gray-500">
                        {bloco.musicas.length} músicas
                      </p>
                    </div>
                    <PlusIcon className="h-5 w-5 text-indigo-600" />
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Lista de blocos selecionados com ordenação */}
        <BlocosOrdenados
          blocos={blocosSelecionados}
          onRemoverBloco={handleRemoverBloco}
          onReordenarBlocos={handleReordenarBlocos}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Blocos Selecionados</h3>
        {blocosSelecionados.map((bloco, blocoIndex) => (
          <div key={bloco.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{bloco.nome}</h4>
              <button
                type="button"
                onClick={() => handleRemoverBloco(bloco.id)}
                className="text-red-600 hover:text-red-800"
              >
                Remover
              </button>
            </div>

            {/* Lista de Músicas com Dicas */}
            <div className="space-y-4">
              {bloco.musicas.map((musica, musicaIndex) => (
                <div key={musica.id} className="pl-4 border-l-2 border-gray-200">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">{musica.nome}</h5>
                  </div>

                  {/* Lista de Dicas da Música */}
                  <div className="mt-2">
                    <ul className="space-y-2">
                      {musica.dicas?.map((dica, dicaIndex) => (
                        <li key={dicaIndex} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span>{dica}</span>
                          <button
                            type="button"
                            onClick={() => removerDica(blocoIndex, musicaIndex, dicaIndex)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remover
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Adicionar Nova Dica para a Música */}
                  {musicaEditandoIndex?.blocoIndex === blocoIndex && 
                   musicaEditandoIndex?.musicaIndex === musicaIndex ? (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={dicaAtual}
                        onChange={(e) => setDicaAtual(e.target.value)}
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Digite a dica"
                      />
                      <button
                        type="button"
                        onClick={() => adicionarDica(blocoIndex, musicaIndex)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Adicionar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMusicaEditandoIndex(null);
                          setDicaAtual('');
                        }}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setMusicaEditandoIndex({ blocoIndex, musicaIndex })}
                      className="text-indigo-600 hover:text-indigo-800 text-sm mt-2"
                    >
                      + Adicionar Dica
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

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