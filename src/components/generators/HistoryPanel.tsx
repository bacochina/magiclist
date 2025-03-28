'use client';

import { useGeneratorHistory } from '@/hooks/useGeneratorHistory';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Loader2, Clock, Database } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface HistoryPanelProps {
  onSelect: (data: any) => void;
}

export function HistoryPanel({ onSelect }: HistoryPanelProps) {
  const { history, isLoading, error, refetch } = useGeneratorHistory();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={refetch} variant="outline">
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Histórico de Gerações</h3>
          <Button onClick={refetch} variant="ghost" size="sm">
            <Clock className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>

        {history.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Nenhuma geração encontrada
          </p>
        ) : (
          <Accordion type="single" collapsible>
            {history.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-start text-left">
                    <Database className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{item.metadata.pageTitle || item.table_name}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div>
                      <p className="text-sm text-gray-600">Tabela: {item.table_name}</p>
                      <p className="text-sm text-gray-600">
                        Campos: {item.metadata.fields.length}
                      </p>
                    </div>
                    
                    <pre className="bg-gray-50 p-3 rounded-md text-sm overflow-x-auto">
                      <code>{item.sql_definition}</code>
                    </pre>

                    <Button
                      onClick={() => onSelect(item.metadata)}
                      className="w-full"
                      variant="outline"
                    >
                      Carregar Esta Configuração
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </ScrollArea>
  );
} 