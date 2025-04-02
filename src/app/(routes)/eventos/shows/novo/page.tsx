"use client"

import { ShowForm } from "../components/ShowForm"
import { PageHeader } from '@/components/ui/page-header'
import "react-day-picker/dist/style.css"

export default function NovoShowPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Novo Show"
          description="Adicione um novo show para sua banda"
        />

        {/* Formulário */}
        <div className="bg-gray-850 rounded-xl p-6 border border-gray-800 shadow-lg">
          <ShowForm />
        </div>
      </div>
    </div>
  )
} 