'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'sonner';

interface Template {
  id: string;
  nome: string;
  descricao: string;
  estrutura: any;
}

interface PageParams {
  id: string;
}

export default function TemplatePage({ params }: { params: PageParams }) {
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [nomePagina, setNomePagina] = useState('');
  const [caminhoPagina, setCaminhoPagina] = useState('');
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function loadTemplate() {
      const { data: template, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        toast.error('Erro ao carregar template');
        console.error('Erro ao carregar template:', error);
        return;
      }

      setTemplate(template);
    }

    loadTemplate();
  }, [params.id, supabase]);

  async function handleGerarPagina(e: React.FormEvent) {
    e.preventDefault();

    if (!template) return;

    const { data, error } = await supabase.rpc('gerar_pagina', {
      p_template_id: template.id,
      p_nome: nomePagina,
      p_caminho: caminhoPagina,
      p_conteudo: { campos: {} }
    });

    if (error) {
      toast.error('Erro ao gerar página');
      console.error('Erro ao gerar página:', error);
      return;
    }

    toast.success('Página gerada com sucesso!');
    router.push('/templates');
  }

  if (!template) {
    return (
      <div className="container mx-auto p-6">
        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardContent className="p-6">
            Carregando...
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
        <CardHeader>
          <CardTitle className="text-foreground">Gerar Página a partir do Template: {template.nome}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Descrição do Template</h3>
            <p className="text-sm text-foreground">{template.descricao}</p>
          </div>

          <form onSubmit={handleGerarPagina} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Nome da Página
              </label>
              <Input
                value={nomePagina}
                onChange={(e) => setNomePagina(e.target.value)}
                placeholder="Ex: Cadastro de Usuário"
                required
                className="bg-background text-foreground placeholder:text-muted-foreground border-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Caminho da Página
              </label>
              <Input
                value={caminhoPagina}
                onChange={(e) => setCaminhoPagina(e.target.value)}
                placeholder="Ex: /cadastro/usuario"
                required
                className="bg-background text-foreground placeholder:text-muted-foreground border-input"
              />
              <p className="text-xs text-muted-foreground mt-1">
                O caminho deve começar com / e usar apenas letras minúsculas, números e traços
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="border-input hover:bg-accent hover:text-accent-foreground"
              >
                Voltar
              </Button>
              <Button type="submit">
                Gerar Página
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
        <CardHeader>
          <CardTitle className="text-foreground">Páginas Geradas</CardTitle>
        </CardHeader>
        <CardContent>
          <PaginasGeradas templateId={template.id} />
        </CardContent>
      </Card>
    </div>
  );
}

function PaginasGeradas({ templateId }: { templateId: string }) {
  const [paginas, setPaginas] = useState<any[]>([]);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function loadPaginas() {
      const { data, error } = await supabase
        .from('paginas_geradas')
        .select('*')
        .eq('template_id', templateId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar páginas:', error);
        return;
      }

      setPaginas(data || []);
    }

    loadPaginas();
  }, [templateId, supabase]);

  if (paginas.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhuma página gerada ainda.</p>;
  }

  return (
    <div className="space-y-2">
      {paginas.map((pagina) => (
        <div
          key={pagina.id}
          className="flex justify-between items-center p-3 bg-muted/50 rounded-md border border-input"
        >
          <div>
            <h4 className="font-medium text-foreground">{pagina.nome}</h4>
            <p className="text-sm text-muted-foreground">{pagina.caminho}</p>
          </div>
          <Button variant="outline" size="sm" asChild className="border-input hover:bg-accent hover:text-accent-foreground">
            <a href={pagina.caminho} target="_blank" rel="noopener noreferrer">
              Visualizar
            </a>
          </Button>
        </div>
      ))}
    </div>
  );
} 