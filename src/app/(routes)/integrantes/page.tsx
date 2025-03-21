"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Plus, 
  Search, 
  Eye, 
  FileEdit, 
  Trash2, 
  Table as TableIcon, 
  Grid
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { alertaSucesso, alertaErro, confirmar } from '@/lib/sweetalert';
import { 
  PhoneIcon, 
  AtSymbolIcon, 
  UserIcon, 
  CreditCardIcon
} from "@heroicons/react/24/outline"

interface Integrante {
  id: string
  nome: string
  email: string | null
  telefone: string | null
  instrumento: string
  observacoes: string | null
  bandas: Array<{
    id: string
    nome: string
    genero: string
  }>
  apelido?: string
  tipo_chave_pix?: string
  chave_pix?: string
}

// Componente de tabela de integrantes
const IntegrantesTable = ({ 
  integrantes, 
  onDelete, 
  onView,
  router
}: { 
  integrantes: Integrante[]; 
  onDelete: (id: string) => void;
  onView: (integrante: Integrante) => void;
  router: any;
}) => {
  const [integrantesFiltrados, setIntegrantesFiltrados] = useState<Integrante[]>(integrantes);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroInstrumento, setFiltroInstrumento] = useState('todos');

  // Filtra os integrantes quando os critérios de filtro mudam
  useEffect(() => {
    const filteredIntegrantes = integrantes.filter(integrante => {
      const matchesTerm = integrante.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integrante.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integrante.telefone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integrante.instrumento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integrante.apelido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         searchTerm === '';
      
      const matchesInstrumento = filtroInstrumento === 'todos' || integrante.instrumento === filtroInstrumento;
      
      return matchesTerm && matchesInstrumento;
    });
    
    setIntegrantesFiltrados(filteredIntegrantes);
  }, [integrantes, searchTerm, filtroInstrumento]);

  // Função para lidar com exclusão
  const handleDelete = async (id: string) => {
    const confirmed = await confirmar('Excluir integrante', 'Tem certeza que deseja excluir este integrante?', 'warning');
    if (confirmed) {
      onDelete(id);
    }
  };

  // Array de instrumentos únicos para o filtro
  const instrumentos = ["todos", ...Array.from(new Set(integrantes.map(integrante => integrante.instrumento || "").filter(Boolean)))];

  return (
    <>
      <div className="w-full space-y-6">
        {/* Barra de pesquisa e filtros */}
        <div className="flex flex-col sm:flex-row gap-3 bg-gray-850 rounded-lg p-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Pesquisar integrantes..."
              className="pl-9 bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-600"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={filtroInstrumento} onValueChange={setFiltroInstrumento}>
            <SelectTrigger className="w-full sm:w-[180px] bg-gray-900 border-gray-600 text-white">
              <SelectValue placeholder="Filtrar por instrumento" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-600">
              {instrumentos.map((instrumento) => (
                <SelectItem key={instrumento} value={instrumento} className="text-white hover:bg-gray-800">
                  {instrumento === "todos" ? "Todos os instrumentos" : instrumento}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabela */}
        <div className="bg-gray-850 rounded-lg overflow-hidden border border-gray-800 shadow-lg">
          <Table>
            <TableHeader className="bg-gray-900">
              <TableRow className="hover:bg-gray-900/90 border-b border-gray-800">
                <TableHead className="text-left font-semibold text-white w-[200px]">NOME</TableHead>
                <TableHead className="text-left font-semibold text-white w-[150px]">INSTRUMENTO</TableHead>
                <TableHead className="text-left font-semibold text-white">CONTATO</TableHead>
                <TableHead className="text-left font-semibold text-white">BANDAS</TableHead>
                <TableHead className="text-left font-semibold text-white w-[120px]">APELIDO</TableHead>
                <TableHead className="text-right w-[100px]">AÇÕES</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {integrantesFiltrados.length > 0 ? (
                integrantesFiltrados.map((integrante) => (
                  <TableRow key={integrante.id} className="hover:bg-gray-800/80 border-b border-gray-800/50">
                    <TableCell className="font-medium text-white">
                      {integrante.nome}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-700 text-purple-50">
                        {integrante.instrumento || 'Não definido'}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {integrante.telefone || integrante.email || 'Sem contato'}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {integrante.bandas && integrante.bandas.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {integrante.bandas.slice(0, 3).map((banda) => (
                            <span 
                              key={banda.id}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-800 text-white"
                            >
                              {banda.nome}
                            </span>
                          ))}
                          {integrante.bandas.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-600 text-gray-200">
                              +{integrante.bandas.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        "Nenhuma banda"
                      )}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {integrante.apelido || 'Sem apelido'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => onView(integrante)}
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                          title="Ver Detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <Link
                          href={`/integrantes/${integrante.id}/editar`}
                          className="text-gray-400 hover:text-yellow-400 transition-colors"
                          title="Editar"
                        >
                          <FileEdit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(integrante.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    Nenhum integrante encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default function IntegrantesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [integranteSelecionado, setIntegranteSelecionado] = useState<Integrante | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"table" | "cards">("table");
  const router = useRouter();
  const [totalIntegrantes, setTotalIntegrantes] = useState(0);
  const [totalInstrumentos, setTotalInstrumentos] = useState(0);
  const [totalBandas, setTotalBandas] = useState(0);

  useEffect(() => {
    buscarIntegrantes();
  }, []);

  async function buscarIntegrantes() {
    try {
      setIsLoading(true);
      const res = await fetch('/api/integrantes/', {
        method: 'GET'
      });

      if (!res.ok) {
        throw new Error("Erro ao buscar os integrantes");
      }

      const resposta = await res.json();
      console.log('Resposta da API:', resposta);
      const integrantesData = resposta || [];
      setIntegrantes(integrantesData);
      
      // Calcular estatísticas
      setTotalIntegrantes(integrantesData.length);
      
      // Calcular total de instrumentos únicos
      const instrumentos = new Set(integrantesData.map((integrante: Integrante) => integrante.instrumento).filter(Boolean));
      setTotalInstrumentos(instrumentos.size);
      
      // Calcular total de bandas únicas
      const bandasIds = new Set();
      integrantesData.forEach((integrante: Integrante) => {
        if (integrante.bandas && integrante.bandas.length > 0) {
          integrante.bandas.forEach(banda => {
            if (banda.id) {
              bandasIds.add(banda.id);
            }
          });
        }
      });
      setTotalBandas(bandasIds.size);
    } catch (error) {
      console.error("Erro ao buscar integrantes:", error);
      setError("Erro ao buscar os integrantes");
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteIntegrante = async (id: string) => {
    try {
      const res = await fetch(`/api/integrantes/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error("Erro ao excluir o integrante");
      }

      await buscarIntegrantes();
      alertaSucesso("Integrante excluído com sucesso!");
    } catch (error) {
      console.error(error);
      alertaErro("Erro ao excluir o integrante");
    }
  };

  const handleOpenModal = (integrante: Integrante) => {
    setIntegranteSelecionado(integrante);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <div className="p-4">Carregando...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container p-4 mx-auto">
      <div className="flex flex-col space-y-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white">Integrantes</h1>
          <p className="text-sm text-zinc-400">
            Gerencie seus músicos e membros da equipe
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mt-8">
          <div className="stat-card group relative overflow-hidden p-3 bg-gradient-to-r from-gray-800 to-gray-800/95 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 hover:shadow-purple-900/20 hover:border-purple-500/30 flex flex-1 items-center justify-between min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-purple-700/20 text-purple-400 ring-1 ring-purple-500/30 shadow-inner shadow-purple-600/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="text-xs text-gray-400">integrantes</div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-purple-200 group-hover:to-purple-400 transition-colors duration-300">{totalIntegrantes}</div>
          </div>

          <div className="stat-card group relative overflow-hidden p-3 bg-gradient-to-r from-gray-800 to-gray-800/95 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 hover:shadow-indigo-900/20 hover:border-indigo-500/30 flex flex-1 items-center justify-between min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-600/20 to-indigo-700/20 text-indigo-400 ring-1 ring-indigo-500/30 shadow-inner shadow-indigo-600/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <div className="text-xs text-gray-400">instrumentos</div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-indigo-200 group-hover:to-indigo-400 transition-colors duration-300">{totalInstrumentos}</div>
          </div>

          <div className="stat-card group relative overflow-hidden p-3 bg-gradient-to-r from-gray-800 to-gray-800/95 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 hover:shadow-blue-900/20 hover:border-blue-500/30 flex flex-1 items-center justify-between min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-700/20 text-blue-400 ring-1 ring-blue-500/30 shadow-inner shadow-blue-600/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M19 9V5L12 2L5 5v4"></path>
                  <circle cx="12" cy="11" r="2"></circle>
                  <path d="M12 13v8"></path>
                  <path d="M9 21h6"></path>
                </svg>
              </div>
              <div className="text-xs text-gray-400">bandas</div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:to-blue-400 transition-colors duration-300">{totalBandas}</div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <div className="flex space-x-2">
            <Button 
              onClick={() => setView("table")} 
              variant={view === "table" ? "outline" : "default"}
              size="sm"
              className="hidden sm:flex"
              title="Visualização em tabela"
            >
              <TableIcon className="h-4 w-4 mr-1" />
              Tabela
            </Button>
            <Button 
              onClick={() => setView("cards")} 
              variant={view === "cards" ? "outline" : "default"}
              size="sm"
              className="hidden sm:flex"
              title="Visualização em cartões"
            >
              <Grid className="h-4 w-4 mr-1" />
              Cartões
            </Button>
          </div>
          <Button
            onClick={() => router.push('/integrantes/novo')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Novo Integrante
          </Button>
        </div>

        {view === "cards" ? (
          <div className="w-full space-y-6 mt-6">
            {/* Barra de pesquisa e filtros */}
            <div className="flex flex-col sm:flex-row gap-3 bg-gray-850 rounded-lg p-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Pesquisar integrantes..."
                  className="pl-9 bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-600"
                />
              </div>
              
              <Select defaultValue="todos">
                <SelectTrigger className="w-full sm:w-[180px] bg-gray-900 border-gray-600 text-white">
                  <SelectValue placeholder="Filtrar por instrumento" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-600">
                  <SelectItem value="todos" className="text-white hover:bg-gray-800">
                    Todos os instrumentos
                  </SelectItem>
                  {Array.from(new Set(integrantes.map(integrante => integrante.instrumento || "").filter(Boolean))).map((instrumento) => (
                    <SelectItem key={instrumento} value={instrumento} className="text-white hover:bg-gray-800">
                      {instrumento}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Exibição dos cartões */}
            {integrantes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {integrantes.map((integrante) => (
                  <div
                    key={integrante.id}
                    className="group relative bg-gray-800 hover:bg-gray-700 rounded-lg p-4 border border-gray-700 hover:border-gray-500 transition-all duration-200 shadow-lg"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {integrante.nome}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-700 text-white">
                            {integrante.instrumento || 'Não definido'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenModal(integrante)}
                            className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                            title="Ver Detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <Link
                            href={`/integrantes/${integrante.id}/editar`}
                            className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                            title="Editar"
                          >
                            <FileEdit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteIntegrante(integrante.id)}
                            className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 text-gray-300 mb-4">
                        {integrante.apelido && (
                          <div className="flex items-center gap-2 text-sm">
                            <UserIcon className="h-4 w-4 text-gray-400" />
                            <span>{integrante.apelido}</span>
                          </div>
                        )}
                        {integrante.telefone && (
                          <div className="flex items-center gap-2 text-sm">
                            <PhoneIcon className="h-4 w-4 text-gray-400" />
                            <span>{integrante.telefone}</span>
                          </div>
                        )}
                        {integrante.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <AtSymbolIcon className="h-4 w-4 text-gray-400" />
                            <span>{integrante.email}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto">
                        <div className="text-sm text-gray-400 mb-2">Bandas:</div>
                        {integrante.bandas && integrante.bandas.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {integrante.bandas.slice(0, 3).map((banda) => (
                              <span
                                key={banda.id}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900 text-white border border-blue-700"
                              >
                                {banda.nome}
                              </span>
                            ))}
                            {integrante.bandas.length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-white border border-gray-600">
                                +{integrante.bandas.length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">Nenhuma banda</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <IntegrantesTable 
                integrantes={integrantes} 
                onDelete={handleDeleteIntegrante}
                onView={handleOpenModal}
                router={router}
              />
            )}
          </div>
        ) : (
          <IntegrantesTable 
            integrantes={integrantes} 
            onDelete={handleDeleteIntegrante}
            onView={handleOpenModal}
            router={router}
          />
        )}
      </div>

      {/* Dialog para visualizar integrante */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg bg-gray-800 border border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              Detalhes do Integrante
            </DialogTitle>
          </DialogHeader>
          
          {integranteSelecionado && (
            <div className="space-y-4 mt-2">
              <div>
                <h3 className="text-2xl font-bold text-white">{integranteSelecionado.nome}</h3>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-800/70 text-purple-100">
                    {integranteSelecionado.instrumento || 'Instrumento não definido'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-700">
                {/* Contatos */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-400">Contatos</h4>
                  <div className="space-y-2">
                    {integranteSelecionado.apelido && (
                      <div className="flex items-center gap-2 text-sm">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400">Apelido:</span>
                        <span className="text-gray-200">{integranteSelecionado.apelido}</span>
                      </div>
                    )}
                    {integranteSelecionado.telefone && (
                      <div className="flex items-center gap-2 text-sm">
                        <PhoneIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-200">{integranteSelecionado.telefone}</span>
                      </div>
                    )}
                    {integranteSelecionado.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <AtSymbolIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-200">{integranteSelecionado.email}</span>
                      </div>
                    )}
                    {integranteSelecionado.tipo_chave_pix && integranteSelecionado.chave_pix && (
                      <div className="flex items-center gap-2 text-sm">
                        <CreditCardIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400">{integranteSelecionado.tipo_chave_pix}:</span>
                        <span className="text-gray-200">{integranteSelecionado.chave_pix}</span>
                      </div>
                    )}
                    {!integranteSelecionado.telefone && !integranteSelecionado.email && !integranteSelecionado.apelido && 
                      !(integranteSelecionado.tipo_chave_pix && integranteSelecionado.chave_pix) && (
                      <div className="text-gray-500 text-sm">Sem contatos registrados</div>
                    )}
                  </div>
                </div>

                {/* Bandas */}
                <div className="space-y-3 pt-4 border-t border-gray-700">
                  <h4 className="text-sm font-medium text-gray-400">Bandas</h4>
                  {integranteSelecionado.bandas && integranteSelecionado.bandas.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {integranteSelecionado.bandas.map((banda) => (
                        <span
                          key={banda.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-800 text-white"
                        >
                          {banda.nome}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">Não participa de nenhuma banda</div>
                  )}
                </div>

                {/* Observações */}
                {integranteSelecionado.observacoes && (
                  <div className="space-y-3 pt-4 border-t border-gray-700">
                    <h4 className="text-sm font-medium text-gray-400">Observações</h4>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{integranteSelecionado.observacoes}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Fechar
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setIsModalOpen(false);
                    router.push(`/integrantes/${integranteSelecionado.id}/editar`);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Editar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 