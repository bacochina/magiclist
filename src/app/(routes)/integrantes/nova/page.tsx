'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Music } from 'lucide-react'
import { IntegranteForm } from '../components/IntegranteForm'

export default function NovoIntegrantePage() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link 
          href="/integrantes" 
          className="flex items-center text-blue-400 hover:text-blue-300 mr-4"
        >
          <ArrowLeft className="mr-1" size={18} />
          <span>Voltar</span>
        </Link>
        <h1 className="text-2xl font-bold text-white">Novo Integrante</h1>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-900/50 to-indigo-800/30 p-4 rounded-lg mb-6 flex items-center">
          <Music className="text-indigo-400 mr-3" size={24} />
          <h2 className="text-xl font-semibold text-white">Cadastrar Novo Integrante</h2>
        </div>

        <IntegranteForm 
          onSave={() => {
            router.push('/integrantes')
            router.refresh()
          }}
        />
      </div>
    </div>
  )
} 