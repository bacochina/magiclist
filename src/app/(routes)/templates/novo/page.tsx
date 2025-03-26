'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'sonner';

export default function NovoTemplatePage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { data, error } = await supabase.rpc('criar_template', {
      p_nome: nome,
      p_descricao: descricao,
      p_estrutura: { tipo: 'form', campos: [] },
      p_estilos: [{ selector: '.form', propriedades: { display: 'flex' } }]
    });

    if (error) {
      toast.error('Erro ao criar template');
      console.error('Erro ao criar template:', error);
      return;
    }

    toast.success('Template criado com sucesso!');
    router.push('/templates');
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
        <CardHeader>
          <CardTitle className="text-foreground">Novo Template</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Nome do Template
              </label>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Template de Cadastro"
                required
                className="bg-background text-foreground placeholder:text-muted-foreground border-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Descrição
              </label>
              <Textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o propósito deste template..."
                rows={4}
                className="bg-background text-foreground placeholder:text-muted-foreground border-input"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="border-input hover:bg-accent hover:text-accent-foreground"
              >
                Cancelar
              </Button>
              <Button type="submit">
                Criar Template
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 