'use client';

import { useState, useEffect } from 'react';
import { Integrante, Banda } from '@/lib/types';

interface IntegranteFormProps {
  integrante?: Integrante;
  bandas: Banda[];
  onSubmit: (data: Partial<Integrante>) => void;
}

export function IntegranteForm({ integrante, bandas, onSubmit }: IntegranteFormProps) {
  const [nome, setNome] = useState(integrante?.nome || '');
  const [funcao, setFuncao] = useState(integrante?.funcao || '');
  const [telefone, setTelefone] = useState(integrante?.telefone || '');
  const [email, setEmail] = useState(integrante?.email || '');
  const [observacoes, setObservacoes] = useState(integrante?.observacoes || '');
  const [bandasIds, setBandasIds] = useState<string[]>(integrante?.bandasIds || []);

  // Atualiza o formulário quando o integrante muda
  useEffect(() => {
    if (integrante) {
      setNome(integrante.nome);
      setFuncao(integrante.funcao);
      setTelefone(integrante.telefone || '');
      setEmail(integrante.email || '');
      setObservacoes(integrante.observacoes || '');
      setBandasIds(integrante.bandasIds || []);
    } else {
      setNome('');
      setFuncao('');
      setTelefone('');
      setEmail('');
      setObservacoes('');
      setBandasIds([]);
    }
  }, [integrante]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nome,
      funcao,
      telefone: telefone || undefined,
      email: email || undefined,
      observacoes: observacoes || undefined,
      bandasIds,
    });
  };

  const handleToggleBanda = (bandaId: string) => {
    setBandasIds(prev => 
      prev.includes(bandaId)
        ? prev.filter(id => id !== bandaId)
        : [...prev, bandaId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
          Nome *
        </label>
        <input
          type="text"
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="funcao" className="block text-sm font-medium text-gray-700">
          Função *
        </label>
        <input
          type="text"
          id="funcao"
          value={funcao}
          onChange={(e) => setFuncao(e.target.value)}
          required
          placeholder="Ex: Guitarrista, Vocalista, Baterista"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
          Telefone
        </label>
        <input
          type="tel"
          id="telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          placeholder="(00) 00000-0000"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="exemplo@email.com"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bandas
        </label>
        <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
          {Array.isArray(bandas) && bandas.map((banda) => (
            <div key={banda.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`banda-${banda.id}`}
                checked={bandasIds.includes(banda.id)}
                onChange={() => handleToggleBanda(banda.id)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor={`banda-${banda.id}`} className="ml-2 block text-sm text-gray-900">
                {banda.nome} <span className="text-gray-500 text-xs">({banda.genero})</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700">
          Observações
        </label>
        <textarea
          id="observacoes"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {integrante ? 'Salvar' : 'Adicionar'}
        </button>
      </div>
    </form>
  );
} 