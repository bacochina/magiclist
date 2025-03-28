'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PreviewPanelProps {
  data: {
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
}

export function PreviewPanel({ data }: PreviewPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSQL, setGeneratedSQL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      setGeneratedSQL(null);

      // Validações básicas
      if (!data.tableName) {
        throw new Error('Nome da tabela é obrigatório');
      }

      if (!data.fields.length) {
        throw new Error('Adicione pelo menos um campo à tabela');
      }

      if (!data.fields.some(f => f.isPrimaryKey)) {
        throw new Error('A tabela precisa ter pelo menos uma chave primária');
      }

      // Validar nomes dos campos
      const invalidFields = data.fields.filter(f => !f.name.match(/^[a-z][a-z0-9_]*$/));
      if (invalidFields.length > 0) {
        throw new Error(`Campos com nomes inválidos: ${invalidFields.map(f => f.name).join(', ')}`);
      }

      const response = await fetch('/api/generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao gerar estrutura');
      }

      setGeneratedSQL(result.sql);
      toast.success('Estrutura gerada com sucesso!');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      toast.error('Erro ao gerar estrutura');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Tabs defaultValue="schema" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="schema">Estrutura DB</TabsTrigger>
        <TabsTrigger value="preview">Preview Página</TabsTrigger>
      </TabsList>

      <TabsContent value="schema" className="mt-4">
        <ScrollArea className="h-[calc(100vh-16rem)] rounded-md border p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Tabela: {data.tableName || '<nome_da_tabela>'}</h3>
              <p className="text-sm text-gray-500">{data.tableFunction || 'Função da tabela'}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Campos:</h4>
              <div className="space-y-2">
                {data.fields.map((field, index) => (
                  <div key={index} className="pl-4 border-l-2 border-gray-200">
                    <p>
                      <span className="font-mono">{field.name}</span>
                      <span className="text-gray-500"> - {field.type}</span>
                      {field.required && <span className="text-red-500"> *</span>}
                      {field.isPrimaryKey && <span className="text-blue-500"> (PK)</span>}
                      {field.isForeignKey && (
                        <span className="text-green-500">
                          {' '}
                          (FK → {field.references?.table}.{field.references?.field})
                        </span>
                      )}
                    </p>
                  </div>
                ))}
                {data.fields.length === 0 && (
                  <p className="text-gray-400 italic">Nenhum campo definido</p>
                )}
              </div>
            </div>

            {data.constraints.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Restrições:</h4>
                <div className="space-y-1 pl-4">
                  {data.constraints.map((constraint, index) => (
                    <p key={index} className="text-sm">
                      {constraint.name}: {constraint.type} - {constraint.definition}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {data.indexes.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Índices:</h4>
                <div className="space-y-1 pl-4">
                  {data.indexes.map((index, i) => (
                    <p key={i} className="text-sm">
                      {index.name}: {index.type} ({index.fields.join(', ')})
                      {index.unique && ' (UNIQUE)'}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {generatedSQL && (
              <div className="mt-6">
                <h4 className="font-medium mb-2">SQL Gerado:</h4>
                <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                  <code>{generatedSQL}</code>
                </pre>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="mt-6">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  'Gerar Estrutura'
                )}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="preview" className="mt-4">
        <ScrollArea className="h-[calc(100vh-16rem)] rounded-md border p-4">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{data.pageTitle || 'Título da Página'}</h2>
            {data.pageSubtitle && (
              <p className="text-gray-600">{data.pageSubtitle}</p>
            )}
            
            <div className="rounded-lg border p-4 bg-gray-50">
              <p className="text-sm text-gray-500">
                Preview da página será gerado aqui com base nos campos e configurações definidas
              </p>
            </div>
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
} 