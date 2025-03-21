'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Banda } from '@/lib/types';
import { alertaErro, alertaSucesso } from '@/lib/sweetalert';
import { BandaForm } from '../../components/BandaForm';

export default function EditarBandaPage({ params }: { params: { id: string } }) {
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

  const handleSubmit = async (formData: Omit<Banda, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/bandas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update',
          data: {
            id: params.id,
            ...formData
          }
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
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!banda) {
    return <div>Banda não encontrada</div>;
  }

  return (
    <div className="h-full">
      <div className="mx-auto max-w-5xl pt-12 px-8">
        <Link
          href="/bandas"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 mb-6"
        >
          <ChevronLeft size={20} />
          <span>Voltar</span>
        </Link>

        <div className="space-y-1 mb-8">
          <h1 className="text-4xl font-bold text-white">Editar Banda</h1>
          <p className="text-sm text-zinc-400">
            Atualize as informações da banda
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
          <BandaForm 
            banda={banda} 
            onSubmit={handleSubmit} 
            onCancel={() => router.back()} 
          />
        </div>
      </div>
    </div>
  );
} 