'use client';

import { useState, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Integrante, Banda } from '@/lib/types';
import { useHydratedLocalStorage } from '@/hooks/useHydratedLocalStorage';
import { ClientOnly } from '../blocos/components/ClientOnly';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  UserGroupIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { IntegranteForm } from './components/IntegranteForm';
import { bandasSeed } from '@/lib/seeds/bandas';

export default function IntegrantesPage() {
  const [integrantes, setIntegrantes] = useHydratedLocalStorage<Integrante[]>('integrantes', []);
  const [bandas] = useState<Banda[]>(bandasSeed);
  const [modalAberto, setModalAberto] = useState(false);
  const [integranteEmEdicao, setIntegranteEmEdicao] = useState<Integrante | undefined>();
  const [busca, setBusca] = useState('');

  // Filtra integrantes baseado na busca
  const integrantesFiltrados = useMemo(() => {
    return integrantes.filter(
      (integrante) =>
        integrante.nome.toLowerCase().includes(busca.toLowerCase()) ||
        integrante.funcao.toLowerCase().includes(busca.toLowerCase())
    );
  }, [integrantes, busca]);

  const handleAdicionarIntegrante = () => {
    setIntegranteEmEdicao(undefined);
    setModalAberto(true);
  };

  const handleEditarIntegrante = (integrante: Integrante) => {
    setIntegranteEmEdicao(integrante);
    setModalAberto(true);
  };

  const handleExcluirIntegrante = (integranteId: string) => {
    const integrante = integrantes.find(i => i.id === integranteId);
    if (integrante && confirm(`Tem certeza que deseja excluir o integrante "${integrante.nome}"?`)) {
      setIntegrantes(integrantes.filter((i) => i.id !== integranteId));
    }
  };

  const handleSubmit = (data: Partial<Integrante>) => {
    if (integranteEmEdicao) {
      setIntegrantes(
        integrantes.map((i) =>
          i.id === integranteEmEdicao.id
            ? { ...i, ...data }
            : i
        )
      );
    } else {
      const novoIntegrante: Integrante = {
        id: Math.random().toString(36).substr(2, 9),
        nome: data.nome || '',
        funcao: data.funcao || '',
        telefone: data.telefone,
        email: data.email,
        observacoes: data.observacoes,
        bandasIds: data.bandasIds || [],
      };
      setIntegrantes([...integrantes, novoIntegrante]);
    }
    setModalAberto(false);
    setIntegranteEmEdicao(undefined);
  };

  // Função para obter os nomes das bandas a partir dos IDs
  const getNomesBandas = (bandasIds: string[]) => {
    return bandasIds
      .map(id => bandas.find(banda => banda.id === id)?.nome)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <ClientOnly>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Integrantes</h1>
          <button
            onClick={handleAdicionarIntegrante}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Integrante
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome ou função..."
              className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {integrantesFiltrados.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {integrantesFiltrados.map((integrante) => (
                <li key={integrante.id}>
                  <div className="px-4 py-4 flex items-center sm:px-6">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <div className="flex text-sm">
                          <p className="font-medium text-indigo-600 truncate">{integrante.nome}</p>
                          <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                            - {integrante.funcao}
                          </p>
                        </div>
                        <div className="mt-2 flex">
                          {integrante.bandasIds && integrante.bandasIds.length > 0 ? (
                            <div className="flex items-center text-sm text-gray-500">
                              <UserGroupIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              <p>Bandas: {getNomesBandas(integrante.bandasIds)}</p>
                            </div>
                          ) : (
                            <div className="flex items-center text-sm text-gray-500">
                              <UserGroupIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              <p>Não participa de nenhuma banda</p>
                            </div>
                          )}
                        </div>
                        {integrante.telefone && (
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <p>Telefone: {integrante.telefone}</p>
                          </div>
                        )}
                        {integrante.email && (
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <p>Email: {integrante.email}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="ml-5 flex-shrink-0 flex space-x-2">
                      <button
                        onClick={() => handleEditarIntegrante(integrante)}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-full p-2 transition-colors duration-200"
                        title="Editar integrante"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleExcluirIntegrante(integrante.id)}
                        className="inline-flex items-center text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-full p-2 transition-colors duration-200"
                        title="Excluir integrante"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12 bg-white shadow overflow-hidden sm:rounded-md">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum integrante encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {busca ? 'Tente uma busca diferente ou ' : 'Comece a '}
              adicionar integrantes à sua equipe.
            </p>
            <div className="mt-6">
              <button
                onClick={handleAdicionarIntegrante}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Novo Integrante
              </button>
            </div>
          </div>
        )}

        <Modal
          title={integranteEmEdicao ? 'Editar Integrante' : 'Novo Integrante'}
          isOpen={modalAberto}
          onClose={() => setModalAberto(false)}
        >
          <IntegranteForm
            integrante={integranteEmEdicao}
            bandas={bandas}
            onSubmit={handleSubmit}
          />
        </Modal>
      </div>
    </ClientOnly>
  );
} 