'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Music, Users } from 'lucide-react';
import { Banda } from '@/lib/types';
import { alertaErro } from '@/lib/sweetalert';

export default function VisualizarBandaPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [banda, setBanda] = useState<Banda | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBanda() {
      try {
        const response = await fetch('/api/bandas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            action: 'get',
            data: { id: params.id }
          }),
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar banda');
        }

        const data = await response.json();
        setBanda(data.banda);
      } catch (error) {
        console.error('Erro ao buscar banda:', error);
        alertaErro('Erro ao carregar os dados da banda');
      } finally {
        setLoading(false);
      }
    }

    fetchBanda();
  }, [params.id]);

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  if (!banda) {
    return (
      <div className="p-8">
        <div className="text-red-500">Banda não encontrada</div>
        <button 
          onClick={() => router.back()}
          className="mt-4 text-gray-400 hover:text-white flex items-center"
        >
          <ArrowLeft className="mr-2" size={16} />
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="mb-8">
        <button 
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white flex items-center mb-4"
        >
          <ArrowLeft className="mr-2" size={16} />
          Voltar
        </button>
        <h1 className="text-3xl font-bold text-white">{banda.nome}</h1>
      </div>

      {/* Conteúdo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card de informações principais */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Informações</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Gênero Musical</label>
                <div className="mt-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-900/50 text-purple-200">
                    <Music className="w-4 h-4 mr-2" />
                    {banda.genero || 'Não definido'}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-400">Descrição</label>
                <p className="mt-1 text-white">
                  {banda.descricao || 'Nenhuma descrição fornecida'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Barra lateral */}
        <div className="space-y-6">
          {/* Card de ações */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Ações</h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push(`/bandas/editar/${banda.id}`)}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Editar Banda
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 