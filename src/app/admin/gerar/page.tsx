'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatabaseSchemaBuilder } from '@/components/generators/DatabaseSchemaBuilder';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { History, Settings, Server, RefreshCw } from 'lucide-react';
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
  SelectItem,
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

export default function GeneratorPage() {
  const { toast } = useToast();
  const [generatedData, setGeneratedData] = useState({
    pageTitle: '',
    pageSubtitle: '',
    tableName: '',
    tableFunction: '',
    fields: [],
    relationships: [],
    constraints: [],
    indexes: []
  });
  
  const [ollamaConfig, setOllamaConfig] = useState({
    baseUrl: 'http://localhost:11434',
    model: 'llama2',
  });
  
  const [ollamaStatus, setOllamaStatus] = useState<'loading' | 'connected' | 'disconnected' | 'error'>('loading');
  const [ollamaModels, setOllamaModels] = useState<OllamaModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerador de Páginas e Estruturas</h1>
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                Configurar Ollama
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Configuração do Ollama</SheetTitle>
                <SheetDescription>
                  Configure a conexão com o servidor Ollama para geração de campos.
                </SheetDescription>
              </SheetHeader>
              
              <div className="py-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ollama-url">URL do Servidor</Label>
                  <Input 
                    id="ollama-url" 
                    value={ollamaConfig.baseUrl} 
                    onChange={(e) => setOllamaConfig({...ollamaConfig, baseUrl: e.target.value})}
                    placeholder="http://localhost:11434"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="ollama-model">Modelo</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={loadOllamaModels}
                      disabled={isLoadingModels || ollamaStatus !== 'connected'}
                    >
                      {isLoadingModels ? (
                        <RefreshCw className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-1" />
                      )}
                      Atualizar
                    </Button>
                  </div>
                  
                  <Select 
                    value={ollamaConfig.model}
                    onValueChange={(value) => setOllamaConfig({...ollamaConfig, model: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      {ollamaModels.length > 0 ? (
                        ollamaModels.map((model) => (
                          <SelectItem key={model.name} value={model.name}>
                            {model.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="llama2">llama2</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                {ollamaStatus === 'error' && (
                  <Alert variant="destructive">
                    <AlertTitle>Erro de conexão</AlertTitle>
                    <AlertDescription>
                      Não foi possível conectar ao servidor Ollama. Verifique se o servidor está em execução e acessível.
                    </AlertDescription>
                  </Alert>
                )}
                
                {ollamaStatus === 'disconnected' && (
                  <Alert variant="destructive">
                    <AlertTitle>Servidor desconectado</AlertTitle>
                    <AlertDescription>
                      O servidor Ollama não está respondendo. Verifique se o servidor está em execução e acessível.
                    </AlertDescription>
                  </Alert>
                )}
                
                {ollamaStatus === 'connected' && (
                  <Alert className="bg-green-50 border-green-200">
                    <Server className="h-4 w-4 text-green-700" />
                    <AlertTitle className="text-green-800">Conectado</AlertTitle>
                    <AlertDescription className="text-green-700">
                      O servidor Ollama está conectado e pronto para uso.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              <SheetFooter>
                <Button onClick={saveOllamaConfig}>Salvar configuração</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          
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

      <Card className="p-6">
        <DatabaseSchemaBuilder
          onSchemaChange={handleSchemaChange}
          initialData={generatedData}
        />
      </Card>
    </div>
  );
} 