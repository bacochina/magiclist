"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { IntegranteForm } from "../../components/IntegranteForm"

interface Integrante {
  id: string
  nome: string
  email: string
  telefone: string
  instrumento: string
  bandas: string[]
}

export default function EditarIntegrantePage() {
  const params = useParams()
  const router = useRouter()
  const [integrante, setIntegrante] = useState<Integrante | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIntegrante = async () => {
      try {
        const response = await fetch(`/api/integrantes/${params.id}`)
        if (!response.ok) throw new Error("Erro ao carregar integrante")
        const data = await response.json()
        setIntegrante(data)
      } catch (error) {
        console.error("Erro ao carregar integrante:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchIntegrante()
    }
  }, [params.id])

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!integrante) {
    return <div>Integrante não encontrado</div>
  }

  return (
    <div className="h-full">
      <div className="mx-auto max-w-5xl pt-12 px-8">
        <Link
          href="/integrantes"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 mb-6"
        >
          <ChevronLeft size={20} />
          <span>Voltar</span>
        </Link>

        <div className="space-y-1 mb-8">
          <h1 className="text-4xl font-bold text-white">Editar Integrante</h1>
          <p className="text-sm text-zinc-400">
            Atualize as informações do integrante
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
          <IntegranteForm initialData={integrante} />
        </div>
      </div>
    </div>
  )
} 