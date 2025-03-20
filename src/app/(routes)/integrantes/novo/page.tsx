'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { IntegranteForm } from '../components/IntegranteForm';

export default function NovoIntegrantePage() {
  const router = useRouter();

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
          <h1 className="text-3xl font-bold text-white mb-2">Novo Integrante</h1>
          <p className="text-gray-400">Cadastre um novo músico ou membro da equipe</p>
        </div>

        {/* Formulário */}
        <IntegranteForm />
      </div>
    </div>
  );
} 