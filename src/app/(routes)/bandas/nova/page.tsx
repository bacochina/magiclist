'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BandaForm } from '../components/BandaForm';
import { alertaSucesso, alertaErro } from '@/lib/sweetalert';

export default function NovaBandaPage() {
  const router = useRouter();

  const handleSubmit = async (formData: any) => {
    try {
      const response = await fetch('/api/bandas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'create',
          data: formData
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar banda');
      }
      
      alertaSucesso('Banda criada com sucesso!');
      router.push('/bandas');
    } catch (error) {
      console.error('Erro ao salvar banda:', error);
      alertaErro('Erro ao salvar a banda');
    }
  };

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
          <h1 className="text-3xl font-bold text-white mb-2">Nova Banda</h1>
          <p className="text-gray-400">Cadastre uma nova banda ou projeto musical</p>
        </div>

        {/* Formulário */}
        <BandaForm 
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
} 