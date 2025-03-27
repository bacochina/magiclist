"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Layers, Music2, Users, Calendar, Plus, Filter, Search, MoreHorizontal, ExternalLink, ChevronDown } from "lucide-react";
import Link from 'next/link';
import { PreviewAnalysis } from './PreviewAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import dynamic from 'next/dynamic';

export type PagePreviewData = {
  name: string;
  title: string;
  description: string;
  path: string;
  formPath: string;
  icon: React.ReactNode;
  count: string;
};

const pageTemplates: Record<string, PagePreviewData> = {
  bandas: {
    name: "bandas",
    title: "Bandas",
    description: "Gerenciamento de bandas com informações detalhadas e integrantes",
    path: "/preview/bandas",
    formPath: "/preview/bandas/nova",
    icon: <Layers className="w-4 h-4" />,
    count: "12 bandas",
  },
  musicas: {
    name: "musicas",
    title: "Músicas",
    description: "Cadastro de músicas com letras, acordes e partituras",
    path: "/preview/musicas",
    formPath: "/preview/musicas/nova",
    icon: <Music2 className="w-4 h-4" />,
    count: "48 músicas",
  },
  integrantes: {
    name: "integrantes",
    title: "Integrantes",
    description: "Gerenciamento de membros da banda e suas funções",
    path: "/preview/integrantes",
    formPath: "/preview/integrantes/novo",
    icon: <Users className="w-4 h-4" />,
    count: "24 integrantes",
  },
  eventos: {
    name: "eventos",
    title: "Eventos",
    description: "Agenda de shows, ensaios e compromissos",
    path: "/preview/eventos",
    formPath: "/preview/eventos/novo",
    icon: <Calendar className="w-4 h-4" />,
    count: "8 eventos",
  },
};

// Carregamento dinâmico das páginas de preview
const DynamicBandasPreview = dynamic(() => import('@/app/preview/bandas/page'), { 
  loading: () => <PreviewLoading title="Carregando Bandas..." />,
  ssr: false
});

const DynamicMusicasPreview = dynamic(() => import('@/app/preview/musicas/page'), { 
  loading: () => <PreviewLoading title="Carregando Músicas..." />,
  ssr: false
});

const DynamicIntegrantesPreview = dynamic(() => import('@/app/preview/integrantes/page'), { 
  loading: () => <PreviewLoading title="Carregando Integrantes..." />,
  ssr: false
});

const DynamicEventosPreview = dynamic(() => import('@/app/preview/eventos/page'), { 
  loading: () => <PreviewLoading title="Carregando Eventos..." />,
  ssr: false
});

const DynamicBandaNova = dynamic(() => import('@/app/preview/bandas/nova/page'), { 
  loading: () => <PreviewLoading title="Carregando Formulário de Banda..." />,
  ssr: false
});

const DynamicMusicaNova = dynamic(() => import('@/app/preview/musicas/nova/page'), { 
  loading: () => <PreviewLoading title="Carregando Formulário de Música..." />,
  ssr: false
});

const DynamicIntegranteNovo = dynamic(() => import('@/app/preview/integrantes/novo/page'), { 
  loading: () => <PreviewLoading title="Carregando Formulário de Integrante..." />,
  ssr: false
});

const DynamicEventoNovo = dynamic(() => import('@/app/preview/eventos/novo/page'), { 
  loading: () => <PreviewLoading title="Carregando Formulário de Evento..." />,
  ssr: false
});

// Componente de carregamento
function PreviewLoading({ title }: { title: string }) {
  return (
    <div className="bg-slate-900 rounded-lg p-6 h-[600px] flex flex-col items-center justify-center border border-slate-800">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-slate-400">{title}</p>
    </div>
  );
}

// Componente que exibe um preview embutido na página
function PreviewCard({ pageName, title, isForm }: { pageName: string; title: string; isForm: boolean }) {
  return (
    <div className="bg-slate-900 rounded-lg p-4 h-[600px] overflow-hidden border border-slate-800">
      <h2 className="text-sm font-medium text-slate-400 mb-2">{title}</h2>
      
      <div className="relative w-full h-[560px] rounded overflow-auto bg-slate-800">
        {/* Wrapper para conter o estilo e escopo do componente carregado */}
        <div className="w-full h-full preview-container">
          {pageName === 'bandas' && !isForm && <DynamicBandasPreview />}
          {pageName === 'bandas' && isForm && <DynamicBandaNova />}
          {pageName === 'musicas' && !isForm && <DynamicMusicasPreview />}
          {pageName === 'musicas' && isForm && <DynamicMusicaNova />}
          {pageName === 'integrantes' && !isForm && <DynamicIntegrantesPreview />}
          {pageName === 'integrantes' && isForm && <DynamicIntegranteNovo />}
          {pageName === 'eventos' && !isForm && <DynamicEventosPreview />}
          {pageName === 'eventos' && isForm && <DynamicEventoNovo />}
        </div>
      </div>
    </div>
  );
}

export function PagePreview() {
  const [selectedPage, setSelectedPage] = useState<string>("");
  const [showPreviews, setShowPreviews] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handlePageSelect = (value: string) => {
    setSelectedPage(value);
    setShowPreviews(true);
    setIsOpen(false);
  };

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Renderiza os previews
  const renderRealPreviews = () => {
    if (!selectedPage || !pageTemplates[selectedPage]) return null;
    
    const template = pageTemplates[selectedPage];
    
    return (
      <div className="space-y-6">
        <Tabs defaultValue="listagem" className="w-full">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="listagem" className="data-[state=active]:bg-slate-700">Listagem</TabsTrigger>
            <TabsTrigger value="formulario" className="data-[state=active]:bg-slate-700">Formulário</TabsTrigger>
          </TabsList>
          
          <TabsContent value="listagem" className="mt-4">
            <PreviewCard 
              pageName={template.name} 
              title={`Listagem de ${template.title}`}
              isForm={false}
            />
          </TabsContent>
          
          <TabsContent value="formulario" className="mt-4">
            <PreviewCard 
              pageName={template.name} 
              title={`Formulário de ${template.title}`}
              isForm={true}
            />
          </TabsContent>
        </Tabs>
        
        <PreviewAnalysis template={template} />
      </div>
    );
  };

  // Renderiza o seletor de página
  const renderPageSelector = () => {
    const selectedTemplate = selectedPage ? pageTemplates[selectedPage] : null;
    
    return (
      <div className="mb-8">
        <h3 className="text-sm text-slate-400 mb-2">Escolha um modelo de página para visualizar:</h3>
        
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full text-left px-4 py-2 rounded-md border border-slate-700 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            {selectedTemplate ? (
              <div className="flex items-center gap-2">
                {selectedTemplate.icon}
                <span>{selectedTemplate.title}</span>
              </div>
            ) : (
              <span className="text-slate-400">Selecione um modelo...</span>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </button>
          
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 rounded-md border border-slate-700 bg-slate-800 shadow-lg">
              <div className="py-1">
                {Object.values(pageTemplates).map((template) => (
                  <button
                    key={template.name}
                    type="button"
                    onClick={() => handlePageSelect(template.name)}
                    className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors"
                  >
                    {template.icon}
                    <span>{template.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="border-slate-700 bg-slate-900">
      <CardHeader>
        <h2 className="text-xl font-semibold text-white">Visualização da página</h2>
        <p className="text-slate-400">Veja como sua página aparecerá no sistema</p>
      </CardHeader>
      
      <CardContent>
        {renderPageSelector()}
        
        {showPreviews ? (
          renderRealPreviews()
        ) : (
          <div className="bg-slate-800 rounded-lg p-8 text-center border border-dashed border-slate-700">
            <div className="mb-4 text-slate-400">
              <ExternalLink className="w-16 h-16 mx-auto opacity-20" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Selecione um modelo para visualizar</h3>
            <p className="text-slate-400 mb-6">
              Escolha um dos modelos disponíveis para ver como sua página ficará no sistema.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 