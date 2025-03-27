'use client';

import { useState } from 'react';
import { Database, Code2, Palette, Monitor, Info } from 'lucide-react';
import type { PagePreviewData } from './PagePreview';

interface PreviewAnalysisProps {
  template: PagePreviewData;
}

interface TabContentProps {
  content: {
    title: string;
    items: string[];
  }[];
}

interface ContentSection {
  title: string;
  items: string[];
}

interface ViewTypeContent {
  estilo: ContentSection[];
  banco: ContentSection[];
  funcionalidades: ContentSection[];
  detalhamento: ContentSection[];
  tecnologias: ContentSection[];
}

interface TemplateViewContent {
  listagem: ViewTypeContent;
  detalhamento: ViewTypeContent;
  tecnologias: ViewTypeContent;
}

interface TemplateContentMap {
  [key: string]: TemplateViewContent;
}

const TabContent = ({ content }: TabContentProps) => (
  <div className="space-y-6">
    {content.map((section, index) => (
      <div key={index} className="space-y-3">
        <h3 className="text-lg font-medium text-white">{section.title}</h3>
        <ul className="space-y-2">
          {section.items.map((item, itemIndex) => (
            <li key={itemIndex} className="text-gray-300 flex items-center space-x-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

export function PreviewAnalysis({ template }: PreviewAnalysisProps) {
  const [activeTab, setActiveTab] = useState<'estilo' | 'banco' | 'funcionalidades' | 'detalhamento' | 'tecnologias'>('estilo');
  const [viewType, setViewType] = useState<'listagem' | 'detalhamento' | 'tecnologias'>('listagem');

  const templateContentMap: TemplateContentMap = {
    bandas: {
    listagem: {
      estilo: [
        {
          title: 'Layout e Componentes',
          items: [
              'Grid responsivo com cards',
              'Esquema de cores escuro',
              'Badges coloridos',
              'Ícones de ação',
          ]
        }
      ],
      banco: [
        {
            title: 'Tabelas',
          items: [
              'bandas (id, nome)',
              'generos (id, nome)',
              'musicas (id, título)',
          ]
        }
      ],
      funcionalidades: [
        {
            title: 'Operações',
          items: [
              'Listagem básica',
              'Busca simples',
              'Filtros básicos',
          ]
        }
        ],
        detalhamento: [
          {
            title: 'Classes',
            items: [
              'grid grid-cols-1',
              'flex flex-col',
              'text-sm font-medium',
            ]
          }
        ],
        tecnologias: [
          {
            title: 'Stack',
            items: [
              'React 18',
              'Next.js 14',
              'TailwindCSS',
            ]
          }
        ]
      },
      detalhamento: {
        estilo: [
          {
            title: 'Design',
            items: [
              'Tema escuro',
              'Design tokens',
              'Sistema de cores',
            ]
          }
        ],
        banco: [
          {
            title: 'Dados',
            items: [
              'PostgreSQL',
              'Prisma ORM',
              'Cache Redis',
            ]
          }
        ],
        funcionalidades: [
          {
            title: 'Features',
            items: [
              'API REST',
              'WebSockets',
              'GraphQL',
            ]
          }
        ],
        detalhamento: [
          {
            title: 'Arquitetura',
            items: [
              'Modular',
              'Lazy loading',
              'Context API',
            ]
          }
        ],
        tecnologias: [
          {
            title: 'Stack',
            items: [
              'TypeScript',
              'ESLint',
              'Jest',
            ]
          }
        ]
      },
      tecnologias: {
        estilo: [
          {
            title: 'UI/UX',
            items: [
              'Design System',
              'Acessibilidade',
              'Temas',
            ]
          }
        ],
        banco: [
          {
            title: 'Backend',
            items: [
              'PostgreSQL',
              'Redis',
              'S3',
            ]
          }
        ],
        funcionalidades: [
          {
            title: 'Features',
            items: [
              'REST',
              'WebSocket',
              'GraphQL',
            ]
          }
        ],
        detalhamento: [
          {
            title: 'DevOps',
            items: [
              'Docker',
              'Kubernetes',
              'Logs',
            ]
          }
        ],
        tecnologias: [
          {
            title: 'Stack',
            items: [
              'Next.js',
              'TypeScript',
              'TailwindCSS',
            ]
          }
        ]
      }
    }
  };

  const defaultContent: {[key: string]: ContentSection[]} = {
    estilo: [{ title: 'Estilo', items: ['Layout responsivo', 'Componentes interativos'] }],
    banco: [{ title: 'Dados', items: ['Estrutura de tabela principal', 'Relacionamentos'] }],
    funcionalidades: [{ title: 'Funcionalidades', items: ['Listagem', 'Filtros', 'CRUD básico'] }],
    detalhamento: [{ title: 'CSS', items: ['Classes tailwind', 'Estilos customizados'] }],
    tecnologias: [{ title: 'Stack', items: ['Frontend', 'Backend'] }]
  };

  const getContent = () => {
    const templateName = template.name as string;
    
    if (templateContentMap[templateName] && 
        templateContentMap[templateName][viewType] && 
        templateContentMap[templateName][viewType][activeTab]) {
      return templateContentMap[templateName][viewType][activeTab];
    }
    return defaultContent[activeTab] || [{ title: 'Informação', items: ['Detalhes não disponíveis'] }];
  };

  const tabs = [
    {
      id: 'estilo' as const,
      label: 'Estilo',
      icon: <Palette className="w-4 h-4" />
    },
    {
      id: 'banco' as const,
      label: 'Banco de Dados',
      icon: <Database className="w-4 h-4" />
    },
    {
      id: 'funcionalidades' as const,
      label: 'Funcionalidades',
      icon: <Code2 className="w-4 h-4" />
    },
    {
      id: 'detalhamento' as const,
      label: 'Detalhamento',
      icon: <Info className="w-4 h-4" />
    },
    {
      id: 'tecnologias' as const,
      label: 'Tecnologias',
      icon: <Monitor className="w-4 h-4" />
    }
  ];

  const viewTypeTabs = [
    { id: 'listagem' as const, label: 'Listagem' },
    { id: 'detalhamento' as const, label: 'Detalhamento' },
    { id: 'tecnologias' as const, label: 'Tecnologias' }
  ];

  return (
    <div className="bg-slate-800 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-white">Análise de Componentes</h2>
        <div className="flex flex-wrap gap-2">
          {viewTypeTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewType(tab.id)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewType === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-6">
        <TabContent content={getContent()} />
      </div>
    </div>
  );
} 