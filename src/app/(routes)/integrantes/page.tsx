'use client';

import { useState, useMemo, useEffect } from 'react';
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
  UserIcon,
  ViewColumnsIcon,
  TableCellsIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { IntegranteForm } from './components/IntegranteForm';
import { bandasSeed } from '@/lib/seeds/bandas';
import { integrantesSeed } from '@/lib/seeds/integrantes';
import { confirmar, alertaSucesso, alertaErro } from '@/lib/sweetalert';

export default function IntegrantesPage() {
  const [integrantes, setIntegrantes] = useHydratedLocalStorage<Integrante[]>('integrantes', []);
  const [bandas] = useState<Banda[]>(bandasSeed);
  const [modalAberto, setModalAberto] = useState(false);
  const [integranteEmEdicao, setIntegranteEmEdicao] = useState<Integrante | undefined>();
  const [busca, setBusca] = useState('');
  // Modo de visualização
  const [modoVisualizacao, setModoVisualizacao] = useState<'cartoes' | 'lista'>('lista');

  // Efeito para verificar se há integrantes e popular com dados de exemplo se necessário
  useEffect(() => {
    if (integrantes.length === 0) {
      popularIntegrantesExemplo();
    }
  }, [integrantes.length]);

  // Função para popular com integrantes de exemplo
  const popularIntegrantesExemplo = () => {
    // Verificar se já existem integrantes no localStorage
    const integrantesExistentes = localStorage.getItem('integrantes');
    if (!integrantesExistentes || JSON.parse(integrantesExistentes).length === 0) {
      // Salvar os integrantes de exemplo no localStorage
      localStorage.setItem('integrantes', JSON.stringify(integrantesSeed));
      // Atualizar o estado
      setIntegrantes(integrantesSeed);
      console.log('Integrantes de exemplo populados com sucesso!');
    }
  };

  // Filtra integrantes baseado na busca
  const integrantesFiltrados = useMemo(() => {
    return integrantes.filter(
      (integrante) =>
        integrante.nome.toLowerCase().includes(busca.toLowerCase()) ||
        integrante.funcao.toLowerCase().includes(busca.toLowerCase()) ||
        (integrante.email && integrante.email.toLowerCase().includes(busca.toLowerCase())) ||
        (integrante.telefone && integrante.telefone.toLowerCase().includes(busca.toLowerCase())) ||
        (integrante.observacoes && integrante.observacoes.toLowerCase().includes(busca.toLowerCase()))
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

  const handleExcluirIntegrante = async (integranteId: string) => {
    const integrante = integrantes.find(i => i.id === integranteId);
    
    if (!integrante) return;
    
    const confirmado = await confirmar(
      'Excluir integrante',
      `Tem certeza que deseja excluir o integrante "${integrante.nome}"?`,
      'warning'
    );
    
    if (confirmado) {
      try {
        setIntegrantes(integrantes.filter((i) => i.id !== integranteId));
        alertaSucesso('Integrante excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir integrante:', error);
        alertaErro('Erro ao excluir o integrante');
      }
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
    if (!Array.isArray(bandas)) return '';
    return bandasIds
      .map(id => bandas.find(banda => banda.id === id)?.nome)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className="min-h-screen relative">
      {/* Background específico para integrantes */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-red-900"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Conteúdo da página */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white mb-6 flex items-center">
                <UserIcon className="h-8 w-8 mr-2" />
                Integrantes
              </h1>
            </div>

            <div className="px-4 py-6 sm:px-0">
              <div className="bg-gray-800/90 backdrop-blur-lg rounded-lg p-6 shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <UserGroupIcon className="h-6 w-6 mr-2 text-purple-400" />
                    <span className="text-xl font-semibold text-gray-100">Meus Integrantes</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Campo de busca */}
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar integrantes..."
                        className="bg-gray-700/50 border border-gray-600 text-white rounded-md pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    {/* Botões de visualização */}
                    <div className="flex items-center">
                      <button
                        onClick={() => setModoVisualizacao('lista')}
                        className={`p-2 rounded-l-md ${
                          modoVisualizacao === 'lista'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        title="Visualização em lista"
                      >
                        <TableCellsIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setModoVisualizacao('cartoes')}
                        className={`p-2 rounded-r-md ${
                          modoVisualizacao === 'cartoes'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        title="Visualização em cartões"
                      >
                        <ViewColumnsIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <button
                      onClick={handleAdicionarIntegrante}
                      className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm"
                    >
                      <PlusIcon className="h-5 w-5 mr-1" />
                      Novo Integrante
                    </button>
          </div>
        </div>

        {integrantesFiltrados.length > 0 ? (
                  modoVisualizacao === 'lista' ? (
                    <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md border border-gray-700">
                      <ul className="divide-y divide-gray-700">
              {integrantesFiltrados.map((integrante) => (
                          <li key={integrante.id} className="hover:bg-gray-700">
                  <div className="px-4 py-4 flex items-center sm:px-6">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <div className="flex text-sm">
                                    <p className="font-medium text-purple-400 truncate">{integrante.nome}</p>
                                    <p className="ml-1 flex-shrink-0 font-normal text-gray-400">
                            - {integrante.funcao}
                          </p>
                        </div>
                        <div className="mt-2 flex">
                          {integrante.bandasIds && integrante.bandasIds.length > 0 ? (
                                      <div className="flex items-center text-sm text-gray-300">
                              <UserGroupIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              <p>Bandas: {getNomesBandas(integrante.bandasIds)}</p>
                            </div>
                          ) : (
                                      <div className="flex items-center text-sm text-gray-300">
                              <UserGroupIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              <p>Não participa de nenhuma banda</p>
                            </div>
                          )}
                        </div>
                        {integrante.telefone && (
                                    <div className="mt-2 flex items-center text-sm text-gray-300">
                            <p>Telefone: {integrante.telefone}</p>
                          </div>
                        )}
                        {integrante.email && (
                                    <div className="mt-2 flex items-center text-sm text-gray-300">
                            <p>Email: {integrante.email}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="ml-5 flex-shrink-0 flex space-x-2">
                      <button
                        onClick={() => handleEditarIntegrante(integrante)}
                                  className="inline-flex items-center text-purple-400 hover:text-purple-300 bg-purple-900/50 hover:bg-purple-800/50 rounded-full p-2 transition-colors duration-200"
                        title="Editar integrante"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleExcluirIntegrante(integrante.id)}
                                  className="inline-flex items-center text-red-400 hover:text-red-300 bg-red-900/50 hover:bg-red-800/50 rounded-full p-2 transition-colors duration-200"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {integrantesFiltrados.map((integrante) => (
                        <div 
                          key={integrante.id} 
                          className="bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden rounded-lg border border-gray-700"
                        >
                          <div className="px-4 py-3 sm:px-6 flex justify-between items-start bg-purple-900">
                            <div className="flex items-center">
                              <UserIcon className="h-5 w-5 text-purple-300" />
                              <h3 className="ml-2 text-lg leading-6 font-medium text-white truncate max-w-[200px]">{integrante.nome}</h3>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-800 text-purple-200">
                              {integrante.funcao}
                            </span>
                          </div>
                          <div className="border-t border-gray-700 px-4 py-5 sm:p-6">
                            <div className="space-y-3">
                              <div className="flex items-center text-sm">
                                <UserGroupIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                <p className="text-gray-200">
                                  {integrante.bandasIds && integrante.bandasIds.length > 0 
                                    ? `Bandas: ${getNomesBandas(integrante.bandasIds)}`
                                    : 'Não participa de nenhuma banda'
                                  }
                                </p>
                              </div>
                              
                              {integrante.telefone && (
                                <div className="flex items-center text-sm">
                                  <PhoneIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                  <p className="text-gray-200">{integrante.telefone}</p>
                                </div>
                              )}
                              
                              {integrante.email && (
                                <div className="flex items-center text-sm">
                                  <EnvelopeIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                  <p className="text-gray-200 truncate max-w-[250px]">{integrante.email}</p>
                                </div>
                              )}
                              
                              {integrante.observacoes && (
                                <div className="mt-2 text-sm text-gray-300 border-t border-gray-700 pt-2">
                                  <p className="font-medium mb-1">Observações:</p>
                                  <p>{integrante.observacoes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="border-t border-gray-700 px-4 py-4 sm:px-6 flex justify-end items-center bg-gray-900">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditarIntegrante(integrante)}
                                className="inline-flex items-center px-2 py-1 border border-gray-700 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-200 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                                title="Editar integrante"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleExcluirIntegrante(integrante.id)}
                                className="inline-flex items-center px-2 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-200 bg-red-900 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                title="Excluir integrante"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12 bg-gray-800 shadow overflow-hidden sm:rounded-md border border-gray-700">
                    <UserIcon className="mx-auto h-12 w-12 text-gray-500" />
                    <h3 className="mt-2 text-sm font-medium text-gray-200">Nenhum integrante encontrado</h3>
                    <p className="mt-1 text-sm text-gray-400">
              {busca ? 'Tente uma busca diferente ou ' : 'Comece a '}
              adicionar integrantes à sua equipe.
            </p>
            <div className="mt-6">
              <button
                onClick={handleAdicionarIntegrante}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Novo Integrante
              </button>
            </div>
          </div>
        )}
              </div>
            </div>

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
        </div>
      </div>
    </div>
  );
} 