'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatabaseSchemaBuilder } from '@/components/generators/DatabaseSchemaBuilder';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { History, ArrowLeft, ArrowRight, ChevronRight, FileText, ExternalLink, Search } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
}

interface PageReference {
  id: string;
  title: string;
  route: string;
  category: string;
}

// Define os passos do processo de geração
type GeneratorStep = 'schema' | 'interface' | 'api' | 'review';

export default function GeneratorPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<GeneratorStep>('schema');
  const [generatedData, setGeneratedData] = useState({
    pageTitle: '',
    pageSubtitle: '',
    tableName: '',
    tableFunction: '',
    fields: [],
    relationships: [],
    constraints: [],
    indexes: [],
    pageReference: '', // Nova propriedade para armazenar a página de referência
  });
  
  const [ollamaConfig, setOllamaConfig] = useState({
    baseUrl: 'http://localhost:11434',
    model: 'llama2',
  });
  
  const [ollamaStatus, setOllamaStatus] = useState<'loading' | 'connected' | 'disconnected' | 'error'>('loading');
  const [ollamaModels, setOllamaModels] = useState<OllamaModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [availablePages, setAvailablePages] = useState<PageReference[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [pageSearchQuery, setPageSearchQuery] = useState('');

  // Estado para controlar qual prévia está sendo exibida na etapa de API
  const [previewMode, setPreviewMode] = useState<'list' | 'form'>('list');
  
  // Estado para controlar o passo na etapa de revisão
  const [reviewStep, setReviewStep] = useState<'sql' | 'location'>('sql');
  const [sqlCreated, setSqlCreated] = useState(false); // Controla se o usuário confirmou a criação da tabela
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Adicionar novo estado para controlar a etapa de confirmação
  const [confirmStep, setConfirmStep] = useState<'check' | 'confirm' | 'generate'>('check');
  const [pageExists, setPageExists] = useState(false);
  const [userChoice, setUserChoice] = useState<'yes' | 'no' | null>(null);

  // Menu hierárquico do sistema para selecionar onde a página será criada
  const systemMenu = [
    {
      id: 'admin',
      label: 'Admin',
      children: [
        { id: 'admin_dashboard', label: 'Dashboard', path: '/admin/dashboard' },
        { id: 'admin_gerar', label: 'Gerador de Páginas', path: '/admin/gerar' },
        { id: 'admin_config', label: 'Configurações', path: '/admin/config' },
      ]
    },
    {
      id: 'bandas',
      label: 'Bandas',
      children: [
        { id: 'bandas_lista', label: 'Lista de Bandas', path: '/bandas' },
        { id: 'bandas_nova', label: 'Nova Banda', path: '/bandas/nova' },
        { id: 'bandas_detalhes', label: 'Detalhes da Banda', path: '/bandas/[id]' },
      ]
    },
    {
      id: 'eventos',
      label: 'Eventos',
      children: [
        { id: 'eventos_shows', label: 'Shows', path: '/eventos/shows' },
        { id: 'eventos_ensaios', label: 'Ensaios', path: '/eventos/ensaios' },
        { id: 'eventos_reunioes', label: 'Reuniões', path: '/eventos/reunioes' },
      ]
    },
    {
      id: 'musicas',
      label: 'Músicas',
      children: [
        { id: 'musicas_lista', label: 'Lista de Músicas', path: '/musicas' },
        { id: 'musicas_nova', label: 'Nova Música', path: '/musicas/nova' },
        { id: 'musicas_detalhes', label: 'Detalhes da Música', path: '/musicas/[id]' },
      ]
    },
    {
      id: 'integrantes',
      label: 'Integrantes',
      children: [
        { id: 'integrantes_lista', label: 'Lista de Integrantes', path: '/integrantes' },
        { id: 'integrantes_novo', label: 'Novo Integrante', path: '/integrantes/novo' },
      ]
    },
    {
      id: 'estudos',
      label: 'Estudos',
      children: [
        { id: 'estudos_lista', label: 'Lista de Estudos', path: '/estudos' },
        { id: 'estudos_novo', label: 'Novo Estudo', path: '/estudos/novo' },
      ]
    },
    {
      id: 'configuracoes',
      label: 'Configurações',
      children: [
        { id: 'config_perfil', label: 'Perfil', path: '/configuracoes/perfil' },
        { id: 'config_sistema', label: 'Sistema', path: '/configuracoes/sistema' },
      ]
    },
  ];

  // Filtrar páginas de acordo com a busca
  const filteredPages = availablePages.filter(page => 
    page.title.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
    page.category.toLowerCase().includes(pageSearchQuery.toLowerCase())
  );

  // Função para renderizar opções agrupadas de páginas
  const renderPageOptions = () => {
    // Se não tiver páginas filtradas, exibir mensagem
    if (filteredPages.length === 0) {
      return (
        <div className="text-center py-3 text-slate-400 text-sm">
          Nenhuma página encontrada para "{pageSearchQuery}"
        </div>
      );
    }
    
    // Obter categorias únicas e ordenar
    const categories = Array.from(new Set(filteredPages.map(page => page.category))).sort();
    
    return categories.map((category) => (
      <SelectGroup key={category}>
        <SelectLabel className="text-slate-400">{category}</SelectLabel>
        {filteredPages
          .filter(page => page.category === category)
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((page) => (
            <SelectItem key={page.id} value={page.id} className="text-white hover:bg-slate-700">
              {page.title}
            </SelectItem>
          ))
        }
      </SelectGroup>
    ));
  };

  // Verificar status do Ollama ao carregar a página
  useEffect(() => {
    checkOllamaStatus();
    
    // Carregar configuração do localStorage
    const savedConfig = localStorage.getItem('ollamaConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setOllamaConfig(parsedConfig);
      } catch (e) {
        console.error('Erro ao carregar configuração do Ollama:', e);
      }
    }
  }, []);

  // Carregar páginas disponíveis quando o componente é montado
  useEffect(() => {
    loadAvailablePages();
  }, []);

  const handleSchemaChange = (schema: any) => {
    setGeneratedData(prev => ({
      ...prev,
      ...schema
    }));
  };
  
  const checkOllamaStatus = async () => {
    setOllamaStatus('loading');
    try {
      const response = await fetch(`${ollamaConfig.baseUrl}/api/tags`);
      
      if (response.ok) {
        setOllamaStatus('connected');
        const data = await response.json();
        if (data.models) {
          setOllamaModels(data.models);
        }
      } else {
        setOllamaStatus('disconnected');
      }
    } catch (error) {
      console.error('Erro ao verificar status do Ollama:', error);
      setOllamaStatus('error');
    }
  };
  
  const loadOllamaModels = async () => {
    setIsLoadingModels(true);
    try {
      const response = await fetch(`${ollamaConfig.baseUrl}/api/tags`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.models) {
          setOllamaModels(data.models);
          toast({
            title: "Modelos carregados",
            description: `${data.models.length} modelos encontrados no servidor Ollama.`,
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao carregar modelos",
          description: "Não foi possível carregar os modelos do Ollama.",
        });
      }
    } catch (error) {
      console.error('Erro ao carregar modelos do Ollama:', error);
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor Ollama.",
      });
    } finally {
      setIsLoadingModels(false);
    }
  };
  
  // Função para carregar a lista de páginas disponíveis no sistema
  const loadAvailablePages = async () => {
    setIsLoadingPages(true);
    try {
      // Lista completa de páginas disponíveis no sistema
      const systemPages: PageReference[] = [
        // Páginas principais
        { id: '1', title: 'Dashboard', route: '/dashboard', category: 'Principais' },
        
        // Gestão de bandas
        { id: '2', title: 'Gerenciamento de Bandas', route: '/bandas', category: 'Bandas' },
        { id: '3', title: 'Cadastro de Nova Banda', route: '/bandas/nova', category: 'Bandas' },
        { id: '4', title: 'Edição de Banda', route: '/bandas/editar', category: 'Bandas' },
        
        // Gestão de shows e eventos
        { id: '5', title: 'Gerenciamento de Shows', route: '/shows', category: 'Eventos' },
        { id: '6', title: 'Gerenciamento de Eventos', route: '/eventos', category: 'Eventos' },
        { id: '7', title: 'Gerenciamento de Ensaios', route: '/eventos/ensaios', category: 'Eventos' },
        { id: '8', title: 'Gerenciamento de Reuniões', route: '/eventos/reunioes', category: 'Eventos' },
        
        // Gestão de músicas e repertórios
        { id: '9', title: 'Gerenciamento de Músicas', route: '/musicas', category: 'Músicas' },
        { id: '10', title: 'Cadastro de Nova Música', route: '/musicas/novo', category: 'Músicas' },
        { id: '11', title: 'Detalhes da Música', route: '/musicas/[id]', category: 'Músicas' },
        { id: '12', title: 'Edição de Música', route: '/musicas/[id]/editar', category: 'Músicas' },
        { id: '13', title: 'Gerenciamento de Repertórios', route: '/repertorios', category: 'Músicas' },
        
        // Gestão de integrantes
        { id: '14', title: 'Gerenciamento de Músicos', route: '/integrantes', category: 'Integrantes' },
        
        // Estudos e desenvolvimento
        { id: '15', title: 'Estudo de Músicas', route: '/estudo-musicas', category: 'Estudos' },
        { id: '16', title: 'Gerenciamento de Estudos', route: '/estudos', category: 'Estudos' },
        
        // Templates e administração
        { id: '17', title: 'Gerenciamento de Templates', route: '/templates', category: 'Templates' },
        { id: '18', title: 'Cadastro de Templates', route: '/templates/cadastros', category: 'Templates' },
        { id: '19', title: 'Novo Template', route: '/templates/novo', category: 'Templates' },
        { id: '20', title: 'Gerador de Páginas', route: '/admin/gerar', category: 'Admin' },
        
        // Outros
        { id: '21', title: 'Configurações', route: '/configuracoes', category: 'Outros' },
        { id: '22', title: 'Gerenciamento de Pedaleiras', route: '/pedaleiras', category: 'Outros' },
        { id: '23', title: 'Gerenciamento de Blocos', route: '/blocos', category: 'Outros' },
        { id: '24', title: 'Ajuda e Suporte', route: '/help', category: 'Outros' },
      ];
      
      setAvailablePages(systemPages);
    } catch (error) {
      console.error('Erro ao carregar páginas:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar páginas",
        description: "Não foi possível carregar a lista de páginas do sistema.",
      });
    } finally {
      setIsLoadingPages(false);
    }
  };
  
  const saveOllamaConfig = () => {
    localStorage.setItem('ollamaConfig', JSON.stringify(ollamaConfig));
    // Atualizar variável de ambiente temporária
    (window as any).OLLAMA_API_URL = ollamaConfig.baseUrl;
    (window as any).OLLAMA_MODEL = ollamaConfig.model;
    
    toast({
      title: "Configuração salva",
      description: "As configurações do Ollama foram salvas.",
    });
    
    checkOllamaStatus();
  };

  // Função para avançar para o próximo passo
  const goToNextStep = () => {
    if (currentStep === 'schema') {
      // Verificar se tem informações suficientes para prosseguir
      if (!generatedData.tableName || generatedData.fields.length === 0) {
        toast({
          variant: "destructive",
          title: "Informações incompletas",
          description: "Por favor, defina o nome da tabela e adicione pelo menos um campo.",
        });
        return;
      }
      setCurrentStep('interface');
    } else if (currentStep === 'interface') {
      // Verificar se uma página de referência foi selecionada
      if (!generatedData.pageReference) {
        toast({
          variant: "destructive",
          title: "Página de referência não selecionada",
          description: "Por favor, selecione uma página existente como referência antes de continuar.",
        });
        return;
      }
      // Define a visualização inicial como lista quando avança para a etapa de API
      setPreviewMode('list');
      setCurrentStep('api');
    } else if (currentStep === 'api') {
      setCurrentStep('review');
    }
  };

  // Função para voltar ao passo anterior
  const goToPreviousStep = () => {
    if (currentStep === 'interface') {
      setCurrentStep('schema');
    } else if (currentStep === 'api') {
      setCurrentStep('interface');
    } else if (currentStep === 'review') {
      setCurrentStep('api');
    }
  };

  // Renderiza o título do passo atual
  const renderStepTitle = () => {
    switch(currentStep) {
      case 'schema':
        return 'Definição do Esquema de Dados';
      case 'interface':
        return 'Configuração da Interface';
      case 'api':
        return 'Configuração da API';
      case 'review':
        return 'Revisão e Finalização';
      default:
        return '';
    }
  };

  // Renderiza o conteúdo de acordo com o passo atual
  const renderStepContent = () => {
    switch(currentStep) {
      case 'schema':
        return (
          <Card className="p-6">
            <DatabaseSchemaBuilder
              onSchemaChange={handleSchemaChange}
              initialData={generatedData}
            />
          </Card>
        );
      case 'interface':
        return (
          <Card>
            {/* Header com título e subtítulo da página anterior */}
            {generatedData.pageTitle && (
              <div className="border-b border-slate-700/50 p-5">
                <h3 className="text-xl font-medium text-slate-100">{generatedData.pageTitle}</h3>
                {generatedData.pageSubtitle && (
                  <p className="text-sm text-slate-400 mt-1">{generatedData.pageSubtitle}</p>
                )}
              </div>
            )}
            
            <div className="p-6 space-y-6">
              {/* Campo para selecionar página de referência */}
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-800/60 shadow-[0_0_15px_rgba(0,0,0,0.2),0_0_3px_rgba(0,0,0,0.3),inset_0_0_1px_rgba(255,255,255,0.2)] overflow-hidden">
                <div className="p-5 pb-4 border-b border-slate-700/50">
                  <h2 className="text-lg font-medium text-slate-100 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-purple-400" />
                    Página de Referência
                    <span className="ml-2 text-red-400">*</span>
                  </h2>
                </div>
                <div className="p-6 space-y-5">
                  <div className="space-y-3">
                    <Label className="text-slate-300 text-sm font-medium inline-flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 mr-2"></span>
                      Selecione uma página existente como referência
                      <span className="ml-1 text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Select
                        value={generatedData.pageReference}
                        onValueChange={(value) => {
                          setGeneratedData(prev => ({...prev, pageReference: value}));
                        }}
                      >
                        <SelectTrigger className={`bg-slate-800/50 border-slate-700/50 text-white focus:border-blue-500/50 focus:ring-blue-500/30 ${!generatedData.pageReference ? 'border-red-500/50' : ''}`}>
                          <SelectValue placeholder="Selecione uma página" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                          <div className="p-2 border-b border-slate-700/50">
                            <div className="relative">
                              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                              <Input
                                placeholder="Buscar página..."
                                value={pageSearchQuery}
                                onChange={(e) => setPageSearchQuery(e.target.value)}
                                className="bg-slate-900/80 border-slate-700/50 text-white placeholder:text-slate-500 pl-8 h-9"
                              />
                            </div>
                          </div>
                          <div className="max-h-[300px] overflow-y-auto">
                            {/* Agrupar páginas por categoria */}
                            {renderPageOptions()}
                          </div>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {generatedData.pageReference && (
                      <div className="mt-4 flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-slate-800/50 hover:bg-slate-700/50 border-slate-700/50 text-slate-300 text-xs gap-1"
                          onClick={() => {
                            // Lógica para visualizar a página selecionada
                            const selectedPage = availablePages.find(p => p.id === generatedData.pageReference);
                            if (selectedPage) {
                              // Abrir a página em uma nova aba
                              window.open(selectedPage.route, '_blank', 'noopener,noreferrer');
                              toast({
                                title: "Página aberta",
                                description: `Abrindo ${selectedPage.title} em nova aba.`,
                              });
                            }
                          }}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Visualizar página selecionada
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-slate-800/50 hover:bg-indigo-900/30 border-slate-700/50 hover:border-indigo-700/50 text-slate-300 hover:text-indigo-300 text-xs gap-1"
                          onClick={() => {
                            // Copiar a rota da página para o clipboard
                            const selectedPage = availablePages.find(p => p.id === generatedData.pageReference);
                            if (selectedPage) {
                              navigator.clipboard.writeText(selectedPage.route);
                              toast({
                                title: "Rota copiada",
                                description: `Rota '${selectedPage.route}' copiada para a área de transferência.`,
                              });
                            }
                          }}
                        >
                          <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                          Copiar rota
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Configurações adicionais da interface */}
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-800/60 shadow-[0_0_15px_rgba(0,0,0,0.2),0_0_3px_rgba(0,0,0,0.3),inset_0_0_1px_rgba(255,255,255,0.2)] overflow-hidden">
                <div className="p-5 pb-4 border-b border-slate-700/50">
                  <h2 className="text-lg font-medium text-slate-100 flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                    Configurações da Interface
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="rounded-lg border border-slate-700/50 bg-slate-800/40 p-4 space-y-4">
                    <h3 className="text-md font-medium text-slate-100">Análise do Design da Referência</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-purple-400 mb-2">Componentes Principais</h4>
                        <ul className="space-y-2 text-sm text-slate-300">
                          <li className="flex items-start">
                            <span className="bg-purple-600/20 text-purple-400 p-1 rounded mr-2 inline-flex">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="3" x2="21" y1="9" y2="9" /><line x1="9" x2="9" y1="21" y2="9" /></svg>
                            </span>
                            <span>Cards estatísticos com gradientes e efeitos hover</span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-purple-600/20 text-purple-400 p-1 rounded mr-2 inline-flex">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></svg>
                            </span>
                            <span>Tabela com cabeçalhos estilizados e colunas responsivas</span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-purple-600/20 text-purple-400 p-1 rounded mr-2 inline-flex">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                            </span>
                            <span>Cards para visualização de itens com transições suaves</span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-purple-600/20 text-purple-400 p-1 rounded mr-2 inline-flex">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M4 21v-7m0 0V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" /><path d="M8 7h8" /><path d="M8 11h8" /><path d="M8 15h2" /></svg>
                            </span>
                            <span>Modal de detalhes com informações organizadas</span>
                          </li>
                        </ul>
                </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-indigo-400 mb-2">Estilos e Cores</h4>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="rounded-md border border-slate-700 p-2 space-y-1">
                            <h5 className="font-medium text-slate-300">Cores de fundo</h5>
                            <div className="flex items-center gap-1.5">
                              <span className="inline-block w-4 h-4 rounded-full bg-gray-900"></span>
                              <span className="text-slate-400">gray-900: #111827</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="inline-block w-4 h-4 rounded-full bg-gray-800"></span>
                              <span className="text-slate-400">gray-800: #1f2937</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="inline-block w-4 h-4 rounded-full bg-gray-850"></span>
                              <span className="text-slate-400">gray-850 (custom)</span>
                            </div>
                          </div>
                          
                          <div className="rounded-md border border-slate-700 p-2 space-y-1">
                            <h5 className="font-medium text-slate-300">Cores de destaque</h5>
                            <div className="flex items-center gap-1.5">
                              <span className="inline-block w-4 h-4 rounded-full bg-purple-600"></span>
                              <span className="text-slate-400">purple-600: #9333ea</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="inline-block w-4 h-4 rounded-full bg-blue-600"></span>
                              <span className="text-slate-400">blue-600: #2563eb</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="inline-block w-4 h-4 rounded-full bg-indigo-600"></span>
                              <span className="text-slate-400">indigo-600: #4f46e5</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-blue-400 mb-2">Efeitos e Decorações</h4>
                        <ul className="space-y-2 text-sm text-slate-300">
                          <li className="flex items-start">
                            <span className="bg-blue-600/20 text-blue-400 p-1 rounded mr-2 inline-flex">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
                            </span>
                            <span>Gradientes sutis para cards e botões</span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-blue-600/20 text-blue-400 p-1 rounded mr-2 inline-flex">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M17.5 13.2a6.2 6.2 0 0 1 2.4 4.3A3.5 3.5 0 0 1 16.5 21" /><path d="M5 16.5A3.5 3.5 0 0 1 8.5 20a3.5 3.5 0 0 1-3.46 3.5" /><path d="M7.5 13.2A6.2 6.2 0 0 0 5.1 17.5" /><path d="M15 9.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 1 1-3 0" /><path d="M7 9.5a1.5 1.5 0 0 0-3 0 1.5 1.5 0 0 0 3 0" /><path d="M12 14a3 3 0 0 0 0-6 3 3 0 0 0 0 6" /></svg>
                            </span>
                            <span>Sombras internas (ring-1, shadow-inner) para elementos em destaque</span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-blue-600/20 text-blue-400 p-1 rounded mr-2 inline-flex">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="10" /><path d="m8 12 2 2 6-4" /></svg>
                            </span>
                            <span>Transições suaves (transition-all duration-200)</span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-blue-600/20 text-blue-400 p-1 rounded mr-2 inline-flex">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
                            </span>
                            <span>Bordas com opacidade (border-gray-700/50) para efeito glass</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-slate-900/60 rounded-lg p-4 mt-2 border border-slate-700/30">
                      <h4 className="text-sm font-medium text-emerald-400 mb-3">CSS Tailwind Principais</h4>
                      <div className="text-xs font-mono bg-slate-950 rounded overflow-auto p-3 text-slate-300">
                        <div><span className="text-pink-400">bg-gray-800</span> <span className="text-emerald-400">hover:bg-gray-700</span> <span className="text-yellow-400">rounded-lg</span></div>
                        <div><span className="text-pink-400">border</span> <span className="text-pink-400">border-gray-700</span> <span className="text-emerald-400">hover:border-gray-500</span></div>
                        <div><span className="text-pink-400">transition-all</span> <span className="text-pink-400">duration-200</span> <span className="text-pink-400">shadow-lg</span></div>
                        <div><span className="text-pink-400">bg-gradient-to-r</span> <span className="text-pink-400">from-gray-800</span> <span className="text-pink-400">to-gray-800/95</span></div>
                        <div><span className="text-pink-400">group-hover:from-purple-200</span> <span className="text-pink-400">group-hover:to-purple-400</span></div>
                        <div><span className="text-pink-400">ring-1</span> <span className="text-pink-400">ring-purple-500/30</span> <span className="text-pink-400">shadow-inner</span></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-slate-700/50 bg-slate-800/40 p-4 space-y-4">
                    <h3 className="text-md font-medium text-slate-100">Elementos de Interface</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="rounded-md border border-slate-700 p-3 space-y-2">
                        <h4 className="text-sm font-medium text-cyan-400">Cabeçalho da Página</h4>
                        <div className="text-xs text-slate-400 space-y-1">
                          <p>• Título principal (text-4xl font-bold text-white)</p>
                          <p>• Subtítulo descritivo (text-sm text-zinc-400)</p>
                          <p>• Flex column com espaçamento (space-y-1)</p>
                        </div>
                      </div>
                      
                      <div className="rounded-md border border-slate-700 p-3 space-y-2">
                        <h4 className="text-sm font-medium text-cyan-400">Cards Estatísticos</h4>
                        <div className="text-xs text-slate-400 space-y-1">
                          <p>• Grupo com três cards flex (flex-1)</p>
                          <p>• Ícones em containers arredondados</p>
                          <p>• Texto com efeito gradiente (bg-clip-text)</p>
                        </div>
                      </div>
                      
                      <div className="rounded-md border border-slate-700 p-3 space-y-2">
                        <h4 className="text-sm font-medium text-cyan-400">Barra de Ferramentas</h4>
                        <div className="text-xs text-slate-400 space-y-1">
                          <p>• Flex justify-between para layout</p>
                          <p>• Botões com ícones (gap-2)</p>
                          <p>• Alternadores de visualização</p>
                        </div>
                      </div>
                      
                      <div className="rounded-md border border-slate-700 p-3 space-y-2">
                        <h4 className="text-sm font-medium text-cyan-400">Filtros e Pesquisa</h4>
                        <div className="text-xs text-slate-400 space-y-1">
                          <p>• Barra de pesquisa com ícone</p>
                          <p>• Select para filtros de categorias</p>
                          <p>• Layout responsivo (flex-col/flex-row)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      case 'api':
        // Função para filtrar campos que não devem ser exibidos na interface
        const filterVisibleFields = (fields: any[]) => {
          return fields.filter(field => {
            // Remover campos ID e campos que terminam com _at (created_at, updated_at, etc)
            return !field.name.toLowerCase().includes('id') && !field.name.toLowerCase().endsWith('_at');
          });
        };
        
        // Obter campos filtrados para exibição
        const visibleFields = generatedData.fields ? filterVisibleFields(generatedData.fields) : [];
        
        return (
          <Card>
            {/* Header com título da etapa */}
            <div className="border-b border-slate-700/50 p-5">
              <h3 className="text-xl font-medium text-slate-100">Prévia do Layout Gerado</h3>
              <p className="text-sm text-slate-400 mt-1">Visualização baseada na página de referência selecionada</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Controles para alternar entre as visualizações */}
              <div className="flex justify-center mb-4">
                <div className="inline-flex bg-slate-800 rounded-lg p-1">
                  <button 
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      previewMode === 'list' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    onClick={() => setPreviewMode('list')}
                  >
                    Lista de {generatedData.tableName || "Itens"}
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      previewMode === 'form' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    onClick={() => setPreviewMode('form')}
                  >
                    Formulário Novo {generatedData.tableName ? generatedData.tableName.replace(/s$/, '') : 'Item'}
                  </button>
                </div>
              </div>

              {/* Simulação da página gerada */}
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-800/60 shadow-[0_0_15px_rgba(0,0,0,0.2),0_0_3px_rgba(0,0,0,0.3),inset_0_0_1px_rgba(255,255,255,0.2)] overflow-hidden">
                {previewMode === 'list' ? (
                  <>
                    {/* Cabeçalho da página simulada */}
                    <div className="p-4">
                      <div className="flex flex-col space-y-1">
                        <h1 className="text-4xl font-bold text-white">{generatedData.pageTitle || "Título da Página"}</h1>
                        <p className="text-sm text-zinc-400">
                          {generatedData.pageSubtitle || "Subtítulo com descrição da página"}
              </p>
            </div>
                    </div>
                    
                    {/* Cards estatísticos simulados */}
                    <div className="flex flex-wrap gap-4 px-4 mt-4">
                      <div className="stat-card group relative overflow-hidden p-3 bg-gradient-to-r from-gray-800 to-gray-800/95 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 hover:shadow-purple-900/20 hover:border-purple-500/30 flex flex-1 items-center justify-between min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-purple-700/20 text-purple-400 ring-1 ring-purple-500/30 shadow-inner shadow-purple-600/10">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                          </div>
                          <div className="text-xs text-gray-400">{generatedData.tableName || "registros"}</div>
                        </div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-purple-200 group-hover:to-purple-400 transition-colors duration-300">0</div>
                      </div>

                      <div className="stat-card group relative overflow-hidden p-3 bg-gradient-to-r from-gray-800 to-gray-800/95 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 hover:shadow-indigo-900/20 hover:border-indigo-500/30 flex flex-1 items-center justify-between min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-600/20 to-indigo-700/20 text-indigo-400 ring-1 ring-indigo-500/30 shadow-inner shadow-indigo-600/10">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                              <path d="M3 9h18" />
                              <path d="M9 21V9" />
                            </svg>
                          </div>
                          <div className="text-xs text-gray-400">categorias</div>
                        </div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-indigo-200 group-hover:to-indigo-400 transition-colors duration-300">0</div>
                      </div>

                      <div className="stat-card group relative overflow-hidden p-3 bg-gradient-to-r from-gray-800 to-gray-800/95 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 hover:shadow-blue-900/20 hover:border-blue-500/30 flex flex-1 items-center justify-between min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-700/20 text-blue-400 ring-1 ring-blue-500/30 shadow-inner shadow-blue-600/10">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                            </svg>
                          </div>
                          <div className="text-xs text-gray-400">criados hoje</div>
                        </div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:to-blue-400 transition-colors duration-300">0</div>
                      </div>
                    </div>
                    
                    {/* Barra de ferramentas simulada */}
                    <div className="flex justify-between items-center mt-8 px-4">
                      <div className="flex space-x-2">
                        <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 py-1.5 px-3 rounded-md text-sm font-medium flex items-center space-x-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="3" y1="9" x2="21" y2="9"></line>
                            <line x1="9" y1="21" x2="9" y2="9"></line>
                          </svg>
                          Tabela
                        </button>
                        <button className="bg-slate-700 border-slate-600 border text-white py-1.5 px-3 rounded-md text-sm font-medium flex items-center space-x-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                          </svg>
                          Cartões
                        </button>
                      </div>
                      <button 
                        className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-md text-sm font-medium flex items-center"
                        onClick={() => setPreviewMode('form')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Novo {generatedData.tableName ? generatedData.tableName.replace(/s$/, '') : 'Item'}
                      </button>
                    </div>
                    
                    {/* Barra de pesquisa e filtros simulada */}
                    <div className="flex flex-col sm:flex-row gap-3 bg-gray-850 rounded-lg p-4 mx-4 mt-6">
                      <div className="relative flex-grow">
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                          type="text"
                          placeholder={`Pesquisar ${generatedData.tableName || 'itens'}...`}
                          className="pl-9 w-full bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-600 rounded-md py-2 text-sm"
                        />
                      </div>
                      
                      <div className="w-full sm:w-[180px] relative rounded-md border border-gray-600 bg-gray-900">
                        <select className="appearance-none w-full bg-transparent text-white py-2 pl-3 pr-8 rounded-md text-sm">
                          <option>Todos os campos</option>
                          {visibleFields.map((field: any, index: number) => (
                            <option key={index} value={field.name}>{field.name}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tabela com colunas baseadas nos campos definidos */}
                    <div className="bg-gray-850 rounded-lg overflow-hidden border border-gray-800 shadow-lg mx-4 mt-6 mb-6">
                      <table className="w-full">
                        <thead className="bg-gray-900">
                          <tr className="border-b border-gray-800">
                            {visibleFields.slice(0, 5).map((field: any, index: number) => (
                              <th key={index} className="text-left font-semibold text-white p-3">{field.label || field.name.toUpperCase()}</th>
                            ))}
                            <th className="text-right p-3 w-[100px]">AÇÕES</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="hover:bg-gray-800/80 border-b border-gray-800/50">
                            {visibleFields.slice(0, 5).map((field: any, index: number) => (
                              <td key={index} className="p-3 text-gray-300">
                                {index === 0 ? (
                                  <span className="font-medium text-white">Exemplo de {field.name}</span>
                                ) : field.type === 'boolean' ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-700 text-green-50">Sim</span>
                                ) : (
                                  `Valor de ${field.name}`
                                )}
                              </td>
                            ))}
                            <td className="p-3 text-right">
                              <div className="flex justify-end space-x-2">
                                <button className="text-gray-400 hover:text-blue-400 transition-colors">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                  </svg>
                                </button>
                                <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 20h9"></path>
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                  </svg>
                                </button>
                                <button className="text-gray-400 hover:text-red-400 transition-colors">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-800/80 border-b border-gray-800/50">
                            {visibleFields.slice(0, 5).map((field: any, index: number) => (
                              <td key={index} className="p-3 text-gray-300">
                                {index === 0 ? (
                                  <span className="font-medium text-white">Outro {field.name}</span>
                                ) : field.type === 'boolean' ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-700 text-red-50">Não</span>
                                ) : (
                                  `Outro valor de ${field.name}`
                                )}
                              </td>
                            ))}
                            <td className="p-3 text-right">
                              <div className="flex justify-end space-x-2">
                                <button className="text-gray-400 hover:text-blue-400 transition-colors">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                  </svg>
                                </button>
                                <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 20h9"></path>
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                  </svg>
                                </button>
                                <button className="text-gray-400 hover:text-red-400 transition-colors">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  /* Formulário de cadastro simulado */
                  <>
                    {/* Cabeçalho do formulário */}
                    <div className="p-4 border-b border-slate-700/50">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <h1 className="text-2xl font-bold text-white">Novo {generatedData.tableName ? generatedData.tableName.replace(/s$/, '') : 'Item'}</h1>
                          <p className="text-sm text-zinc-400">
                            Preencha os campos abaixo para adicionar um novo registro
                          </p>
                        </div>
                        <button 
                          className="text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-full p-2 transition-colors"
                          onClick={() => setPreviewMode('list')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Conteúdo do formulário */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filterVisibleFields(visibleFields).map((field: any, index: number) => (
                          <div key={index} className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex gap-1 items-center">
                              {field.label || field.name}
                              {field.required && <span className="text-red-400">*</span>}
                            </label>
                            {field.type === 'string' || field.type === 'text' ? (
                              <input 
                                type="text" 
                                placeholder={`Digite ${field.label || field.name}...`} 
                                className="w-full bg-slate-800 border-slate-700 rounded-md text-white"
                              />
                            ) : field.type === 'number' || field.type === 'integer' ? (
                              <input 
                                type="number" 
                                placeholder={`Digite um valor...`} 
                                className="w-full bg-slate-800 border-slate-700 rounded-md text-white"
                              />
                            ) : field.type === 'boolean' ? (
                              <div className="flex items-center h-8">
                                <input 
                                  type="checkbox" 
                                  id={`field-${index}`}
                                  className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-600"
                                />
                                <label htmlFor={`field-${index}`} className="ml-2 text-sm text-slate-400">
                                  {field.description || 'Ativar este recurso'}
                                </label>
                              </div>
                            ) : field.type === 'date' ? (
                              <input 
                                type="date" 
                                className="w-full bg-slate-800 border-slate-700 rounded-md text-white"
                              />
                            ) : field.type === 'select' || field.type === 'enum' ? (
                              <select className="w-full bg-slate-800 border-slate-700 rounded-md text-white">
                                <option value="">Selecione uma opção</option>
                                <option value="opcao1">Opção 1</option>
                                <option value="opcao2">Opção 2</option>
                                <option value="opcao3">Opção 3</option>
                              </select>
                            ) : field.type === 'textarea' ? (
                              <textarea 
                                rows={3}
                                placeholder={`Digite ${field.label || field.name}...`} 
                                className="w-full bg-slate-800 border-slate-700 rounded-md text-white"
                              ></textarea>
                            ) : (
                              <input 
                                type="text" 
                                placeholder={`Digite ${field.label || field.name}...`} 
                                className="w-full bg-slate-800 border-slate-700 rounded-md text-white"
                              />
                            )}
                            {field.description && (
                              <p className="text-xs text-slate-500">{field.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Botões de ação */}
                      <div className="mt-8 flex justify-end space-x-2">
                        <button 
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-sm font-medium transition-colors"
                          onClick={() => setPreviewMode('list')}
                        >
                          Cancelar
                        </button>
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors">
                          Salvar
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Configurações de endpoints API */}
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-800/60 shadow-[0_0_15px_rgba(0,0,0,0.2),0_0_3px_rgba(0,0,0,0.3),inset_0_0_1px_rgba(255,255,255,0.2)] overflow-hidden">
                <div className="p-5 pb-4 border-b border-slate-700/50">
                  <h2 className="text-lg font-medium text-slate-100 flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                    Configuração de Endpoints
                  </h2>
                </div>
                <div className="p-6">
                  <p className="text-slate-500 mb-4">Funcionalidade em desenvolvimento</p>
              <p className="text-slate-600 max-w-md text-sm mb-5">
                Esta seção permitirá configurar os endpoints da API para a tabela {generatedData.tableName}.
              </p>
                </div>
              </div>
            </div>
          </Card>
        );
      case 'review':
        // Gera o SQL para a tabela baseado nos dados do usuário
        const generateSqlForTable = () => {
          const tableName = generatedData.tableName.toLowerCase();
          
          // Início do comando CREATE TABLE
          let sql = `CREATE TABLE public.${tableName} (\n`;
          
          // Adiciona ID como chave primária
          sql += `  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n`;
          
          // Adiciona os campos definidos pelo usuário
          if (generatedData.fields && generatedData.fields.length > 0) {
            generatedData.fields.forEach((field: any, index: number) => {
              // Não adicionar o ID novamente se já existe nos campos definidos
              if (field.name.toLowerCase() === 'id') return;
              
              // Mapeia o tipo do campo para tipo SQL
              let sqlType = '';
              switch (field.type) {
                case 'string':
                  sqlType = field.size ? `VARCHAR(${field.size})` : 'TEXT';
                  break;
                case 'text':
                  sqlType = 'TEXT';
                  break;
                case 'number':
                  sqlType = 'NUMERIC';
                  break;
                case 'integer':
                  sqlType = 'INTEGER';
                  break;
                case 'boolean':
                  sqlType = 'BOOLEAN';
                  break;
                case 'date':
                  sqlType = 'DATE';
                  break;
                case 'timestamp':
                  sqlType = 'TIMESTAMP WITH TIME ZONE';
                  break;
                case 'json':
                  sqlType = 'JSONB';
                  break;
                case 'array':
                  sqlType = 'TEXT[]';
                  break;
      default:
                  sqlType = 'TEXT';
              }
              
              // Adiciona o campo com seu tipo
              sql += `  ${field.name.toLowerCase()} ${sqlType}`;
              
              // Adiciona NOT NULL se o campo for obrigatório
              if (field.required) {
                sql += ' NOT NULL';
              }
              
              // Adiciona valor padrão se existir
              if (field.default) {
                // Se for string, envolve em aspas
                if (field.type === 'string' || field.type === 'text') {
                  sql += ` DEFAULT '${field.default}'`;
                } else if (field.type === 'boolean') {
                  sql += ` DEFAULT ${field.default.toString().toLowerCase()}`;
                } else {
                  sql += ` DEFAULT ${field.default}`;
                }
              }
              
              // Adiciona vírgula se não for o último campo
              if (index < generatedData.fields.length - 1 || generatedData.relationships.length > 0) {
                sql += ',\n';
              }
            });
          }
          
          // Adiciona relacionamentos, se houver
          if (generatedData.relationships && generatedData.relationships.length > 0) {
            generatedData.relationships.forEach((rel: any, index: number) => {
              const isLast = index === generatedData.relationships.length - 1;
              
              sql += `  ${rel.name.toLowerCase()}_id UUID REFERENCES public.${rel.reference.toLowerCase()}(id)`;
              if (!isLast) {
                sql += ',\n';
              }
            });
          }
          
          // Adiciona os timestamps
          sql += `,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,\n`;
          sql += `  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL\n`;
          
          // Fecha o comando CREATE TABLE
          sql += `);\n\n`;
          
          // Adiciona os comentários na tabela
          if (generatedData.pageTitle) {
            sql += `COMMENT ON TABLE public.${tableName} IS '${generatedData.pageTitle}';\n\n`;
          }
          
          // Adiciona gatilho para atualizar updated_at automaticamente
          sql += `-- Trigger para atualizar updated_at automaticamente\n`;
          sql += `CREATE TRIGGER set_updated_at\n`;
          sql += `BEFORE UPDATE ON public.${tableName}\n`;
          sql += `FOR EACH ROW\n`;
          sql += `EXECUTE FUNCTION public.set_updated_at();\n\n`;
          
          // Adiciona RLS (Row Level Security) básico
          sql += `-- Configuração de segurança por linha (RLS)\n`;
          sql += `ALTER TABLE public.${tableName} ENABLE ROW LEVEL SECURITY;\n\n`;
          
          // Políticas de RLS
          sql += `-- Políticas de acesso\n`;
          sql += `CREATE POLICY "Acesso público para leitura de ${tableName}"\n`;
          sql += `ON public.${tableName} FOR SELECT\n`;
          sql += `USING (true);\n\n`;
          
          sql += `CREATE POLICY "Usuários autenticados podem criar ${tableName}"\n`;
          sql += `ON public.${tableName} FOR INSERT\n`;
          sql += `WITH CHECK (auth.uid() IS NOT NULL);\n\n`;
          
          sql += `CREATE POLICY "Usuários proprietários podem atualizar ${tableName}"\n`;
          sql += `ON public.${tableName} FOR UPDATE\n`;
          sql += `USING (auth.uid() IS NOT NULL)\n`;
          sql += `WITH CHECK (auth.uid() IS NOT NULL);\n\n`;
          
          sql += `CREATE POLICY "Usuários proprietários podem excluir ${tableName}"\n`;
          sql += `ON public.${tableName} FOR DELETE\n`;
          sql += `USING (auth.uid() IS NOT NULL);\n`;
          
          // Adiciona índices
          if (generatedData.indexes && generatedData.indexes.length > 0) {
            sql += `\n-- Índices\n`;
            generatedData.indexes.forEach((index: any) => {
              sql += `CREATE INDEX ${tableName}_${index.name}_idx ON public.${tableName}(${index.fields.join(', ')});\n`;
            });
          }
          
          return sql;
        };
        
        // Gera o SQL para a tabela
        const sqlCommand = generateSqlForTable();
        
        // Renderização do conteúdo conforme o passo da revisão
  return (
          <Card className="p-6 space-y-8">
            {reviewStep === 'sql' ? (
              // Etapa 1: SQL e instruções para Supabase
              <>
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-white">Criação da Tabela no Supabase</h2>
                  <p className="text-slate-400">
                    Copie o código SQL abaixo e execute no Supabase para criar a tabela <span className="text-blue-400 font-medium">{generatedData.tableName}</span>.
                  </p>
                
                  <div className="mt-4 relative">
                    <div className="bg-slate-900 rounded-lg border border-slate-700 p-4 overflow-auto max-h-96">
                      <pre className="text-slate-300 text-sm whitespace-pre overflow-x-auto">
                        <code>{sqlCommand}</code>
                      </pre>
                </div>
                
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <button 
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-md transition-colors"
                        onClick={() => {
                          navigator.clipboard.writeText(sqlCommand);
                          toast({
                            title: "SQL copiado",
                            description: "O código SQL foi copiado para a área de transferência.",
                          });
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </button>
                      
                      <button 
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-md transition-colors"
                        onClick={() => {
                          // Baixar como arquivo SQL
                          const element = document.createElement("a");
                          const file = new Blob([sqlCommand], {type: 'text/plain'});
                          element.href = URL.createObjectURL(file);
                          element.download = `${generatedData.tableName.toLowerCase()}_create_table.sql`;
                          document.body.appendChild(element);
                          element.click();
                          document.body.removeChild(element);
                          
                          toast({
                            title: "SQL baixado",
                            description: `Arquivo ${generatedData.tableName.toLowerCase()}_create_table.sql baixado.`,
                          });
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/60 rounded-lg border border-blue-800/30 p-6 space-y-4">
                  <h3 className="text-lg font-medium text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    Instruções para criação da tabela no Supabase
                  </h3>
                  <ol className="space-y-3 text-slate-300 pl-6 list-decimal">
                    <li>Acesse o <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Dashboard do Supabase</a> e entre no seu projeto.</li>
                    <li>Navegue até a seção <span className="px-2 py-1 bg-slate-700 rounded text-sm">SQL Editor</span> no menu lateral.</li>
                    <li>Clique em <span className="px-2 py-1 bg-slate-700 rounded text-sm">+ Nova Query</span> para criar uma nova consulta SQL.</li>
                    <li>Cole o código SQL acima no editor.</li>
                    <li>Clique em <span className="px-2 py-1 bg-green-700 rounded text-sm">Executar</span> para criar a tabela.</li>
                    <li>Verifique se a tabela foi criada corretamente na seção <span className="px-2 py-1 bg-slate-700 rounded text-sm">Table Editor</span>.</li>
                  </ol>
                </div>
                
                <div className="flex justify-center mt-6">
                    <Button 
                    variant="default" 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      setSqlCreated(true);
                      setReviewStep('location');
                    }}
                  >
                    Já criei a tabela no Supabase, continuar
                    </Button>
                  </div>
              </>
            ) : (
              // Etapa 2: Seleção de localização no menu
              <>
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-white">Selecione a Localização da Nova Página</h2>
                  <p className="text-slate-400">
                    Escolha onde a nova página <span className="text-blue-400 font-medium">{generatedData.pageTitle}</span> será adicionada no menu do sistema.
                  </p>
                
                  <div className="mt-6 bg-slate-900 rounded-lg border border-slate-700 p-6">
                    <div className="space-y-4">
                      {systemMenu.map((menuItem) => (
                        <div key={menuItem.id} className="space-y-2">
                          {/* Menu Principal Selecionável */}
                          <div 
                            className={`p-3 rounded-md cursor-pointer transition-colors flex items-center justify-between ${
                              selectedLocation === menuItem.id
                                ? 'bg-purple-900/50 border border-purple-700'
                                : 'hover:bg-slate-800 border border-transparent'
                            }`}
                            onClick={() => setSelectedLocation(menuItem.id)}
                          >
                            <h3 className="text-lg font-medium text-white flex items-center">
                              <span className={`w-2 h-2 rounded-full ${selectedLocation === menuItem.id ? 'bg-purple-400' : 'bg-slate-400'} mr-2`}></span>
                              {menuItem.label}
                            </h3>
                            <div className="text-xs text-slate-500">Menu Principal</div>
                </div>
                
                          {/* Submenus */}
                          <div className="pl-4 space-y-2 border-l border-slate-700">
                            {menuItem.children.map((subItem) => (
                              <div 
                                key={subItem.id} 
                                className={`p-3 rounded-md cursor-pointer transition-colors ${
                                  selectedLocation === subItem.id
                                    ? 'bg-blue-900/50 border border-blue-700'
                                    : 'hover:bg-slate-800 border border-transparent'
                                }`}
                                onClick={() => setSelectedLocation(subItem.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-300 flex items-center">
                                    <span className={`w-1.5 h-1.5 rounded-full ${selectedLocation === subItem.id ? 'bg-blue-400' : 'bg-slate-500'} mr-2`}></span>
                                    {subItem.label}
                                  </span>
                                  <div className="text-xs text-slate-500">{subItem.path}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Adicionar alerta informativo */}
                  <div className="mt-4">
                    <Alert>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      <AlertTitle>Dica de Localização</AlertTitle>
                      <AlertDescription className="text-slate-400">
                        Você pode escolher tanto um menu principal (ex: Admin, Bandas, Eventos) quanto um submenu específico (ex: Lista de Bandas, Ensaios) para adicionar sua nova página.
                    </AlertDescription>
                  </Alert>
                  </div>
                </div>
                
                <div className="flex justify-center mt-6 space-x-4">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
                    onClick={() => setReviewStep('sql')}
                  >
                    Voltar
                  </Button>
                  
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!selectedLocation}
                    onClick={() => {
                      const selectedMenuItem = systemMenu
                        .flatMap(menu => menu.children)
                        .find(item => item.id === selectedLocation);
                        
                      if (selectedMenuItem) {
                        checkPageExists(selectedMenuItem.path);
                      } else {
                        // Se não encontrou nos submenus, procura no menu principal
                        const mainMenuItem = systemMenu.find(menu => menu.id === selectedLocation);
                        if (mainMenuItem) {
                          checkPageExists(mainMenuItem.label.toLowerCase());
                        }
                      }
                    }}
                  >
                    Finalizar e Gerar Página
                  </Button>
              </div>
              </>
            )}
          </Card>
        );
      default:
        return null;
    }
  };

  // Função para verificar se a página já existe
  const checkPageExists = async (location: string) => {
    try {
      // Encontrar o menu principal selecionado
      const mainMenu = systemMenu.find(menu => menu.id === selectedLocation);
      
      // Se for um menu principal, verificar se já existe uma página com o nome dentro deste menu
      if (mainMenu) {
        const basePath = `/${mainMenu.label.toLowerCase()}`;
        const newPagePath = `${basePath}/${generatedData.tableName.toLowerCase()}`;
        
        // Verificar se já existe uma página com este caminho
        const pageExists = mainMenu.children.some(child => 
          child.path.toLowerCase() === newPagePath.toLowerCase() ||
          child.path.toLowerCase().startsWith(newPagePath.toLowerCase())
        );
        
        setPageExists(pageExists);
        if (pageExists) {
          toast({
            variant: "destructive",
            title: "Página já existe",
            description: `Já existe uma página em ${newPagePath}. Por favor, escolha outro local ou outro nome.`,
          });
        }
      } else {
        // Se for um submenu, verificar se já existe uma página com o mesmo nome no diretório pai
        const submenu = systemMenu
          .flatMap(menu => menu.children)
          .find(item => item.id === selectedLocation);
        
        if (submenu) {
          const parentPath = submenu.path.split('/').slice(0, -1).join('/');
          const newPagePath = `${parentPath}/${generatedData.tableName.toLowerCase()}`;
          
          // Verificar se já existe uma página com este caminho
          const pageExists = systemMenu
            .flatMap(menu => menu.children)
            .some(child => 
              child.path.toLowerCase() === newPagePath.toLowerCase() ||
              child.path.toLowerCase().startsWith(newPagePath.toLowerCase())
            );
          
          setPageExists(pageExists);
          if (pageExists) {
            toast({
              variant: "destructive",
              title: "Página já existe",
              description: `Já existe uma página em ${newPagePath}. Por favor, escolha outro local ou outro nome.`,
            });
          }
        }
      }
      
      // Sempre mostrar o modal de confirmação, mesmo se a página existir
      setConfirmStep('confirm');
      
    } catch (error) {
      console.error('Erro ao verificar existência da página:', error);
      toast({
        variant: "destructive",
        title: "Erro na verificação",
        description: "Não foi possível verificar se a página já existe.",
      });
    }
  };

  // Função para gerar a página
  const handleGeneratePage = async () => {
    try {
      // Encontrar o menu selecionado
      const selectedMenuItem = systemMenu
        .flatMap(menu => menu.children)
        .find(item => item.id === selectedLocation);
      
      const mainMenuItem = systemMenu.find(menu => menu.id === selectedLocation);
      
      let pagePath = '';
      
      if (selectedMenuItem) {
        pagePath = selectedMenuItem.path;
      } else if (mainMenuItem) {
        pagePath = `/${mainMenuItem.label.toLowerCase()}/${generatedData.tableName.toLowerCase()}`;
      }
      
      if (!pagePath) {
        throw new Error('Caminho da página não definido');
      }

      // Aqui você pode adicionar a lógica para gerar os arquivos da página
      toast({
        title: "Página gerada com sucesso!",
        description: `A página foi criada em ${pagePath}`,
      });

      // Limpar estados e voltar ao início
      setGeneratedData({
        pageTitle: '',
        pageSubtitle: '',
        tableName: '',
        tableFunction: '',
        fields: [],
        relationships: [],
        constraints: [],
        indexes: [],
        pageReference: '',
      });
      setCurrentStep('schema');
      setConfirmStep('check');
      setUserChoice(null);
      setSelectedLocation(null);
      
    } catch (error) {
      console.error('Erro ao gerar página:', error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar página",
        description: "Ocorreu um erro ao tentar gerar a página. Por favor, tente novamente.",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerador de Páginas e Estruturas</h1>
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <History className="h-4 w-4" />
                Histórico
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Histórico de Gerações</SheetTitle>
              </SheetHeader>
              {/* Componente de histórico será adicionado aqui */}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Indicador de passos */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-800/60 shadow-[0_0_15px_rgba(0,0,0,0.2),0_0_3px_rgba(0,0,0,0.3),inset_0_0_1px_rgba(255,255,255,0.2)] p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-slate-100">{renderStepTitle()}</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-400">
              Passo {currentStep === 'schema' ? 1 : currentStep === 'interface' ? 2 : currentStep === 'api' ? 3 : 4} de 4
            </span>
            <div className="flex items-center space-x-1">
              <div className={`h-2 w-6 rounded-full ${currentStep === 'schema' ? 'bg-blue-500' : 'bg-blue-500/40'}`}></div>
              <div className={`h-2 w-6 rounded-full ${currentStep === 'interface' ? 'bg-blue-500' : 'bg-blue-500/40'}`}></div>
              <div className={`h-2 w-6 rounded-full ${currentStep === 'api' ? 'bg-blue-500' : 'bg-blue-500/40'}`}></div>
              <div className={`h-2 w-6 rounded-full ${currentStep === 'review' ? 'bg-blue-500' : 'bg-blue-500/40'}`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo de acordo com o passo atual */}
      {renderStepContent()}
      
      {/* Botões de navegação */}
      <div className="flex justify-between mt-4">
        <Button 
          variant="outline" 
          size="lg"
          onClick={goToPreviousStep}
          disabled={currentStep === 'schema'}
          className="bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>
        
        <Button 
          variant="default" 
          size="lg"
          onClick={goToNextStep}
          disabled={currentStep === 'review'}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {currentStep === 'review' ? 'Finalizar' : 'Próximo'}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {confirmStep === 'confirm' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-xl border border-slate-700 max-w-2xl w-full mx-4 p-6 space-y-6">
            {pageExists ? (
              <>
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold text-white">Página já existe!</h3>
                  <p className="text-slate-400">
                    Uma página com este nome já existe no sistema. Deseja excluir a página anterior e seus componentes?
                  </p>
                  <div className="flex justify-center space-x-4 mt-6">
                    <Button
                      variant="outline"
                      className="bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
                      onClick={() => {
                        setConfirmStep('check');
                        setUserChoice(null);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setUserChoice('yes');
                        setConfirmStep('generate');
                      }}
                    >
                      Excluir e Continuar
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Confirmação de Criação</h3>
                    
                    <div className="bg-slate-800/50 rounded-lg p-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-slate-300 mb-2">Nome da Página Principal</h4>
                        <p className="text-white">{generatedData.pageTitle}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-slate-300 mb-2">Título e Subtítulo</h4>
                        <p className="text-white">{generatedData.pageTitle}</p>
                        <p className="text-slate-400 text-sm">{generatedData.pageSubtitle}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-slate-300 mb-2">Nome da Tabela</h4>
                        <p className="text-white">{generatedData.tableName}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-slate-300 mb-2">Campos da Tabela</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-slate-700">
                                <th className="text-left py-2 text-slate-300">Nome</th>
                                <th className="text-left py-2 text-slate-300">Tipo</th>
                                <th className="text-left py-2 text-slate-300">Obrigatório</th>
                              </tr>
                            </thead>
                            <tbody>
                              {generatedData.fields.map((field: any, index: number) => (
                                <tr key={index} className="border-b border-slate-700/50">
                                  <td className="py-2 text-white">{field.name}</td>
                                  <td className="py-2 text-slate-400">{field.type}</td>
                                  <td className="py-2 text-slate-400">{field.required ? 'Sim' : 'Não'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center space-x-4 mt-6">
                      <Button
                        variant="outline"
                        className="bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
                        onClick={() => {
                          setUserChoice('no');
                          setConfirmStep('check');
                        }}
                      >
                        Voltar para Configuração
                      </Button>
                      <Button
                        variant="default"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => {
                          setUserChoice('yes');
                          setConfirmStep('generate');
                          handleGeneratePage();
                        }}
                      >
                        Confirmar e Gerar
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 