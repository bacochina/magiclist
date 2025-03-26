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
  Grid,
  Music2,
  LayoutGrid,
  LayoutList
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
import { alertaSucesso, alertaErro, confirmar, alertaConfirmacao } from '@/lib/sweetalert'
import { toast } from 'sonner'
import { MusicaForm } from './components/MusicaForm'
import { MusicaTable } from './components/MusicaTable'
import { MusicaCard } from './components/MusicaCard'

interface Banda {
  id: string
  nome: string
  genero: string
}

interface Musica {
  id: string
  titulo: string
  artista: string
  genero: string
  duracao: string
  tom: string
  bpm: string
  observacoes?: string
  link_letra?: string
  link_cifra?: string
  link_mp3?: string
  link_vs?: string
  status_vs?: string
  bandas?: Banda[]
}

interface Stats {
  totalMusicas: number
  totalGeneros: number
  totalBandas: number
}

// Componente de tabela de músicas
const MusicasTable = ({ 
  musicas, 
  onDelete, 
  onView,
  router
}: { 
  musicas: Musica[]
  onDelete: (musica: Musica) => void
  onView: (musica: Musica) => void
  router: any
}) => {
  const [musicasFiltradas, setMusicasFiltradas] = useState<Musica[]>(musicas)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroGenero, setFiltroGenero] = useState('todos')

  // Filtra as músicas quando os critérios de filtro mudam
  useEffect(() => {
    const filteredMusicas = musicas.filter(musica => {
      const matchesTerm = musica.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         musica.artista?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         musica.genero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         musica.tom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         searchTerm === ''
      
      const matchesGenero = filtroGenero === 'todos' || musica.genero === filtroGenero
      
      return matchesTerm && matchesGenero
    })
    
    setMusicasFiltradas(filteredMusicas)
  }, [musicas, searchTerm, filtroGenero])

  // Função para lidar com exclusão
  const handleDelete = async (musica: Musica) => {
    const confirmed = await confirmar('Excluir música', 'Tem certeza que deseja excluir esta música?', 'warning')
    if (confirmed) {
      onDelete(musica)
    }
  }

  // Array de gêneros únicos para o filtro
  const generos = ["todos", ...Array.from(new Set(musicas.map(musica => musica.genero || "").filter(Boolean)))]

  return (
    <>
      <div className="w-full space-y-6">
        {/* Barra de pesquisa e filtros */}
        <div className="flex flex-col sm:flex-row gap-3 bg-gray-850 rounded-lg p-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Pesquisar músicas..."
              className="pl-9 bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-600"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={filtroGenero} onValueChange={setFiltroGenero}>
            <SelectTrigger className="w-full sm:w-[180px] bg-gray-900 border-gray-600 text-white">
              <SelectValue placeholder="Filtrar por gênero" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-600">
              {generos.map((genero) => (
                <SelectItem key={genero} value={genero} className="text-white hover:bg-gray-800">
                  {genero === "todos" ? "Todos os gêneros" : genero}
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
                <TableHead className="text-left font-semibold text-white w-[200px]">TÍTULO</TableHead>
                <TableHead className="text-left font-semibold text-white w-[150px]">ARTISTA</TableHead>
                <TableHead className="text-left font-semibold text-white">GÊNERO</TableHead>
                <TableHead className="text-left font-semibold text-white">TOM</TableHead>
                <TableHead className="text-left font-semibold text-white">BANDAS</TableHead>
                <TableHead className="text-left font-semibold text-white w-[120px]">STATUS VS</TableHead>
                <TableHead className="text-right w-[100px]">AÇÕES</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {musicasFiltradas.length > 0 ? (
                musicasFiltradas.map((musica) => (
                  <TableRow key={musica.id} className="hover:bg-gray-800/80 border-b border-gray-800/50">
                    <TableCell className="font-medium text-white">
                      {musica.titulo}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {musica.artista}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-700 text-purple-50">
                        {musica.genero || 'Não definido'}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {musica.tom || 'Não definido'}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {musica.bandas && musica.bandas.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {musica.bandas.slice(0, 3).map((banda) => (
                            <span 
                              key={banda.id}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-800 text-white"
                            >
                              {banda.nome}
                            </span>
                          ))}
                          {musica.bandas.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-600 text-gray-200">
                              +{musica.bandas.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        "Nenhuma banda"
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        musica.status_vs === 'VS (A Fazer)' ? 'bg-yellow-600 text-yellow-50' :
                        musica.status_vs === 'VS (Fazendo)' ? 'bg-blue-600 text-blue-50' :
                        musica.status_vs === 'VS (Feito)' ? 'bg-green-600 text-green-50' :
                        'bg-gray-600 text-gray-50'
                      }`}>
                        {musica.status_vs}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => onView(musica)}
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                          title="Ver Detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <Link
                          href={`/musicas/${musica.id}/editar`}
                          className="text-gray-400 hover:text-yellow-400 transition-colors"
                          title="Editar"
                        >
                          <FileEdit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(musica)}
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
                    Nenhuma música encontrada
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

export default function MusicasPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [musicas, setMusicas] = useState<Musica[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isViewMode, setIsViewMode] = useState<'grid' | 'table'>('table')
  const [selectedMusica, setSelectedMusica] = useState<Musica | null>(null)
  const [stats, setStats] = useState<Stats>({
    totalMusicas: 0,
    totalGeneros: 0,
    totalBandas: 0
  })

  // Buscar músicas e calcular estatísticas
  useEffect(() => {
    const fetchMusicas = async () => {
      try {
        const response = await fetch('/api/musicas')
        if (!response.ok) throw new Error('Erro ao buscar músicas')
        const data = await response.json()
        setMusicas(data)

        // Calcular estatísticas
        const generos = new Set(data.map((m: Musica) => m.genero))
        const bandas = new Set(data.flatMap((m: Musica) => m.bandas?.map(b => b.id) || []))

        setStats({
          totalMusicas: data.length,
          totalGeneros: generos.size,
          totalBandas: bandas.size
        })
      } catch (error) {
        console.error('Erro ao buscar músicas:', error)
        toast.error('Erro ao carregar músicas')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMusicas()
  }, [])

  // Função para excluir música
  const handleDelete = async (musica: Musica) => {
    try {
      const confirmado = await alertaConfirmacao({
        titulo: 'Excluir música?',
        texto: `Tem certeza que deseja excluir a música "${musica.titulo}"?`,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
        icone: 'warning'
      })

      if (!confirmado) {
        return
      }

      const response = await fetch(`/api/musicas/${musica.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir música')
      }

      // Atualizar a lista de músicas localmente
      const updatedMusicas = musicas.filter(m => m.id !== musica.id)
      setMusicas(updatedMusicas)
      
      // Atualizar estatísticas
      const generos = new Set(updatedMusicas.map(m => m.genero))
      const bandas = new Set(updatedMusicas.flatMap(m => m.bandas?.map(b => b.id) || []))
      
      setStats({
        totalMusicas: updatedMusicas.length,
        totalGeneros: generos.size,
        totalBandas: bandas.size
      })

      alertaSucesso('Música excluída com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir música:', error)
      alertaErro('Erro ao excluir música')
    }
  }

  // Função para visualizar detalhes da música
  const handleView = (musica: Musica) => {
    setSelectedMusica(musica)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-200" />
      </div>
    )
  }

  return (
    <div className="container p-4 mx-auto">
      <div className="flex flex-col space-y-4">
        {/* Cabeçalho */}
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white">Músicas</h1>
          <p className="text-sm text-zinc-400">
            Gerencie o repertório musical da sua igreja
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="flex flex-wrap gap-4 mt-8">
          <div className="stat-card group relative overflow-hidden p-3 bg-gradient-to-r from-gray-800 to-gray-800/95 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 hover:shadow-purple-900/20 hover:border-purple-500/30 flex flex-1 items-center justify-between min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-purple-700/20 text-purple-400 ring-1 ring-purple-500/30 shadow-inner shadow-purple-600/10">
                <Music2 className="h-5 w-5" />
              </div>
              <div className="text-xs text-gray-400">músicas</div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-purple-200 group-hover:to-purple-400 transition-colors duration-300">
              {stats.totalMusicas}
            </div>
          </div>

          <div className="stat-card group relative overflow-hidden p-3 bg-gradient-to-r from-gray-800 to-gray-800/95 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 hover:shadow-blue-900/20 hover:border-blue-500/30 flex flex-1 items-center justify-between min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-700/20 text-blue-400 ring-1 ring-blue-500/30 shadow-inner shadow-blue-600/10">
                <Music2 className="h-5 w-5" />
              </div>
              <div className="text-xs text-gray-400">gêneros</div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:to-blue-400 transition-colors duration-300">
              {stats.totalGeneros}
            </div>
          </div>

          <div className="stat-card group relative overflow-hidden p-3 bg-gradient-to-r from-gray-800 to-gray-800/95 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 hover:shadow-green-900/20 hover:border-green-500/30 flex flex-1 items-center justify-between min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-600/20 to-green-700/20 text-green-400 ring-1 ring-green-500/30 shadow-inner shadow-green-600/10">
                <Music2 className="h-5 w-5" />
              </div>
              <div className="text-xs text-gray-400">bandas</div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-green-200 group-hover:to-green-400 transition-colors duration-300">
              {stats.totalBandas}
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
            onClick={() => router.push('/musicas/novo')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Nova Música
          </Button>
        </div>

        {/* Conteúdo Principal */}
        {isViewMode === 'table' ? (
          <MusicaTable
            musicas={musicas}
            onDelete={handleDelete}
            onView={handleView}
            router={router}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {musicas.map((musica) => (
              <MusicaCard
                key={musica.id}
                musica={musica}
                onDelete={handleDelete}
                onView={handleView}
                router={router}
              />
            ))}
          </div>
        )}

        {/* Dialog de Visualização */}
        <Dialog open={!!selectedMusica} onOpenChange={() => setSelectedMusica(null)}>
          <DialogContent className="sm:max-w-lg bg-gray-800 border border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-white">
                Detalhes da Música
              </DialogTitle>
            </DialogHeader>
            
            {selectedMusica && (
              <div className="space-y-4 mt-2">
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedMusica.titulo}</h3>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-800/70 text-purple-100">
                      {selectedMusica.genero || 'Gênero não definido'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Artista</p>
                    <p className="text-gray-200">{selectedMusica.artista}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Tom</p>
                    <p className="text-gray-200">{selectedMusica.tom || 'Não definido'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">BPM</p>
                    <p className="text-gray-200">{selectedMusica.bpm || 'Não definido'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Duração</p>
                    <p className="text-gray-200">{selectedMusica.duracao || 'Não definido'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Status VS</p>
                    <p className="text-gray-200">{selectedMusica.status_vs || 'Não Tem'}</p>
                  </div>
                </div>

                {/* Bandas */}
                <div className="space-y-3 pt-4 border-t border-gray-700">
                  <h4 className="text-sm font-medium text-gray-400">Bandas</h4>
                  {selectedMusica.bandas && selectedMusica.bandas.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMusica.bandas.map((banda) => (
                        <span
                          key={banda.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-800 text-white"
                        >
                          {banda.nome}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">Não está em nenhuma banda</div>
                  )}
                </div>

                {/* Observações */}
                {selectedMusica.observacoes && (
                  <div className="space-y-3 pt-4 border-t border-gray-700">
                    <h4 className="text-sm font-medium text-gray-400">Observações</h4>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{selectedMusica.observacoes}</p>
                  </div>
                )}

                {/* Links */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                  {selectedMusica.link_letra && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(selectedMusica.link_letra, '_blank')}
                      className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Ver Letra
                    </Button>
                  )}
                  {selectedMusica.link_cifra && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(selectedMusica.link_cifra, '_blank')}
                      className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Ver Cifra
                    </Button>
                  )}
                  {selectedMusica.link_mp3 && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(selectedMusica.link_mp3, '_blank')}
                      className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Ouvir MP3
                    </Button>
                  )}
                  {selectedMusica.link_vs && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(selectedMusica.link_vs, '_blank')}
                      className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Ver VS
                    </Button>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedMusica(null)}
                    className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Fechar
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => {
                      setSelectedMusica(null)
                      router.push(`/musicas/${selectedMusica.id}/editar`)
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
    </div>
  )
} 