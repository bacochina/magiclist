'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { DatabaseSchemaBuilder } from '@/components/generators/DatabaseSchemaBuilder';
import { PreviewPanel } from '@/components/generators/PreviewPanel';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function GeneratorPage() {
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

  const handleSchemaChange = (schema: any) => {
    setGeneratedData(prev => ({
      ...prev,
      ...schema
    }));
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerador de Páginas e Estruturas</h1>
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

      <Card className="p-6">
        <DatabaseSchemaBuilder
          onSchemaChange={handleSchemaChange}
          initialData={generatedData}
        />
      </Card>
    </div>
  );
} 