'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Banda } from '@/lib/types';
import { alertaErro, alertaSucesso } from '@/lib/sweetalert';

export default function EditarBandaPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [banda, setBanda] = useState<Banda>({
    id: '',
    nome: '',
    genero: '',
    descricao: ''
  });
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    try {
      const response = await fetch('/api/bandas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update',
          data: banda
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar banda');
      }

      alertaSucesso('Banda atualizada com sucesso!');
      router.push('/bandas');
    } catch (error) {
      console.error('Erro ao atualizar banda:', error);
      alertaErro('Erro ao atualizar a banda');
    } finally {
      setSalvando(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBanda(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="p-8">Carregando...</div>;
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
        <h1 className="text-3xl font-bold text-white">Editar Banda</h1>
      </div>

      {/* Formulário */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="space-y-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-300">
                  Nome da Banda
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={banda.nome}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md bg-gray-900 border border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="genero" className="block text-sm font-medium text-gray-300">
                  Gênero Musical
                </label>
                <input
                  type="text"
                  id="genero"
                  name="genero"
                  value={banda.genero}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-gray-900 border border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-300">
                  Descrição
                </label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={banda.descricao}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md bg-gray-900 border border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {salvando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 