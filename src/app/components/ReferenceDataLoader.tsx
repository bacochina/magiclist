import React, { useEffect, useState } from 'react';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface ReferenceData {
  styles: any[];
  database: any[];
  features: any[];
}

interface ReferenceDataLoaderProps {
  pageId: string;
}

export const ReferenceDataLoader: React.FC<ReferenceDataLoaderProps> = ({ pageId }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReferenceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fazer as chamadas à API para buscar os dados
        const response = await fetch(`/api/reference/${pageId}`);
        
        if (!response.ok) {
          throw new Error('Erro ao carregar dados de referência');
        }

        const referenceData = await response.json();
        setData(referenceData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    if (pageId) {
      fetchReferenceData();
    }
  }, [pageId]);

  if (loading) {
    return (
      <LoadingSpinner message="Carregando dados de referência..." />
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-md">
        <p>Erro: {error}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Seção de Estilos */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Estilos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.styles.map((style, index) => (
            <div key={index} className="p-4 border rounded-md">
              {/* Renderizar dados de estilo */}
            </div>
          ))}
        </div>
      </section>

      {/* Seção de Banco de Dados */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Banco de Dados</h2>
        <div className="space-y-4">
          {data.database.map((item, index) => (
            <div key={index} className="p-4 border rounded-md">
              {/* Renderizar dados do banco */}
            </div>
          ))}
        </div>
      </section>

      {/* Seção de Funcionalidades */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Funcionalidades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.features.map((feature, index) => (
            <div key={index} className="p-4 border rounded-md">
              {/* Renderizar dados de funcionalidade */}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}; 