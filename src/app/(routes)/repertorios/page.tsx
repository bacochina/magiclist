'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { RepertorioForm } from './components/RepertorioForm';
import { RepertorioPDF } from './components/RepertorioPDF';
import { CalendarIcon, DocumentArrowDownIcon, QueueListIcon } from '@heroicons/react/24/outline';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Remover dados de exemplo - músicas, blocos e repertórios
interface Banda {
  id: string;
  nome: string;
}

interface Musica {
  id: string;
  nome: string;
  artista: string;
  tom: string;
  bpm: string;
}

interface Bloco {
  id: string;
  nome: string;
  descricao: string;
  musicas: Musica[];
}

interface Repertorio {
  id: string;
  nome: string;
  data: string;
  bandaId: string;
  observacoes: string;
  blocos: Bloco[];
}

export default function RepertoriosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [repertorios, setRepertorios] = useState<Repertorio[]>([]);
  const [repertorioSelecionado, setRepertorioSelecionado] = useState<Repertorio | undefined>();
  const [isEditando, setIsEditando] = useState(false);
  const [repertorioParaExcluir, setRepertorioParaExcluir] = useState<string | null>(null);
  const [bandas, setBandas] = useState<Banda[]>([]);
  const [isLoadingBandas, setIsLoadingBandas] = useState(true);
  const [errorBandas, setErrorBandas] = useState<string | null>(null);

  useEffect(() => {
    const fetchBandas = async () => {
      try {
        const response = await fetch('/api/bandas');
        if (!response.ok) {
          throw new Error('Erro ao carregar bandas');
        }
        const data = await response.json();
        setBandas(data.bandas);
      } catch (error) {
        console.error('Erro ao carregar bandas:', error);
        setErrorBandas('Não foi possível carregar as bandas. Por favor, tente novamente mais tarde.');
      } finally {
        setIsLoadingBandas(false);
      }
    };

    fetchBandas();
  }, []);

  // Carregar repertórios
  useEffect(() => {
    const fetchRepertorios = async () => {
      try {
        const response = await fetch('/api/repertorios');
        if (!response.ok) {
          throw new Error('Erro ao carregar repertórios');
        }
        const data = await response.json();
        setRepertorios(data);
      } catch (error) {
        console.error('Erro ao carregar repertórios:', error);
      }
    };

    fetchRepertorios();
  }, []);

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(repertorios);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setRepertorios(items);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (isEditando && repertorioSelecionado) {
        // Atualizar repertório existente
        const response = await fetch('/api/repertorios', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...repertorioSelecionado,
            ...data,
          }),
        });

        if (!response.ok) {
          throw new Error('Erro ao atualizar repertório');
        }

        const repertorioAtualizado = await response.json();
        setRepertorios(repertorios.map(repertorio => 
          repertorio.id === repertorioAtualizado.id 
            ? repertorioAtualizado
            : repertorio
        ));
      } else {
        // Adicionar novo repertório
        const response = await fetch('/api/repertorios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Erro ao criar repertório');
        }

        const novoRepertorio = await response.json();
        setRepertorios([...repertorios, novoRepertorio]);
      }

      setIsModalOpen(false);
      setIsEditando(false);
      setRepertorioSelecionado(undefined);
    } catch (error) {
      console.error('Erro ao salvar repertório:', error);
      // Aqui você pode adicionar uma notificação de erro para o usuário
    }
  };

  const handleEditar = (repertorio: Repertorio) => {
    setRepertorioSelecionado(repertorio);
    setIsEditando(true);
    setIsModalOpen(true);
  };

  const handleExcluir = async (repertorioId: string) => {
    try {
      const response = await fetch(`/api/repertorios?id=${repertorioId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir repertório');
      }

      setRepertorios(repertorios.filter(repertorio => repertorio.id !== repertorioId));
      setRepertorioParaExcluir(null);
    } catch (error) {
      console.error('Erro ao excluir repertório:', error);
      // Aqui você pode adicionar uma notificação de erro para o usuário
    }
  };

  const handleGerarPDF = (repertorio: Repertorio) => {
    setRepertorioSelecionado(repertorio);
    setIsPDFModalOpen(true);
  };

  const handleDuplicar = async (repertorio: Repertorio) => {
    try {
      const { id, ...novoRepertorio } = {
        ...repertorio,
        nome: `${repertorio.nome} (Cópia)`,
      };

      const response = await fetch('/api/repertorios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoRepertorio),
      });

      if (!response.ok) {
        throw new Error('Erro ao duplicar repertório');
      }

      const repertorioDuplicado = await response.json();
      setRepertorios([...repertorios, repertorioDuplicado]);
    } catch (error) {
      console.error('Erro ao duplicar repertório:', error);
      // Aqui você pode adicionar uma notificação de erro para o usuário
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const calcularDuracaoTotal = (blocos: Bloco[]) => {
    const totalMinutos = blocos.reduce((acc: number, bloco: Bloco) => acc + (bloco.musicas.length * 4), 0);
    if (totalMinutos < 60) {
      return `${totalMinutos} minutos`;
    }
    const horas = Math.floor(totalMinutos / 60);
    const minutosRestantes = totalMinutos % 60;
    return `${horas}h${minutosRestantes > 0 ? ` ${minutosRestantes}min` : ''}`;
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Meus Repertórios</h1>
          <button
            onClick={() => {
              setIsEditando(false);
              setRepertorioSelecionado(undefined);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Novo Repertório
          </button>
        </div>

        {/* Lista de Repertórios */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="repertorios">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="bg-white shadow overflow-hidden sm:rounded-lg"
              >
                <ul className="divide-y divide-gray-200">
                  {repertorios.map((repertorio, index) => (
                    <Draggable key={repertorio.id} draggableId={repertorio.id} index={index}>
                      {(provided, snapshot) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`px-6 py-4 ${snapshot.isDragging ? 'bg-gray-50 shadow-lg ring-2 ring-indigo-500' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab hover:text-indigo-500"
                              >
                                <QueueListIcon className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">{repertorio.nome}</h3>
                                <p className="text-sm text-gray-500">
                                  {formatarData(repertorio.data)} • {repertorio.blocos.length} blocos • {calcularDuracaoTotal(repertorio.blocos)}
                                </p>
                                {repertorio.observacoes && (
                                  <p className="mt-1 text-sm text-gray-600">{repertorio.observacoes}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-4">
                              <button
                                onClick={() => handleGerarPDF(repertorio)}
                                className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
                              >
                                <DocumentArrowDownIcon className="h-5 w-5 mr-1" />
                                PDF
                              </button>
                              <button
                                onClick={() => handleDuplicar(repertorio)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Duplicar
                              </button>
                              <button
                                onClick={() => handleEditar(repertorio)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => setRepertorioParaExcluir(repertorio.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Excluir
                              </button>
                            </div>
                          </div>

                          {/* Lista de blocos do repertório */}
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Blocos:</h4>
                            <ul className="space-y-2">
                              {repertorio.blocos.map((bloco, index) => (
                                <li key={bloco.id} className="text-sm text-gray-600">
                                  {index + 1}. {bloco.nome} ({bloco.musicas.length} músicas)
                                </li>
                              ))}
                            </ul>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Mensagem quando não há repertórios */}
        {repertorios.length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum repertório cadastrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Crie seu primeiro repertório para organizar suas apresentações.
            </p>
          </div>
        )}
      </div>

      {/* Modal de Criação/Edição */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditando(false);
          setRepertorioSelecionado(undefined);
        }}
        title={isEditando ? 'Editar Repertório' : 'Novo Repertório'}
      >
        {isLoadingBandas ? (
          <div className="flex justify-center items-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : errorBandas ? (
          <div className="text-center p-4">
            <p className="text-red-600">{errorBandas}</p>
          </div>
        ) : (
          <RepertorioForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsModalOpen(false);
              setIsEditando(false);
              setRepertorioSelecionado(undefined);
            }}
            bandasDisponiveis={bandas}
            initialData={repertorioSelecionado}
          />
        )}
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={!!repertorioParaExcluir}
        onClose={() => setRepertorioParaExcluir(null)}
        title="Confirmar Exclusão"
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Tem certeza que deseja excluir este repertório? Esta ação não pode ser desfeita.
          </p>
        </div>

        <div className="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            onClick={() => setRepertorioParaExcluir(null)}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
            onClick={() => repertorioParaExcluir && handleExcluir(repertorioParaExcluir)}
          >
            Excluir
          </button>
        </div>
      </Modal>

      {/* Modal do PDF */}
      <Modal
        isOpen={isPDFModalOpen}
        onClose={() => {
          setIsPDFModalOpen(false);
          setRepertorioSelecionado(undefined);
        }}
        title="Visualizar Repertório"
        size="full"
      >
        {repertorioSelecionado && (
          <div className="h-[calc(100vh-200px)]">
            {repertorioSelecionado.blocos?.length > 0 ? (
              <RepertorioPDF
                nomeBanda={repertorioSelecionado.bandaId === '1' ? 'Metallica' : 'Iron Maiden'}
                nomeRepertorio={repertorioSelecionado.nome}
                data={repertorioSelecionado.data}
                blocos={repertorioSelecionado.blocos}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-center">
                  <p className="text-gray-500">Este repertório não possui blocos</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
} 