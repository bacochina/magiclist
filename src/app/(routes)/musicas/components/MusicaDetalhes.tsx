'use client';

import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface MusicaDetalhesProps {
  isOpen: boolean;
  onClose: () => void;
  musica: {
    nome: string;
    artista: string;
    tom: string;
    bpm?: string;
    cifra?: string;
    letra?: string;
    observacoes?: string;
  };
}

export function MusicaDetalhes({ isOpen, onClose, musica }: MusicaDetalhesProps) {
  return (
    <Dialog as="div" className="relative z-10" onClose={onClose} open={isOpen}>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                onClick={onClose}
              >
                <span className="sr-only">Fechar</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div>
              <div className="mt-3 sm:mt-5">
                <Dialog.Title as="h3" className="text-2xl font-semibold leading-6 text-gray-900 mb-1">
                  {musica.nome}
                </Dialog.Title>
                <p className="text-sm text-gray-500 mb-6">
                  {musica.artista} • Tom: {musica.tom}
                  {musica.bpm ? ` • ${musica.bpm} BPM` : ''}
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Cifra */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Cifra</h4>
                    <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto font-mono text-sm whitespace-pre-wrap">
                      {musica.cifra || 'Nenhuma cifra cadastrada'}
                    </pre>
                  </div>

                  {/* Letra */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Letra</h4>
                    <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto whitespace-pre-wrap">
                      {musica.letra || 'Nenhuma letra cadastrada'}
                    </pre>
                  </div>
                </div>

                {/* Observações */}
                {musica.observacoes && (
                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Observações</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {musica.observacoes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                onClick={onClose}
              >
                Fechar
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
} 