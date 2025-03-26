import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { ReactNode } from 'react';

interface StatCard {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

interface ListPageTemplateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  stats: StatCard[];
  createButton: {
    href: string;
    label: string;
  };
  children: React.ReactNode;
  isLoading?: boolean;
  error?: string | null;
  actions?: ReactNode;
  filters?: ReactNode;
}

export function ListPageTemplate({
  title,
  description,
  icon: Icon,
  stats,
  createButton,
  children,
  isLoading,
  error,
  actions,
  filters
}: ListPageTemplateProps) {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-8">
        {/* Cabeçalho */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>

        {/* Estatísticas */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-card/20 rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-2xl font-bold text-foreground">{stat.value}</h4>
                    <p className="text-muted-foreground text-sm">{stat.title}</p>
                  </div>
                  {stat.icon && (
                    <div className="text-primary">
                      {stat.icon}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Conteúdo */}
        <div className="space-y-6">
          {/* Barra de Ações */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Botões de Ação */}
            <div className="flex items-center gap-2">
              <Link 
                href={createButton.href}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={16} />
                <span>{createButton.label}</span>
              </Link>
            </div>
          </div>

          {/* Lista/Tabela */}
          <div className="mt-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-900/20 border border-red-800 text-red-300 px-4 py-3 rounded-lg">
                {error}
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 