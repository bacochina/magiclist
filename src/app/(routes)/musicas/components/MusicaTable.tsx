"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Edit, Trash2, Eye, Music2, Search } from 'lucide-react'
import { MusicaForm } from './MusicaForm'
import { alertaConfirmacao } from '@/lib/sweetalert'

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

interface MusicaTableProps {
  musicas: Musica[]
  onDelete: (musica: Musica) => void
  onView: (musica: Musica) => void
  router: any
}

export function MusicaTable({ musicas, onDelete, onView, router }: MusicaTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [generoFilter, setGeneroFilter] = useState('todos')
  const [musicasFiltradas, setMusicasFiltradas] = useState<Musica[]>(musicas)

  // Filtra as músicas quando os critérios de filtro mudam
  useEffect(() => {
    const filteredMusicas = musicas.filter(musica => {
      const matchesSearch = (
        musica.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        musica.artista?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        musica.genero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        musica.tom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        searchTerm === ''
      )
      const matchesGenero = generoFilter === 'todos' || musica.genero === generoFilter
      return matchesSearch && matchesGenero
    })
    
    setMusicasFiltradas(filteredMusicas)
  }, [musicas, searchTerm, generoFilter])

  // Array de gêneros únicos para o filtro
  const generos = ["todos", ...Array.from(new Set(musicas.map(musica => musica.genero || "").filter(Boolean)))]

  // Função para lidar com exclusão
  const handleDelete = async (musica: Musica) => {
    onDelete(musica)
  }

  return (
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
        
        <Select value={generoFilter} onValueChange={setGeneroFilter}>
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
                      {musica.status_vs || 'Não Tem'}
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
                      <button
                        onClick={() => router.push(`/musicas/${musica.id}/editar`)}
                        className="text-gray-400 hover:text-yellow-400 transition-colors"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(musica)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
  )
} 