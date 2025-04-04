'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldTypeSelector } from './FieldTypeSelector';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, ChevronUp, ChevronDown, Copy, Trash2, Loader2, Wand2, Database, Plus, Code, ArrowUp, ArrowDown } from 'lucide-react';
import Swal from 'sweetalert2';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast, Toaster } from 'react-hot-toast';

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

// Comentar ou remover a interface ContextCategory
/*
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
*/

export interface DatabaseSchemaBuilderProps {
  onSchemaChange?: (data: {
    pageTitle: string;
    pageSubtitle: string;
    tableName: string;
    fields: Field[];
    indexes: Index[];
    constraints: Constraint[];
  }) => void;
  initialData?: {
    pageTitle: string;
    pageSubtitle: string;
    tableName: string;
    fields: Field[];
    indexes: Index[];
    constraints: Constraint[];
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
  }).join(',\n');
  
  // Juntar as definições de campos
  sql += fieldDefinitions;
  
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
const PREDEFINED_CONTEXTS = {
  financeiro: {
    name: 'Campos Financeiros',
    description: 'Campos relacionados a valores, transações e controle financeiro',
    icon: <Database className="h-4 w-4" />,
    suggestions: [
      'valores monetários',
      'datas de vencimento',
      'status de pagamento',
      'métodos de pagamento',
      'histórico de transações'
    ]
  },
  auditoria: {
    name: 'Campos de Auditoria',
    description: 'Campos para rastreamento e auditoria de mudanças',
    icon: <Database className="h-4 w-4" />,
    suggestions: [
      'logs de alterações',
      'histórico de versões',
      'responsáveis por mudanças',
      'timestamps de operações'
    ]
  },
  metadados: {
    name: 'Campos de Metadados',
    description: 'Campos para informações adicionais e classificação',
    icon: <Database className="h-4 w-4" />,
    suggestions: [
      'tags',
      'categorias',
      'status',
      'prioridade',
      'metadados customizados'
    ]
  },
  endereco: {
    name: 'Campos de Endereço',
    description: 'Campos para endereçamento e localização',
    icon: <Database className="h-4 w-4" />,
    suggestions: [
      'endereço completo',
      'CEP',
      'coordenadas geográficas',
      'referências'
    ]
  },
  contato: {
    name: 'Campos de Contato',
    description: 'Campos para informações de contato',
    icon: <Database className="h-4 w-4" />,
    suggestions: [
      'telefones',
      'emails',
      'redes sociais',
      'preferências de contato'
    ]
  },
  documentos: {
    name: 'Campos de Documentos',
    description: 'Campos para documentação e arquivos',
    icon: <Database className="h-4 w-4" />,
    suggestions: [
      'anexos',
      'documentos oficiais',
      'histórico de versões',
      'metadados de arquivos'
    ]
  },
  pessoa: {
    name: 'Campos de Pessoa',
    description: 'Campos para informações pessoais e identificação',
    icon: <Database className="h-4 w-4" />,
    suggestions: [
      'dados pessoais',
      'documentos de identificação',
      'informações demográficas',
      'preferências'
    ]
  },
  produto: {
    name: 'Campos de Produto',
    description: 'Campos para cadastro e gestão de produtos',
    icon: <Database className="h-4 w-4" />,
    suggestions: [
      'informações básicas',
      'especificações técnicas',
      'preços e custos',
      'estoque',
      'categorização'
    ]
  },
  evento: {
    name: 'Campos de Evento',
    description: 'Campos para gestão de eventos e agendamentos',
    icon: <Database className="h-4 w-4" />,
    suggestions: [
      'datas e horários',
      'local',
      'participantes',
      'recursos necessários',
      'status do evento'
    ]
  },
  seguranca: {
    name: 'Campos de Segurança',
    description: 'Campos para controle de acesso e segurança',
    icon: <Database className="h-4 w-4" />,
    suggestions: [
      'permissões',
      'logs de acesso',
      'tokens e chaves',
      'configurações de segurança'
    ]
  },
  integracao: {
    name: 'Campos de Integração',
    description: 'Campos para integração com sistemas externos',
    icon: <Database className="h-4 w-4" />,
    suggestions: [
      'identificadores externos',
      'tokens de API',
      'configurações de sincronização',
      'mapeamentos'
    ]
  }
};

// Comentar ou remover a definição de CONTEXT_CATEGORIES
/*
const CONTEXT_CATEGORIES: ContextCategory[] = [
  {
    id: 'basic',
    title: 'Dados Básicos',
    contexts: [
      {
        id: 'user',
        name: 'Usuário',
        description: 'Campos comuns para tabela de usuários',
        prompt: 'Gere campos para uma tabela de usuários com dados básicos como nome, email, senha, etc.',
        icon: User
      },
      {
        id: 'address',
        name: 'Endereço',
        description: 'Campos para endereço completo',
        prompt: 'Gere campos para armazenar um endereço completo com CEP, rua, número, etc.',
        icon: MapPin
      }
    ]
  },
  {
    id: 'management',
    title: 'Gestão',
    contexts: [
      {
        id: 'product',
        name: 'Produto',
        description: 'Campos para cadastro de produtos',
        prompt: 'Gere campos para uma tabela de produtos com dados como nome, descrição, preço, etc.',
        icon: Package
      },
      {
        id: 'inventory',
        name: 'Estoque',
        description: 'Campos para controle de estoque',
        prompt: 'Gere campos para controle de estoque com quantidade, lote, validade, etc.',
        icon: Boxes
      }
    ]
  },
  {
    id: 'financial',
    title: 'Financeiro',
    contexts: [
      {
        id: 'payment',
        name: 'Pagamento',
        description: 'Campos para registro de pagamentos',
        prompt: 'Gere campos para registrar pagamentos com valor, data, status, etc.',
        icon: CreditCard
      },
      {
        id: 'invoice',
        name: 'Nota Fiscal',
        description: 'Campos para notas fiscais',
        prompt: 'Gere campos para uma tabela de notas fiscais com número, série, valor, etc.',
        icon: Receipt
      }
    ]
  },
  {
    id: 'security',
    title: 'Segurança e Controle',
    contexts: [
      {
        id: 'audit',
        name: 'Auditoria',
        description: 'Campos para registro de auditoria',
        prompt: 'Gere campos para registrar logs de auditoria com data, usuário, ação, etc.',
        icon: Shield
      },
      {
        id: 'access',
        name: 'Controle de Acesso',
        description: 'Campos para controle de permissões',
        prompt: 'Gere campos para controle de acesso e permissões de usuários.',
        icon: Lock
      }
    ]
  }
];
*/

export function DatabaseSchemaBuilder({ onSchemaChange, initialData }: DatabaseSchemaBuilderProps) {
  const [pageTitle, setPageTitle] = useState(initialData?.pageTitle || '');
  const [pageSubtitle, setPageSubtitle] = useState(initialData?.pageSubtitle || '');
  const [tableName, setTableName] = useState(initialData?.tableName || '');
  const [tableContext, setTableContext] = useState('');
  const [fields, setFields] = useState<Field[]>(initialData?.fields || []);
  const [indexes, setIndexes] = useState<Index[]>(initialData?.indexes || []);
  const [constraints, setConstraints] = useState<Constraint[]>(initialData?.constraints || []);
  const [isGeneratingSpecificFields, setIsGeneratingSpecificFields] = useState(false);
  const [lastNotifiedData, setLastNotifiedData] = useState({
    pageTitle: initialData?.pageTitle || '',
    pageSubtitle: initialData?.pageSubtitle || '',
    tableName: initialData?.tableName || '',
    fields: initialData?.fields || [],
    indexes: initialData?.indexes || [],
    constraints: initialData?.constraints || []
  });
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(false);
  const [searchResults, setSearchResults] = useState('');
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  
  useEffect(() => {
    if (onSchemaChange) {
      const currentData = {
        pageTitle,
        pageSubtitle,
        tableName,
        fields,
        indexes,
        constraints
      };

      // Verifica se houve mudanças desde a última notificação
      if (
        JSON.stringify(currentData) !== JSON.stringify(lastNotifiedData)
      ) {
        onSchemaChange(currentData);
        setLastNotifiedData(currentData);
      }
    }
  }, [pageTitle, pageSubtitle, tableName, fields, indexes, constraints, onSchemaChange, lastNotifiedData]);

  const sqlCommand = useMemo(() => {
    if (!tableName || !fields.length) return '';

    const fieldDefinitions = fields.map(field => {
      let definition = `  ${field.name} ${field.type}`;
      if (field.required) definition += ' NOT NULL';
      if (field.isPrimaryKey) definition += ' PRIMARY KEY';
      return definition;
    }).join(',\n');

    const foreignKeyDefinitions = fields
      .filter(field => field.isForeignKey && field.references)
      .map(field => {
        return `  FOREIGN KEY (${field.name}) REFERENCES ${field.references?.table}(${field.references?.field})`;
      })
      .join(',\n');

    let sql = `CREATE TABLE ${tableName} (\n${fieldDefinitions}`;
    if (foreignKeyDefinitions) {
      sql += `,\n${foreignKeyDefinitions}`;
    }
    sql += '\n);';

    return sql;
  }, [tableName, fields]);

  const generateFields = async () => {
    if (!tableName) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Por favor, insira o nome da tabela primeiro.'
      });
      return;
    }

    setIsGeneratingSpecificFields(true);
    try {
      // Gerar campos baseados no nome da tabela
      const suggestedFields = suggestFields(tableName);
      
      // Atualizar os campos
      setFields(suggestedFields);
      
      // Gerar índices sugeridos
      const suggestedIndexes = suggestIndexes(suggestedFields);
      setIndexes(suggestedIndexes);
      
      // Gerar constraints sugeridas
      const suggestedConstraints = suggestConstraints(suggestedFields);
      setConstraints(suggestedConstraints);

      await Swal.fire({
        icon: 'success',
        title: 'Sucesso',
        text: 'Campos gerados com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao gerar campos:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Ocorreu um erro ao gerar os campos.'
      });
    } finally {
      setIsGeneratingSpecificFields(false);
    }
  };

  const suggestFields = (tableName: string) => {
    const commonFields = [
      {
        name: 'id',
        type: 'uuid',
        required: true,
        isPrimaryKey: true,
        isForeignKey: false,
        description: 'Identificador único do registro'
      },
      {
        name: 'created_at',
        type: 'timestamp',
        required: true,
        isPrimaryKey: false,
        isForeignKey: false,
        description: 'Data e hora de criação do registro'
      },
      {
        name: 'updated_at',
        type: 'timestamp',
        required: true,
        isPrimaryKey: false,
        isForeignKey: false,
        description: 'Data e hora da última atualização do registro'
      }
    ];

    const fieldSuggestions: { [key: string]: Field[] } = {
      usuarios: [
        { name: 'nome', type: 'text', required: true, isPrimaryKey: false, isForeignKey: false, description: 'Nome completo do usuário' },
        { name: 'email', type: 'text', required: true, isPrimaryKey: false, isForeignKey: false, description: 'Endereço de e-mail do usuário' },
        { name: 'senha', type: 'text', required: true, isPrimaryKey: false, isForeignKey: false, description: 'Senha do usuário (hash)' },
        { name: 'ativo', type: 'boolean', required: true, isPrimaryKey: false, isForeignKey: false, description: 'Status de ativação do usuário' }
      ],
      produtos: [
        { name: 'nome', type: 'text', required: true, isPrimaryKey: false, isForeignKey: false, description: 'Nome do produto' },
        { name: 'descricao', type: 'text', required: false, isPrimaryKey: false, isForeignKey: false, description: 'Descrição detalhada do produto' },
        { name: 'preco', type: 'decimal', required: true, isPrimaryKey: false, isForeignKey: false, description: 'Preço do produto' },
        { name: 'estoque', type: 'integer', required: true, isPrimaryKey: false, isForeignKey: false, description: 'Quantidade em estoque' }
      ],
      categorias: [
        { name: 'nome', type: 'text', required: true, isPrimaryKey: false, isForeignKey: false, description: 'Nome da categoria' },
        { name: 'descricao', type: 'text', required: false, isPrimaryKey: false, isForeignKey: false, description: 'Descrição da categoria' },
        { name: 'ativa', type: 'boolean', required: true, isPrimaryKey: false, isForeignKey: false, description: 'Status de ativação da categoria' }
      ]
    };

    const normalizedTableName = tableName.toLowerCase().replace(/_/g, '');
    
    let suggestedFields = commonFields;
    for (const [key, fields] of Object.entries(fieldSuggestions)) {
      if (normalizedTableName.includes(key)) {
        suggestedFields = [...suggestedFields, ...fields];
        break;
      }
    }

    return suggestedFields;
  };

  const suggestIndexes = (fields: Field[]) => {
    const suggestedIndexes: Index[] = [];

    fields.forEach(field => {
      if (field.isForeignKey) {
        suggestedIndexes.push({
          name: `idx_${field.name}`,
          fields: [field.name],
          type: 'btree',
          unique: false
        });
      }
    });

    fields.forEach(field => {
      if (['email', 'nome', 'codigo'].some(pattern => field.name.toLowerCase().includes(pattern))) {
        suggestedIndexes.push({
          name: `idx_${field.name}`,
          fields: [field.name],
          type: 'btree',
          unique: field.name === 'email'
        });
      }
    });

    return suggestedIndexes;
  };

  const suggestConstraints = (fields: Field[]) => {
    const suggestedConstraints: Constraint[] = [];

    fields.forEach(field => {
      if (field.isForeignKey && field.references) {
        suggestedConstraints.push({
          name: `fk_${field.name}`,
          type: 'foreign_key',
          definition: `FOREIGN KEY (${field.name}) REFERENCES ${field.references.table}(${field.references.field})`
        });
      }
    });

    fields.forEach(field => {
      if (field.name === 'email' || field.name === 'codigo') {
        suggestedConstraints.push({
          name: `unq_${field.name}`,
          type: 'unique',
          definition: field.name
        });
      }
    });

    return suggestedConstraints;
  };

  const removeAllFields = async () => {
    if (fields.length > 0) {
      const result = await Swal.fire({
        title: 'Tem certeza?',
        text: "Você está prestes a remover todos os campos. Esta ação não pode ser desfeita!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Sim, remover todos!',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        setFields([]);
        await Swal.fire({
          title: 'Removido!',
          text: 'Todos os campos foram removidos com sucesso.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#10b981'
        });
      }
    }
  };

  const updateField = (index: number, updates: Partial<Field>) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], ...updates };
    setFields(updatedFields);
  };

  const handleFieldChange = (index: number, property: keyof Field, value: any) => {
    const updatedFields = [...fields];
    (updatedFields[index] as any)[property] = value;
    setFields(updatedFields);
  };

  const generateSubtitle = async () => {
    if (!pageTitle) {
      await Swal.fire({
        title: 'Atenção!',
        text: 'Digite o título da página primeiro',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#10b981'
      });
      return;
    }
    
    setIsGeneratingSpecificFields(true);
    try {
      const formattedTitle = pageTitle
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
        
      const suggestedSubtitle = `Gerencie e organize ${formattedTitle.toLowerCase()} de forma eficiente e intuitiva`;
      setPageSubtitle(suggestedSubtitle);
      await Swal.fire({
        title: 'Sucesso!',
        text: 'Subtítulo sugerido com sucesso!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#10b981'
      });
    } catch (error) {
      console.error('Erro:', error);
      const fallbackSuggestion = `Gerencie ${pageTitle.toLowerCase()} do sistema de forma eficiente`;
      setPageSubtitle(fallbackSuggestion);
      await Swal.fire({
        title: 'Erro!',
        text: 'Erro ao gerar sugestão. Usando sugestão padrão.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#10b981'
      });
    } finally {
      setIsGeneratingSpecificFields(false);
    }
  };

  const handleGenerateFieldsFromContext = async () => {
    if (!tableName) {
      toast.error('Por favor, insira o nome da tabela primeiro.');
      return;
    }

    setIsGeneratingSpecificFields(true);
    try {
      const generatedFields = await generateFieldsBasedOnContext(tableContext);
      setFields(generatedFields);
      toast.success('Campos gerados com sucesso!');
    } catch (error) {
      console.error('Error generating fields from context:', error);
      toast.error('Erro ao gerar campos a partir do contexto.');
    } finally {
      setIsGeneratingSpecificFields(false);
    }
  };

  const generateFieldsBasedOnContext = async (tableContext: string): Promise<Field[]> => {
    try {
      const response = await fetch('/api/ollama', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'context',
          pageTitle: pageTitle,
          pageSubtitle: pageSubtitle,
          tableName: tableName,
          context: tableContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fields generated by Ollama:', data);
      return data.fields;
    } catch (error) {
      console.error('Error generating fields from context with Ollama:', error);
      toast.error('Erro ao gerar campos a partir do contexto. Usando lógica padrão.');
      
      // Fallback to default logic
      const contextFields: Field[] = [
        {
          name: 'id',
          type: 'SERIAL',
          description: 'Identificador único do registro',
          required: true,
          isPrimaryKey: true,
          isForeignKey: false,
        },
        {
          name: 'created_at',
          type: 'TIMESTAMP WITH TIME ZONE',
          description: 'Data e hora de criação do registro',
          required: true,
          isPrimaryKey: false,
          isForeignKey: false,
        },
        {
          name: 'updated_at',
          type: 'TIMESTAMP WITH TIME ZONE',
          description: 'Data e hora da última atualização do registro',
          required: true,
          isPrimaryKey: false,
          isForeignKey: false,
        },
      ];

      return contextFields;
    }
  };

  const createEmptyField = (): Field => ({
    name: '',
    type: 'varchar(255)',
    description: '',
    required: false,
    isPrimaryKey: false,
    isForeignKey: false
  });

  const removeField = (index: number) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  // Adicionar função para mover campo para cima
  const moveFieldUp = (index: number) => {
    if (index <= 0) return;
    
    const updatedFields = [...fields];
    const temp = updatedFields[index];
    updatedFields[index] = updatedFields[index - 1];
    updatedFields[index - 1] = temp;
    
    setFields(updatedFields);
  };

  // Adicionar função para mover campo para baixo
  const moveFieldDown = (index: number) => {
    if (index >= fields.length - 1) return;
    
    const updatedFields = [...fields];
    const temp = updatedFields[index];
    updatedFields[index] = updatedFields[index + 1];
    updatedFields[index + 1] = temp;
    
    setFields(updatedFields);
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-800/60 shadow-[0_0_15px_rgba(0,0,0,0.2),0_0_3px_rgba(0,0,0,0.3),inset_0_0_1px_rgba(255,255,255,0.2)] overflow-hidden">
        <div className="p-5 pb-4 border-b border-slate-700/50">
          <h2 className="text-lg font-medium text-slate-100 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
            Detalhes da Página
          </h2>
        </div>
        <div className="p-6 space-y-5">
          <div className="space-y-3">
            <Label htmlFor="pageTitle" className="text-slate-300 text-sm font-medium inline-flex items-center">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></span>
              Título da Página
            </Label>
            <div className="relative">
              <Input
                id="pageTitle"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                placeholder="Título da página"
                className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/30 pr-10 h-10"
              />
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center">
              <Label htmlFor="pageSubtitle" className="text-slate-300 text-sm font-medium inline-flex items-center">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></span>
                Subtítulo da Página
              </Label>
              <span className="ml-2 text-[10px] bg-slate-800/80 px-1.5 py-0.5 rounded-full text-slate-400 border border-slate-700/50 font-medium tracking-wide">OPCIONAL</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={generateSubtitle}
                disabled={isGeneratingSpecificFields || !pageTitle}
                className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 h-auto self-stretch shadow-sm text-slate-300 hover:text-white transition-colors"
              >
                {isGeneratingSpecificFields ? (
                  <Loader2 className="h-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
              </Button>
              <div className="relative flex-1">
                <Textarea
                  id="pageSubtitle"
                  value={pageSubtitle}
                  onChange={(e) => setPageSubtitle(e.target.value)}
                  placeholder="Descreva o propósito desta página"
                  className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/30 resize-none min-h-[100px]"
                />
                <div className="absolute top-2.5 right-2.5 pr-0 flex items-center pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-800/60 shadow-[0_0_15px_rgba(0,0,0,0.2),0_0_3px_rgba(0,0,0,0.3),inset_0_0_1px_rgba(255,255,255,0.2)] overflow-hidden">
        <div className="p-5 pb-4 border-b border-slate-700/50">
          <h2 className="text-lg font-medium text-slate-100 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
            Estrutura da Tabela
          </h2>
        </div>
        <div className="p-6 space-y-5">
          <div className="space-y-3">
            <Label htmlFor="tableName" className="text-slate-300 text-sm font-medium inline-flex items-center">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 mr-2"></span>
              Nome da Tabela
            </Label>
            <div className="relative">
              <Input
                id="tableName"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="nome_da_tabela"
                className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/30 pr-10 h-10"
              />
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center">
              <Label htmlFor="tableContext" className="text-slate-300 text-sm font-medium inline-flex items-center">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 mr-2"></span>
                Descrição do Contexto
              </Label>
              <span className="ml-2 text-[10px] bg-slate-800/80 px-1.5 py-0.5 rounded-full text-slate-400 border border-slate-700/50 font-medium tracking-wide">RECOMENDADO</span>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Textarea
                  id="tableContext"
                  value={tableContext}
                  onChange={(e) => setTableContext(e.target.value)}
                  placeholder="Descreva detalhadamente o contexto desta tabela para que a IA possa sugerir os campos mais apropriados..."
                  className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/30 resize-none min-h-[100px]"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleGenerateFieldsFromContext}
                disabled={isGeneratingSpecificFields}
              >
                <Wand2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-800/60 shadow-[0_0_15px_rgba(0,0,0,0.2),0_0_3px_rgba(0,0,0,0.3),inset_0_0_1px_rgba(255,255,255,0.2)] overflow-hidden">
        <div className="p-5 pb-4 border-b border-slate-700/50">
          <h2 className="text-lg font-medium text-slate-100 flex items-center justify-between">
            <span className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-rose-500 mr-2"></span>
              Campos
              <span className="ml-2 text-xs bg-slate-800 px-1.5 py-0.5 rounded-full text-slate-400 font-medium">
                {fields.length} campo{fields.length === 1 ? '' : 's'}
              </span>
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSqlModalOpen(true)}
                className="bg-slate-800/50 hover:bg-slate-700/50 border-slate-700/50 text-slate-300 h-7 text-xs"
              >
                <Database className="h-3.5 w-3.5 mr-1" />
                <span>SQL</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={generateFields}
                disabled={isGeneratingSpecificFields || !tableName}
                className="bg-slate-800/50 hover:bg-slate-700/50 border-slate-700/50 text-slate-300 h-7 text-xs"
              >
                {isGeneratingSpecificFields ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                ) : (
                  <Wand2 className="h-3.5 w-3.5 mr-1" />
                )}
                <span>Sugerir</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFields([...fields, createEmptyField()])}
                className="bg-slate-800/50 hover:bg-slate-700/50 border-slate-700/50 text-slate-300 h-7"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Adicionar Campo
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={removeAllFields}
                disabled={fields.length === 0}
                className="bg-slate-800/50 hover:bg-red-900/30 border-slate-700/50 hover:border-red-700/50 text-slate-300 hover:text-red-300 h-7"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Remover Todos
              </Button>
            </div>
          </h2>
        </div>

        <div className="divide-y divide-slate-800/50">
          {fields.length === 0 ? (
            <div className="p-8 flex flex-col items-center justify-center text-center">
              <Database className="h-10 w-10 text-slate-600 mb-3" />
              <p className="text-slate-500 mb-4 text-sm">Nenhum campo definido</p>
              <p className="text-slate-600 max-w-md text-xs mb-5">Selecione um dos contextos ou adicione um campo manualmente</p>
              <Button
                onClick={() => setFields([...fields, createEmptyField()])}
                variant="outline" 
                className="bg-slate-800/70 hover:bg-slate-700/70 border-slate-700/50 text-slate-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Campo
              </Button>
            </div>
          ) : (
            <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-slate-700/50 bg-slate-800/30 text-xs font-medium text-slate-400 uppercase tracking-wider">
                <div className="col-span-3">Nome</div>
                <div className="col-span-2">Tipo</div>
                <div className="col-span-6">Descrição</div>
                <div className="col-span-1 text-right">Ações/Ordem</div>
              </div>

              {fields.map((field, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 px-4 py-2 hover:bg-slate-800/30 transition-colors items-start border-b border-slate-800/40">
                  <div className="col-span-3">
                    <Input
                      value={field.name}
                      onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                      placeholder="nome_campo"
                      className="h-7 text-sm bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-rose-500/40 focus:ring-rose-500/20"
                    />
                    <div className="mt-1 flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Checkbox 
                          id={`field-${index}-required`}
                          checked={field.required}
                          onCheckedChange={(checked) => 
                            updateField(index, { required: checked === true })
                          }
                          className="h-3.5 w-3.5 rounded-sm border-slate-700 data-[state=checked]:bg-rose-600 data-[state=checked]:border-rose-600"
                        />
                        <label htmlFor={`field-${index}-required`} className="text-xs text-slate-400">
                          Obrigatório
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Input
                      value={field.type}
                      onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                      placeholder="tipo"
                      className="h-7 text-sm bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-blue-500/40 focus:ring-blue-500/20"
                    />
                    <div className="mt-1 flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Checkbox
                          id={`field-${index}-pk`}
                          checked={field.isPrimaryKey}
                          onCheckedChange={(checked) => 
                            updateField(index, { isPrimaryKey: checked === true })
                          }
                          className="h-3.5 w-3.5 rounded-sm border-slate-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <label htmlFor={`field-${index}-pk`} className="text-xs text-slate-400">
                          PK
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-6">
                    <Textarea
                      value={field.description}
                      onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                      placeholder="Descrição detalhada do campo (propósito, formato, regras, etc.)"
                      className="h-16 min-h-16 text-sm bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-amber-500/40 focus:ring-amber-500/20 resize-none"
                    />
                    <div className="mt-1 flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Checkbox
                          id={`field-${index}-fk`}
                          checked={field.isForeignKey}
                          onCheckedChange={(checked) => {
                            if (checked === true) {
                              updateField(index, { 
                                isForeignKey: true,
                                references: {
                                  table: field.references?.table || "",
                                  field: field.references?.field || ""
                                }
                              });
                            } else {
                              updateField(index, { isForeignKey: false });
                            }
                          }}
                          className="h-3.5 w-3.5 rounded-sm border-slate-700 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                        />
                        <label htmlFor={`field-${index}-fk`} className="text-xs text-slate-400">
                          FK
                        </label>
                      </div>
                      {field.isForeignKey && (
                        <div className="flex items-center space-x-1 text-xs text-slate-400">
                          <span>Ref:</span>
                          <Input
                            value={field.references?.table || ""}
                            onChange={(e) => {
                              const table = e.target.value;
                              const fieldName = field.references?.field || "";
                              updateField(index, { 
                                references: { table, field: fieldName } 
                              });
                            }}
                            placeholder="tabela"
                            className="h-5 w-20 text-xs bg-slate-800/70 border-slate-700/50 text-white placeholder:text-slate-500"
                          />
                          <span>.</span>
                          <Input
                            value={field.references?.field || ""}
                            onChange={(e) => {
                              const fieldName = e.target.value;
                              const table = field.references?.table || "";
                              updateField(index, { 
                                references: { table, field: fieldName }
                              });
                            }}
                            placeholder="campo"
                            className="h-5 w-20 text-xs bg-slate-800/70 border-slate-700/50 text-white placeholder:text-slate-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveFieldUp(index)}
                      disabled={index === 0}
                      className="h-6 w-6 p-0 text-slate-400 hover:text-blue-400 hover:bg-blue-900/20"
                      title="Mover para cima"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveFieldDown(index)}
                      disabled={index === fields.length - 1}
                      className="h-6 w-6 p-0 text-slate-400 hover:text-blue-400 hover:bg-blue-900/20"
                      title="Mover para baixo"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField(index)}
                      className="h-6 w-6 p-0 text-slate-400 hover:text-red-400 hover:bg-red-900/20"
                      title="Remover campo"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
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

      {/* Modal SQL */}
      <Dialog open={isSqlModalOpen} onOpenChange={setIsSqlModalOpen}>
        <DialogContent className="bg-slate-900/95 backdrop-blur-xl border border-slate-800/60 shadow-[0_0_15px_rgba(0,0,0,0.2),0_0_3px_rgba(0,0,0,0.3),inset_0_0_1px_rgba(255,255,255,0.2)] text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-100 flex items-center">
              <Database className="h-5 w-5 mr-2 text-blue-400" />
              Comando SQL
            </DialogTitle>
            <DialogDescription className="text-slate-400 mt-1">
              Script para criação da tabela {tableName || "definida"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="bg-slate-800/80 border border-slate-700/50 rounded-md overflow-hidden">
              <div className="flex items-center justify-between p-3 bg-slate-900/60 border-b border-slate-700/50">
                <h3 className="text-sm font-medium text-slate-200 flex items-center">
                  <Code className="h-4 w-4 mr-2 text-blue-400" />
                  SQL
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                  onClick={async () => {
                    await navigator.clipboard.writeText(sqlCommand);
                    await Swal.fire({
                      title: 'Copiado!',
                      text: 'SQL copiado para a área de transferência!',
                      icon: 'success',
                      confirmButtonText: 'OK',
                      confirmButtonColor: '#10b981',
                      timer: 1500,
                      timerProgressBar: true
                    });
                  }}
                  title="Copiar SQL"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  <span className="text-xs">Copiar</span>
                </Button>
              </div>
              <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <pre className="text-sm font-mono bg-slate-950/70 p-4 rounded overflow-x-auto text-green-400 custom-scrollbar whitespace-pre-wrap">
                  {sqlCommand || 'Defina o nome da tabela e adicione campos para gerar o SQL'}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              className="bg-slate-800/50 hover:bg-slate-700/50 border-slate-700/50 text-slate-300"
              onClick={() => setIsSqlModalOpen(false)}
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 