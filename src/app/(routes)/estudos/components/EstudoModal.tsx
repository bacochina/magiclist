'use client';

import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Estudo {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: 'baixa' | 'media' | 'alta';
  dataLimite?: string;
  cor: 'vermelho' | 'laranja' | 'amarelo' | 'verde';
}

interface EstudoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (estudo: Omit<Estudo, 'id'>) => void;
  estudo?: Estudo;
}

export function EstudoModal({ isOpen, onClose, onSave, estudo }: EstudoModalProps) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState<'baixa' | 'media' | 'alta'>('media');
  const [dataLimite, setDataLimite] = useState('');
  const [cor, setCor] = useState<'vermelho' | 'laranja' | 'amarelo' | 'verde'>('verde');

  useEffect(() => {
    if (estudo) {
      setTitulo(estudo.titulo);
      setDescricao(estudo.descricao);
      setPrioridade(estudo.prioridade);
      setDataLimite(estudo.dataLimite || '');
      setCor(estudo.cor);
    } else {
      setTitulo('');
      setDescricao('');
      setPrioridade('media');
      setDataLimite('');
      setCor('verde');
    }
  }, [estudo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      titulo,
      descricao,
      prioridade,
      dataLimite: dataLimite || undefined,
      cor
    });
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Fechar</span>
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      {estudo ? 'Editar Estudo' : 'Novo Estudo'}
                    </Dialog.Title>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                      <div>
                        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
                          Título
                        </label>
                        <input
                          type="text"
                          id="titulo"
                          value={titulo}
                          onChange={(e) => setTitulo(e.target.value)}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                          Descrição
                        </label>
                        <textarea
                          id="descricao"
                          value={descricao}
                          onChange={(e) => setDescricao(e.target.value)}
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700">
                          Prioridade
                        </label>
                        <select
                          id="prioridade"
                          value={prioridade}
                          onChange={(e) => setPrioridade(e.target.value as 'baixa' | 'media' | 'alta')}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="baixa">Baixa</option>
                          <option value="media">Média</option>
                          <option value="alta">Alta</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cor do Cartão
                        </label>
                        <div className="flex space-x-4">
                          <button
                            type="button"
                            onClick={() => setCor('vermelho')}
                            className={`w-8 h-8 rounded-full bg-red-500 ${
                              cor === 'vermelho' ? 'ring-2 ring-offset-2 ring-red-500' : ''
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setCor('laranja')}
                            className={`w-8 h-8 rounded-full bg-orange-500 ${
                              cor === 'laranja' ? 'ring-2 ring-offset-2 ring-orange-500' : ''
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setCor('amarelo')}
                            className={`w-8 h-8 rounded-full bg-yellow-500 ${
                              cor === 'amarelo' ? 'ring-2 ring-offset-2 ring-yellow-500' : ''
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setCor('verde')}
                            className={`w-8 h-8 rounded-full bg-green-500 ${
                              cor === 'verde' ? 'ring-2 ring-offset-2 ring-green-500' : ''
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="dataLimite" className="block text-sm font-medium text-gray-700">
                          Data Limite
                        </label>
                        <input
                          type="date"
                          id="dataLimite"
                          value={dataLimite}
                          onChange={(e) => setDataLimite(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                        >
                          Salvar
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          onClick={onClose}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 