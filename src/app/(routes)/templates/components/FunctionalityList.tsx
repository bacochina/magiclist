"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

type Dependency = {
  name: string;
  version: string;
  description: string;
};

type Technology = {
  name: string;
  description: string;
  docs?: string;
};

type Feature = {
  name: string;
  description: string;
  implementation?: string;
};

type FunctionalityGroup = {
  name: string;
  features: Feature[];
};

type DatabaseTable = {
  name: string;
  description: string;
  fields: {
    name: string;
    type: string;
    description?: string;
    required?: boolean;
    reference?: string;
  }[];
};

const functionalityGroups: FunctionalityGroup[] = [
  {
    name: "Operações CRUD",
    features: [
      {
        name: "Listagem Paginada",
        description: "Lista de registros com paginação, ordenação e filtros",
        implementation: "Implementado usando TanStack Table v8 com server-side pagination",
      },
      {
        name: "Formulário de Criação",
        description: "Formulário validado para criar novos registros",
        implementation: "Usa React Hook Form + Zod para validação de dados",
      },
      {
        name: "Edição de Registros",
        description: "Formulário pré-preenchido para edição de registros existentes",
        implementation: "Modal de edição com validação e preservação de estado",
      },
      {
        name: "Exclusão com Confirmação",
        description: "Dialog de confirmação antes da exclusão",
        implementation: "Usa o componente AlertDialog do shadcn/ui",
      },
    ],
  },
  {
    name: "Funcionalidades Avançadas",
    features: [
      {
        name: "Pesquisa em Tempo Real",
        description: "Busca com debounce e highlight dos resultados",
        implementation: "Implementado com useDebounce hook e match-sorter",
      },
      {
        name: "Exportação de Dados",
        description: "Exportação da lista para CSV/Excel",
        implementation: "Usa react-csv para exportação de dados",
      },
      {
        name: "Upload de Arquivos",
        description: "Suporte a upload de imagens e documentos",
        implementation: "Integrado com Supabase Storage",
      },
    ],
  },
];

const dependencies: Dependency[] = [
  {
    name: "@tanstack/react-table",
    version: "^8.0.0",
    description: "Biblioteca para tabelas complexas com ordenação e filtros",
  },
  {
    name: "react-hook-form",
    version: "^7.0.0",
    description: "Gerenciamento de formulários com validação",
  },
  {
    name: "zod",
    version: "^3.0.0",
    description: "Schema validation com TypeScript",
  },
  {
    name: "@radix-ui/react-dialog",
    version: "^1.0.0",
    description: "Componentes acessíveis para modais e dialogs",
  },
  {
    name: "match-sorter",
    version: "^6.0.0",
    description: "Busca e filtragem avançada de dados",
  },
];

const technologies: Technology[] = [
  {
    name: "Next.js 14",
    description: "Framework React com Server Components e App Router",
    docs: "https://nextjs.org/docs",
  },
  {
    name: "TypeScript",
    description: "Tipagem estática para JavaScript",
    docs: "https://www.typescriptlang.org/docs",
  },
  {
    name: "Tailwind CSS",
    description: "Framework CSS utility-first",
    docs: "https://tailwindcss.com/docs",
  },
  {
    name: "Prisma",
    description: "ORM para TypeScript/Node.js",
    docs: "https://www.prisma.io/docs",
  },
  {
    name: "Supabase",
    description: "Backend as a Service com PostgreSQL",
    docs: "https://supabase.com/docs",
  },
];

const databaseTables: DatabaseTable[] = [
  {
    name: "bands",
    description: "Armazena informações das bandas",
    fields: [
      { name: "id", type: "uuid", description: "Identificador único", required: true },
      { name: "name", type: "text", description: "Nome da banda", required: true },
      { name: "description", type: "text", description: "Descrição/biografia da banda" },
      { name: "logo_url", type: "text", description: "URL do logo da banda" },
      { name: "created_at", type: "timestamp", description: "Data de criação", required: true },
      { name: "updated_at", type: "timestamp", description: "Data da última atualização", required: true },
    ],
  },
  {
    name: "members",
    description: "Cadastro de integrantes das bandas",
    fields: [
      { name: "id", type: "uuid", description: "Identificador único", required: true },
      { name: "name", type: "text", description: "Nome do integrante", required: true },
      { name: "band_id", type: "uuid", description: "ID da banda", required: true, reference: "bands.id" },
      { name: "role", type: "text", description: "Função/instrumento", required: true },
      { name: "join_date", type: "date", description: "Data de entrada na banda" },
      { name: "photo_url", type: "text", description: "URL da foto do integrante" },
      { name: "created_at", type: "timestamp", description: "Data de criação", required: true },
      { name: "updated_at", type: "timestamp", description: "Data da última atualização", required: true },
    ],
  },
  {
    name: "songs",
    description: "Cadastro de músicas do repertório",
    fields: [
      { name: "id", type: "uuid", description: "Identificador único", required: true },
      { name: "title", type: "text", description: "Título da música", required: true },
      { name: "band_id", type: "uuid", description: "ID da banda", required: true, reference: "bands.id" },
      { name: "lyrics", type: "text", description: "Letra da música" },
      { name: "chords", type: "jsonb", description: "Acordes em formato JSON" },
      { name: "sheet_music_url", type: "text", description: "URL da partitura" },
      { name: "created_at", type: "timestamp", description: "Data de criação", required: true },
      { name: "updated_at", type: "timestamp", description: "Data da última atualização", required: true },
    ],
  },
  {
    name: "events",
    description: "Agenda de eventos e shows",
    fields: [
      { name: "id", type: "uuid", description: "Identificador único", required: true },
      { name: "title", type: "text", description: "Título do evento", required: true },
      { name: "band_id", type: "uuid", description: "ID da banda", required: true, reference: "bands.id" },
      { name: "date", type: "timestamp", description: "Data e hora do evento", required: true },
      { name: "location", type: "text", description: "Local do evento", required: true },
      { name: "description", type: "text", description: "Descrição do evento" },
      { name: "status", type: "text", description: "Status do evento (confirmado, cancelado, etc)", required: true },
      { name: "created_at", type: "timestamp", description: "Data de criação", required: true },
      { name: "updated_at", type: "timestamp", description: "Data da última atualização", required: true },
    ],
  },
];

export function FunctionalityList() {
  return (
    <Card className="bg-slate-950 border-slate-800 p-6">
      <h3 className="text-lg font-medium text-white mb-4">Funcionalidades e Tecnologias</h3>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Funcionalidades</span>
            <Badge variant="secondary" className="bg-emerald-600/20 text-emerald-400 border-0">
              7 recursos
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Dependências</span>
            <Badge variant="secondary" className="bg-emerald-600/20 text-emerald-400 border-0">
              5 pacotes
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Tecnologias</span>
            <Badge variant="secondary" className="bg-emerald-600/20 text-emerald-400 border-0">
              5 ferramentas
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white">Recursos Disponíveis</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>• Listagem com paginação e filtros</li>
            <li>• Formulário de cadastro com validação</li>
            <li>• Upload de imagens e arquivos</li>
            <li>• Autenticação e autorização</li>
            <li>• Integração com API REST</li>
            <li>• Cache e otimização de performance</li>
            <li>• Testes automatizados</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white">Tecnologias Utilizadas</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>• Next.js 13 com App Router</li>
            <li>• React Hook Form e Zod</li>
            <li>• Tailwind CSS e Radix UI</li>
            <li>• Prisma ORM</li>
            <li>• Jest e Testing Library</li>
          </ul>
        </div>
      </div>
    </Card>
  );
} 