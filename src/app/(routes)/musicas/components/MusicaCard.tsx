"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Edit, Eye, Music2, Trash2, Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'
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

interface MusicaCardProps {
  musica: Musica
  onDelete: (musica: Musica) => void
  onView: (musica: Musica) => void
  router: ReturnType<typeof useRouter>
}

export function MusicaCard({ musica, onDelete, onView, router }: MusicaCardProps) {
  return (
    <div className="group relative bg-gray-800 hover:bg-gray-700 rounded-lg p-4 border border-gray-700 hover:border-gray-500 transition-all duration-200 shadow-lg">
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              {musica.titulo}
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-700 text-white">
              {musica.genero || 'Não definido'}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onView(musica)}
              className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
              title="Ver Detalhes"
            >
              <Eye className="h-4 w-4" />
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/musicas/${musica.id}/editar`)}
              className="h-8 w-8 p-0 hover:bg-purple-500/20"
            >
              <Pencil className="h-4 w-4 text-purple-400" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(musica)}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3 text-gray-300 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Music2 className="h-4 w-4 text-gray-400" />
            <span>{musica.artista}</span>
          </div>
          {musica.tom && (
            <div className="flex items-center gap-2 text-sm">
              <Music2 className="h-4 w-4 text-gray-400" />
              <span>Tom: {musica.tom}</span>
            </div>
          )}
          {musica.bpm && (
            <div className="flex items-center gap-2 text-sm">
              <Music2 className="h-4 w-4 text-gray-400" />
              <span>BPM: {musica.bpm}</span>
            </div>
          )}
          {musica.status_vs && (
            <div className="flex items-center gap-2 text-sm">
              <Music2 className="h-4 w-4 text-gray-400" />
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                musica.status_vs === 'VS (A Fazer)' ? 'bg-yellow-600 text-yellow-50' :
                musica.status_vs === 'VS (Fazendo)' ? 'bg-blue-600 text-blue-50' :
                musica.status_vs === 'VS (Feito)' ? 'bg-green-600 text-green-50' :
                'bg-gray-600 text-gray-50'
              }`}>
                {musica.status_vs}
              </span>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <div className="text-sm text-gray-400 mb-2">Bandas:</div>
          {musica.bandas && musica.bandas.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {musica.bandas.slice(0, 3).map((banda) => (
                <span
                  key={banda.id}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900 text-white border border-blue-700"
                >
                  {banda.nome}
                </span>
              ))}
              {musica.bandas.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-white border border-gray-600">
                  +{musica.bandas.length - 3}
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-500 text-sm">Nenhuma banda</span>
          )}
        </div>
      </div>
    </div>
  )
} 