import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Search, 
  Eye, 
  FileEdit, 
  Trash2
} from "lucide-react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { confirmar } from '@/lib/sweetalert'
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { alertaConfirmacao } from '@/lib/sweetalert'

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

export const ShowsTable = ({ 
  shows, 
  onDelete, 
  onView,
  router
}: { 
  shows: Show[]
  onDelete: (show: Show) => void
  onView: (show: Show) => void
  router: any
}) => {
  const [showsFiltrados, setShowsFiltrados] = useState<Show[]>(shows)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')

  // Filtra os shows quando os critérios de filtro mudam
  useEffect(() => {
    const filteredShows = shows.filter(show => {
      const matchesTerm = show.banda?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        show.local?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        show.contato?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        searchTerm === ''
      
      const matchesStatus = filtroStatus === 'todos' || show.status === filtroStatus
      
      return matchesTerm && matchesStatus
    })
    
    setShowsFiltrados(filteredShows)
  }, [shows, searchTerm, filtroStatus])

  // Função para lidar com exclusão
  const handleDelete = async (show: Show) => {
    const result = await alertaConfirmacao({
      titulo: 'Excluir show?',
      texto: `Tem certeza que deseja excluir o show de ${show.banda?.nome || 'banda desconhecida'} em ${format(new Date(show.data), 'dd/MM/yyyy')}?`,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      icone: 'warning'
    })
    
    if (result.isConfirmed) {
      onDelete(show)
    }
  }

  // Array de status únicos para o filtro
  const statusOptions = ["todos", "Confirmado", "Negociação", "Reservado", "Cancelado"]

  return (
    <>
      <div className="w-full space-y-6">
        {/* Barra de pesquisa e filtros */}
        <div className="flex flex-col sm:flex-row gap-3 bg-gray-850 rounded-lg p-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Pesquisar shows..."
              className="pl-9 bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-600"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-full sm:w-[180px] bg-gray-900 border-gray-600 text-white">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-600">
              {statusOptions.map((status) => (
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
              {showsFiltrados.length > 0 ? (
                showsFiltrados.map((show) => (
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
                        show.status === 'Confirmado' ? 'bg-green-600 text-white' : 
                        show.status === 'Negociação' ? 'bg-blue-700 text-blue-100' : 
                        show.status === 'Reservado' ? 'bg-yellow-700 text-yellow-100' : 
                        'bg-red-600 text-white'
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
                          onClick={() => onView(show)}
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
    </>
  )
} 