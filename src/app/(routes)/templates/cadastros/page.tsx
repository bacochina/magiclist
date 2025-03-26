"use client";

import { TemplateForm } from "../components/TemplateForm";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

// Função para download do arquivo
const handleDownloadAnalise = () => {
  // Conteúdo do arquivo de análise
  const conteudo = `# Análise de Componentes - Templates/Cadastros

## Estrutura de Arquivos
- \`src/app/(routes)/templates/cadastros/page.tsx\` - Página principal de cadastro de templates
- \`src/app/(routes)/templates/components/TemplateForm.tsx\` - Formulário para criação de templates
- \`src/app/(routes)/templates/components/PagePreview.tsx\` - Componente de visualização prévia de páginas
- \`src/app/(routes)/templates/components/PreviewAnalysis.tsx\` - Componente de análise da estrutura e componentes da página selecionada

## Fluxo de Funcionamento
1. O usuário acessa a página de cadastro de templates
2. Seleciona uma página existente como referência
3. O sistema mostra uma pré-visualização da página selecionada (listagem e formulário)
4. Uma análise detalhada dos componentes, banco de dados e funcionalidades é apresentada
5. O usuário fornece um nome para a nova página a ser criada
6. Ao confirmar, o sistema gera uma nova página baseada no template selecionado

## Componentes Principais

### TemplatesPage
Componente principal da página de cadastro de templates. Renderiza o formulário e dicas de uso.

**Características:**
- Layout com grid responsivo
- Título e descrição explicativa
- Seção de dicas com passos numerados
- Divisão entre o formulário (esquerda) e dicas (direita)
- Design clean com backgrounds escuros e bordas sutis

### TemplateForm
Formulário para criação de templates, utilizando React Hook Form.

**Características:**
- Gerenciamento de estado com useForm
- Integração com componentes UI do sistema
- Campo para nome da nova página
- Componente PagePreview embutido
- Botão de submissão com estilo destacado
- Validação de campos

### PagePreview
Componente responsável por mostrar a prévia da página selecionada como template.

**Características:**
- Seletor de página referência (bandas, músicas, integrantes, eventos)
- Carregamento dinâmico dos componentes de preview
- Tabs para alternar entre visualização de listagem e formulário
- Renderização de componentes reais em formato miniatura
- Componente de análise integrado (PreviewAnalysis)
- Loading states para carregamento assíncrono

### PreviewAnalysis
Componente que analisa e exibe detalhes sobre a estrutura, estilo e funcionalidades da página selecionada.

**Características:**
- Análise detalhada por categorias (estilo, banco, funcionalidades, detalhamento, tecnologias)
- Tabs para navegação entre categorias
- Conteúdo dinâmico baseado no template selecionado
- Lista de componentes e características agrupadas por seções
- Informações técnicas sobre implementação

## Componentes Personalizados

### IntegrantesSelector
Componente personalizado para seleção de integrantes em formulários.

\`\`\`jsx
function IntegrantesSelector({ value = [], onChange }) {
  const [selectedIntegrantes, setSelectedIntegrantes] = useState(value);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Busca de integrantes filtrados por termo de pesquisa
  const filteredIntegrantes = useMemo(() => {
    return integrantes.filter(integrante => 
      integrante.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, integrantes]);
  
  // Handler para seleção de integrantes
  const handleToggleIntegrante = (id) => {
    const updatedSelection = selectedIntegrantes.includes(id)
      ? selectedIntegrantes.filter(item => item !== id)
      : [...selectedIntegrantes, id];
    
    setSelectedIntegrantes(updatedSelection);
    if (onChange) onChange(updatedSelection);
  };
  
  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar integrantes..."
          className="w-full py-2 px-4 bg-gray-800 border border-gray-700 rounded-lg text-white"
        />
        <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
      </div>
      
      <div className="max-h-60 overflow-y-auto space-y-1 p-1">
        {filteredIntegrantes.length > 0 ? (
          filteredIntegrantes.map(integrante => (
            <div
              key={integrante.id}
              onClick={() => handleToggleIntegrante(integrante.id)}
              className={\`flex items-center gap-2 p-2 rounded-md cursor-pointer \${
                selectedIntegrantes.includes(integrante.id) 
                  ? 'bg-purple-900/50 border border-purple-500/50'
                  : 'hover:bg-gray-800 border border-transparent'
              }\`}
            >
              <div className={\`
                w-4 h-4 rounded-sm flex items-center justify-center
                \${selectedIntegrantes.includes(integrante.id)
                  ? 'bg-purple-600'
                  : 'border border-gray-500'}
              \`}>
                {selectedIntegrantes.includes(integrante.id) && (
                  <CheckIcon className="h-3 w-3 text-white" />
                )}
              </div>
              <span>{integrante.nome}</span>
              <span className="text-xs text-gray-400">{integrante.instrumento}</span>
            </div>
          ))
        ) : (
          <div className="text-center py-2 text-gray-400">
            Nenhum integrante encontrado
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mt-3">
        {selectedIntegrantes.length > 0 && selectedIntegrantes.map(id => {
          const integrante = integrantes.find(i => i.id === id);
          return integrante ? (
            <div key={id} className="bg-gray-800 px-2 py-1 rounded-full flex items-center gap-1 text-sm">
              <span>{integrante.nome}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleIntegrante(id);
                }}
                className="text-gray-400 hover:text-white ml-1"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}
\`\`\`

## Análise de Estilos e Funcionalidades

### Estilos Principais
- **Cores**: Esquema escuro com tons de cinza, preto e roxo como destaque
- **Tipografia**: Hierarquia clara com diferentes pesos e tamanhos
- **Layout**: Sistema de grid responsivo com uso de Flexbox
- **Componentes**: Cards, tabs, inputs, botões e selects estilizados
- **Espaçamento**: Uso consistente de padding e margin

### Funcionalidades Implementadas
- Seleção dinâmica de templates
- Carregamento assíncrono de componentes (dynamic imports)
- Tabs para navegação entre diferentes visualizações
- Análise detalhada de componentes e estruturas
- Formulário para captura de dados
- Loading states para feedback visual

### Tecnologias Utilizadas
- **React**: Hooks, Context, Memo para otimização
- **Next.js**: App Router, Dynamic Imports, Client Components
- **Tailwind CSS**: Estilização utilitária e responsiva
- **React Hook Form**: Gerenciamento de formulários
- **Lucide React**: Ícones vetoriais
- **shadcn/ui**: Componentes de UI reutilizáveis

## Considerações de Implementação
- O componente \`IntegrantesSelector\` apresenta um erro de sintaxe que precisa ser corrigido
- Existe uma estrutura bem definida para análise de templates
- O sistema usa carregamento dinâmico para otimizar a performance
- A interface segue um padrão visual consistente com o resto da aplicação
- Os componentes são modulares e reutilizáveis`;

  // Criar um blob com o conteúdo
  const blob = new Blob([conteudo], { type: 'text/plain' });
  
  // Criar URL para o blob
  const url = window.URL.createObjectURL(blob);
  
  // Criar elemento de link para download
  const a = document.createElement('a');
  a.href = url;
  a.download = 'analise_componentes_template_cadastro.txt';
  
  // Adicionar à página, clicar e depois remover
  document.body.appendChild(a);
  a.click();
  
  // Limpar
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export default function TemplatesPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Novo Template</h1>
        <p className="text-slate-400">
          Crie um novo template baseado em uma página existente para reutilizar sua estrutura e estilos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8">
        <div className="space-y-8">
          <div className="p-6 rounded-lg bg-slate-950/50 backdrop-blur border border-slate-800">
            <TemplateForm />
          </div>
        </div>

        <div className="space-y-4">
          <div className="sticky top-8">
            <div className="p-6 rounded-lg bg-slate-950/50 backdrop-blur border border-slate-800">
              <h2 className="text-lg font-medium text-white mb-4">Dicas</h2>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex gap-2">
                  <span className="text-purple-400">1.</span>
                  <p>Selecione uma página existente como referência para o novo template</p>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400">2.</span>
                  <p>Escolha um nome descritivo para a nova página que será gerada</p>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400">3.</span>
                  <p>Revise os estilos e funcionalidades que serão replicados</p>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400">4.</span>
                  <p>Confirme a criação do template para gerar a nova página automaticamente</p>
                </li>
              </ul>
              
              {/* Botão de download do arquivo de análise */}
              <div className="mt-6 border-t border-slate-800 pt-4">
                <Button 
                  onClick={handleDownloadAnalise}
                  className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Baixar análise completa</span>
                </Button>
                <p className="text-xs text-slate-400 mt-2">
                  Faça o download da análise detalhada de componentes para referência offline
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 