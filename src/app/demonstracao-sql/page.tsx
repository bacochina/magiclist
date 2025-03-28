'use client';

import { useState } from 'react';
import { SQLDisplay } from '@/components/generators/SQLDisplay';
import { User, MapPin, CreditCard, Package, Boxes, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Interface para definir o tipo de coluna com referências opcionais
interface ColumnType {
  name: string;
  type: string;
  required: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  references?: {
    table: string;
    field: string;
  };
}

export default function DemonstracaoSQL() {
  // Dados de exemplo para a tabela
  const [tableName, setTableName] = useState('usuarios');
  const [columns, setColumns] = useState<ColumnType[]>([
    {
      name: 'id',
      type: 'uuid',
      required: true,
      isPrimaryKey: true,
      isForeignKey: false
    },
    {
      name: 'nome',
      type: 'varchar(255)',
      required: true,
      isPrimaryKey: false,
      isForeignKey: false
    },
    {
      name: 'email',
      type: 'varchar(255)',
      required: true,
      isPrimaryKey: false,
      isForeignKey: false
    },
    {
      name: 'senha',
      type: 'varchar(255)',
      required: true,
      isPrimaryKey: false,
      isForeignKey: false
    },
    {
      name: 'criado_em',
      type: 'timestamp',
      required: true,
      isPrimaryKey: false,
      isForeignKey: false
    }
  ]);

  // Lista de contextos predefinidos
  const contextCategories = [
    {
      id: 'basic',
      title: 'Dados Básicos',
      contexts: [
        {
          id: 'user',
          name: 'Usuário',
          description: 'Campos comuns para tabela de usuários',
          icon: User
        },
        {
          id: 'address',
          name: 'Endereço',
          description: 'Campos para endereço completo',
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
          icon: Package
        },
        {
          id: 'inventory',
          name: 'Estoque',
          description: 'Campos para controle de estoque',
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
          icon: CreditCard
        },
        {
          id: 'invoice',
          name: 'Nota Fiscal',
          description: 'Campos para notas fiscais',
          icon: Receipt
        }
      ]
    }
  ];

  // Função para alternar entre tabelas de exemplo
  const changeTableExample = (tableType: string) => {
    switch (tableType) {
      case 'user':
        setTableName('usuarios');
        setColumns([
          {
            name: 'id',
            type: 'uuid',
            required: true,
            isPrimaryKey: true,
            isForeignKey: false
          },
          {
            name: 'nome',
            type: 'varchar(255)',
            required: true,
            isPrimaryKey: false,
            isForeignKey: false
          },
          {
            name: 'email',
            type: 'varchar(255)',
            required: true,
            isPrimaryKey: false,
            isForeignKey: false
          },
          {
            name: 'senha',
            type: 'varchar(255)',
            required: true,
            isPrimaryKey: false,
            isForeignKey: false
          },
          {
            name: 'criado_em',
            type: 'timestamp',
            required: true,
            isPrimaryKey: false,
            isForeignKey: false
          }
        ]);
        break;
      
      case 'product':
        setTableName('produtos');
        setColumns([
          {
            name: 'id',
            type: 'uuid',
            required: true,
            isPrimaryKey: true,
            isForeignKey: false
          },
          {
            name: 'nome',
            type: 'varchar(255)',
            required: true,
            isPrimaryKey: false,
            isForeignKey: false
          },
          {
            name: 'descricao',
            type: 'text',
            required: false,
            isPrimaryKey: false,
            isForeignKey: false
          },
          {
            name: 'preco',
            type: 'decimal(10,2)',
            required: true,
            isPrimaryKey: false,
            isForeignKey: false
          },
          {
            name: 'categoria_id',
            type: 'uuid',
            required: true,
            isPrimaryKey: false,
            isForeignKey: true,
            references: {
              table: 'categorias',
              field: 'id'
            }
          },
          {
            name: 'ativo',
            type: 'boolean',
            required: true,
            isPrimaryKey: false,
            isForeignKey: false
          }
        ]);
        break;
        
      case 'payment':
        setTableName('pagamentos');
        setColumns([
          {
            name: 'id',
            type: 'uuid',
            required: true,
            isPrimaryKey: true,
            isForeignKey: false
          },
          {
            name: 'pedido_id',
            type: 'uuid',
            required: true,
            isPrimaryKey: false,
            isForeignKey: true,
            references: {
              table: 'pedidos',
              field: 'id'
            }
          },
          {
            name: 'valor',
            type: 'decimal(10,2)',
            required: true,
            isPrimaryKey: false,
            isForeignKey: false
          },
          {
            name: 'metodo',
            type: 'varchar(50)',
            required: true,
            isPrimaryKey: false,
            isForeignKey: false
          },
          {
            name: 'status',
            type: 'varchar(20)',
            required: true,
            isPrimaryKey: false,
            isForeignKey: false
          },
          {
            name: 'data_pagamento',
            type: 'timestamp',
            required: false,
            isPrimaryKey: false,
            isForeignKey: false
          }
        ]);
        break;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold text-white mb-6">Demonstração do Componente SQL</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna da Esquerda - Contextos */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-800/60 shadow-[0_0_15px_rgba(0,0,0,0.2),0_0_3px_rgba(0,0,0,0.3),inset_0_0_1px_rgba(255,255,255,0.2)] overflow-hidden">
          <div className="p-5 pb-4 border-b border-slate-700/50">
            <h2 className="text-lg font-medium text-slate-100 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
              Contextos
            </h2>
          </div>
          <div className="px-2 py-3 max-h-[400px] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 gap-2 px-2">
              {contextCategories.map((category) => (
                <div key={category.id} className="mb-3">
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 mb-2 ml-1 font-semibold">{category.title}</h3>
                  <div className="space-y-1.5">
                    {category.contexts.map((context) => (
                      <Button
                        key={context.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => changeTableExample(context.id)}
                        className="w-full justify-start bg-slate-800/40 hover:bg-slate-700/60 border border-slate-700/40 shadow-sm"
                      >
                        <context.icon className="h-3.5 w-3.5 mr-2 text-emerald-400" />
                        <span>{context.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Coluna da Direita - SQL Display */}
        <div>
          <SQLDisplay tableName={tableName} columns={columns} />
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