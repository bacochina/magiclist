"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Music2, 
  User, 
  Clock, 
  Hash, 
  Activity, 
  FileText, 
  Link as LinkIcon,
  FileMusic,
  Video,
  Tag
} from 'lucide-react'
import { alertaSucesso, alertaErro } from '@/lib/sweetalert'

interface Banda {
  id: string
  nome: string
  genero: string
}

interface Musica {
  id?: string
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

interface MusicaFormProps {
  initialData?: Musica
  onSave?: () => void
}

const generos = [
  'Rock',
  'Pop',
  'Gospel',
  'Worship',
  'MPB',
  'Sertanejo',
  'Outro'
]

const statusVS = [
  'Não Tem',
  'VS (A Fazer)',
  'VS (Fazendo)',
  'VS (Feito)'
]

export function MusicaForm({ initialData, onSave }: MusicaFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [bandas, setBandas] = useState<Banda[]>([])
  const [formData, setFormData] = useState<Musica>({
    titulo: initialData?.titulo || '',
    artista: initialData?.artista || '',
    genero: initialData?.genero || '',
    duracao: initialData?.duracao || '',
    tom: initialData?.tom || '',
    bpm: initialData?.bpm || '',
    observacoes: initialData?.observacoes || '',
    link_letra: initialData?.link_letra || '',
    link_cifra: initialData?.link_cifra || '',
    link_mp3: initialData?.link_mp3 || '',
    link_vs: initialData?.link_vs || '',
    status_vs: initialData?.status_vs || 'Não Tem',
    bandas: initialData?.bandas || []
  })

  useEffect(() => {
    async function carregarBandas() {
      try {
        const response = await fetch('/api/bandas')
        if (!response.ok) throw new Error('Erro ao carregar bandas')
        const { data } = await response.json()
        setBandas(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Erro ao carregar bandas:', error)
        alertaErro('Erro ao carregar bandas')
        setBandas([])
      }
    }

    carregarBandas()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBandasChange = (bandaId: string) => {
    setFormData(prev => {
      const bandas = prev.bandas || []
      const index = bandas.indexOf(bandaId)
      
      if (index === -1) {
        return { ...prev, bandas: [...bandas, bandaId] }
      } else {
        return { ...prev, bandas: bandas.filter(id => id !== bandaId) }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.titulo || !formData.artista) {
      alertaErro('Título e artista são obrigatórios')
      return
    }
    
    setLoading(true)

    try {
      const endpoint = initialData?.id 
        ? `/api/musicas/${initialData.id}` 
        : '/api/musicas'

      const method = initialData?.id ? 'PUT' : 'POST'
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          method === 'POST' 
            ? { action: 'create', data: formData }
            : formData
        ),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar música')
      }

      alertaSucesso(
        `Música ${initialData?.id ? "atualizada" : "cadastrada"} com sucesso!`
      )
      
      if (onSave) {
        onSave()
      } else {
        router.push('/musicas')
        router.refresh()
      }
    } catch (error) {
      console.error('Erro ao salvar música:', error)
      alertaErro('Erro ao salvar música')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-6 space-y-2">
          <label htmlFor="titulo" className="block text-sm font-medium text-white flex items-center">
            <Music2 className="h-5 w-5 mr-2 text-purple-400" />
            Título da Música *
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
            placeholder="Digite o título da música"
            required
          />
        </div>

        <div className="md:col-span-6 space-y-2">
          <label htmlFor="artista" className="block text-sm font-medium text-white flex items-center">
            <User className="h-5 w-5 mr-2 text-purple-400" />
            Artista/Banda *
          </label>
          <input
            type="text"
            id="artista"
            name="artista"
            value={formData.artista}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
            placeholder="Nome do artista ou banda"
            required
          />
        </div>

        <div className="md:col-span-4 space-y-2">
          <label htmlFor="genero" className="block text-sm font-medium text-white flex items-center">
            <Tag className="h-5 w-5 mr-2 text-purple-400" />
            Gênero
          </label>
          <select
            id="genero"
            name="genero"
            value={formData.genero}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
          >
            <option value="">Selecione um gênero</option>
            {generos.map(genero => (
              <option key={genero} value={genero}>{genero}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-4 space-y-2">
          <label htmlFor="duracao" className="block text-sm font-medium text-white flex items-center">
            <Clock className="h-5 w-5 mr-2 text-purple-400" />
            Duração
          </label>
          <input
            type="text"
            id="duracao"
            name="duracao"
            value={formData.duracao}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
            placeholder="Ex: 4:30"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label htmlFor="tom" className="block text-sm font-medium text-white flex items-center">
            <Hash className="h-5 w-5 mr-2 text-purple-400" />
            Tom
          </label>
          <input
            type="text"
            id="tom"
            name="tom"
            value={formData.tom}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
            placeholder="Ex: C"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label htmlFor="bpm" className="block text-sm font-medium text-white flex items-center">
            <Activity className="h-5 w-5 mr-2 text-purple-400" />
            BPM
          </label>
          <input
            type="text"
            id="bpm"
            name="bpm"
            value={formData.bpm}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
            placeholder="Ex: 120"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-white flex items-center">
          <Music2 className="h-5 w-5 mr-2 text-purple-400" />
          Bandas
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.isArray(bandas) && bandas.map((banda) => (
            <div
              key={banda.id}
              className={`
                relative flex items-center p-4 rounded-xl border
                ${formData.bandas?.includes(banda.id)
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-white/20 bg-gray-800/50'}
                hover:border-purple-500/50 transition-all duration-200
                cursor-pointer group
              `}
              onClick={() => handleBandasChange(banda.id)}
            >
              <div className="flex-1">
                <h3 className="font-medium text-white">{banda.nome}</h3>
                <p className="text-sm text-gray-400">{banda.genero}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-6 space-y-2">
          <label htmlFor="link_letra" className="block text-sm font-medium text-white flex items-center">
            <FileText className="h-5 w-5 mr-2 text-purple-400" />
            Link da Letra
          </label>
          <input
            type="text"
            id="link_letra"
            name="link_letra"
            value={formData.link_letra}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
            placeholder="URL da letra"
          />
        </div>

        <div className="md:col-span-6 space-y-2">
          <label htmlFor="link_cifra" className="block text-sm font-medium text-white flex items-center">
            <FileMusic className="h-5 w-5 mr-2 text-purple-400" />
            Link da Cifra
          </label>
          <input
            type="text"
            id="link_cifra"
            name="link_cifra"
            value={formData.link_cifra}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
            placeholder="URL da cifra"
          />
        </div>

        <div className="md:col-span-6 space-y-2">
          <label htmlFor="link_mp3" className="block text-sm font-medium text-white flex items-center">
            <LinkIcon className="h-5 w-5 mr-2 text-purple-400" />
            Link do MP3
          </label>
          <input
            type="text"
            id="link_mp3"
            name="link_mp3"
            value={formData.link_mp3}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
            placeholder="URL do MP3"
          />
        </div>

        <div className="md:col-span-6 space-y-2">
          <label htmlFor="link_vs" className="block text-sm font-medium text-white flex items-center">
            <Video className="h-5 w-5 mr-2 text-purple-400" />
            Link do VS
          </label>
          <input
            type="text"
            id="link_vs"
            name="link_vs"
            value={formData.link_vs}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
            placeholder="URL do VS"
          />
        </div>

        <div className="md:col-span-12 space-y-2">
          <label htmlFor="status_vs" className="block text-sm font-medium text-white flex items-center">
            <Tag className="h-5 w-5 mr-2 text-purple-400" />
            Status do VS
          </label>
          <select
            id="status_vs"
            name="status_vs"
            value={formData.status_vs}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
          >
            {statusVS.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="observacoes" className="block text-sm font-medium text-white flex items-center">
          <FileText className="h-5 w-5 mr-2 text-purple-400" />
          Observações
        </label>
        <textarea
          id="observacoes"
          name="observacoes"
          value={formData.observacoes}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                   focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                   transition-all duration-200 ease-in-out px-3 py-2"
          rows={4}
          placeholder="Descreva detalhes sobre a música"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 rounded-xl border border-white/20 text-sm text-white hover:bg-white/10
                   focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 ease-in-out
                   font-medium flex items-center justify-center"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-indigo-500 text-sm text-white hover:bg-indigo-600
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900
                   transition-all duration-200 ease-in-out font-medium shadow-lg shadow-indigo-500/20
                   flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
              Salvando...
            </>
          ) : initialData ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  )
} 