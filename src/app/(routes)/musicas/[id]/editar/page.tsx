'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MusicaForm } from '../../components/MusicaForm';
import { alertaErro } from '@/lib/sweetalert';

interface Musica {
  id: string;
  titulo: string;
  artista: string;
  genero: string;
  duracao: string;
  tom: string;
  bpm: string;
  observacoes?: string;
  link_letra?: string;
  link_cifra?: string;
  link_mp3?: string;
  link_vs?: string;
  status_vs?: string;
  bandas?: string[];
}

export default function EditarMusicaPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [musica, setMusica] = useState<Musica | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarMusica() {
      try {
        const response = await fetch(`/api/musicas/${params.id}`);
        if (!response.ok) throw new Error('Erro ao carregar música');
        const data = await response.json();
        setMusica(data);
      } catch (error) {
        console.error('Erro ao carregar música:', error);
        alertaErro('Erro ao carregar música');
      } finally {
        setLoading(false);
      }
    }

    carregarMusica();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-24 bg-gray-700 rounded mb-4" />
            <div className="h-12 w-64 bg-gray-700 rounded mb-2" />
            <div className="h-6 w-96 bg-gray-700 rounded mb-8" />
            <div className="space-y-4">
              <div className="h-12 bg-gray-700 rounded" />
              <div className="h-12 bg-gray-700 rounded" />
              <div className="h-12 bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!musica) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Música não encontrada</h1>
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white flex items-center justify-center mx-auto"
            >
              <ArrowLeft className="mr-2" size={16} />
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white flex items-center mb-4"
          >
            <ArrowLeft className="mr-2" size={16} />
            Voltar
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">Editar Música</h1>
          <p className="text-gray-400">Atualize as informações da música</p>
        </div>

        {/* Formulário */}
        <MusicaForm initialData={musica} />
      </div>
    </div>
  );
} 