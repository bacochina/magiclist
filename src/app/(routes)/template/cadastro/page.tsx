"use client";

import { TemplateForm } from "../components/TemplateForm";
import { Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Função para download do arquivo
const handleDownloadAnalise = () => {
  // Conteúdo do arquivo de análise
  const conteudo = `# Análise de Componentes - Templates/Cadastros`;
  
  // Criar blob e fazer download
  const blob = new Blob([conteudo], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'analise_template.md';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export default function TemplatesPage() {
  const [showSQL, setShowSQL] = useState(false);
  const [generatedSQL, setGeneratedSQL] = useState<string>("");

  return (
    <div className="flex flex-col gap-8 p-8 relative pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Novo Template</h1>
          <p className="text-slate-400">
            Crie um novo template baseado em uma página existente para reutilizar sua estrutura e estilos
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSQL(true)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Visualizar SQL
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (generatedSQL) {
                const blob = new Blob([generatedSQL], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'template_schema.sql';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
              }
            }}
            disabled={!generatedSQL}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Baixar SQL
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadAnalise}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Baixar Análise
          </Button>
        </div>
      </div>

      <Dialog open={showSQL} onOpenChange={setShowSQL}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>SQL do Template</DialogTitle>
          </DialogHeader>
          <pre className="p-4 bg-slate-950 rounded-lg overflow-x-auto text-sm text-slate-300">
            {generatedSQL || "Nenhum SQL gerado ainda. Configure o template primeiro."}
          </pre>
          {generatedSQL && (
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const blob = new Blob([generatedSQL], { type: 'text/plain' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'template_schema.sql';
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                }}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Baixar SQL
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <TemplateForm onSQLGenerated={setGeneratedSQL} />
    </div>
  );
} 