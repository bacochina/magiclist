import { useState, useEffect } from 'react';

interface GeneratorHistoryItem {
  id: string;
  table_name: string;
  sql_definition: string;
  metadata: {
    pageTitle: string;
    pageSubtitle: string;
    tableName: string;
    tableFunction: string;
    fields: Array<{
      name: string;
      type: string;
      required: boolean;
      isPrimaryKey: boolean;
      isForeignKey: boolean;
      references?: {
        table: string;
        field: string;
      };
    }>;
    relationships: any[];
    constraints: any[];
    indexes: any[];
  };
  created_at: string;
  updated_at: string;
}

export function useGeneratorHistory() {
  const [history, setHistory] = useState<GeneratorHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/generator');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar histórico');
      }

      setHistory(data.history);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return {
    history,
    isLoading,
    error,
    refetch: fetchHistory
  };
} 