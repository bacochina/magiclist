import Link from "next/link"
import { 
  Eye, 
  FileEdit, 
  Trash2, 
  Calendar, 
  Map, 
  Phone, 
  DollarSign
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { confirmar } from '@/lib/sweetalert'
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

export const ShowCard = ({ 
  show, 
  onDelete, 
  onView,
  router
}: { 
  show: Show
  onDelete: (show: Show) => void
  onView: (show: Show) => void
  router: any
}) => {
  // Função para lidar com exclusão
  const handleDelete = async (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
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

  return (
    <div 
      onClick={() => onView(show)}
      className="group bg-gray-850 border border-gray-800 hover:border-blue-600/30 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-blue-900/20 cursor-pointer"
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
              {show.banda?.nome || "Banda não especificada"}
            </h3>
            <div className="flex items-center text-gray-400 text-sm mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              {format(new Date(show.data), 'EEEE, dd/MM/yyyy', { locale: ptBR })}
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            show.status === 'Confirmado' ? 'bg-green-600 text-white' : 
            show.status === 'Negociação' ? 'bg-blue-700 text-blue-100' : 
            show.status === 'Reservado' ? 'bg-yellow-700 text-yellow-100' : 
            'bg-red-600 text-white'
          }`}>
            {show.status}
          </span>
        </div>

        <div className="mt-4 space-y-2">
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

        <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between">
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 p-1 h-auto"
              onClick={(e) => {
                e.stopPropagation()
                onView(show)
              }}
              title="Ver Detalhes"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          
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
              onClick={handleDelete}
              title="Excluir"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 