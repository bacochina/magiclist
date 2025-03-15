'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Users, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Integrante, Banda } from '@/lib/types';
import { alertaSucesso, alertaErro } from '@/lib/sweetalert';
import { useHydratedLocalStorage } from '@/hooks/useHydratedLocalStorage';
import { bandasSeed } from '@/lib/seeds/bandas';

export default function NovoIntegrantePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [integrantes, setIntegrantes] = useHydratedLocalStorage<Integrante[]>('integrantes', []);
  const [bandas, setBandas] = useState<Banda[]>([]);
  const [formData, setFormData] = useState<Omit<Integrante, 'id'>>({
    nome: '',
    funcao: '',
    telefone: '',
    email: '',
    observacoes: '',
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
      
      // Criar o novo integrante
      const novoIntegrante: Integrante = {
        id: novoId,
        ...formData
      };
      
      // Atualizar a lista de integrantes no localStorage
      const novosIntegrantes = [...integrantes, novoIntegrante];
      setIntegrantes(novosIntegrantes);
      
      alertaSucesso('Integrante criado com sucesso!');
      router.push('/integrantes');
    } catch (error) {
      console.error('Erro ao criar integrante:', error);
      alertaErro('Erro ao criar integrante. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <User className="h-8 w-8 mr-3 text-purple-400" />
            Novo Integrante
          </h1>
          <p className="text-gray-400">Cadastre um novo músico ou membro da equipe</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link 
            href="/integrantes" 
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
                  Nome*
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                  className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Nome do integrante"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="funcao" className="block text-sm font-medium text-gray-200">
                  Função*
                </label>
                <input
                  type="text"
                  id="funcao"
                  name="funcao"
                  required
                  value={formData.funcao}
                  onChange={handleChange}
                  className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Ex: Guitarrista, Vocalista, Produtor"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-200">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone || ''}
                  onChange={handleChange}
                  className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-200">
                Bandas
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

            <div className="space-y-3">
              <label htmlFor="observacoes" className="block text-sm font-medium text-gray-200">
                Observações
              </label>
              <textarea
                id="observacoes"
                name="observacoes"
                rows={4}
                value={formData.observacoes || ''}
                onChange={handleChange}
                className="bg-gray-900 text-white mt-1 block w-full rounded-md border border-gray-700 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Observações adicionais sobre o integrante"
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
                    Salvar Integrante
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