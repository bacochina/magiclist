"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart2, 
  Calendar, 
  Music2, 
  Users, 
  TrendingUp, 
  Clock, 
  ListMusic,
  PieChart,
  LineChart,
  Layers
} from 'lucide-react';
import { Button } from "@/components/ui/button";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Registrando os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Componente de cartão de estatística
const StatCard = ({ title, value, icon, change, changeType = "up", subtitle }: { 
  title: string; 
  value: string; 
  icon: React.ReactNode;
  change?: string;
  changeType?: "up" | "down";
  subtitle?: string;
}) => (
  <div className="stat-card relative overflow-hidden">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <div className="text-2xl font-bold text-white">{value}</div>
        {subtitle && <div className="text-sm text-gray-400 mt-1">{subtitle}</div>}
      </div>
      <div className="p-2 rounded-md bg-gray-700 text-purple-400">
        {icon}
      </div>
    </div>
    {change && (
      <div className={`text-sm ${changeType === "up" ? "text-green-500" : "text-red-500"} flex items-center`}>
        {changeType === "up" ? (
          <TrendingUp size={14} className="mr-1" />
        ) : (
          <TrendingUp size={14} className="mr-1 transform rotate-180" />
        )}
        {change} {changeType === "up" ? "aumento" : "redução"}
      </div>
    )}
  </div>
);

// Componente de cartão de gráfico (simulado)
const ChartCard = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <div className="chart-container">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-gray-200 font-medium">{title}</h3>
          {subtitle && <div className="text-sm text-gray-400">{subtitle}</div>}
        </div>
      </div>
      <div className="h-56 bg-gray-800 rounded-md flex items-center justify-center">
        <div className="w-full h-full px-4 py-2 flex items-end">
          {/* Simulação de gráficos com barras */}
          {Array.from({ length: 12 }).map((_, i) => {
            // Determinar qual cor usar baseado no índice
            const colorIndex = (i % 4) + 1; // Alterna entre 1, 2, 3, 4
            
            return (
              <div 
                key={i}
                className="w-full mx-1"
                style={{ height: `${Math.random() * 70 + 20}%` }}
              >
                <div 
                  className="w-full h-full rounded-t-md"
                  data-chart-color={colorIndex}
                  style={{ opacity: 0.7 + Math.random() * 0.3 }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Componente para lista de itens recentes
const RecentItemsList = ({ title, items }: { title: string; items: any[] }) => (
  <div className="dashboard-card">
    <h3 className="text-gray-200 font-medium mb-3">{title}</h3>
    <div className="divide-y divide-gray-700">
      {items.map((item, index) => (
        <div key={index} className="py-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-gray-700 text-purple-400 mr-3">
              {item.icon}
            </div>
            <div>
              <div className="text-white font-medium">{item.title}</div>
              <div className="text-gray-400 text-sm">{item.subtitle}</div>
            </div>
          </div>
          <div className="text-sm text-gray-400">{item.date}</div>
        </div>
      ))}
    </div>
    <div className="mt-4">
      <Link 
        href={"/eventos"} 
        className="text-purple-400 text-sm font-medium hover:text-purple-300 flex items-center"
      >
        Ver todos
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  </div>
);

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Home() {
  const [chartType1, setChartType1] = useState<'bar' | 'line'>('bar');
  const [chartType2, setChartType2] = useState<'pie' | 'doughnut'>('pie');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEventos: 0,
    totalBandas: 0,
    totalMusicas: 0,
    totalIntegrantes: 0
  });

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
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        padding: 12,
        displayColors: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          padding: 8,
          callback: function(value: any) {
            return value + ' itens';
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          padding: 8
        }
      }
    }
  };

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setStats({
        totalEventos: 30,
        totalBandas: 5,
        totalMusicas: 150,
        totalIntegrantes: 25
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  // Dados simulados para os gráficos
  const dadosMensais = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'Shows',
        data: [4, 6, 8, 5, 7, 9, 8, 7, 6, 8, 9, 7],
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1
      },
      {
        label: 'Ensaios',
        data: [8, 7, 9, 8, 6, 7, 8, 9, 8, 7, 8, 9],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        label: 'Músicas',
        data: [12, 15, 14, 16, 15, 17, 16, 18, 17, 19, 18, 20],
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 1
      }
    ]
  };

  const dadosDistribuicao = {
    labels: ['Shows', 'Ensaios', 'Músicas', 'Integrantes'],
    datasets: [{
      data: [30, 45, 150, 25],
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(52, 211, 153, 0.8)'
      ],
      borderColor: [
        'rgb(99, 102, 241)',
        'rgb(59, 130, 246)',
        'rgb(147, 51, 234)',
        'rgb(52, 211, 153)'
      ],
      borderWidth: 1
    }]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Visão geral do seu sistema musical</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total de Eventos"
              value={stats.totalEventos.toString()}
              icon={<Calendar className="h-6 w-6" />}
              change="15%"
              changeType="up"
            />
            <StatCard
              title="Bandas"
              value={stats.totalBandas.toString()}
              icon={<Users className="h-6 w-6" />}
              change="20%"
              changeType="up"
            />
            <StatCard
              title="Músicas"
              value={stats.totalMusicas.toString()}
              icon={<Music2 className="h-6 w-6" />}
              change="10%"
              changeType="up"
            />
            <StatCard
              title="Integrantes"
              value={stats.totalIntegrantes.toString()}
              icon={<Users className="h-6 w-6" />}
              change="5%"
              changeType="up"
            />
          </div>

          {/* Seção de Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Gráfico 1: Atividades por Mês */}
            <div className="bg-gray-800/60 rounded-xl border border-gray-700 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <BarChart2 className="mr-2 text-blue-400" /> Atividades por Mês
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant={chartType1 === 'bar' ? 'primary' : 'secondary'}
                    size="sm"
                    className={`
                      ${chartType1 === 'bar' 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                      }
                      border border-gray-600
                    `}
                    onClick={() => setChartType1('bar')}
                  >
                    <BarChart2 className="w-4 h-4 mr-1" />
                    Barras
                  </Button>
                  <Button
                    variant={chartType1 === 'line' ? 'primary' : 'secondary'}
                    size="sm"
                    className={`
                      ${chartType1 === 'line' 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                      }
                      border border-gray-600
                    `}
                    onClick={() => setChartType1('line')}
                  >
                    <LineChart className="w-4 h-4 mr-1" />
                    Linha
                  </Button>
                </div>
              </div>
              <div className="h-80">
                {chartType1 === 'bar' ? (
                  <Bar
                    data={dadosMensais}
                    options={{
                      ...commonOptions,
                      plugins: {
                        ...commonOptions.plugins,
                        title: {
                          display: true,
                          text: 'Distribuição de Atividades por Mês',
                          color: 'rgba(255, 255, 255, 0.9)',
                          font: {
                            size: 16
                          }
                        }
                      }
                    }}
                  />
                ) : (
                  <Line
                    data={{
                      ...dadosMensais,
                      datasets: dadosMensais.datasets.map(dataset => ({
                        ...dataset,
                        tension: 0.4,
                        fill: true,
                        backgroundColor: dataset.backgroundColor.replace('0.5', '0.1')
                      }))
                    }}
                    options={{
                      ...commonOptions,
                      plugins: {
                        ...commonOptions.plugins,
                        title: {
                          display: true,
                          text: 'Tendência de Atividades por Mês',
                          color: 'rgba(255, 255, 255, 0.9)',
                          font: {
                            size: 16
                          }
                        }
                      }
                    }}
                  />
                )}
              </div>
            </div>

            {/* Gráfico 2: Distribuição Geral */}
            <div className="bg-gray-800/60 rounded-xl border border-gray-700 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <PieChart className="mr-2 text-purple-400" /> Distribuição Geral
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant={chartType2 === 'pie' ? 'primary' : 'secondary'}
                    size="sm"
                    className={`
                      ${chartType2 === 'pie' 
                        ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                      }
                      border border-gray-600
                    `}
                    onClick={() => setChartType2('pie')}
                  >
                    <PieChart className="w-4 h-4 mr-1" />
                    Pizza
                  </Button>
                  <Button
                    variant={chartType2 === 'doughnut' ? 'primary' : 'secondary'}
                    size="sm"
                    className={`
                      ${chartType2 === 'doughnut' 
                        ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                      }
                      border border-gray-600
                    `}
                    onClick={() => setChartType2('doughnut')}
                  >
                    <Layers className="w-4 h-4 mr-1" />
                    Rosca
                  </Button>
                </div>
              </div>
              <div className="h-80">
                <Pie
                  data={dadosDistribuicao}
                  options={{
                    ...commonOptions,
                    plugins: {
                      ...commonOptions.plugins,
                      title: {
                        display: true,
                        text: 'Distribuição Geral de Itens',
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: {
                          size: 16
                        }
                      }
                    },
                    cutout: chartType2 === 'doughnut' ? '50%' : undefined
                  }}
                />
              </div>
            </div>
          </div>

          {/* Última atualização */}
          <div className="text-center text-gray-400 text-sm">
            Última atualização: {new Date().toLocaleDateString('pt-BR', { 
              day: '2-digit', month: '2-digit', year: 'numeric', 
              hour: '2-digit', minute: '2-digit' 
            })}
          </div>
        </>
      )}
    </div>
  );
} 