'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Music, Save, ArrowLeft, Clock, Tag, MusicIcon, Users } from 'lucide-react';
import Link from 'next/link';
import { Musica, Banda } from '@/lib/types';
import { alertaSucesso, alertaErro } from '@/lib/sweetalert';
import { useHydratedLocalStorage } from '@/hooks/useHydratedLocalStorage';
import { bandasSeed } from '@/lib/seeds/bandas';

// Interface estendida para o formulário
interface FormMusica {
  nome: string;
  artista: string;
  tom: string;
  bpm: string; // Será convertido para número ao salvar
  observacoes?: string;
  // Campos extras não presentes na interface original
  compositor?: string;
  genero?: string;
  duracao?: string;
  letra?: string;
  acordes?: string;
  bandasIds: string[];
}

export default function NovaMusicaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [musicas, setMusicas] = useHydratedLocalStorage<Musica[]>('musicas', []);
  const [bandas, setBandas] = useState<Banda[]>([]);
  const [formData, setFormData] = useState<FormMusica>({
    nome: '',
    artista: '',
    tom: '',
    bpm: '',
    observacoes: '',
    // Campos extras
    compositor: '',
    genero: '',
    duracao: '',
    letra: '',
    acordes: '',
    bandasIds: []
  });

  useEffect(() => {
    // Carregar bandas
    const bandasFromStorage = localStorage.getItem('bandas');
    if (bandasFromStorage) {
      setBandas(JSON.parse(bandasFromStorage));
    } else {
      setBandas(bandasSeed);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBandaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const bandaId = e.target.value;
    const isChecked = e.target.checked;
    
    setFormData(prev => ({
      ...prev,
      bandasIds: isChecked 
        ? [...prev.bandasIds, bandaId] 
        : prev.bandasIds.filter(id => id !== bandaId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Criar um novo ID
      const novoId = Math.random().toString(36).substr(2, 9);
      
      // Criar a nova música - convertendo os campos conforme necessário
      const novaMusica: Musica = {
        id: novoId,
        nome: formData.nome,
        artista: formData.artista,
        tom: formData.tom,
        bpm: formData.bpm ? parseInt(formData.bpm, 10) : 0,
        observacoes: formData.observacoes
      };
      
      // Salvar também os campos extras no localStorage como uma extensão
      const musicaExtendida = {
        ...novaMusica,
        compositor: formData.compositor,
        genero: formData.genero,
        duracao: formData.duracao,
        letra: formData.letra,
        acordes: formData.acordes,
        bandasIds: formData.bandasIds
      };
      
      // Atualizar a lista de músicas no localStorage
      const novasMusicas = [...musicas, musicaExtendida as any];
      setMusicas(novasMusicas);
      
      alertaSucesso('Música cadastrada com sucesso!');
      router.push('/musicas');
    } catch (error) {
      console.error('Erro ao cadastrar música:', error);
      alertaErro('Erro ao cadastrar música. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Music className="h-8 w-8 mr-3 text-purple-400" />
            Nova Música
          </h1>
          <p className="text-gray-400">Cadastre uma nova música para seu repertório</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link 
            href="/musicas" 
            className="inline-flex items-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label htmlFor="nome" className="block text-sm font-medium text-gray-200">
                  Título*
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                  className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Título da música"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="artista" className="block text-sm font-medium text-gray-200">
                  Artista*
                </label>
                <input
                  type="text"
                  id="artista"
                  name="artista"
                  required
                  value={formData.artista}
                  onChange={handleChange}
                  className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Nome do artista original"
                />
              </div>
            </div>

            {/* Informações adicionais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label htmlFor="genero" className="block text-sm font-medium text-gray-200">
                  Gênero
                </label>
                <input
                  type="text"
                  id="genero"
                  name="genero"
                  value={formData.genero || ''}
                  onChange={handleChange}
                  className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Ex: Rock, Pop, MPB"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="tom" className="block text-sm font-medium text-gray-200">
                  Tom
                </label>
                <input
                  type="text"
                  id="tom"
                  name="tom"
                  value={formData.tom || ''}
                  onChange={handleChange}
                  className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Ex: C, Dm, G#"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="duracao" className="block text-sm font-medium text-gray-200">
                  Duração
                </label>
                <input
                  type="text"
                  id="duracao"
                  name="duracao"
                  value={formData.duracao || ''}
                  onChange={handleChange}
                  className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Ex: 3:45"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label htmlFor="compositor" className="block text-sm font-medium text-gray-200">
                  Compositor
                </label>
                <input
                  type="text"
                  id="compositor"
                  name="compositor"
                  value={formData.compositor || ''}
                  onChange={handleChange}
                  className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Nome do compositor"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="bpm" className="block text-sm font-medium text-gray-200">
                  BPM
                </label>
                <input
                  type="number"
                  id="bpm"
                  name="bpm"
                  value={formData.bpm || ''}
                  onChange={handleChange}
                  className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Ex: 120"
                />
              </div>
            </div>

            {/* Bandas */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-200">
                Bandas que tocam esta música
              </label>
              <div className="bg-gray-900 p-4 rounded-md border border-gray-700 max-h-48 overflow-y-auto">
                {bandas.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {bandas.map(banda => (
                      <div key={banda.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`banda-${banda.id}`}
                          value={banda.id}
                          checked={formData.bandasIds.includes(banda.id)}
                          onChange={handleBandaChange}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`banda-${banda.id}`} className="ml-2 block text-sm text-gray-200">
                          {banda.nome} <span className="text-gray-400 text-xs">({banda.genero})</span>
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Nenhuma banda cadastrada</p>
                )}
              </div>
            </div>

            {/* Acordes */}
            <div className="space-y-3">
              <label htmlFor="acordes" className="block text-sm font-medium text-gray-200">
                Acordes
              </label>
              <textarea
                id="acordes"
                name="acordes"
                rows={4}
                value={formData.acordes || ''}
                onChange={handleChange}
                className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm font-mono"
                placeholder="Adicione os acordes da música aqui..."
              />
            </div>

            {/* Letra */}
            <div className="space-y-3">
              <label htmlFor="letra" className="block text-sm font-medium text-gray-200">
                Letra
              </label>
              <textarea
                id="letra"
                name="letra"
                rows={6}
                value={formData.letra || ''}
                onChange={handleChange}
                className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Adicione a letra da música aqui..."
              />
            </div>

            {/* Observações */}
            <div className="space-y-3">
              <label htmlFor="observacoes" className="block text-sm font-medium text-gray-200">
                Observações
              </label>
              <textarea
                id="observacoes"
                name="observacoes"
                rows={3}
                value={formData.observacoes || ''}
                onChange={handleChange}
                className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Observações adicionais sobre a música"
              />
            </div>

            <div className="flex justify-end pt-5">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Música
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 