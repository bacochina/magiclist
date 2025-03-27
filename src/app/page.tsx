'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { StatCard } from '@/components/ui/stat-card'
import { 
  Music2,
  Users,
  Mic2,
  ListMusic,
  BarChart2,
  PieChart,
  ArrowRight,
  FileText,
  LineChart,
  Layers
} from 'lucide-react'
import { Bar, Line, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

// Tipos
interface Banda {
  id: string
  nome: string
  genero: string
  descricao?: string
  integrantes?: Integrante[]
}

interface Integrante {
  id: string
  nome: string
  instrumento: string
  apelido?: string
  bandas?: Banda[]
}

interface Musica {
  id: string
  titulo: string
  artista: string
  genero: string
  duracao: string
  tom: string
  bpm: string
  bandas?: Banda[]
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBandas: 0,
    totalIntegrantes: 0,
    totalMusicas: 0,
    totalGeneros: 0,
    totalInstrumentos: 0,
    bandasAtivas: 0
  })

  const [chartType1, setChartType1] = useState<'bar' | 'line'>('bar')
  const [chartType2, setChartType2] = useState<'pie' | 'doughnut'>('pie')

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        // Buscar bandas
        const bandasRes = await fetch('/api/bandas/', { method: 'GET' })
        const bandasData = await bandasRes.json()
        const bandas = bandasData.data || []

        // Buscar integrantes
        const integrantesRes = await fetch('/api/integrantes/', { method: 'GET' })
        const integrantes = await integrantesRes.json() || []

        // Buscar músicas
        const musicasRes = await fetch('/api/musicas/', { method: 'GET' })
        const musicas = await musicasRes.json() || []

        // Calcular estatísticas
        const generosUnicos = new Set([
          ...bandas.map((b: Banda) => b.genero),
          ...musicas.map((m: Musica) => m.genero)
        ].filter(Boolean))

        const instrumentosUnicos = new Set(
          integrantes.map((i: Integrante) => i.instrumento).filter(Boolean)
        )

        // Bandas ativas são aquelas que têm integrantes ou músicas
        const bandasAtivas = bandas.filter((banda: Banda) => {
          const temIntegrantes = banda.integrantes && banda.integrantes.length > 0
          const temMusicas = musicas.some((musica: Musica) => 
            musica.bandas?.some(b => b.id === banda.id)
          )
          return temIntegrantes || temMusicas
        }).length

        setStats({
          totalBandas: bandas.length,
          totalIntegrantes: integrantes.length,
          totalMusicas: musicas.length,
          totalGeneros: generosUnicos.size,
          totalInstrumentos: instrumentosUnicos.size,
          bandasAtivas
        })

      } catch (error) {
        console.error("Erro ao buscar dados:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Configurações comuns para os gráficos
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12
          }
        }
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">Visão geral do seu projeto musical</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total de Bandas"
              value={stats.totalBandas}
              icon={<Music2 className="h-6 w-6 text-purple-400" />}
              trend={null}
              color="border-purple-900/40"
            />
            <StatCard
              title="Integrantes"
              value={stats.totalIntegrantes}
              icon={<Users className="h-6 w-6 text-blue-400" />}
              trend={null}
              color="border-blue-900/40"
            />
            <StatCard
              title="Músicas"
              value={stats.totalMusicas}
              icon={<ListMusic className="h-6 w-6 text-green-400" />}
              trend={null}
              color="border-green-900/40"
            />
            <StatCard
              title="Gêneros Musicais"
              value={stats.totalGeneros}
              icon={<Mic2 className="h-6 w-6 text-indigo-400" />}
              trend={null}
              color="border-indigo-900/40"
            />
            <StatCard
              title="Instrumentos"
              value={stats.totalInstrumentos}
              icon={<Music2 className="h-6 w-6 text-pink-400" />}
              trend={null}
              color="border-pink-900/40"
            />
            <StatCard
              title="Bandas Ativas"
              value={stats.bandasAtivas}
              icon={<Music2 className="h-6 w-6 text-yellow-400" />}
              trend={null}
              color="border-yellow-900/40"
            />
          </div>
          
          {/* Links Rápidos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Bandas */}
            <Link href="/bandas" className="bg-gray-800/60 rounded-xl border border-purple-900/40 p-6 shadow-lg hover:bg-gray-800/80 transition-all">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Music2 className="mr-2 text-purple-400" /> Bandas
                </h2>
                <ArrowRight className="h-5 w-5 text-purple-400" />
              </div>
              <p className="text-sm text-gray-400">
                Gerencie suas bandas e projetos musicais
              </p>
            </Link>

            {/* Integrantes */}
            <Link href="/integrantes" className="bg-gray-800/60 rounded-xl border border-blue-900/40 p-6 shadow-lg hover:bg-gray-800/80 transition-all">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Users className="mr-2 text-blue-400" /> Integrantes
                </h2>
                <ArrowRight className="h-5 w-5 text-blue-400" />
              </div>
              <p className="text-sm text-gray-400">
                Gerencie seus músicos e membros da equipe
              </p>
            </Link>

            {/* Músicas */}
            <Link href="/musicas" className="bg-gray-800/60 rounded-xl border border-green-900/40 p-6 shadow-lg hover:bg-gray-800/80 transition-all">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <ListMusic className="mr-2 text-green-400" /> Músicas
                </h2>
                <ArrowRight className="h-5 w-5 text-green-400" />
              </div>
              <p className="text-sm text-gray-400">
                Gerencie seu repertório musical
              </p>
            </Link>
          </div>

          {/* Seção de Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico 1: Distribuição por Tipo */}
            <div className="bg-gray-800/60 rounded-xl border border-gray-700 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <BarChart2 className="mr-2 text-blue-400" /> Distribuição por Tipo
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setChartType1('bar')}
                    className={`px-3 py-1 rounded text-sm ${
                      chartType1 === 'bar'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    <BarChart2 className="w-4 h-4 inline-block mr-1" />
                    Barras
                  </button>
                  <button
                    onClick={() => setChartType1('line')}
                    className={`px-3 py-1 rounded text-sm ${
                      chartType1 === 'line'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    <LineChart className="w-4 h-4 inline-block mr-1" />
                    Linha
                  </button>
                </div>
              </div>
              <div className="h-80">
                {chartType1 === 'bar' ? (
                  <Bar
                    data={{
                      labels: ['Bandas', 'Integrantes', 'Músicas'],
                      datasets: [
                        {
                          label: 'Total',
                          data: [stats.totalBandas, stats.totalIntegrantes, stats.totalMusicas],
                          backgroundColor: [
                            'rgba(147, 51, 234, 0.5)',
                            'rgba(59, 130, 246, 0.5)',
                            'rgba(34, 197, 94, 0.5)'
                          ]
                        }
                      ]
                    }}
                    options={commonOptions}
                  />
                ) : (
                  <Line
                    data={{
                      labels: ['Bandas', 'Integrantes', 'Músicas'],
                      datasets: [
                        {
                          label: 'Total',
                          data: [stats.totalBandas, stats.totalIntegrantes, stats.totalMusicas],
                          borderColor: 'rgb(99, 102, 241)',
                          tension: 0.4
                        }
                      ]
                    }}
                    options={commonOptions}
                  />
                )}
              </div>
            </div>

            {/* Gráfico 2: Distribuição de Recursos */}
            <div className="bg-gray-800/60 rounded-xl border border-gray-700 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <PieChart className="mr-2 text-purple-400" /> Distribuição de Recursos
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setChartType2('pie')}
                    className={`px-3 py-1 rounded text-sm ${
                      chartType2 === 'pie'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    <PieChart className="w-4 h-4 inline-block mr-1" />
                    Pizza
                  </button>
                  <button
                    onClick={() => setChartType2('doughnut')}
                    className={`px-3 py-1 rounded text-sm ${
                      chartType2 === 'doughnut'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    <Layers className="w-4 h-4 inline-block mr-1" />
                    Rosca
                  </button>
                </div>
              </div>
              <div className="h-80">
                <Pie
                  data={{
                    labels: ['Gêneros', 'Instrumentos', 'Bandas Ativas'],
                    datasets: [
                      {
                        data: [stats.totalGeneros, stats.totalInstrumentos, stats.bandasAtivas],
                        backgroundColor: [
                          'rgba(99, 102, 241, 0.8)',
                          'rgba(236, 72, 153, 0.8)',
                          'rgba(234, 179, 8, 0.8)'
                        ]
                      }
                    ]
                  }}
                  options={{
                    ...commonOptions,
                    cutout: chartType2 === 'doughnut' ? '50%' : undefined
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
