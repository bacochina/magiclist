'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
<<<<<<< HEAD
import { Pedaleira } from '@/lib/types';

=======
import { confirmar, alertaSucesso, alertaErro } from '@/lib/sweetalert';

interface Pedaleira {
  id: string;
  nome: string;
  marca: string;
  modelo: string;
  descricao?: string;
  usaLetras: boolean;
  qtdeBancos: number;
  qtdePresetsporBanco: number;
  bancos?: any[];
}

>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6
const pedaleiraSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, 'O nome é obrigatório'),
  marca: z.string().min(1, 'A marca é obrigatória'),
<<<<<<< HEAD
=======
  modelo: z.string().min(1, 'O modelo é obrigatório'),
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6
  usaLetras: z.boolean().default(false),
  qtdeBancos: z.number().min(1, 'A quantidade de bancos deve ser maior que 0').max(99, 'A quantidade máxima de bancos é 99'),
  qtdePresetsporBanco: z.number().min(1, 'A quantidade de presets por banco deve ser maior que 0').max(9, 'A quantidade máxima de presets por banco é 9'),
});

type PedaleiraFormData = z.infer<typeof pedaleiraSchema>;

const mockPedaleiras: Pedaleira[] = [
  {
    id: '1',
    nome: 'Pedaleira 1',
    marca: 'Boss',
<<<<<<< HEAD
=======
    modelo: 'GT-1000',
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6
    usaLetras: true,
    qtdeBancos: 4,
    qtdePresetsporBanco: 5,
    bancos: []
  }
];

export default function PedaleirasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pedaleiraEditando, setPedaleiraEditando] = useState<Pedaleira | null>(null);
  const [pedaleiras, setPedaleiras] = useState<Pedaleira[]>(mockPedaleiras);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<PedaleiraFormData>({
    resolver: zodResolver(pedaleiraSchema),
    defaultValues: pedaleiraEditando || {
      nome: '',
      marca: '',
<<<<<<< HEAD
=======
      modelo: '',
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6
      usaLetras: false,
      qtdeBancos: 1,
      qtdePresetsporBanco: 5
    }
  });

  const onSubmit = (data: PedaleiraFormData) => {
    const novaPedaleira = {
      ...data,
      id: pedaleiraEditando?.id || (pedaleiras.length + 1).toString(),
      bancos: pedaleiraEditando?.bancos || []
    };

    if (pedaleiraEditando) {
      setPedaleiras(pedaleiras.map(p => 
        p.id === pedaleiraEditando.id ? novaPedaleira : p
      ));
    } else {
      setPedaleiras([...pedaleiras, novaPedaleira]);
    }
    setPedaleiraEditando(null);
    setIsModalOpen(false);
    reset();
  };

  const handleEditar = (pedaleira: Pedaleira) => {
    setPedaleiraEditando(pedaleira);
    setIsModalOpen(true);
    reset(pedaleira);
  };

  const handleExcluirPedaleira = async (id: string) => {
    const confirmado = await confirmar(
      'Excluir pedaleira',
      'Tem certeza que deseja excluir esta pedaleira?',
      'warning'
    );
    
    if (confirmado) {
      try {
        setPedaleiras(pedaleiras.filter(p => p.id !== id));
        alertaSucesso('Pedaleira excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir pedaleira:', error);
        alertaErro('Erro ao excluir a pedaleira');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Minhas Pedaleiras</h1>
          <div className="flex items-center space-x-4">
            <a
              href="/pedaleiras/presets"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Configurar Presets
            </a>
            <button
              onClick={() => {
                setPedaleiraEditando(null);
                setIsModalOpen(true);
                reset();
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Nova Pedaleira
            </button>
          </div>
        </div>

        {pedaleiras.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pedaleiras.map((pedaleira) => (
              <div
                key={pedaleira.id}
                className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">{pedaleira.nome}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Marca: {pedaleira.marca}
                  </p>
                  <p className="text-sm text-gray-500">
                    {pedaleira.qtdeBancos} banco(s) • {pedaleira.qtdePresetsporBanco} presets por banco
                  </p>
                  <p className="text-sm text-gray-500">
                    Usa {pedaleira.usaLetras ? 'letras' : 'números'} nos presets
                  </p>
                </div>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleEditar(pedaleira)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleExcluirPedaleira(pedaleira.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhuma pedaleira cadastrada
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece criando sua primeira pedaleira.
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPedaleiraEditando(null);
          reset();
        }}
        title={pedaleiraEditando ? 'Editar Pedaleira' : 'Nova Pedaleira'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            <label htmlFor="marca" className="block text-sm font-medium text-gray-700">
              Marca
            </label>
            <input
              type="text"
              id="marca"
              {...register('marca')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.marca && (
              <p className="mt-1 text-sm text-red-600">{errors.marca.message}</p>
            )}
          </div>

<<<<<<< HEAD
=======
          <div>
            <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">
              Modelo
            </label>
            <input
              type="text"
              id="modelo"
              {...register('modelo')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.modelo && (
              <p className="mt-1 text-sm text-red-600">{errors.modelo.message}</p>
            )}
          </div>

>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="qtdeBancos" className="block text-sm font-medium text-gray-700">
                Quantidade de Bancos
              </label>
              <input
                type="number"
                id="qtdeBancos"
                min="1"
                max="99"
                {...register('qtdeBancos', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              {errors.qtdeBancos && (
                <p className="mt-1 text-sm text-red-600">{errors.qtdeBancos.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="qtdePresetsporBanco" className="block text-sm font-medium text-gray-700">
                Presets por Banco
              </label>
              <input
                type="number"
                id="qtdePresetsporBanco"
                min="1"
                max="9"
                {...register('qtdePresetsporBanco', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              {errors.qtdePresetsporBanco && (
                <p className="mt-1 text-sm text-red-600">{errors.qtdePresetsporBanco.message}</p>
              )}
            </div>
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
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setPedaleiraEditando(null);
                reset();
              }}
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
      </Modal>
    </div>
  );
} 