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
  Calendar,
  Music,
  LayoutGrid,
  LayoutList,
  Map,
  Phone,
  DollarSign
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageHeader } from '@/components/ui/page-header'
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
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { alertaSucesso, alertaErro, confirmar, alertaConfirmacao } from '@/lib/sweetalert'
import { toast } from 'sonner'

interface Banda {
  id: string
  nome: string
  genero: string
}

interface Show {
  id: string
  banda_id: string
  data: string
  local: string
  contato: string
  telefone_contato: string
  status: string
  cache_bruto: string
  observacoes: string
  created_at: string
  updated_at: string
  banda?: Banda
}

interface Stats {
  totalShows: number
  totalConfirmados: number
  totalEmNegociacao: number
  totalReservados: number
  totalCancelados: number
}

export default function ShowsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [shows, setShows] = useState<Show[]>([])
  const [isViewMode, setIsViewMode] = useState<'grid' | 'table'>('table')
  const [selectedShow, setSelectedShow] = useState<Show | null>(null)
  const [stats, setStats] = useState<Stats>({
    totalShows: 0,
    totalConfirmados: 0,
    totalEmNegociacao: 0,
    totalReservados: 0,
    totalCancelados: 0
  })

  // Buscar shows e calcular estatísticas
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch('/api/eventos/shows')
        if (!response.ok) throw new Error('Erro ao buscar shows')
        const data = await response.json()
        setShows(data)

        // Calcular estatísticas
        const confirmados = data.filter((s: Show) => s.status === 'Confirmado').length
        const emNegociacao = data.filter((s: Show) => s.status === 'Negociação').length
        const reservados = data.filter((s: Show) => s.status === 'Reservado').length
        const cancelados = data.filter((s: Show) => s.status === 'Cancelado').length

        setStats({
          totalShows: data.length,
          totalConfirmados: confirmados,
          totalEmNegociacao: emNegociacao,
          totalReservados: reservados,
          totalCancelados: cancelados
        })
      } catch (error) {
        console.error('Erro ao buscar shows:', error)
        toast.error('Erro ao carregar shows')
      } finally {
        setIsLoading(false)
      }
    }

    fetchShows()
  }, [])

  // Função para excluir show
  const handleDelete = async (show: Show) => {
    try {
      const result = await alertaConfirmacao({
        titulo: 'Excluir show?',
        texto: `Tem certeza que deseja excluir o show de ${show.banda?.nome || 'banda desconhecida'} em ${format(new Date(show.data), 'dd/MM/yyyy')}?`,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
        icone: 'warning'
      })

      // Verificar se o usuário confirmou a exclusão
      if (!result.isConfirmed) {
        return
      }

      const response = await fetch(`/api/eventos/shows/${show.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir show')
      }

      // Atualizar a lista de shows localmente
      const updatedShows = shows.filter(s => s.id !== show.id)
      setShows(updatedShows)
      
      // Atualizar estatísticas
      const confirmados = updatedShows.filter((s: Show) => s.status === 'Confirmado').length
      const emNegociacao = updatedShows.filter((s: Show) => s.status === 'Negociação').length
      const reservados = updatedShows.filter((s: Show) => s.status === 'Reservado').length
      const cancelados = updatedShows.filter((s: Show) => s.status === 'Cancelado').length

      setStats({
        totalShows: updatedShows.length,
        totalConfirmados: confirmados,
        totalEmNegociacao: emNegociacao,
        totalReservados: reservados,
        totalCancelados: cancelados
      })

      alertaSucesso('Show excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir show:', error)
      alertaErro('Erro ao excluir show')
    }
  }

  // Função para visualizar detalhes do show
  const handleView = (show: Show) => {
    setSelectedShow(show)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-200" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Shows"
          description="Gerencie os shows de suas bandas"
          showBackButton={false}
        />

        {/* Cards de Estatísticas */}
        <div className="flex flex-wrap gap-4 mt-8">
          <div className="stat-card group relative overflow-hidden p-3 bg-gradient-to-r from-gray-800 to-gray-800/95 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 hover:shadow-purple-900/20 hover:border-purple-500/30 flex flex-1 items-center justify-between min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-purple-700/20 text-purple-400 ring-1 ring-purple-500/30 shadow-inner shadow-purple-600/10">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="text-xs text-gray-400">shows</div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-purple-200 group-hover:to-purple-400 transition-colors duration-300">
              {stats.totalShows}
            </div>
          </div>

          <div className="stat-card group relative overflow-hidden p-3 bg-gradient-to-r from-gray-800 to-gray-800/95 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 hover:shadow-green-900/20 hover:border-green-500/30 flex flex-1 items-center justify-between min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-600/20 to-green-700/20 text-green-400 ring-1 ring-green-500/30 shadow-inner shadow-green-600/10">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="text-xs text-gray-400">confirmados</div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-green-200 group-hover:to-green-400 transition-colors duration-300">
              {stats.totalConfirmados}
            </div>
          </div>

          <div className="stat-card group relative overflow-hidden p-3 bg-gradient-to-r from-gray-800 to-gray-800/95 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 hover:shadow-blue-900/20 hover:border-blue-500/30 flex flex-1 items-center justify-between min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-700/20 text-blue-400 ring-1 ring-blue-500/30 shadow-inner shadow-blue-600/10">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="text-xs text-gray-400">em negociação</div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:to-blue-400 transition-colors duration-300">
              {stats.totalEmNegociacao}
            </div>
          </div>
        </div>

        {/* Barra de Ações */}
        <div className="flex justify-between items-center mt-8">
          <div className="flex space-x-2">
            <Button 
              onClick={() => setIsViewMode("table")} 
              variant={isViewMode === "table" ? "outline" : "default"}
              size="sm"
              className="hidden sm:flex"
              title="Visualização em tabela"
            >
              <LayoutList className="h-4 w-4 mr-1" />
              Tabela
            </Button>
            <Button 
              onClick={() => setIsViewMode("grid")} 
              variant={isViewMode === "grid" ? "outline" : "default"}
              size="sm"
              className="hidden sm:flex"
              title="Visualização em cartões"
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              Cartões
            </Button>
          </div>
          <Button
            onClick={() => router.push('/eventos/shows/novo')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Novo Show
          </Button>
        </div>

        {/* Conteúdo Principal */}
        {isViewMode === 'table' ? (
          <div className="w-full space-y-6">
            {/* Barra de pesquisa e filtros */}
            <div className="flex flex-col sm:flex-row gap-3 bg-gray-850 rounded-lg p-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Pesquisar shows..."
                  className="pl-9 bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-600"
                  value=""
                  onChange={(e) => {}}
                />
              </div>
              
              <Select defaultValue="todos">
                <SelectTrigger className="w-full sm:w-[180px] bg-gray-900 border-gray-600 text-white">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-600">
                  {["todos", "Confirmado", "Negociação", "Reservado", "Cancelado"].map((status) => (
                    <SelectItem key={status} value={status} className="text-white hover:bg-gray-800">
                      {status === "todos" ? "Todos os status" : status}
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
                    <TableHead className="text-left font-semibold text-white w-[180px]">BANDA</TableHead>
                    <TableHead className="text-left font-semibold text-white w-[120px]">DATA</TableHead>
                    <TableHead className="text-left font-semibold text-white">LOCAL</TableHead>
                    <TableHead className="text-left font-semibold text-white">CONTATO</TableHead>
                    <TableHead className="text-left font-semibold text-white w-[120px]">STATUS</TableHead>
                    <TableHead className="text-right font-semibold text-white w-[120px]">CACHÊ</TableHead>
                    <TableHead className="text-right w-[100px]">AÇÕES</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shows.length > 0 ? (
                    shows.map((show) => (
                      <TableRow key={show.id} className="hover:bg-gray-800/80 border-b border-gray-800/50">
                        <TableCell className="font-medium text-white">
                          {show.banda?.nome || "Banda não especificada"}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {format(new Date(show.data), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {show.local || "Não definido"}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {show.contato || "Não definido"}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            show.status === 'Confirmado' ? 'bg-green-700 text-green-100' : 
                            show.status === 'Negociação' ? 'bg-blue-700 text-blue-100' : 
                            show.status === 'Reservado' ? 'bg-yellow-700 text-yellow-100' : 
                            'bg-red-700 text-red-100'
                          }`}>
                            {show.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-gray-300">
                          {show.cache_bruto 
                            ? `R$ ${parseFloat(show.cache_bruto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleView(show)}
                              className="text-gray-400 hover:text-blue-400 transition-colors"
                              title="Ver Detalhes"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <Link
                              href={`/eventos/shows/${show.id}/editar`}
                              className="text-gray-400 hover:text-yellow-400 transition-colors"
                              title="Editar"
                            >
                              <FileEdit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(show)}
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
                      <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                        Nenhum show encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-900/30 rounded-lg">
            {shows.length > 0 ? (
              shows.map((show) => (
                <div 
                  key={show.id}
                  onClick={() => handleView(show)}
                  className="bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-xl border border-gray-700 flex flex-col h-full hover:translate-y-[-3px] hover:border-blue-500/50"
                >
                  {/* Cabeçalho do cartão */}
                  <div className="p-3 flex flex-col bg-gradient-to-r from-blue-800 to-blue-900 border-b border-blue-700">
                    <div className="flex items-center w-full">
                      <div className="flex-1 min-w-0">
                        <h3 
                          className="text-base font-medium text-white leading-tight line-clamp-1 text-center"
                        >
                          {show.banda?.nome || "Banda não especificada"}
                        </h3>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center justify-center w-full">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        show.status === 'Confirmado' ? 'bg-green-600 text-white' : 
                        show.status === 'Negociação' ? 'bg-blue-700 text-blue-100' : 
                        show.status === 'Reservado' ? 'bg-yellow-700 text-yellow-100' : 
                        'bg-red-600 text-white'
                      }`}>
                        {show.status}
                      </span>
                    </div>
                  </div>
                  
                  {/* Corpo do cartão */}
                  <div className="p-4 flex-grow bg-gradient-to-b from-gray-800 to-gray-850">
                    <div className="flex items-center text-gray-400 text-sm mb-3">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(new Date(show.data), 'EEEE, dd/MM/yyyy', { locale: ptBR })}
                    </div>

                    <div className="space-y-2">
                      {show.local && (
                        <div className="flex items-center text-gray-300 text-sm">
                          <Map className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                          <span className="line-clamp-1">{show.local}</span>
                        </div>
                      )}
                      
                      {show.contato && (
                        <div className="flex items-center text-gray-300 text-sm">
                          <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                          <span className="line-clamp-1">{show.contato} {show.telefone_contato ? `(${show.telefone_contato})` : ''}</span>
                        </div>
                      )}
                      
                      {show.cache_bruto && (
                        <div className="flex items-center text-gray-300 text-sm">
                          <DollarSign className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                          <span>R$ {parseFloat(show.cache_bruto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rodapé com ações */}
                  <div className="p-3 border-t border-gray-700 bg-gray-800 flex justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 p-1 h-auto"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleView(show)
                      }}
                      title="Ver Detalhes"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex space-x-1">
                      <Link
                        href={`/eventos/shows/${show.id}/editar`}
                        className="inline-flex items-center justify-center text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20 rounded-md p-1"
                        onClick={(e) => e.stopPropagation()}
                        title="Editar"
                      >
                        <FileEdit className="h-4 w-4" />
                      </Link>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-1 h-auto"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDelete(show)
                        }}
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-gray-850 border border-gray-800 rounded-lg p-8 text-center text-gray-400">
                Nenhum show encontrado
              </div>
            )}
          </div>
        )}

        {/* Dialog de Visualização */}
        <Dialog open={!!selectedShow} onOpenChange={() => setSelectedShow(null)}>
          <DialogContent className="sm:max-w-lg bg-gray-800 border border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-white">
                Detalhes do Show
              </DialogTitle>
            </DialogHeader>
            
            {selectedShow && (
              <div className="space-y-4 mt-2">
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedShow.banda?.nome || 'Banda não identificada'}</h3>
                  <p className="text-gray-400">
                    {format(new Date(selectedShow.data), 'EEEE, dd/MM/yyyy', { locale: ptBR })}
                  </p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedShow.status === 'Confirmado' ? 'bg-green-600 text-white' : 
                      selectedShow.status === 'Negociação' ? 'bg-blue-700 text-blue-100' : 
                      selectedShow.status === 'Reservado' ? 'bg-yellow-700 text-yellow-100' : 
                      'bg-red-600 text-white'
                    }`}>
                      {selectedShow.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Local</p>
                    <p className="text-gray-200">{selectedShow.local || 'Não definido'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Contato</p>
                    <p className="text-gray-200">{selectedShow.contato || 'Não definido'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Telefone</p>
                    <p className="text-gray-200">{selectedShow.telefone_contato || 'Não definido'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Cachê</p>
                    <p className="text-gray-200">
                      {selectedShow.cache_bruto 
                        ? `R$ ${parseFloat(selectedShow.cache_bruto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
                        : 'Não definido'}
                    </p>
                  </div>
                </div>

                {selectedShow.observacoes && (
                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-sm font-medium text-gray-400">Observações</p>
                    <p className="text-gray-200 whitespace-pre-line">{selectedShow.observacoes}</p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/eventos/shows/${selectedShow.id}/editar`)}
                  >
                    <FileEdit className="h-4 w-4 mr-1" />
                    Editar Show
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 