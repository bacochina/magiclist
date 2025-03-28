'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldTypeSelector } from './FieldTypeSelector';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, ChevronUp, ChevronDown, Copy, Trash2, Loader2, Wand2, Database, MessageSquarePlus, Plus, Code } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LucideIcon } from 'lucide-react';
import { User, MapPin, Package, Boxes, CreditCard, Receipt, Shield, Lock, Tags, Link } from 'lucide-react';

// Mantenha as interfaces existentes
interface Field {
  name: string;
  type: string;
  description: string;
  required: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  references?: {
    table: string;
    field: string;
  };
}

interface Index {
  name: string;
  fields: string[];
  type: 'btree' | 'hash' | 'gin' | 'gist';
  unique: boolean;
}

interface Constraint {
  name: string;
  type: 'check' | 'unique' | 'foreign_key';
  definition: string;
}

interface Context {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon: LucideIcon;
}

interface ContextCategory {
  id: string;
  title: string;
  contexts: Context[];
}

interface DatabaseSchemaBuilderProps {
  onSchemaChange: (schema: any) => void;
  initialData?: {
    pageTitle: string;
    pageSubtitle: string;
    tableName: string;
    tableFunction: string;
    fields: Field[];
    relationships: any[];
    constraints: Constraint[];
    indexes: Index[];
  };
}

// Função para gerar o comando SQL
const generateCreateTableSQL = (tableName: string, fields: Field[], indexes: Index[], constraints: Constraint[]): string => {
  if (!tableName || fields.length === 0) return '';

  // Iniciar a declaração CREATE TABLE
  let sql = `CREATE TABLE ${tableName} (\n`;
  
  // Adicionar campos
  const fieldDefinitions = fields.map(field => {
    let definition = `  ${field.name} ${field.type}`;
    
    // Adicionar NOT NULL se o campo for obrigatório
    if (field.required) {
      definition += ' NOT NULL';
    }
    
    // Adicionar PRIMARY KEY se for chave primária
    if (field.isPrimaryKey) {
      definition += ' PRIMARY KEY';
    }
    
    // Adicionar referência de chave estrangeira
    if (field.isForeignKey && field.references) {
      definition += ` REFERENCES ${field.references.table}(${field.references.field})`;
    }
    
    return definition;
  });
  
  // Juntar as definições de campos
  sql += fieldDefinitions.join(',\n');
  
  // Adicionar restrições
  if (constraints.length > 0) {
    const constraintDefinitions = constraints.map(constraint => {
      if (constraint.type === 'check') {
        return `  CONSTRAINT ${constraint.name} CHECK (${constraint.definition})`;
      } else if (constraint.type === 'unique') {
        return `  CONSTRAINT ${constraint.name} UNIQUE (${constraint.definition})`;
      }
      return '';
    }).filter(Boolean);
    
    if (constraintDefinitions.length > 0) {
      sql += ',\n' + constraintDefinitions.join(',\n');
    }
  }
  
  // Fechar a declaração CREATE TABLE
  sql += '\n);';
  
  // Adicionar criação de índices
  if (indexes.length > 0) {
    const indexDefinitions = indexes.map(index => {
      if (index.fields.length === 0) return '';
      
      let indexSQL = `\n\nCREATE `;
      if (index.unique) {
        indexSQL += 'UNIQUE ';
      }
      indexSQL += `INDEX ${index.name} ON ${tableName} USING ${index.type} (${index.fields.join(', ')});`;
      return indexSQL;
    }).filter(Boolean);
    
    sql += indexDefinitions.join('');
  }
  
  return sql;
};

// Inclua aqui as definições de PREDEFINED_CONTEXTS e CONTEXT_CATEGORIES do arquivo original

export function DatabaseSchemaBuilder({ onSchemaChange, initialData }: DatabaseSchemaBuilderProps) {
  // Inclua todos os estados do componente original
  const [fields, setFields] = useState<Field[]>(initialData?.fields || []);
  const [indexes, setIndexes] = useState<Index[]>(initialData?.indexes || []);
  const [constraints, setConstraints] = useState<Constraint[]>(initialData?.constraints || []);
  const [tableName, setTableName] = useState(initialData?.tableName || '');
  const [tableFunction, setTableFunction] = useState(initialData?.tableFunction || '');
  const [pageTitle, setPageTitle] = useState(initialData?.pageTitle || '');
  const [pageSubtitle, setPageSubtitle] = useState(initialData?.pageSubtitle || '');
  const [isGeneratingSubtitle, setIsGeneratingSubtitle] = useState(false);
  const [isGeneratingTableFunction, setIsGeneratingTableFunction] = useState(false);
  const [isGeneratingFields, setIsGeneratingFields] = useState(false);
  const [isGeneratingSpecificFields, setIsGeneratingSpecificFields] = useState(false);
  const [lastNotifiedData, setLastNotifiedData] = useState({
    pageTitle: initialData?.pageTitle || '',
    pageSubtitle: initialData?.pageSubtitle || '',
    tableName: initialData?.tableName || '',
    tableFunction: initialData?.tableFunction || '',
    fields: initialData?.fields || [],
    indexes: initialData?.indexes || [],
    constraints: initialData?.constraints || [],
  });
  const [customContext, setCustomContext] = useState('');
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const [showCustomContextDialog, setShowCustomContextDialog] = useState(false);
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(false);
  // Novo estado para o painel SQL
  const [showSQLPanel, setShowSQLPanel] = useState(true);
  
  // Inclua aqui todas as funções e manipuladores de eventos do componente original
  
  // Lógica para gerar o SQL atualizado quando algum dado relevante muda
  const sqlCommand = useMemo(() => {
    return generateCreateTableSQL(tableName, fields, indexes, constraints);
  }, [tableName, fields, indexes, constraints]);

  // Função auxiliar para criar um campo vazio (se necessário para o componente)
  const createEmptyField = (): Field => ({
    name: '',
    type: 'varchar(255)',
    description: '',
    required: false,
    isPrimaryKey: false,
    isForeignKey: false
  });

  // Função de exemplo para remover um campo (se necessário para o componente)
  const removeField = (index: number) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  // Substitua por sua real implementação
  const generateSpecificFields = async (context: string) => {
    // Implementação fictícia
    console.log("Gerando campos para contexto:", context);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho e campos principais */}
      <div className="grid grid-cols-1 gap-6">
        {/* Área de contextos e SQL */}
        <div>
          {/* Componente de contextos */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-800/60 shadow-[0_0_15px_rgba(0,0,0,0.2),0_0_3px_rgba(0,0,0,0.3),inset_0_0_1px_rgba(255,255,255,0.2)] overflow-hidden">
            <div className="p-5 pb-4 border-b border-slate-700/50">
              <h2 className="text-lg font-medium text-slate-100 flex items-center justify-between">
                <span className="flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                  Contextos
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSQLPanel(!showSQLPanel)}
                    className="text-xs bg-slate-800/90 hover:bg-slate-700/90 border-slate-700/50 text-slate-300 h-7 px-2 py-0"
                  >
                    <Code className="h-3.5 w-3.5 mr-1" />
                    {showSQLPanel ? 'Ocultar SQL' : 'Mostrar SQL'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCustomContextDialog(true)}
                    className="text-xs bg-slate-800/90 hover:bg-slate-700/90 border-slate-700/50 text-slate-300 h-7 px-2 py-0"
                  >
                    <MessageSquarePlus className="h-3.5 w-3.5 mr-1" />
                    Personalizado
                  </Button>
                </div>
              </h2>
            </div>
            
            <div className="flex flex-row">
              {/* Área de contextos */}
              <div className={`px-2 py-3 max-h-[400px] overflow-y-auto custom-scrollbar ${showSQLPanel ? 'w-1/2 border-r border-slate-700/30' : 'w-full'}`}>
                <p className="text-center text-slate-500 text-sm">
                  Selecione um contexto para gerar campos
                </p>
              </div>
              
              {/* Painel SQL - visível apenas quando showSQLPanel é true */}
              {showSQLPanel && (
                <div className="w-1/2 p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                  <div className="bg-slate-800/80 border border-slate-700/50 rounded-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-slate-200 flex items-center">
                        <Database className="h-3.5 w-3.5 mr-2 text-blue-400" />
                        Comando SQL
                      </h3>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                          onClick={() => {
                            navigator.clipboard.writeText(sqlCommand);
                            toast.success('SQL copiado para a área de transferência!');
                          }}
                          title="Copiar SQL"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="relative">
                      <pre className="text-xs font-mono bg-slate-950/50 p-3 rounded overflow-x-auto text-green-400 custom-scrollbar">
                        {sqlCommand || 'Defina o nome da tabela e adicione campos para gerar o SQL'}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para contexto personalizado */}
      <Dialog open={showCustomContextDialog} onOpenChange={setShowCustomContextDialog}>
        <DialogContent className="max-w-3xl bg-slate-900/95 backdrop-blur-xl border-slate-700/50 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.3),0_0_10px_rgba(0,0,0,0.3),inset_0_0_1px_rgba(255,255,255,0.1)]">
          <div className="absolute inset-0 rounded-xl overflow-hidden -z-10">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>
          <DialogHeader>
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
              <DialogTitle className="text-slate-100">Contexto Personalizado</DialogTitle>
            </div>
            <DialogDescription className="text-slate-400">
              Descreva o contexto específico para gerar campos personalizados.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="context" className="text-slate-200 text-sm font-medium">Descreva seu Contexto</Label>
              <Textarea
                id="context"
                placeholder="Ex: Campos para controle de estoque com rastreamento de lotes e validade"
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                className="min-h-[150px] bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 resize-none"
              />
              <div className="bg-blue-900/20 border border-blue-600/20 rounded-lg p-3 mt-2">
                <p className="text-sm text-blue-300 flex items-start">
                  <span className="bg-blue-500/20 p-1 rounded-md mr-3 mt-0.5">
                    <Wand2 className="h-3.5 w-3.5 text-blue-400" />
                  </span>
                  <span>
                    <span className="font-medium">Dica:</span> Seja específico sobre o que você precisa. Inclua detalhes sobre regras de negócio,
                    validações necessárias e relacionamentos importantes.
                  </span>
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                generateSpecificFields(customContext);
                setShowCustomContextDialog(false);
              }}
              disabled={!customContext.trim() || isGeneratingFields}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-2 transition-colors"
            >
              {isGeneratingFields ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 mr-2 relative">
                    <Loader2 className="h-5 w-5 animate-spin absolute" />
                    <div className="h-5 w-5 rounded-full bg-white/10 absolute"></div>
                  </div>
                  Gerando Campos...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Wand2 className="h-4 w-4 mr-2" />
                  Gerar Campos Personalizados
                </div>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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