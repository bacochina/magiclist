'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Music, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Banda } from '@/lib/types';
import { alertaSucesso, alertaErro } from '@/lib/sweetalert';

export default function NovaBandaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<Banda, 'id'>>({
    nome: '',
    genero: '',
    descricao: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/bandas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao criar banda');
      }
      
      alertaSucesso('Banda criada com sucesso!');
      router.push('/bandas');
    } catch (error) {
      console.error('Erro ao criar banda:', error);
      alertaErro('Erro ao criar banda. Tente novamente.');
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
            Nova Banda
          </h1>
          <p className="text-gray-400">Cadastre uma nova banda ou projeto musical</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link 
            href="/bandas" 
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label htmlFor="nome" className="block text-sm font-medium text-gray-200">
                  Nome da Banda
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                  className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Nome da banda ou projeto"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="genero" className="block text-sm font-medium text-gray-200">
                  Gênero Musical
                </label>
                <input
                  type="text"
                  id="genero"
                  name="genero"
                  required
                  value={formData.genero}
                  onChange={handleChange}
                  className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Rock, Pop, Jazz, MPB, etc."
                />
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-200">
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                rows={4}
                value={formData.descricao || ''}
                onChange={handleChange}
                className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Descreva a banda, estilo musical, história, etc."
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
                    Salvar Banda
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