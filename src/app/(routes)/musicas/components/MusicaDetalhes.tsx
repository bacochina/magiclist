'use client';

<<<<<<< HEAD
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface MusicaDetalhesProps {
  isOpen: boolean;
  onClose: () => void;
  musica: {
    nome: string;
    artista: string;
    tom: string;
    observacoes?: string;
  };
=======
interface Musica {
  id: string;
  nome: string;
  artista: string;
  tom: string;
  observacoes?: string;
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6
}

interface MusicaDetalhesProps {
  musica: Musica;
}

export function MusicaDetalhes({ musica }: MusicaDetalhesProps) {
  return (
<<<<<<< HEAD
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-xl">
          <div className="absolute right-4 top-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
              </p>

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
        </Dialog.Panel>
=======
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-500">Nome</h3>
        <p className="mt-1 text-sm text-gray-900">{musica.nome}</p>
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500">Artista</h3>
        <p className="mt-1 text-sm text-gray-900">{musica.artista}</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500">Tom</h3>
        <p className="mt-1 text-sm text-gray-900">{musica.tom}</p>
      </div>

      {musica.observacoes && (
        <div>
          <h3 className="text-sm font-medium text-gray-500">Observações</h3>
          <p className="mt-1 text-sm text-gray-900">{musica.observacoes}</p>
        </div>
      )}
    </div>
  );
} 