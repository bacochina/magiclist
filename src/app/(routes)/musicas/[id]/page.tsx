"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { MusicaForm } from '../components/MusicaForm'
import { alertaErro } from '@/lib/sweetalert'

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
  bandas?: string[]
}

export default function EditarMusica({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [musica, setMusica] = useState<Musica | null>(null)

  useEffect(() => {
    async function carregarMusica() {
      try {
        const response = await fetch(`/api/musicas/${params.id}`)
        if (!response.ok) throw new Error('Erro ao carregar música')
        const data = await response.json()
        setMusica(data)
      } catch (error) {
        console.error('Erro ao carregar música:', error)
        alertaErro('Erro ao carregar música')
        router.push('/musicas')
      } finally {
        setLoading(false)
      }
    }

    carregarMusica()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!musica) return null

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center rounded-xl border border-white/20 p-2 text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 ease-in-out"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h2 className="text-4xl font-bold tracking-tight text-white">Editar Música</h2>
        </div>
      </div>

      <div className="mx-auto max-w-5xl">
        <MusicaForm initialData={musica} />
      </div>
    </div>
  )
} 