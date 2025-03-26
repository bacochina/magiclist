"use client"

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { MusicaForm } from '../components/MusicaForm'

export default function NovaMusicaPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white flex items-center mb-4"
          >
            <ArrowLeft className="mr-2" size={16} />
            Voltar
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">Nova Música</h1>
          <p className="text-gray-400">Cadastre uma nova música no repertório</p>
        </div>

        {/* Formulário */}
        <MusicaForm />
      </div>
    </div>
  )
} 