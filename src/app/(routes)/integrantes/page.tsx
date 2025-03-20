"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, FileEdit, Trash2, LayoutGrid, LayoutList, Plus, Filter, Music, Search, List, Grid } from "lucide-react"
import { toast } from "sonner"
import { IntegranteForm } from "./components/IntegranteForm"
import Link from "next/link"
import { 
  PhoneIcon, 
  AtSymbolIcon, 
  UserIcon, 
  MagnifyingGlassIcon,
  MusicalNoteIcon,
  CreditCardIcon
} from "@heroicons/react/24/outline"
import { alertaSucesso, alertaErro, alertaConfirmacao } from '@/lib/sweetalert';

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

export default function IntegrantesPage() {
  const router = useRouter()
  const [integrantes, setIntegrantes] = useState<Integrante[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [totalIntegrantes, setTotalIntegrantes] = useState(0)
  const [totalInstrumentos, setTotalInstrumentos] = useState(0)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [selectedInstrumento, setSelectedInstrumento] = useState("")
  const [selectedIntegrante, setSelectedIntegrante] = useState<Integrante | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)

  useEffect(() => {
    fetchIntegrantes()
  }, [])

  const fetchIntegrantes = async () => {
    try {
      const response = await fetch("/api/integrantes")
      if (!response.ok) throw new Error("Erro ao carregar integrantes")
      const data = await response.json()
      setIntegrantes(data)
      setTotalIntegrantes(data.length)
      
      // Calcula total de instrumentos únicos
      const instrumentos = new Set(data.map((i: Integrante) => i.instrumento))
      setTotalInstrumentos(instrumentos.size)
    } catch (error) {
      console.error("Erro ao carregar integrantes:", error)
      toast.error("Erro ao carregar integrantes")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const confirmacao = await alertaConfirmacao({
      titulo: 'Excluir Integrante',
      texto: 'Tem certeza que deseja excluir este integrante? Esta ação não poderá ser desfeita.',
      icone: 'warning',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Não, manter',
      showCancelButton: true,
      confirmButtonColor: '#9333ea', // purple-600
      cancelButtonColor: '#374151', // gray-700
    });

    if (confirmacao.isConfirmed) {
      try {
        const response = await fetch(`/api/integrantes/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Erro ao excluir integrante");

        alertaSucesso('Integrante excluído com sucesso!');
        fetchIntegrantes();
      } catch (error) {
        console.error("Erro ao excluir integrante:", error);
        alertaErro('Erro ao excluir integrante');
      }
    }
  };

  const handleView = (integrante: Integrante) => {
    setSelectedIntegrante(integrante);
    setIsViewOpen(true);
  };

  const filteredIntegrantes = integrantes.filter((integrante) => {
    const matchesSearch = integrante.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integrante.instrumento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integrante.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integrante.apelido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integrante.chave_pix?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesInstrumento = selectedInstrumento === "" || 
      integrante.instrumento === selectedInstrumento

    return matchesSearch && matchesInstrumento
  })

  const uniqueInstrumentos = Array.from(new Set(integrantes.map(i => i.instrumento).filter(Boolean))).sort()

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="h-full">
      <div className="mx-auto max-w-7xl pt-12 px-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white">Integrantes</h1>
          <p className="text-sm text-zinc-400">
            Gerencie os músicos e membros da sua equipe
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
          <div className="stat-card p-5 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 rounded-md bg-gray-700 text-purple-400">
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
              <h3 className="text-gray-400 text-sm font-medium">Total de integrantes</h3>
            </div>
            <div className="text-2xl font-bold text-white">{totalIntegrantes}</div>
          </div>

          <div className="stat-card p-5 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 rounded-md bg-gray-700 text-purple-400">
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
              <h3 className="text-gray-400 text-sm font-medium">Funções diferentes</h3>
            </div>
            <div className="text-2xl font-bold text-white">{totalInstrumentos}</div>
          </div>

          <div className="stat-card p-5 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 rounded-md bg-gray-700 text-purple-400">
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
              <h3 className="text-gray-400 text-sm font-medium">Em bandas</h3>
            </div>
            <div className="text-2xl font-bold text-white">26</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden mt-8">
      <div className="p-4 border-b border-gray-700 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
                  </div>
            <input
              type="text"
                        placeholder="Buscar integrantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-900 text-white pl-10 pr-4 py-2 rounded-md border border-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-400" />
            <select
                  value={selectedInstrumento}
                  onChange={(e) => setSelectedInstrumento(e.target.value)}
              className="bg-gray-900 text-white px-3 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Todos os instrumentos</option>
                  {uniqueInstrumentos.map((instrumento) => (
                    <option key={instrumento} value={instrumento}>
                      {instrumento}
                </option>
              ))}
            </select>
          </div>
          
              {/* Botões de visualização */}
          <div className="flex items-center space-x-1 ml-auto">
                      <button
              type="button"
              className={`p-2 rounded-l ${
                    viewMode === 'list'
                  ? 'bg-gray-700 text-gray-100'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                        }`}
                  onClick={() => setViewMode('list')}
              title="Visualização em Lista"
                      >
              <List size={18} />
                      </button>
                      <button
              type="button"
              className={`p-2 rounded-r ${
                    viewMode === 'grid'
                  ? 'bg-gray-700 text-gray-100'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                        }`}
                  onClick={() => setViewMode('grid')}
                  title="Visualização em Grade"
                      >
              <Grid size={18} />
                      </button>
                    </div>
                    
              <Link
                href="/integrantes/novo"
                className="btn-primary"
              >
            <Plus size={18} className="mr-1" />
                      Novo Integrante
          </Link>
        </div>
        </div>

          {viewMode === 'list' ? (
          <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Instrumento</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Apelido</TableHead>
                    <TableHead>PIX</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIntegrantes.map((integrante) => (
                    <TableRow key={integrante.id}>
                      <TableCell className="font-semibold">{integrante.nome}</TableCell>
                      <TableCell>{integrante.instrumento || "-"}</TableCell>
                      <TableCell>{integrante.telefone || "-"}</TableCell>
                      <TableCell>{integrante.email || "-"}</TableCell>
                      <TableCell>{integrante.apelido || "-"}</TableCell>
                      <TableCell>{integrante.tipo_chave_pix || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleView(integrante)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          title="Visualizar"
                        >
                            <Eye className="h-4 w-4" />
                        </button>
                      <button
                            onClick={() => router.push(`/integrantes/${integrante.id}/editar`)}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors"
                          title="Editar"
                        >
                            <FileEdit className="h-4 w-4" />
                      </button>
                      <button
                            onClick={() => handleDelete(integrante.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          title="Excluir"
                        >
                            <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                      </TableCell>
                    </TableRow>
              ))}
                </TableBody>
              </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-900/30 rounded-lg">
              {filteredIntegrantes.map((integrante) => (
                        <div 
                          key={integrante.id} 
                className="bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-xl border border-gray-700 flex flex-col h-full hover:translate-y-[-3px] hover:border-indigo-500/50"
              >
                {/* Cabeçalho do cartão */}
                <div className="p-3 flex flex-col bg-gradient-to-r from-indigo-800 to-indigo-900 border-b border-indigo-700">
                  <div className="flex items-center w-full">
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="text-base font-medium text-white leading-tight line-clamp-2 text-center"
                          title={integrante.nome}
                      >
                        {integrante.nome}
                      </h3>
                    </div>
                            </div>
                  <div className="mt-1 flex items-center justify-center w-full">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-800/70 text-purple-100 shadow-sm">
                        {integrante.instrumento || 'Instrumento não definido'}
                            </span>
                          </div>
                </div>
                
                {/* Corpo do cartão */}
                <div className="px-4 py-4 flex-grow bg-gradient-to-b from-gray-800 to-gray-850">
                            <div className="space-y-3">
                      {/* Contatos */}
                        <div>
                        <p className="text-xs text-gray-400 font-medium mb-0.5">Contatos</p>
                        <div className="space-y-2 text-sm text-gray-300">
                          {integrante.apelido && (
                            <div className="flex items-center gap-2 text-sm">
                              <UserIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-400">Apelido:</span>
                              <span className="text-gray-200">{integrante.apelido}</span>
                              </div>
                          )}
                          {integrante.telefone && (
                            <div className="flex items-center gap-2 text-sm">
                              <PhoneIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-200">{integrante.telefone}</span>
                                </div>
                              )}
                              {integrante.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <AtSymbolIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-200">{integrante.email}</span>
                            </div>
                          )}
                          {integrante.tipo_chave_pix && integrante.chave_pix && (
                            <div className="flex items-center gap-2 text-sm">
                              <CreditCardIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-400">{integrante.tipo_chave_pix}:</span>
                              <span className="text-gray-200">{integrante.chave_pix}</span>
                        </div>
                          )}
                          {!integrante.telefone && !integrante.email && !integrante.apelido && 
                            !(integrante.tipo_chave_pix && integrante.chave_pix) && (
                            <div className="text-gray-500 text-sm">Sem contatos registrados</div>
                          )}
                        </div>
                                </div>
                              
                    {/* Bandas */}
                      <div>
                        <p className="text-xs text-gray-400 font-medium mb-0.5">Bandas</p>
                        {integrante.bandas && integrante.bandas.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {integrante.bandas.map((banda) => (
                              <span
                                key={banda.id}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-800/70 text-purple-100 shadow-sm"
                              >
                                {banda.nome}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-16 text-center text-gray-500">
                            <p className="text-sm">Sem bandas</p>
                          </div>
                        )}
                      </div>
                            </div>
                          </div>
                
                {/* Rodapé com ações */}
                <div className="p-3 sm:px-6 flex justify-end items-center bg-gray-850 border-t border-gray-700/50 mt-auto">
                            <div className="flex space-x-2">
                              <button
                        onClick={() => handleView(integrante)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-blue-300 hover:bg-blue-800/30 transition-colors duration-200"
                      title="Visualizar integrante"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => router.push(`/integrantes/${integrante.id}/editar`)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-yellow-300 hover:bg-yellow-800/30 transition-colors duration-200"
                                title="Editar integrante"
                              >
                      <FileEdit className="h-4 w-4" />
                              </button>
                              <button
                        onClick={() => handleDelete(integrante.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-red-300 hover:bg-red-800/30 transition-colors duration-200"
                                title="Excluir integrante"
                              >
                      <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
          )}
        </div>
      </div>

      {/* Dialog para visualizar integrante */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-lg bg-gray-800 border border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              Detalhes do Integrante
            </DialogTitle>
          </DialogHeader>
          
          {selectedIntegrante && (
            <div className="space-y-4 mt-2">
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedIntegrante.nome}</h3>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-800/70 text-purple-100">
                    {selectedIntegrante.instrumento || 'Instrumento não definido'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                {/* Contatos */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-400">Contatos</h4>
                  <div className="space-y-2">
                    {selectedIntegrante.apelido && (
                      <div className="flex items-center gap-2 text-sm">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400">Apelido:</span>
                        <span className="text-gray-200">{selectedIntegrante.apelido}</span>
                      </div>
                    )}
                    {selectedIntegrante.telefone && (
                      <div className="flex items-center gap-2 text-sm">
                        <PhoneIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-200">{selectedIntegrante.telefone}</span>
                      </div>
                    )}
                    {selectedIntegrante.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <AtSymbolIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-200">{selectedIntegrante.email}</span>
                      </div>
                    )}
                    {selectedIntegrante.tipo_chave_pix && selectedIntegrante.chave_pix && (
                      <div className="flex items-center gap-2 text-sm">
                        <CreditCardIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400">{selectedIntegrante.tipo_chave_pix}:</span>
                        <span className="text-gray-200">{selectedIntegrante.chave_pix}</span>
                      </div>
                    )}
                    {!selectedIntegrante.telefone && !selectedIntegrante.email && !selectedIntegrante.apelido && 
                      !(selectedIntegrante.tipo_chave_pix && selectedIntegrante.chave_pix) && (
                      <div className="text-gray-500 text-sm">Sem contatos registrados</div>
                    )}
                  </div>
                </div>

                {/* Bandas */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-400">Bandas</h4>
                  {selectedIntegrante.bandas && selectedIntegrante.bandas.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedIntegrante.bandas.map((banda) => (
                        <span
                          key={banda.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-800/70 text-purple-100"
                        >
                          {banda.nome}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">Não participa de nenhuma banda</div>
                  )}
                </div>
              </div>

              {/* Observações */}
              <div className="pt-4 border-t border-gray-700">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Observações</h4>
                {selectedIntegrante.observacoes ? (
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{selectedIntegrante.observacoes}</p>
                ) : (
                  <p className="text-sm text-gray-500">Sem observações registradas</p>
        )}
    </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => setIsViewOpen(false)}
                  className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Fechar
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setIsViewOpen(false);
                    router.push(`/integrantes/${selectedIntegrante.id}/editar`);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Editar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
} 