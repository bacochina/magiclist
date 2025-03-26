Plano de Implementação - Página de Shows

Projeto: MagicList
Módulo: Shows
Data: [DATA_ATUAL]

Índice

1. Visão Geral
2. Estrutura do Projeto
3. Fases de Implementação
4. Cronograma
5. Detalhes Técnicos
6. Considerações de Segurança

Visão Geral

Implementação do módulo de Shows, seguindo o padrão da página de Músicas, com sistema de abas e integrações com o Supabase.

Objetivos

- Criar interface para gerenciamento de shows
- Implementar sistema de abas para organização das informações
- Integrar com banco de dados Supabase
- Manter consistência visual com o resto da aplicação

Requisitos Principais

1. Gerenciamento completo de shows (CRUD)
2. Sistema de abas para diferentes aspectos do show
3. Integração com bandas e integrantes
4. Gestão de substituições e freelancers
5. Controle financeiro básico

Estrutura do Projeto


Estrutura de Diretórios


src/app/(routes)/eventos/shows/
├── [id]/
│ ├── page.tsx
│ └── loading.tsx
├── components/
│ ├── ShowForm.tsx
│ ├── ShowTable.tsx
│ ├── ShowCard.tsx
│ ├── BandaTab.tsx
│ ├── ContatoTab.tsx
│ ├── EquipamentosTab.tsx
│ ├── HospedagemTab.tsx
│ └── CacheTab.tsx
├── page.tsx
└── loading.tsx



Interfaces TypeScript

// Types principais
interface Show {
  id: string;
  data: string;
  horario: string;
  local: string;
  endereco: string;
  cache_bruto: number;
  titulo: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

interface ShowBanda {
  show_id: string;
  banda_id: string;
  banda?: Banda;
}

interface ShowSubstituicao {
  id: string;
  show_id: string;
  banda_id: string;
  integrante_original_id: string;
  integrante_substituto_id: string;
  motivo: string;
}

interface ShowContato {
  id: string;
  show_id: string;
  tipo: 'show' | 'tecnico';
  nome: string;
  telefone?: string;
  observacoes?: string;
}

interface ShowEquipamento {
  id: string;
  show_id: string;
  descricao: string;
  quantidade: number;
  observacoes?: string;
}

interface ShowHospedagem {
  id: string;
  show_id: string;
  local?: string;
  endereco?: string;
  check_in?: Date;
  check_out?: Date;
  numero_quartos?: number;
  observacoes?: string;
}

interface ShowCache {
  id: string;
  show_id: string;
  descricao: string;
  valor: number;
  tipo: 'entrada' | 'saida';
  observacoes?: string;
}

Fases de Implementação


Fase 1: Estrutura Base e Componentes

1. Configuração Inicial
   Criar estrutura de diretórios
   Configurar tipos TypeScript
   Configurar rotas Next.js
   
2. Componentes Base
   Implementar ShowForm
   Implementar ShowTable
   Implementar ShowCard
   Configurar sistema de abas
   

Fase 2: API Routes

1. Rotas Principais
// src/app/api/shows/route.ts
export async function GET() {
  // Listar shows
}

export async function POST() {
  // Criar show
}

// src/app/api/shows/[id]/route.ts
export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Buscar show específico
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  // Atualizar show
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  // Excluir show
}
2. Rotas Secundárias
   
   API para bandas do show
   API para substituições
   API para contatos
   API para equipamentos
   API para hospedagem
   API para cachê
   

Fase 3: Implementação das Páginas

1. Página Principal (Lista de Shows)
   Cards de estatísticas
   Filtros e busca
   Alternância tabela/cards
   Ações principais
   
2. Página de Detalhes/Edição
   Sistema de abas
   Formulário principal
   Componentes específicos por aba
   

Fase 4: Componentes Específicos

1. Aba Principal
// src/app/(routes)/eventos/shows/components/ShowForm.tsx
export function ShowForm({ show, onSubmit }: ShowFormProps) {
  // Implementação do formulário principal
}
2. Aba de Bandas
// src/app/(routes)/eventos/shows/components/BandaTab.tsx
export function BandaTab({ show, onUpdate }: BandaTabProps) {
  // Implementação da aba de bandas
}
3. Demais Abas
   
   Implementar componentes específicos
   Configurar validações
   Integrar com APIs
   

Fase 5: Integrações

1. Serviços Supabase
// src/lib/supabase/shows.ts
export const showsService = {
  list: async () => {
    const { data, error } = await supabase
      .from('shows')
      .select('*, shows_bandas(*)');
    // ...
  },
  
  create: async (data: ShowCreateInput) => {
    const { data: show, error } = await supabase
      .from('shows')
      .insert(data)
      .select()
      .single();
    // ...
  },
  
  // ... outros métodos
};
2. Hooks Personalizados
// src/hooks/useShows.ts
export function useShows() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Implementação do hook
}

Fase 6: Testes e Validação

1. Testes de Unidade
   Componentes
   Hooks
   Funções utilitárias
   
2. Testes de Integração
   Fluxos completos
   Integrações Supabase
   

Cronograma


Sprint 1: Estrutura Base (1 semana)

- [ ] Criar estrutura de diretórios
- [ ] Implementar types e interfaces
- [ ] Configurar rotas base da API

Sprint 2: Listagem de Shows (1 semana)

- [ ] Implementar página principal
- [ ] Criar componentes de tabela e card
- [ ] Implementar filtros e busca

Sprint 3: Formulário Principal (1 semana)

- [ ] Criar página de detalhes/edição
- [ ] Implementar formulário principal
- [ ] Configurar validações

Sprint 4: Sistema de Abas (1 semana)

- [ ] Implementar navegação por abas
- [ ] Criar componentes base para cada aba
- [ ] Integrar com formulário principal

Sprint 5: Integrações (1 semana)

- [ ] Implementar serviços Supabase
- [ ] Criar hooks personalizados
- [ ] Integrar com backend

Sprint 6: Refinamentos (1 semana)

- [ ] Implementar feedback de usuário
- [ ] Adicionar loading states
- [ ] Melhorar UX/UI
- [ ] Realizar testes

Detalhes Técnicos


Tecnologias Utilizadas

- Next.js 14
- TypeScript
- Supabase
- TailwindCSS
- Shadcn/ui

Padrões de Código

- Componentes funcionais React
- Hooks personalizados para lógica reutilizável
- Validação de formulários com Zod
- Gerenciamento de estado com React Query

Considerações de Performance

- Paginação na listagem
- Lazy loading de componentes pesados
- Caching de dados com React Query
- Otimização de imagens

Considerações de Segurança


Políticas do Supabase

- Autenticação requerida para todas as operações
- RLS (Row Level Security) ativado
- Validações no backend

Validações

- Sanitização de inputs
- Validação de tipos
- Proteção contra XSS
- Tratamento de erros

Próximos Passos

1. Revisar e aprovar plano de implementação
2. Definir prioridades de desenvolvimento
3. Iniciar implementação da Fase 1
4. Agendar revisões semanais
5. Definir métricas de sucesso