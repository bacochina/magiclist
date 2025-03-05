'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pedaleira, Musica } from '@/lib/types';
import { TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Modal } from '@/components/ui/Modal';

const presetSchema = z.object({
  id: z.string().optional(),
  identificador: z.string().min(1),
  tipo: z.enum(['Clean', 'Drive', 'Distortion', 'Fuzz', 'Solo']),
  descricao: z.string().min(1, 'A descrição é obrigatória'),
  musicas: z.array(z.string())
});

const bancoSchema = z.object({
  id: z.string().optional(),
  numero: z.number().min(1).max(99),
  descricao: z.string().min(1, 'A descrição é obrigatória'),
  presets: z.array(presetSchema)
});

const mockPedaleiras: Pedaleira[] = [
  {
    id: '1',
    nome: 'Pedaleira 1',
    marca: 'Boss',
    usaLetras: true,
    qtdeBancos: 4,
    qtdePresetsporBanco: 5,
    bancos: []
  }
];

const mockMusicas: Musica[] = [
  {
    id: '1',
    nome: 'Enter Sandman',
    artista: 'Metallica',
    tom: 'Em',
    bpm: 123,
  },
  {
    id: '2',
    nome: 'Nothing Else Matters',
    artista: 'Metallica',
    tom: 'Em',
    bpm: 92,
  },
  {
    id: '3',
    nome: 'Sweet Child O\' Mine',
    artista: 'Guns N\' Roses',
    tom: 'D',
    bpm: 126,
  },
  {
    id: '4',
    nome: 'Wonderwall',
    artista: 'Oasis',
    tom: 'Am',
    bpm: 86,
  },
  {
    id: '5',
    nome: 'Run to the Hills',
    artista: 'Iron Maiden',
    tom: 'D',
    bpm: 190,
  },
];

export default function PresetsPage() {
  const [pedaleiras] = useState<Pedaleira[]>(mockPedaleiras);
  const [pedaleiraId, setPedaleiraId] = useState<string>('');
  const [bancoAtual, setBancoAtual] = useState<number>(1);
  const [musicSearch, setMusicSearch] = useState<{ [key: string]: string }>({});
  const [selectedMusics, setSelectedMusics] = useState<{ [key: string]: string[] }>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [nextBanco, setNextBanco] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const pedaleiraSelecionada = pedaleiras.find(p => p.id === pedaleiraId);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    reset
  } = useForm({
    resolver: zodResolver(bancoSchema),
    defaultValues: {
      numero: bancoAtual,
      descricao: '',
      presets: []
    }
  });

  const { fields: presetsFields, append: appendPreset, remove: removePreset } = useFieldArray({
    control,
    name: 'presets'
  });

  const adicionarPreset = () => {
    if (!pedaleiraSelecionada) return;

    const presets = watch('presets') || [];
    appendPreset({
      identificador: pedaleiraSelecionada.usaLetras 
        ? String.fromCharCode(65 + presets.length) 
        : (presets.length + 1).toString(),
      tipo: 'Clean',
      descricao: '',
      musicas: []
    });
  };

  const onSubmit = async (data: any) => {
    try {
      setIsSaving(true);
      
      // Adicionar as músicas selecionadas aos presets antes de salvar
      const presetsComMusicas = data.presets.map((preset: any, index: number) => ({
        ...preset,
        musicas: selectedMusics[presetsFields[index].id] || []
      }));

      const dadosFinais = {
        ...data,
        presets: presetsComMusicas
      };

      // Simular o salvamento (substitua por uma chamada real à API)
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Dados do banco:', dadosFinais);

      // Resetar o estado de alterações
      reset(data);
      setShowConfirmModal(false);
      
      // Mostrar mensagem de sucesso (você pode implementar um toast aqui)
      alert('Banco salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar o banco:', error);
      alert('Erro ao salvar o banco. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredMusicas = (presetId: string) => {
    const searchTerm = musicSearch[presetId]?.toLowerCase() || '';
    return mockMusicas.filter(
      musica => 
        musica.nome.toLowerCase().includes(searchTerm) ||
        musica.artista.toLowerCase().includes(searchTerm)
    );
  };

  const toggleMusicSelection = (presetId: string, musicId: string) => {
    setSelectedMusics(prev => {
      const currentSelection = prev[presetId] || [];
      const newSelection = currentSelection.includes(musicId)
        ? currentSelection.filter(id => id !== musicId)
        : [...currentSelection, musicId];
      
      return {
        ...prev,
        [presetId]: newSelection
      };
    });
  };

  const handleBancoChange = (newBanco: number) => {
    if (isDirty) {
      setNextBanco(newBanco);
      setShowConfirmModal(true);
    } else {
      setBancoAtual(newBanco);
      reset({
        numero: newBanco,
        descricao: '',
        presets: []
      });
    }
  };

  const handleConfirmChange = () => {
    if (nextBanco !== null) {
      setBancoAtual(nextBanco);
      reset({
        numero: nextBanco,
        descricao: '',
        presets: []
      });
      setNextBanco(null);
    }
    setShowConfirmModal(false);
  };

  const handleCancelChange = () => {
    setNextBanco(null);
    setShowConfirmModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">Configurar Presets</h1>
            <a
              href="/pedaleiras"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Voltar para Pedaleiras
            </a>
          </div>
          
          <div>
            <label htmlFor="pedaleira" className="block text-sm font-medium text-gray-700">
              Pedaleira
            </label>
            <select
              id="pedaleira"
              value={pedaleiraId}
              onChange={(e) => setPedaleiraId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Selecione uma pedaleira</option>
              {pedaleiras.map((pedaleira) => (
                <option key={pedaleira.id} value={pedaleira.id}>
                  {pedaleira.nome} - {pedaleira.marca}
                </option>
              ))}
            </select>
          </div>

          {pedaleiraSelecionada && (
            <div className="mt-4">
              <label htmlFor="banco" className="block text-sm font-medium text-gray-700">
                Banco
              </label>
              <select
                id="banco"
                value={bancoAtual}
                onChange={(e) => handleBancoChange(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                {Array.from({ length: pedaleiraSelecionada.qtdeBancos }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    Banco {num}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {pedaleiraSelecionada && (
          <>
            <form id="banco-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                  Descrição do Banco
                </label>
                <input
                  type="text"
                  id="descricao"
                  {...register('descricao')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Ex: Músicas Clean"
                />
                {errors.descricao && (
                  <p className="mt-1 text-sm text-red-600">{errors.descricao.message}</p>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Presets do Banco</h3>
                  <button
                    type="button"
                    onClick={adicionarPreset}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Adicionar Preset
                  </button>
                </div>

                {presetsFields.map((field, index) => (
                  <div key={field.id} className="border rounded-md p-4 space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-24">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {pedaleiraSelecionada.usaLetras ? 'Letra' : 'Número'}
                        </label>
                        <input
                          type="text"
                          {...register(`presets.${index}.identificador`)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-center uppercase"
                        />
                      </div>

                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Descrição do Preset
                        </label>
                        <input
                          type="text"
                          {...register(`presets.${index}.descricao`)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>

                      <div className="w-32">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo
                        </label>
                        <select
                          {...register(`presets.${index}.tipo`)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="Clean">Clean</option>
                          <option value="Drive">Drive</option>
                          <option value="Distortion">Distortion</option>
                          <option value="Fuzz">Fuzz</option>
                          <option value="Solo">Solo</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => removePreset(index)}
                        className="mt-6 p-1 text-red-600 hover:text-red-800"
                        title="Remover Preset"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Músicas do Preset
                      </label>
                      <div className="relative">
                        <div className="flex items-center border-b border-gray-300 pb-2">
                          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2" />
                          <input
                            type="text"
                            placeholder="Buscar música..."
                            value={musicSearch[field.id] || ''}
                            onChange={(e) => setMusicSearch(prev => ({
                              ...prev,
                              [field.id]: e.target.value
                            }))}
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                        <div className="mt-2 h-[160px] overflow-y-auto border rounded-md">
                          <div className="divide-y divide-gray-200">
                            {filteredMusicas(field.id).map((musica) => (
                              <div
                                key={musica.id}
                                className="flex items-center px-4 py-2 hover:bg-gray-50"
                              >
                                <input
                                  type="checkbox"
                                  id={`musica-${field.id}-${musica.id}`}
                                  checked={selectedMusics[field.id]?.includes(musica.id) || false}
                                  onChange={() => toggleMusicSelection(field.id, musica.id)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label
                                  htmlFor={`musica-${field.id}-${musica.id}`}
                                  className="ml-3 block text-sm text-gray-700"
                                >
                                  <span className="font-medium">{musica.nome}</span>
                                  <span className="text-gray-500"> - {musica.artista}</span>
                                  <span className="text-gray-400 text-xs ml-2">
                                    (Tom: {musica.tom}{musica.bpm ? `, BPM: ${musica.bpm}` : ''})
                                  </span>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Banco'}
                </button>
              </div>
            </form>

            <Modal
              isOpen={showConfirmModal}
              onClose={handleCancelChange}
              title="Alterações não salvas"
            >
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Existem alterações não salvas no banco atual. O que você deseja fazer?
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancelChange}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Continuar editando
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmChange}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    Descartar alterações
                  </button>
                  <button
                    type="submit"
                    form="banco-form"
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Salvando...' : 'Salvar alterações'}
                  </button>
                </div>
              </div>
            </Modal>
          </>
        )}
      </div>
    </div>
  );
} 