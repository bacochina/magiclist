"use client";

import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { PagePreview } from "./PagePreview";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Tipos para campos
interface CampoForm {
  id: string;
  nomeAmigavel: string;
  nomeSugestao: string;
  tipoInformacao: string;
  validacao: string;
  mostrarListagem: boolean;
  incluirPesquisa: boolean;
  incluirFiltro: boolean;
}

export function TemplateForm() {
  const form = useForm();
  
  // Estados para título e subtítulo
  const [titulo, setTitulo] = useState<string>("");
  const [subtitulo, setSubtitulo] = useState<string>("");
  
  // Estados para nome da tabela e função
  const [nomeTabela, setNomeTabela] = useState<string>("");
  const [funcaoTabela, setFuncaoTabela] = useState<string>("");
  
  // Estado para gerenciar campos dinâmicos
  const [campos, setCampos] = useState<CampoForm[]>([]);
  
  // Estado para controlar a visualização do preview final
  const [showFinalPreview, setShowFinalPreview] = useState(false);
  const [nomePagina, setNomePagina] = useState<string>("");
  
  // Estado para controlar a visualização do SQL
  const [showSQL, setShowSQL] = useState(false);
  
  // Efeito para gerar subtítulo automaticamente
  useEffect(() => {
    if (titulo) {
      setSubtitulo(gerarSubtitulo(titulo));
    }
  }, [titulo]);
  
  // Efeito para gerar função da tabela automaticamente
  useEffect(() => {
    if (nomeTabela) {
      setFuncaoTabela(gerarFuncaoTabela(nomeTabela));
    }
  }, [nomeTabela]);
  
  // Função para gerar função da tabela com base no nome
  const gerarFuncaoTabela = (nome: string): string => {
    // Humanizar o nome (converter de snake_case ou camelCase para texto normal)
    const nomeHumanizado = nome
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .trim();
    
    // Remover plurais comuns em português
    let singular = nomeHumanizado;
    if (singular.endsWith('s')) {
      singular = singular.endsWith('es') 
        ? singular.slice(0, -2) 
        : singular.slice(0, -1);
    }
    
    // Capitalizar primeira letra
    const nomeCapitalizado = singular.charAt(0).toUpperCase() + singular.slice(1);
    
    // Padrões de funções por tipo de entidade
    const padroes = [
      { padrao: "usuario", texto: `Armazenar informações de usuários do sistema, incluindo dados pessoais, credenciais e permissões de acesso` },
      { padrao: "client", texto: `Armazenar dados cadastrais completos de clientes, incluindo informações de contato e histórico de relacionamento` },
      { padrao: "produto", texto: `Armazenar informações detalhadas de produtos, incluindo descrições, preços, categorias e estoque` },
      { padrao: "pedido", texto: `Registrar pedidos realizados por clientes, incluindo itens, quantidades, valores e status de processamento` },
      { padrao: "venda", texto: `Registrar vendas realizadas, incluindo produtos vendidos, valores, formas de pagamento e informações fiscais` },
      { padrao: "financeir", texto: `Armazenar movimentações financeiras, incluindo receitas, despesas, categorias e forma de pagamento` },
      { padrao: "categoria", texto: `Armazenar categorias para classificação e organização de itens no sistema` },
      { padrao: "estoque", texto: `Controlar o estoque de produtos, incluindo entradas, saídas, níveis mínimos e pontos de reposição` },
      { padrao: "fornecedor", texto: `Armazenar dados cadastrais de fornecedores, incluindo produtos fornecidos, condições comerciais e contatos` },
      { padrao: "evento", texto: `Registrar eventos, incluindo datas, horários, locais, participantes e recursos necessários` },
      { padrao: "tarefa", texto: `Gerenciar tarefas, incluindo descrições, responsáveis, prazos, prioridades e status` },
      { padrao: "projeto", texto: `Armazenar informações de projetos, incluindo escopo, cronograma, recursos, responsáveis e status` },
      { padrao: "banda", texto: `Armazenar informações sobre bandas musicais, incluindo integrantes, gêneros e repertório` },
      { padrao: "musica", texto: `Catalogar músicas, incluindo títulos, autores, letras, partituras e informações de copyright` },
      { padrao: "integrant", texto: `Registrar dados de integrantes, incluindo funções, habilidades e informações de contato` },
    ];
    
    // Verificar se o nome corresponde a algum padrão conhecido
    for (const p of padroes) {
      if (nomeHumanizado.includes(p.padrao)) {
        return p.texto;
      }
    }
    
    // Padrão genérico se nenhum específico for encontrado
    return `Armazenar e gerenciar informações relacionadas a ${nomeHumanizado}, incluindo dados cadastrais e atributos específicos`;
  };
  
  // Função para gerar subtítulo com base no título
  const gerarSubtitulo = (titulo: string): string => {
    // Lista de padrões de subtítulos para diferentes contextos
    const padroes = [
      { padrao: "Gerenciamento", texto: "Controle e organize todos os seus $recursos de forma eficiente" },
      { padrao: "Cadastro", texto: "Registre e mantenha informações detalhadas sobre seus $recursos" },
      { padrao: "Controle", texto: "Monitore e administre seus $recursos com facilidade" },
      { padrao: "Lista", texto: "Visualize e gerencie todos os seus $recursos" },
      { padrao: "Agenda", texto: "Organize seus $recursos com datas e horários" },
      { padrao: "Relatório", texto: "Analise estatísticas e métricas sobre seus $recursos" },
      { padrao: "Dashboard", texto: "Visualize indicadores importantes sobre seus $recursos" },
      { padrao: "Inventário", texto: "Controle o estoque e informações de seus $recursos" },
      { padrao: "Sistema", texto: "Plataforma integrada de gestão para seus $recursos" },
    ];
    
    // Identificar recursos no título
    let recurso = titulo.toLowerCase()
      .replace(/gerenciamento de |cadastro de |controle de |lista de |sistema de |dashboard de |relatório de |inventário de /gi, "")
      .trim();
    
    // Verificar padrões no título
    const padraoEncontrado = padroes.find(p => 
      titulo.toLowerCase().includes(p.padrao.toLowerCase())
    );
    
    if (padraoEncontrado) {
      return padraoEncontrado.texto.replace("$recursos", recurso);
    }
    
    // Padrão genérico se nenhum específico for encontrado
    return `Gerencie informações completas sobre ${recurso} com facilidade`;
  };
  
  // Função para adicionar novo campo
  const adicionarCampo = () => {
    const novoCampo: CampoForm = {
      id: `campo_${Date.now()}`,
      nomeAmigavel: '',
      nomeSugestao: '',
      tipoInformacao: '',
      validacao: '',
      mostrarListagem: true,
      incluirPesquisa: true,
      incluirFiltro: true
    };
    setCampos([...campos, novoCampo]);
  };
  
  // Função para remover campo
  const removerCampo = (id: string) => {
    setCampos(campos.filter(campo => campo.id !== id));
  };
  
  // Função para atualizar campo
  const atualizarCampo = (id: string, atualizacao: Partial<CampoForm>) => {
    setCampos(
      campos.map(campo => 
        campo.id === id ? { ...campo, ...atualizacao } : campo
      )
    );
  };
  
  // Função para gerar nome para Supabase baseado no nome amigável
  const gerarNomeSugestao = (nomeAmigavel: string): string => {
    if (!nomeAmigavel) return '';
    
    return nomeAmigavel
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]/g, '_') // Substitui caracteres especiais por underline
      .replace(/_+/g, '_') // Remove underlines duplicados
      .replace(/^_|_$/g, ''); // Remove underlines no início e fim
  };
  
  // Handler para mudança no nome amigável
  const handleNomeAmigavelChange = (id: string, valor: string) => {
    const nomeSugestao = gerarNomeSugestao(valor);
    atualizarCampo(id, { nomeAmigavel: valor, nomeSugestao });
  };
  
  // Mover campo para cima
  const moverCampoCima = (index: number) => {
    if (index <= 0) return;
    const novosCampos = [...campos];
    [novosCampos[index], novosCampos[index - 1]] = [novosCampos[index - 1], novosCampos[index]];
    setCampos(novosCampos);
  };
  
  // Mover campo para baixo
  const moverCampoBaixo = (index: number) => {
    if (index >= campos.length - 1) return;
    const novosCampos = [...campos];
    [novosCampos[index], novosCampos[index + 1]] = [novosCampos[index + 1], novosCampos[index]];
    setCampos(novosCampos);
  };

  // Função para processar o formulário e mostrar o preview final
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verifica se o nome da página foi preenchido
    if (!nomePagina.trim()) {
      alert("Por favor, insira o nome da nova página");
      return;
    }
    
    // Ativa a visualização do preview final
    setShowFinalPreview(true);
    
    // Scroll para o topo da página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Função para gerar dados fictícios baseados no tipo do campo
  const gerarDadoFicticioParaCampo = (campo: CampoForm, indiceItem: number): React.ReactNode => {
    // Lista de valores possíveis para diferentes tipos de dados
    const nomes = ["João Silva", "Maria Santos", "Pedro Oliveira", "Ana Souza", "Carlos Pereira", "Lucia Fernandes", "Roberto Almeida"];
    const produtos = ["Violão Acústico", "Baixo Elétrico", "Bateria Completa", "Teclado Profissional", "Microfone Dinâmico", "Mesa de Som", "Amplificador"];
    const cores = ["Vermelho", "Azul", "Verde", "Amarelo", "Preto", "Branco", "Cinza"];
    const locais = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Salvador", "Curitiba", "Porto Alegre", "Recife"];
    const status = ["Ativo", "Inativo", "Em análise", "Pendente", "Concluído"];
    const precos = [149.90, 299.90, 1250.00, 899.90, 549.90, 79.90, 1599.90];
    const datas = ["10/05/2023", "22/08/2023", "15/01/2024", "03/11/2023", "27/06/2023", "14/02/2024", "19/09/2023"];
    
    // Verificar o nome do campo para contextualizar dados
    const nomeCampo = campo.nomeAmigavel.toLowerCase();
    
    // Preferir a escolha por tipo, com ajustes baseados no nome do campo
    switch(campo.tipoInformacao) {
      case 'text':
        if (nomeCampo.includes('nome') || nomeCampo.includes('titulo'))
          return produtos[indiceItem % produtos.length];
        else if (nomeCampo.includes('cor'))
          return cores[indiceItem % cores.length];
        else if (nomeCampo.includes('local') || nomeCampo.includes('cidade') || nomeCampo.includes('endereco'))
          return locais[indiceItem % locais.length];
        else if (nomeCampo.includes('status'))
          return status[indiceItem % status.length];
        else
          return `Item ${indiceItem + 1}`;
        
      case 'longtext':
        return (
          <span className="truncate inline-block max-w-[200px]">
            {`Descrição detalhada do item ${indiceItem + 1}. Contém informações adicionais sobre este registro específico.`}
          </span>
        );
        
      case 'number':
        if (nomeCampo.includes('preco') || nomeCampo.includes('valor'))
          return `R$ ${precos[indiceItem % precos.length].toFixed(2)}`;
        else if (nomeCampo.includes('quantidade') || nomeCampo.includes('estoque'))
          return (indiceItem + 1) * 5;
        else
          return indiceItem * 10 + 100;
        
      case 'date':
        return datas[indiceItem % datas.length];
        
      case 'datetime':
        return `${datas[indiceItem % datas.length]} 14:${indiceItem * 10}`;
        
      case 'boolean':
        return (
          <span className={`inline-block w-4 h-4 rounded-full ${indiceItem % 2 === 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
        );
        
      case 'enum':
        if (nomeCampo.includes('status'))
          return status[indiceItem % status.length];
        else if (nomeCampo.includes('cor'))
          return cores[indiceItem % cores.length];
        else
          return `Opção ${indiceItem + 1}`;
        
      case 'file':
        return (
          <span className="flex items-center gap-1 text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span>arquivo_{indiceItem + 1}.jpg</span>
          </span>
        );
        
      case 'relation':
        return `Ref #${1000 + indiceItem}`;
        
      default:
        return `Valor ${indiceItem + 1}`;
    }
  };

  // Função para gerar SQL baseado nos campos configurados
  const gerarSQL = (): string => {
    // Verificar se há nome de tabela definido
    const nomeTab = nomeTabela.trim() || nomePagina.toLowerCase().replace(/\s+/g, '_');
    
    // Começar a construir o SQL
    let sql = `-- Comando SQL para criação da tabela ${nomeTab}\n`;
    sql += `-- Gerado automaticamente para ${nomePagina}\n\n`;
    
    // Criar a tabela
    sql += `CREATE TABLE public.${nomeTab} (\n`;
    sql += `  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n`;
    
    // Adicionar os campos
    const camposSQL = campos.map(campo => {
      let tipo = '';
      
      // Mapear tipo de informação para tipo SQL
      switch(campo.tipoInformacao) {
        case 'text':
          tipo = 'VARCHAR(255)';
          break;
        case 'longtext':
          tipo = 'TEXT';
          break;
        case 'number':
          tipo = 'NUMERIC';
          break;
        case 'date':
          tipo = 'DATE';
          break;
        case 'datetime':
          tipo = 'TIMESTAMP WITH TIME ZONE';
          break;
        case 'boolean':
          tipo = 'BOOLEAN DEFAULT FALSE';
          break;
        case 'enum':
          tipo = 'VARCHAR(50)';
          break;
        case 'file':
          tipo = 'VARCHAR(255)';
          break;
        case 'relation':
          tipo = 'UUID';
          break;
        default:
          tipo = 'VARCHAR(255)';
      }
      
      // Adicionar validações
      let validacoes = '';
      if (campo.validacao.toLowerCase().includes('obrigatório') || 
          campo.validacao.toLowerCase().includes('obrigatorio') || 
          campo.validacao.toLowerCase().includes('required')) {
        validacoes = ' NOT NULL';
      }
      
      return `  ${campo.nomeSugestao} ${tipo}${validacoes}`;
    }).join(',\n');
    
    sql += camposSQL;
    
    // Adicionar campos padrão de sistema
    sql += `,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),\n`;
    sql += `  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()\n`;
    sql += `);\n\n`;
    
    // Adicionar comentário de tabela
    sql += `COMMENT ON TABLE public.${nomeTab} IS '${funcaoTabela.replace(/'/g, "''")}';\n\n`;
    
    // Adicionar comentários para cada campo
    campos.forEach(campo => {
      sql += `COMMENT ON COLUMN public.${nomeTab}.${campo.nomeSugestao} IS '${campo.nomeAmigavel.replace(/'/g, "''")}';\n`;
    });
    
    // Adicionar trigger para atualizar o updated_at
    sql += `\n-- Trigger para atualizar o campo updated_at automaticamente\n`;
    sql += `CREATE TRIGGER set_updated_at\n`;
    sql += `  BEFORE UPDATE ON public.${nomeTab}\n`;
    sql += `  FOR EACH ROW\n`;
    sql += `  EXECUTE PROCEDURE public.moddatetime('updated_at');\n\n`;
    
    // Adicionar índices para campos de pesquisa
    const camposPesquisa = campos.filter(campo => campo.incluirPesquisa);
    if (camposPesquisa.length > 0) {
      sql += `-- Índices para campos de pesquisa\n`;
      camposPesquisa.forEach(campo => {
        sql += `CREATE INDEX idx_${nomeTab}_${campo.nomeSugestao} ON public.${nomeTab} (${campo.nomeSugestao});\n`;
      });
      sql += '\n';
    }
    
    // Configurar RLS (Row Level Security)
    sql += `-- Configuração de Row Level Security (RLS)\n`;
    sql += `ALTER TABLE public.${nomeTab} ENABLE ROW LEVEL SECURITY;\n\n`;
    
    // Criar políticas de acesso
    sql += `-- Políticas de acesso\n`;
    sql += `CREATE POLICY "Permitir SELECT para usuários autenticados" ON public.${nomeTab}\n`;
    sql += `  FOR SELECT USING (auth.role() = 'authenticated');\n\n`;
    
    sql += `CREATE POLICY "Permitir INSERT para usuários autenticados" ON public.${nomeTab}\n`;
    sql += `  FOR INSERT WITH CHECK (auth.role() = 'authenticated');\n\n`;
    
    sql += `CREATE POLICY "Permitir UPDATE para usuários autenticados" ON public.${nomeTab}\n`;
    sql += `  FOR UPDATE USING (auth.role() = 'authenticated');\n\n`;
    
    sql += `CREATE POLICY "Permitir DELETE para usuários autenticados" ON public.${nomeTab}\n`;
    sql += `  FOR DELETE USING (auth.role() = 'authenticated');\n\n`;
    
    // Criar Views para facilitar consultas
    sql += `-- View para facilitar consultas\n`;
    sql += `CREATE OR REPLACE VIEW public.vw_${nomeTab} AS\n`;
    sql += `  SELECT\n`;
    sql += `    t.id,\n`;
    campos.forEach((campo, index) => {
      sql += `    t.${campo.nomeSugestao}${index < campos.length - 1 ? ',' : ''}\n`;
    });
    sql += `  FROM public.${nomeTab} t;\n\n`;
    
    // Permissões da view
    sql += `-- Permissões da view\n`;
    sql += `GRANT SELECT ON public.vw_${nomeTab} TO authenticated;\n`;
    sql += `GRANT SELECT ON public.vw_${nomeTab} TO service_role;\n\n`;
    
    // Instruções finais
    sql += `-- Instruções de uso:\n`;
    sql += `-- 1. Execute este SQL no Editor SQL do Supabase\n`;
    sql += `-- 2. Configure os hooks de API se necessário\n`;
    sql += `-- 3. Teste as permissões de acesso\n`;
    
    return sql;
  };

  // Função para gerar SQL para download
  const generateSQL = () => {
    if (!nomeTabela) return "";
    
    let sql = `-- Criação da tabela ${nomeTabela}\n`;
    sql += `CREATE TABLE public.${nomeTabela} (\n`;
    sql += `  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n`;
    
    // Adicionar campos
    campos.forEach((campo, index) => {
      const tipo = getTipoSQL(campo.tipoInformacao);
      sql += `  ${campo.nomeSugestao} ${tipo}`;
      
      // Adicionar vírgula se não for o último campo
      if (index < campos.length - 1) {
        sql += ",";
      }
      
      sql += `\n`;
    });
    
    sql += `);\n\n`;
    
    // Comentários da tabela
    sql += `-- Adicionar comentário na tabela\n`;
    sql += `COMMENT ON TABLE public.${nomeTabela} IS '${funcaoTabela.replace(/'/g, "''")}';\n\n`;
    
    // Comentários dos campos
    campos.forEach(campo => {
      sql += `-- Comentário para o campo ${campo.nomeSugestao}\n`;
      sql += `COMMENT ON COLUMN public.${nomeTabela}.${campo.nomeSugestao} IS '${campo.nomeAmigavel.replace(/'/g, "''")}';\n`;
    });
    
    return sql;
  };
  
  // Função para obter o tipo SQL baseado no tipo de informação
  const getTipoSQL = (tipo: string): string => {
    switch (tipo) {
      case 'text':
        return 'TEXT';
      case 'number':
        return 'INTEGER';
      case 'decimal':
        return 'DECIMAL(10,2)';
      case 'date':
        return 'DATE';
      case 'datetime':
        return 'TIMESTAMP WITH TIME ZONE';
      case 'boolean':
        return 'BOOLEAN';
      case 'image':
        return 'TEXT';
      case 'file':
        return 'TEXT';
      case 'select':
        return 'TEXT';
      case 'relation':
        return 'INTEGER';
      default:
        return 'TEXT';
    }
  };
  
  // Função para download do SQL
  const handleDownloadSQL = () => {
    const sql = generateSQL();
    if (!sql) return;
    
    const blob = new Blob([sql], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nomeTabela}_schema.sql`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <Form {...form}>
      <div className="grid grid-cols-[1fr] gap-6">
        {/* Preview Final da Página Completa (quando ativado) */}
        {showFinalPreview && (
          <div className="space-y-6 mb-8">
            <div className="bg-green-600/20 border border-green-600/30 text-green-300 p-4 rounded-lg flex items-center gap-3">
              <div className="bg-green-600 rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Preview gerado com sucesso!</h3>
                <p className="text-sm">Abaixo está uma prévia de como ficará a página "{nomePagina}" após ser preenchida.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-white flex items-center gap-2">
                <span>Preview da Página Completa</span>
                <span className="text-xs bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded-full">
                  {nomePagina}
                </span>
              </h2>
              
              <Tabs defaultValue="listagem" className="w-full">
                <TabsList className="bg-slate-800 border border-slate-700 mb-4">
                  <TabsTrigger value="listagem" className="data-[state=active]:bg-slate-700">Listagem</TabsTrigger>
                  <TabsTrigger value="formulario" className="data-[state=active]:bg-slate-700">Formulário</TabsTrigger>
                </TabsList>
                
                <TabsContent value="listagem" className="mt-0">
                  <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 space-y-6">
                    <div>
                      <h1 className="text-2xl font-bold text-white">{titulo || `Gerenciamento de ${nomePagina}`}</h1>
                      <p className="text-slate-400">
                        {subtitulo || `Controle e organize todos os seus ${nomePagina.toLowerCase()} de forma eficiente`}
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Buscar..."
                              className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white w-64"
                            />
                            <span className="absolute left-3 top-2.5 text-slate-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </span>
                          </div>
                          
                          <div>
                            <select className="bg-slate-800 border border-slate-700 rounded-md text-white px-3 py-2">
                              <option>Todos os status</option>
                              <option>Ativo</option>
                              <option>Inativo</option>
                            </select>
                          </div>
                        </div>
                        
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center space-x-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span>Novo {nomePagina.replace(/s$/, '')}</span>
                        </button>
                      </div>
                      
                      <div className="bg-slate-800 rounded-md border border-slate-700 overflow-hidden">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-700/50">
                              {campos.length > 0 ? (
                                campos.filter(campo => campo.mostrarListagem).map((campo, i) => (
                                  <th key={i} className="px-4 py-3 text-white font-medium">{campo.nomeAmigavel}</th>
                                ))
                              ) : (
                                <th className="px-4 py-3 text-white font-medium">ID</th>
                              )}
                              <th className="px-4 py-3 text-white font-medium text-right">Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[1, 2, 3, 4, 5].map((item) => (
                              <tr key={item} className="border-t border-slate-700">
                                {campos.length > 0 ? (
                                  campos.filter(campo => campo.mostrarListagem).map((campo, i) => (
                                    <td key={i} className="px-4 py-3 text-slate-300">
                                      {gerarDadoFicticioParaCampo(campo, item - 1)}
                                    </td>
                                  ))
                                ) : (
                                  <td className="px-4 py-3 text-white">#{item}</td>
                                )}
                                <td className="px-4 py-3 text-right">
                                  <div className="flex justify-end space-x-2">
                                    <button className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                    </button>
                                    <button className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                      </svg>
                                    </button>
                                    <button className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-400">
                          Exibindo 5 de 5 resultados
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700" disabled>Anterior</button>
                          <button className="px-3 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700" disabled>Próximo</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="formulario" className="mt-0">
                  <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 space-y-6">
                    <div className="flex items-center mb-4">
                      <button className="bg-slate-800 p-2 rounded-md text-slate-400 hover:text-white mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                      </button>
                      <div>
                        <h1 className="text-2xl font-bold text-white">Novo {nomePagina.replace(/s$/, '')}</h1>
                        <p className="text-slate-400">Preencha os dados para criar um novo registro</p>
                      </div>
                    </div>
                    
                    <div className="space-y-8">
                      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 space-y-6">
                        <h2 className="text-lg font-medium text-white">Informações Principais</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {campos.map((campo, index) => (
                            <div key={index} className="space-y-2">
                              <label className="block text-sm font-medium text-white">
                                {campo.nomeAmigavel}
                                {campo.validacao.toLowerCase().includes('obrigat') && <span className="text-red-500 ml-1">*</span>}
                              </label>
                              
                              {(() => {
                                switch(campo.tipoInformacao) {
                                  case 'text':
                                    return (
                                      <input 
                                        type="text" 
                                        placeholder={`Digite ${campo.nomeAmigavel.toLowerCase()}`} 
                                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white"
                                      />
                                    );
                                  case 'longtext':
                                    return (
                                      <textarea 
                                        placeholder={`Digite ${campo.nomeAmigavel.toLowerCase()}`} 
                                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white min-h-[100px]"
                                      />
                                    );
                                  case 'number':
                                    return (
                                      <input 
                                        type="number" 
                                        placeholder="0" 
                                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white"
                                      />
                                    );
                                  case 'date':
                                    return (
                                      <input 
                                        type="date" 
                                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white"
                                      />
                                    );
                                  case 'datetime':
                                    return (
                                      <div className="grid grid-cols-2 gap-2">
                                        <input 
                                          type="date" 
                                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white"
                                        />
                                        <input 
                                          type="time" 
                                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white"
                                        />
                                      </div>
                                    );
                                  case 'boolean':
                                    return (
                                      <div className="flex items-center space-x-2">
                                        <div className="bg-purple-600 w-10 h-5 rounded-full relative">
                                          <div className="absolute right-1 top-1 bg-white w-3 h-3 rounded-full"></div>
                                        </div>
                                        <span className="text-slate-300 text-sm">Ativado</span>
                                      </div>
                                    );
                                  case 'enum':
                                    return (
                                      <select className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white">
                                        <option>Selecione uma opção</option>
                                        <option>Opção 1</option>
                                        <option>Opção 2</option>
                                        <option>Opção 3</option>
                                      </select>
                                    );
                                  case 'file':
                                    return (
                                      <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer bg-slate-900 hover:bg-slate-800">
                                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg className="w-8 h-8 mb-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                            </svg>
                                            <p className="mb-2 text-sm text-slate-400">
                                              <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                                            </p>
                                            <p className="text-xs text-slate-500">PNG, JPG ou PDF (Máx. 10MB)</p>
                                          </div>
                                          <input type="file" className="hidden" />
                                        </label>
                                      </div>
                                    );
                                  case 'relation':
                                    return (
                                      <select className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white">
                                        <option>Selecione um item relacionado</option>
                                        <option>Item Relacionado 1</option>
                                        <option>Item Relacionado 2</option>
                                        <option>Item Relacionado 3</option>
                                      </select>
                                    );
                                  default:
                                    return (
                                      <input 
                                        type="text" 
                                        placeholder="Digite um valor" 
                                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white"
                                      />
                                    );
                                }
                              })()}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-end space-x-4">
                        <button className="px-4 py-2 rounded-md border border-slate-700 text-white">
                          Cancelar
                        </button>
                        <button className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white">
                          Salvar
                        </button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end space-x-4 mt-4">
                <button 
                  onClick={() => setShowFinalPreview(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md"
                >
                  Voltar à Edição
                </button>
                <button 
                  onClick={() => setShowSQL(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>Visualizar SQL</span>
                </button>
                <button 
                  onClick={handleDownloadSQL}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Baixar SQL</span>
                </button>
                <button 
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                >
                  Confirmar e Criar Página
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Conteúdo Principal */}
        <div className="space-y-8">
          {/* Página de Referência */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Página de Referência</h3>
            <PagePreview />
          </div>
          
          {/* Informações Básicas */}
          <div className="space-y-6 border-t border-slate-800 pt-6">
            <h3 className="text-lg font-medium text-white">Informações Básicas</h3>
            
            {/* Título e Subtítulo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="titulo" className="text-white">Título</Label>
                <Input 
                  id="titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Gerenciamento de Projetos"
                  className="bg-slate-900 border-slate-700 text-white mt-2 placeholder:text-slate-500"
                />
                <p className="text-sm text-slate-400 mt-2">
                  Título principal que aparecerá no topo da página
                </p>
              </div>
              
              <div>
                <Label htmlFor="subtitulo" className="text-white flex items-center gap-2">
                  <span>Subtítulo</span>
                  {titulo && <span className="text-xs bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">Gerado</span>}
                </Label>
                <Input 
                  id="subtitulo"
                  value={subtitulo}
                  onChange={(e) => setSubtitulo(e.target.value)}
                  placeholder="Ex: Controle todos os seus projetos"
                  className="bg-slate-900 border-slate-700 text-white mt-2 placeholder:text-slate-500"
                />
                <p className="text-sm text-slate-400 mt-2">
                  Texto descritivo que aparecerá abaixo do título (gerado automaticamente)
                </p>
              </div>
            </div>
            
            {/* Nome e Função da Tabela */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="nomeTabela" className="text-white">Nome da Tabela</Label>
                <Input 
                  id="nomeTabela"
                  value={nomeTabela}
                  onChange={(e) => setNomeTabela(e.target.value)}
                  placeholder="Ex: projetos"
                  className="bg-slate-900 border-slate-700 text-white mt-2 placeholder:text-slate-500"
                />
                <p className="text-sm text-slate-400 mt-2">
                  Nome técnico da tabela no banco de dados (sem espaços ou caracteres especiais)
                </p>
              </div>
              
              <div>
                <Label htmlFor="funcaoTabela" className="text-white flex items-center gap-2">
                  <span>Função da Tabela</span>
                  {nomeTabela && <span className="text-xs bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">Gerado</span>}
                </Label>
                <Textarea 
                  id="funcaoTabela"
                  value={funcaoTabela}
                  onChange={(e) => setFuncaoTabela(e.target.value)}
                  placeholder="Ex: Armazenar informações de projetos incluindo nome, descrição, datas e responsáveis"
                  className="bg-slate-900 border-slate-700 text-white mt-2 h-[80px] placeholder:text-slate-500"
                />
                <p className="text-sm text-slate-400 mt-2">
                  Descreva a finalidade desta tabela no sistema (gerado automaticamente)
                </p>
              </div>
            </div>
          </div>
          
          {/* Campos Dinâmicos */}
          <div className="space-y-6 border-t border-slate-800 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Campos</h3>
              <Button 
                type="button" 
                onClick={adicionarCampo}
                className="bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-2 px-3 py-1 h-8"
              >
                <Plus className="h-4 w-4" />
                <span>Adicionar Campo</span>
              </Button>
            </div>
            
            {campos.length === 0 ? (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
                <p className="text-slate-400">
                  Nenhum campo adicionado. Clique no botão acima para adicionar campos à sua tabela.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {campos.map((campo, index) => (
                  <Card key={campo.id} className="bg-slate-800/50 border-slate-700 p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-white font-medium">Campo {index + 1}</h4>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moverCampoCima(index)}
                          disabled={index === 0}
                          className="h-7 w-7 p-0"
                        >
                          <ChevronUp className="h-4 w-4 text-slate-400" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moverCampoBaixo(index)}
                          disabled={index === campos.length - 1}
                          className="h-7 w-7 p-0"
                        >
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removerCampo(campo.id)}
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10 h-7 w-7 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Nome Amigável */}
                      <div>
                        <Label htmlFor={`campo-${campo.id}-nome`} className="text-white">Nome Amigável</Label>
                        <Input 
                          id={`campo-${campo.id}-nome`}
                          value={campo.nomeAmigavel}
                          onChange={(e) => handleNomeAmigavelChange(campo.id, e.target.value)}
                          placeholder="Ex: Nome do Projeto"
                          className="bg-slate-700 border-slate-600 text-white mt-2 placeholder:text-slate-400"
                        />
                      </div>
                      
                      {/* Nome Sugestão (gerado) */}
                      <div>
                        <Label htmlFor={`campo-${campo.id}-nome-sugestao`} className="text-white flex items-center gap-1">
                          <span>Nome no Banco</span>
                          <span className="text-xs bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">Gerado</span>
                        </Label>
                        <Input 
                          id={`campo-${campo.id}-nome-sugestao`}
                          value={campo.nomeSugestao}
                          onChange={(e) => atualizarCampo(campo.id, { nomeSugestao: e.target.value })}
                          placeholder="Ex: nome_projeto"
                          className="bg-slate-700 border-slate-600 text-white mt-2 placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {/* Tipo de Informação */}
                      <div>
                        <Label htmlFor={`campo-${campo.id}-tipo`} className="text-white">Tipo de Informação</Label>
                        <Select 
                          value={campo.tipoInformacao} 
                          onValueChange={(value) => atualizarCampo(campo.id, { tipoInformacao: value })}
                        >
                          <SelectTrigger id={`campo-${campo.id}-tipo`} className="bg-slate-700 border-slate-600 text-white mt-2">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="text">Texto</SelectItem>
                            <SelectItem value="longtext">Texto Longo</SelectItem>
                            <SelectItem value="number">Número</SelectItem>
                            <SelectItem value="date">Data</SelectItem>
                            <SelectItem value="datetime">Data e Hora</SelectItem>
                            <SelectItem value="boolean">Sim/Não</SelectItem>
                            <SelectItem value="enum">Lista de Opções</SelectItem>
                            <SelectItem value="file">Arquivo/Imagem</SelectItem>
                            <SelectItem value="relation">Relacionamento</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Validação */}
                      <div>
                        <Label htmlFor={`campo-${campo.id}-validacao`} className="text-white">Validação</Label>
                        <Input 
                          id={`campo-${campo.id}-validacao`}
                          value={campo.validacao}
                          onChange={(e) => atualizarCampo(campo.id, { validacao: e.target.value })}
                          placeholder="Ex: Obrigatório, Máx 100 caracteres"
                          className="bg-slate-700 border-slate-600 text-white mt-2 placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                    
                    {/* Opções adicionais */}
                    <div className="space-y-5 mt-6 bg-slate-900/50 p-4 rounded-md border border-slate-700">
                      <div>
                        <h5 className="text-sm font-medium text-white mb-3">Opções de exibição e uso</h5>
                        <p className="text-xs text-slate-400 mb-3">Clique nos interruptores abaixo para ativar ou desativar cada opção</p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center justify-between bg-slate-800 p-3 rounded-md hover:bg-slate-800/80 transition-colors">
                          <div>
                            <Label htmlFor={`campo-${campo.id}-mostrar`} className="text-white font-medium cursor-pointer">
                              Mostrar na listagem
                            </Label>
                            <p className="text-xs text-slate-400 mt-1">
                              Este campo aparecerá como coluna na tabela principal
                            </p>
                          </div>
                          {/* Switch customizado */}
                          <div 
                            className="relative cursor-pointer" 
                            onClick={() => atualizarCampo(campo.id, { mostrarListagem: !campo.mostrarListagem })}
                          >
                            <Switch
                              checked={campo.mostrarListagem}
                              onCheckedChange={(checked) => atualizarCampo(campo.id, { mostrarListagem: checked })}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between bg-slate-800 p-3 rounded-md hover:bg-slate-800/80 transition-colors">
                          <div>
                            <Label htmlFor={`campo-${campo.id}-pesquisa`} className="text-white font-medium cursor-pointer">
                              Incluir na pesquisa
                            </Label>
                            <p className="text-xs text-slate-400 mt-1">
                              Este campo será considerado ao realizar buscas e estatísticas
                            </p>
                          </div>
                          {/* Switch customizado */}
                          <div 
                            className="relative cursor-pointer" 
                            onClick={() => atualizarCampo(campo.id, { incluirPesquisa: !campo.incluirPesquisa })}
                          >
                            <Switch
                              checked={campo.incluirPesquisa}
                              onCheckedChange={(checked) => atualizarCampo(campo.id, { incluirPesquisa: checked })}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between bg-slate-800 p-3 rounded-md hover:bg-slate-800/80 transition-colors">
                          <div>
                            <Label htmlFor={`campo-${campo.id}-filtro`} className="text-white font-medium cursor-pointer">
                              Incluir no filtro
                            </Label>
                            <p className="text-xs text-slate-400 mt-1">
                              Este campo será uma opção de filtro na listagem principal
                            </p>
                          </div>
                          {/* Switch customizado */}
                          <div 
                            className="relative cursor-pointer" 
                            onClick={() => atualizarCampo(campo.id, { incluirFiltro: !campo.incluirFiltro })}
                          >
                            <Switch
                              checked={campo.incluirFiltro}
                              onCheckedChange={(checked) => atualizarCampo(campo.id, { incluirFiltro: checked })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Nome da Nova Página */}
          <div className="max-w-xl border-t border-slate-800 pt-6">
            <Label htmlFor="pageName" className="text-white">Nome da Nova Página</Label>
            <Input 
              id="pageName"
              value={nomePagina}
              onChange={(e) => setNomePagina(e.target.value)}
              placeholder="Ex: Produtos, Clientes, Pedidos..."
              className="bg-slate-900 border-slate-700 text-white mt-2 placeholder:text-slate-500"
            />
            <p className="text-sm text-slate-400 mt-2">
              Este será o nome usado para criar a nova página e suas funcionalidades
            </p>
          </div>

          {/* Botão de Submit */}
          <div className="mt-6">
            <Button 
              type="button" 
              onClick={handleSubmit} 
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Criar Template
            </Button>
          </div>
        </div>
      </div>

      {/* Dialog para mostrar o SQL */}
      <Dialog open={showSQL} onOpenChange={setShowSQL}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>SQL do Template</DialogTitle>
          </DialogHeader>
          <pre className="p-4 bg-slate-950 rounded-lg overflow-x-auto text-sm text-slate-300">
            {generateSQL() || "Nenhum SQL gerado ainda. Configure o template primeiro."}
          </pre>
          {generateSQL() && (
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadSQL}
                className="flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Baixar SQL
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Form>
  );
} 