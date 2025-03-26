'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Music, Users } from 'lucide-react';
import { Banda } from '@/lib/types';
import { alertaErro } from '@/lib/sweetalert';

// Interface para os integrantes
interface Integrante {
  id: string;
  nome: string;
  instrumento: string;
  apelido?: string;
}

export default function VisualizarBandaPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [banda, setBanda] = useState<Banda | null>(null);
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar detalhes da banda com integrantes
  useEffect(() => {
    async function fetchBanda() {
      try {
        console.log("Buscando detalhes da banda:", params.id);
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
          throw new Error(`Erro ao buscar banda: ${response.status}`);
        }

        const data = await response.json();
        console.log("Dados completos obtidos:", data);
        
        setBanda(data.banda);
        
        // Usar os integrantes que agora são retornados junto com a banda
        if (data.integrantes && Array.isArray(data.integrantes)) {
          console.log("Integrantes encontrados:", data.integrantes.length);
          setIntegrantes(data.integrantes);
        } else {
          console.log("Nenhum integrante encontrado na resposta");
          setIntegrantes([]);
        }
      } catch (error) {
        console.error('Erro ao buscar banda:', error);
        setError('Erro ao carregar os dados da banda');
      } finally {
        setLoading(false);
      }
    }

    fetchBanda();
  }, [params.id]);

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  if (error || !banda) {
    return (
      <div className="p-8">
        <div className="text-red-500">{error || 'Banda não encontrada'}</div>
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
        <div className="mt-2 text-purple-400 font-bold">Hello Claude</div>
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
          
          {/* Card de integrantes da banda */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Integrantes
            </h2>
            
            {integrantes && integrantes.length > 0 ? (
              <div className="divide-y divide-gray-700">
                {integrantes.map((integrante) => (
                  <div key={integrante.id} className="py-3 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-white">
                        {integrante.nome} 
                        {integrante.apelido && <span className="text-gray-400 ml-2">({integrante.apelido})</span>}
                      </div>
                      <div className="text-sm text-gray-400">{integrante.instrumento}</div>
                    </div>
                    <button 
                      onClick={() => router.push(`/integrantes/${integrante.id}`)}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Ver perfil
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Nenhum integrante cadastrado para esta banda.</p>
            )}
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