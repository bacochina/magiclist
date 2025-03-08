'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface Banda {
  id: string;
  nome: string;
}

interface Musica {
  id: string;
  nome: string;
  artista: string;
  tom: string;
  banda: Banda;
}

interface EstudoMusica {
  id: string;
  musicaId: string;
  status: 'A Aprender' | 'Aprendendo' | 'Dominada';
  notas?: string;
  musica: Musica;
}

export default function KanbanBoard() {
  const [estudos, setEstudos] = useState<EstudoMusica[]>([]);
  const [musicas, setMusicas] = useState<Musica[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMusicaId, setSelectedMusicaId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<'A Aprender' | 'Aprendendo' | 'Dominada'>('A Aprender');
  const [notas, setNotas] = useState<string>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEstudo, setSelectedEstudo] = useState<EstudoMusica | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEstudoId, setSelectedEstudoId] = useState<string | null>(null);

  // Carregar estudos e músicas
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Carregar estudos
        const estudosResponse = await fetch('/api/estudo-musicas');
        if (!estudosResponse.ok) {
          throw new Error('Erro ao carregar estudos');
        }
        const estudosData = await estudosResponse.json();
        setEstudos(estudosData);

        // Carregar músicas
        const musicasResponse = await fetch('/api/musicas');
        if (!musicasResponse.ok) {
          throw new Error('Erro ao carregar músicas');
        }
        const musicasData = await musicasResponse.json();
        setMusicas(musicasData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar músicas que ainda não estão em estudo
  const musicasDisponiveis = musicas.filter(
    (musica) => !estudos.some((estudo) => estudo.musicaId === musica.id)
  );

  // Agrupar estudos por status
  const estudosPorStatus = {
    'A Aprender': estudos.filter((estudo) => estudo.status === 'A Aprender'),
    'Aprendendo': estudos.filter((estudo) => estudo.status === 'Aprendendo'),
    'Dominada': estudos.filter((estudo) => estudo.status === 'Dominada'),
  };

  // Função para lidar com o arrastar e soltar
  const handleDragEnd = async (result: any) => {
    const { source, destination, draggableId } = result;

    // Se não houver destino ou o destino for o mesmo que a origem, não fazer nada
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    // Encontrar o estudo que foi arrastado
    const estudo = estudos.find((e) => e.id === draggableId);
    if (!estudo) return;

    // Atualizar o status do estudo localmente
    const novoStatus = destination.droppableId as 'A Aprender' | 'Aprendendo' | 'Dominada';
    const novosEstudos = estudos.map((e) =>
      e.id === draggableId ? { ...e, status: novoStatus } : e
    );
    setEstudos(novosEstudos);

    // Atualizar o status no servidor
    try {
      const response = await fetch('/api/estudo-musicas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ id: draggableId, status: novoStatus }]),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status');
      }
    } catch (err) {
      // Reverter a mudança em caso de erro
      setEstudos(estudos);
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
    }
  };

  // Função para adicionar uma música ao estudo
  const handleAddEstudo = async () => {
    if (!selectedMusicaId) return;

    try {
      const response = await fetch('/api/estudo-musicas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          musicaId: selectedMusicaId,
          status: selectedStatus,
          notas,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar música ao estudo');
      }

      const novoEstudo = await response.json();
      setEstudos([...estudos, novoEstudo]);
      setIsModalOpen(false);
      setSelectedMusicaId('');
      setSelectedStatus('A Aprender');
      setNotas('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  // Função para editar um estudo
  const handleEditEstudo = async () => {
    if (!selectedEstudo) return;

    try {
      const response = await fetch(`/api/estudo-musicas/${selectedEstudo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: selectedStatus,
          notas,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao editar estudo');
      }

      const estudoAtualizado = await response.json();
      setEstudos(estudos.map((e) => (e.id === estudoAtualizado.id ? estudoAtualizado : e)));
      setIsEditModalOpen(false);
      setSelectedEstudo(null);
      setSelectedStatus('A Aprender');
      setNotas('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  // Função para excluir um estudo
  const handleDeleteEstudo = async () => {
    if (!selectedEstudoId) return;

    try {
      const response = await fetch(`/api/estudo-musicas/${selectedEstudoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir estudo');
      }

      setEstudos(estudos.filter((e) => e.id !== selectedEstudoId));
      setIsDeleteModalOpen(false);
      setSelectedEstudoId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  // Função para abrir o modal de edição
  const openEditModal = (estudo: EstudoMusica) => {
    setSelectedEstudo(estudo);
    setSelectedStatus(estudo.status);
    setNotas(estudo.notas || '');
    setIsEditModalOpen(true);
  };

  // Função para abrir o modal de exclusão
  const openDeleteModal = (estudoId: string) => {
    setSelectedEstudoId(estudoId);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Kanban de Estudo de Músicas</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Adicionar Música
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna "A Aprender" */}
          <div className="bg-gray-100 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">A Aprender</h2>
            <Droppable droppableId="A Aprender">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-[200px]"
                >
                  {estudosPorStatus['A Aprender'].map((estudo, index) => (
                    <Draggable key={estudo.id} draggableId={estudo.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white p-4 mb-3 rounded-md shadow ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{estudo.musica.nome}</h3>
                              <p className="text-sm text-gray-600">
                                {estudo.musica.artista} - Tom: {estudo.musica.tom}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Banda: {estudo.musica.banda.nome}
                              </p>
                              {estudo.notas && (
                                <p className="text-sm mt-2 bg-yellow-50 p-2 rounded">
                                  {estudo.notas}
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openEditModal(estudo)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(estudo.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Coluna "Aprendendo" */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 text-blue-700">Aprendendo</h2>
            <Droppable droppableId="Aprendendo">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-[200px]"
                >
                  {estudosPorStatus['Aprendendo'].map((estudo, index) => (
                    <Draggable key={estudo.id} draggableId={estudo.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white p-4 mb-3 rounded-md shadow ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{estudo.musica.nome}</h3>
                              <p className="text-sm text-gray-600">
                                {estudo.musica.artista} - Tom: {estudo.musica.tom}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Banda: {estudo.musica.banda.nome}
                              </p>
                              {estudo.notas && (
                                <p className="text-sm mt-2 bg-yellow-50 p-2 rounded">
                                  {estudo.notas}
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openEditModal(estudo)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(estudo.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Coluna "Dominada" */}
          <div className="bg-green-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 text-green-700">Dominada</h2>
            <Droppable droppableId="Dominada">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-[200px]"
                >
                  {estudosPorStatus['Dominada'].map((estudo, index) => (
                    <Draggable key={estudo.id} draggableId={estudo.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white p-4 mb-3 rounded-md shadow ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{estudo.musica.nome}</h3>
                              <p className="text-sm text-gray-600">
                                {estudo.musica.artista} - Tom: {estudo.musica.tom}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Banda: {estudo.musica.banda.nome}
                              </p>
                              {estudo.notas && (
                                <p className="text-sm mt-2 bg-yellow-50 p-2 rounded">
                                  {estudo.notas}
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openEditModal(estudo)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(estudo.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>

      {/* Modal para adicionar música ao estudo */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Adicionar Música ao Estudo
                  </Dialog.Title>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Música</label>
                      <select
                        value={selectedMusicaId}
                        onChange={(e) => setSelectedMusicaId(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="">Selecione uma música</option>
                        {musicasDisponiveis.map((musica) => (
                          <option key={musica.id} value={musica.id}>
                            {musica.nome} - {musica.artista} ({musica.banda.nome})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as any)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="A Aprender">A Aprender</option>
                        <option value="Aprendendo">Aprendendo</option>
                        <option value="Dominada">Dominada</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Notas</label>
                      <textarea
                        value={notas}
                        onChange={(e) => setNotas(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Adicione notas sobre o estudo desta música"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={handleAddEstudo}
                    >
                      Adicionar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Modal para editar estudo */}
      <Transition appear show={isEditModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsEditModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Editar Estudo
                  </Dialog.Title>
                  {selectedEstudo && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {selectedEstudo.musica.nome} - {selectedEstudo.musica.artista}
                      </p>
                    </div>
                  )}
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as any)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="A Aprender">A Aprender</option>
                        <option value="Aprendendo">Aprendendo</option>
                        <option value="Dominada">Dominada</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Notas</label>
                      <textarea
                        value={notas}
                        onChange={(e) => setNotas(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Adicione notas sobre o estudo desta música"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setIsEditModalOpen(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={handleEditEstudo}
                    >
                      Salvar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Modal de confirmação de exclusão */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsDeleteModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Confirmar Exclusão
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Tem certeza que deseja remover esta música do seu estudo?
                    </p>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      onClick={handleDeleteEstudo}
                    >
                      Excluir
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
} 