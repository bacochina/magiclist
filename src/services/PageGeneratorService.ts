import { FileSystemService } from './FileSystemService';
import path from 'path';

export interface PageGenerationConfig {
  pageTitle: string;
  pageSubtitle: string;
  tableName: string;
  basePath: string;
  fields: any[];
  relationships: any[];
}

export interface GenerationProgress {
  step: number;
  message: string;
  error: string | null;
}

export class PageGeneratorService {
  private config: PageGenerationConfig;
  private paths: {
    pageDir: string;
    componentsDir: string;
    apiDir: string;
  } | null = null;
  private onProgress?: (progress: GenerationProgress) => void;

  constructor(config: PageGenerationConfig, onProgress?: (progress: GenerationProgress) => void) {
    this.config = config;
    this.onProgress = onProgress;
  }

  private emitProgress(step: number, message: string, error: string | null = null) {
    if (this.onProgress) {
      this.onProgress({ step, message, error });
    }
  }

  /**
   * Inicia o processo de geração da página
   */
  async initializeStructure(progressCallback?: (step: number, message: string, error: string | null) => void): Promise<{ success: boolean; error?: string }> {
    // Configurar callback temporário se fornecido
    const originalCallback = this.onProgress;
    
    try {
      if (progressCallback) {
        this.onProgress = (progress) => {
          progressCallback(progress.step, progress.message, progress.error);
          // Manter o callback original se existir
          if (originalCallback) {
            originalCallback(progress);
          }
        };
      }

      // 1. Validar configuração
      const validationResult = await this.validateConfig();
      if (!validationResult.success) {
        return validationResult;
      }

      // 2. Criar estrutura de diretórios
      const structureResult = await this.createDirectoryStructure();
      if (!structureResult.success) {
        return structureResult;
      }

      // 3. Gerar arquivos base
      this.emitProgress(5, 'Gerando arquivos base');
      const baseFilesResult = await this.generateBaseFiles();
      if (!baseFilesResult.success) {
        return baseFilesResult;
      }

      // 4. Configurar rotas
      this.emitProgress(6, 'Configurando rotas');
      const routesResult = await this.configureRoutes();
      if (!routesResult.success) {
        return routesResult;
      }

      this.emitProgress(7, 'Finalizado com sucesso');
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      this.emitProgress(0, 'Erro na geração', errorMessage);
      
      return { success: false, error: errorMessage };
    } finally {
      // Restaurar callback original
      if (progressCallback) {
        this.onProgress = originalCallback;
      }
    }
  }

  /**
   * Valida a configuração fornecida
   */
  private async validateConfig(): Promise<{ success: boolean; error?: string }> {
    this.emitProgress(0, 'Validando configuração');
    
    if (!this.config.pageTitle) {
      return { success: false, error: 'Título da página é obrigatório' };
    }
    if (!this.config.tableName) {
      return { success: false, error: 'Nome da tabela é obrigatório' };
    }
    if (!this.config.basePath) {
      return { success: false, error: 'Caminho base é obrigatório' };
    }
    if (!this.config.fields || this.config.fields.length === 0) {
      return { success: false, error: 'Pelo menos um campo deve ser definido' };
    }

    return { success: true };
  }

  private async createDirectoryStructure(): Promise<{ success: boolean; error?: string }> {
    try {
      this.emitProgress(1, 'Criando estrutura de diretórios');

      // Normalizar o caminho base - remover acentos, espaços e caracteres especiais
      const normalizedBasePath = this.config.basePath
        .replace(/\s+/g, '-')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''); // Remove acentos
      
      const normalizedTableName = this.config.tableName.toLowerCase()
        .replace(/\s+/g, '-')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''); // Remove acentos
      
      const pageDir = `${normalizedBasePath}/${normalizedTableName}`;
      const componentsDir = `${pageDir}/components`;
      const apiDir = `${pageDir}/api`;

      console.log('Tentando criar diretórios em:', {
        pageDir,
        componentsDir,
        apiDir,
        configPath: this.config.basePath
      });

      // Criar diretório da página
      this.emitProgress(2, 'Criando diretório da página');
      const pageDirResult = await FileSystemService.ensureDirectoryExists(pageDir);
      if (!pageDirResult.success) {
        console.error('Erro ao criar diretório da página:', pageDirResult.error);
        return {
          success: false,
          error: `Erro ao criar diretório da página: ${pageDirResult.error}`
        };
      }

      // Criar diretório de componentes
      this.emitProgress(3, 'Criando diretório de componentes');
      const componentsDirResult = await FileSystemService.ensureDirectoryExists(componentsDir);
      if (!componentsDirResult.success) {
        console.error('Erro ao criar diretório de componentes:', componentsDirResult.error);
        return {
          success: false,
          error: `Erro ao criar diretório de componentes: ${componentsDirResult.error}`
        };
      }

      // Criar diretório de API
      this.emitProgress(4, 'Criando diretório de API');
      const apiDirResult = await FileSystemService.ensureDirectoryExists(apiDir);
      if (!apiDirResult.success) {
        console.error('Erro ao criar diretório de API:', apiDirResult.error);
        return {
          success: false,
          error: `Erro ao criar diretório de API: ${apiDirResult.error}`
        };
      }

      // Salvar os caminhos para uso posterior
      this.paths = {
        pageDir,
        componentsDir,
        apiDir
      };

      return { success: true };
    } catch (error) {
      console.error('Erro ao criar estrutura de diretórios:', error);
      return {
        success: false,
        error: `Erro ao criar estrutura de diretórios: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Gera os arquivos base para a página
   */
  private async generateBaseFiles(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.paths) {
        return { 
          success: false, 
          error: 'Estrutura de diretórios não iniciada. Execute createDirectoryStructure primeiro.' 
        };
      }

      // 1. Gerar página principal
      const pageResult = await this.generatePageFile();
      if (!pageResult.success) {
        return pageResult;
      }

      // 2. Gerar componentes da interface
      const componentsResult = await this.generateComponents();
      if (!componentsResult.success) {
        return componentsResult;
      }

      // 3. Gerar arquivos da API
      const apiResult = await this.generateApiFiles();
      if (!apiResult.success) {
        return apiResult;
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao gerar arquivos base:', error);
      return {
        success: false,
        error: `Erro ao gerar arquivos base: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Gera o arquivo principal da página
   */
  private async generatePageFile(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.paths) {
        return { success: false, error: 'Estrutura de diretórios não iniciada' };
      }

      const pageContent = this.generatePageTemplate();
      const pageFilePath = `${this.paths.pageDir}/page.tsx`;

      const result = await FileSystemService.createFile(pageFilePath, pageContent);
      return result;
    } catch (error) {
      console.error('Erro ao gerar arquivo da página:', error);
      return {
        success: false,
        error: `Erro ao gerar arquivo da página: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Gera os componentes da interface
   */
  private async generateComponents(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.paths) {
        return { success: false, error: 'Estrutura de diretórios não iniciada' };
      }

      // 1. Gerar componente de listagem
      const listComponentContent = this.generateListComponentTemplate();
      const listComponentPath = `${this.paths.componentsDir}/List.tsx`;
      const listResult = await FileSystemService.createFile(listComponentPath, listComponentContent);
      if (!listResult.success) {
        return listResult;
      }

      // 2. Gerar componente de formulário
      const formComponentContent = this.generateFormComponentTemplate();
      const formComponentPath = `${this.paths.componentsDir}/Form.tsx`;
      const formResult = await FileSystemService.createFile(formComponentPath, formComponentContent);
      if (!formResult.success) {
        return formResult;
      }

      // 3. Gerar componentes adicionais (se necessário)
      // ...

      return { success: true };
    } catch (error) {
      console.error('Erro ao gerar componentes:', error);
      return {
        success: false,
        error: `Erro ao gerar componentes: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Gera os arquivos da API
   */
  private async generateApiFiles(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.paths) {
        return { success: false, error: 'Estrutura de diretórios não iniciada' };
      }

      // 1. Gerar arquivo de rota principal
      const routeContent = this.generateApiRouteTemplate();
      const routePath = `${this.paths.apiDir}/route.ts`;
      const routeResult = await FileSystemService.createFile(routePath, routeContent);
      if (!routeResult.success) {
        return routeResult;
      }

      // 2. Gerar outros arquivos da API, se necessário
      // ...

      return { success: true };
    } catch (error) {
      console.error('Erro ao gerar arquivos da API:', error);
      return {
        success: false,
        error: `Erro ao gerar arquivos da API: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Configura as rotas da aplicação
   */
  private async configureRoutes(): Promise<{ success: boolean; error?: string }> {
    try {
      // Como a tabela já existe no Supabase, não é necessário criar a estrutura do banco
      // Apenas simulamos o progresso para manter o fluxo visual
      return { success: true };
    } catch (error) {
      console.error('Erro ao configurar rotas:', error);
      return {
        success: false,
        error: `Erro ao configurar rotas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Gera o template para o arquivo principal da página
   */
  private generatePageTemplate(): string {
    const { pageTitle, pageSubtitle, tableName } = this.config;
    const normalizedTableName = tableName.toLowerCase();
    
    return `import { Metadata } from "next";
import List from "./components/List";

export const metadata: Metadata = {
  title: "${pageTitle}",
  description: "${pageSubtitle}",
};

export default function ${this.capitalize(normalizedTableName)}Page() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">${pageTitle}</h1>
        <p className="text-muted-foreground">
          ${pageSubtitle}
        </p>
      </div>
      <List />
    </div>
  );
}`;
  }

  /**
   * Gera o template para o componente de listagem
   */
  private generateListComponentTemplate(): string {
    const { pageTitle, tableName, fields } = this.config;
    const normalizedTableName = tableName.toLowerCase();
    
    // Identificar campos que serão exibidos na listagem
    const listFields = fields.slice(0, 4); // Limitar a 4 campos para simplificar
    
    // Gerar colunas para a tabela
    const columns = this.generateColumnsCode(listFields);
    
    return `"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/components/ui/use-toast";
import Form from "./Form";
import { useQuery } from "@tanstack/react-query";

// Definição das colunas da tabela
${columns}

export default function List() {
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { toast } = useToast();

  // Buscar dados do Supabase
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["${normalizedTableName}"],
    queryFn: async () => {
      const response = await fetch(\`/api/${normalizedTableName}\`);
      if (!response.ok) {
        throw new Error("Erro ao carregar dados");
      }
      return response.json();
    },
  });

  // Manipuladores de eventos
  const handleAdd = () => {
    setEditingItem(null);
    setOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setOpen(true);
  };

  const handleSave = async () => {
    await refetch();
    setOpen(false);
    toast({
      title: "Sucesso",
      description: editingItem ? "Item atualizado com sucesso" : "Item criado com sucesso",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">${pageTitle}</h2>
        <Button onClick={handleAdd} className="gap-1">
          <Plus className="h-4 w-4" /> Adicionar
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        onEdit={handleEdit}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <Form 
            item={editingItem} 
            onSave={handleSave} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}`;
  }

  /**
   * Gera o template para o componente de formulário
   */
  private generateFormComponentTemplate(): string {
    const { tableName, fields } = this.config;
    const normalizedTableName = tableName.toLowerCase();
    
    // Gerar campos do formulário
    const formFields = this.generateFormFieldsCode(fields);
    
    return `"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form as UIForm,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Definição do esquema de validação
const formSchema = z.object({
${this.generateZodSchemaCode(fields)}
});

type FormValues = z.infer<typeof formSchema>;

interface FormProps {
  item?: any;
  onSave: () => void;
}

export default function Form({ item, onSave }: FormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Configurar o formulário com react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: item || {
${this.generateDefaultValuesCode(fields)}
    },
  });

  // Enviar o formulário
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      // Determinar se é uma criação ou atualização
      const url = \`/api/${normalizedTableName}\${item?.id ? \`/\${item.id}\` : ""}\`;
      const method = item?.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar dados");
      }

      onSave();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao salvar. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <UIForm {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            ${formFields}

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onSave()}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : item ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </UIForm>
      </CardContent>
    </Card>
  );
}`;
  }

  /**
   * Gera o template para a API Route
   */
  private generateApiRouteTemplate(): string {
    const { tableName } = this.config;
    const normalizedTableName = tableName.toLowerCase();
    
    return `import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const supabase = createRouteHandlerClient({ cookies });
    
    // Construir query base
    let query = supabase.from("${normalizedTableName}").select("*");
    
    // Adicionar paginação
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const start = (page - 1) * pageSize;
    query = query.range(start, start + pageSize - 1);
    
    // Executar query
    const { data, error, count } = await query;
    
    if (error) {
      console.error("Erro ao buscar dados:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ data, count });
  } catch (error) {
    console.error("Erro na API:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();
    
    const { data, error } = await supabase
      .from("${normalizedTableName}")
      .insert(body)
      .select("*")
      .single();
    
    if (error) {
      console.error("Erro ao inserir dados:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro na API:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();
    const id = request.url.split("/").pop();
    
    if (!id) {
      return NextResponse.json(
        { error: "ID não fornecido" },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase
      .from("${normalizedTableName}")
      .update(body)
      .eq("id", id)
      .select("*")
      .single();
    
    if (error) {
      console.error("Erro ao atualizar dados:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro na API:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const id = request.url.split("/").pop();
    
    if (!id) {
      return NextResponse.json(
        { error: "ID não fornecido" },
        { status: 400 }
      );
    }
    
    const { error } = await supabase
      .from("${normalizedTableName}")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error("Erro ao excluir dados:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro na API:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}`
  }

  /**
   * Gera o código para as colunas da tabela de listagem
   */
  private generateColumnsCode(fields: any[]): string {
    const columnsCode = fields.map(field => {
      const fieldName = field.name;
      const fieldLabel = this.capitalize(field.name);
      
      return `{
    accessorKey: "${fieldName}",
    header: "${fieldLabel}",
    cell: ({ row }) => <div>{row.getValue("${fieldName}")}</div>,
  }`;
    });

    // Adicionar coluna de ações
    columnsCode.push(`{
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.options.meta?.onEdit?.(row.original)}
          >
            Editar
          </Button>
        </div>
      );
    },
  }`);

    return `const columns = [
  ${columnsCode.join(',\n  ')}
];`;
  }

  /**
   * Gera código para o esquema de validação zod
   */
  private generateZodSchemaCode(fields: any[]): string {
    return fields.map(field => {
      const fieldName = field.name;
      const required = !field.nullable;
      
      let validationCode = '';
      
      switch (field.type) {
        case 'varchar':
        case 'text':
          validationCode = `z.string()${required ? '' : '.optional()'}`;
          break;
        case 'int4':
        case 'integer':
        case 'numeric':
          validationCode = `z.number()${required ? '' : '.optional()'}`;
          break;
        case 'boolean':
          validationCode = `z.boolean()${required ? '' : '.optional()'}`;
          break;
        case 'date':
        case 'timestamp':
          validationCode = `z.string()${required ? '' : '.optional()'}`;
          break;
        default:
          validationCode = `z.any()${required ? '' : '.optional()'}`;
      }
      
      return `  ${fieldName}: ${validationCode},`;
    }).join('\n');
  }

  /**
   * Gera código para os valores padrão do formulário
   */
  private generateDefaultValuesCode(fields: any[]): string {
    return fields.map(field => {
      const fieldName = field.name;
      let defaultValue = '';
      
      switch (field.type) {
        case 'varchar':
        case 'text':
          defaultValue = '""';
          break;
        case 'int4':
        case 'integer':
        case 'numeric':
          defaultValue = '0';
          break;
        case 'boolean':
          defaultValue = 'false';
          break;
        case 'date':
        case 'timestamp':
          defaultValue = '""';
          break;
        default:
          defaultValue = 'null';
      }
      
      return `      ${fieldName}: ${defaultValue},`;
    }).join('\n');
  }

  /**
   * Gera código para os campos do formulário
   */
  private generateFormFieldsCode(fields: any[]): string {
    return fields.map(field => {
      const fieldName = field.name;
      const fieldLabel = this.capitalize(field.name);
      
      let inputType = 'text';
      switch (field.type) {
        case 'int4':
        case 'integer':
        case 'numeric':
          inputType = 'number';
          break;
        case 'date':
          inputType = 'date';
          break;
        case 'timestamp':
          inputType = 'datetime-local';
          break;
        case 'boolean':
          // Para boolean, usaríamos um checkbox ou toggle, mas vamos manter simples
          inputType = 'checkbox';
          break;
      }
      
      return `<FormField
  control={form.control}
  name="${fieldName}"
  render={({ field }) => (
    <FormItem>
      <FormLabel>${fieldLabel}</FormLabel>
      <FormControl>
        <Input type="${inputType}" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>`;
    }).join('\n');
  }

  /**
   * Capitaliza a primeira letra de uma string
   */
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Retorna os caminhos gerados
   */
  getPaths() {
    return this.paths;
  }
} 