'use client';

import { Copy, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SQLDisplayProps {
  tableName: string;
  columns: Array<{
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
}

export function SQLDisplay({ tableName, columns }: SQLDisplayProps) {
  // Gerar o comando SQL
  const generateSQL = () => {
    if (!tableName || columns.length === 0) {
      return 'Defina o nome da tabela e adicione campos para gerar o SQL';
    }

    // Iniciar a declaração CREATE TABLE
    let sql = `CREATE TABLE ${tableName} (\n`;
    
    // Adicionar colunas
    const columnDefinitions = columns.map(column => {
      let definition = `  ${column.name} ${column.type}`;
      
      // Adicionar NOT NULL se o campo for obrigatório
      if (column.required) {
        definition += ' NOT NULL';
      }
      
      // Adicionar PRIMARY KEY se for chave primária
      if (column.isPrimaryKey) {
        definition += ' PRIMARY KEY';
      }
      
      // Adicionar referência de chave estrangeira
      if (column.isForeignKey && column.references) {
        definition += ` REFERENCES ${column.references.table}(${column.references.field})`;
      }
      
      return definition;
    });
    
    // Juntar as definições de colunas
    sql += columnDefinitions.join(',\n');
    
    // Fechar a declaração CREATE TABLE
    sql += '\n);';
    
    return sql;
  };

  const sqlCommand = generateSQL();

  const handleCopySQL = () => {
    navigator.clipboard.writeText(sqlCommand);
    toast.success('SQL copiado para a área de transferência!');
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-800/60 shadow-[0_0_15px_rgba(0,0,0,0.2),0_0_3px_rgba(0,0,0,0.3),inset_0_0_1px_rgba(255,255,255,0.2)] overflow-hidden">
      <div className="p-5 pb-4 border-b border-slate-700/50">
        <h2 className="text-lg font-medium text-slate-100 flex items-center justify-between">
          <span className="flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
            Comando SQL
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopySQL}
            className="text-xs bg-slate-800/90 hover:bg-slate-700/90 border-slate-700/50 text-slate-300 h-7 px-2 py-0"
          >
            <Copy className="h-3.5 w-3.5 mr-1" />
            Copiar
          </Button>
        </h2>
      </div>
      <div className="p-4">
        <div className="bg-slate-800/80 border border-slate-700/50 rounded-md p-4">
          <div className="flex items-center mb-3">
            <Database className="h-4 w-4 mr-2 text-blue-400" />
            <h3 className="text-sm font-medium text-slate-200">
              Comando para criar a tabela {tableName || '[nome da tabela]'}
            </h3>
          </div>
          <div className="relative">
            <pre className="text-xs font-mono bg-slate-950/50 p-3 rounded overflow-x-auto text-green-400 custom-scrollbar">
              {sqlCommand}
            </pre>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.6);
        }
      `}</style>
    </div>
  );
} 