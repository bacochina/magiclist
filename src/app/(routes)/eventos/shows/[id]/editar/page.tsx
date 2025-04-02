"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ShowForm } from "../../components/ShowForm"
import { PageHeader } from '@/components/ui/page-header'
import { toast } from "sonner"
import "react-day-picker/dist/style.css"

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
}

export default function EditarShowPage() {
  const params = useParams()
  const showId = params.id as string
  const [show, setShow] = useState<Show | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchShow = async () => {
      try {
        if (!showId) return
        
        const response = await fetch(`/api/eventos/shows/${showId}`)
        
        if (!response.ok) {
          throw new Error('Erro ao buscar dados do show')
        }
        
        const data = await response.json()
        setShow(data)
      } catch (error) {
        console.error('Erro ao buscar show:', error)
        toast.error('Erro ao carregar dados do show')
      } finally {
        setIsLoading(false)
      }
    }

    fetchShow()
  }, [showId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-200" />
      </div>
    )
  }

  if (!show) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-red-200">
            Show não encontrado ou erro ao carregar os dados.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Editar Show"
          description="Atualize os dados do show"
        />

        {/* Formulário */}
        <div className="bg-gray-850 rounded-xl p-6 border border-gray-800 shadow-lg">
          <ShowForm initialData={show} isEditing={true} />
        </div>
      </div>
    </div>
  )
} 