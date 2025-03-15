'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Calendar, 
  BarChart2, 
  PieChart, 
  TrendingUp, 
  Users, 
  Clock, 
  MapPin, 
  Music, 
  FileText,
  CheckCircle,
  AlertCircle,
  Clock3,
  ArrowRight,
  LineChart,
  Layers
} from 'lucide-react';
import { Evento, Banda, TipoEvento } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Chart as ChartJS, 
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
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

// Componente de card de estatísticas
const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  color 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode; 
  trend?: { value: string; up: boolean } | null; 
  color: string 
}) => (
  <div className={`p-6 rounded-xl border ${color} bg-gray-800/60 hover:bg-gray-800/80 transition-all shadow-lg`}>
    <div className="flex items-center justify-between">
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-700/50">
        {icon}
      </div>
      {trend && (
        <div className={`text-xs flex items-center ${trend.up ? 'text-green-400' : 'text-red-400'}`}>
          <span>{trend.value}</span>
          <TrendingUp className={`h-3 w-3 ml-1 ${!trend.up && 'transform rotate-180'}`} />
        </div>
      )}
    </div>
    <h3 className="mt-4 text-gray-400 text-sm font-medium">{title}</h3>
    <div className="mt-1 text-3xl font-bold">{value}</div>
  </div>
);

// Componente de card de evento próximo
const UpcomingEventCard = ({ event, eventType }: { event: any; eventType: TipoEvento }) => {
  const formatarData = (data: string) => {
    const date = new Date(data);
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  const getEventLink = () => {
    switch (eventType) {
      case 'show': return `/eventos/shows/${event.id}`;
      case 'ensaio': return `/eventos/ensaios/${event.id}`;
      case 'reuniao': return `/eventos/reunioes/${event.id}`;
      default: return '/eventos';
    }
  };

  const getEventIcon = () => {
    switch (eventType) {
      case 'show': return <Calendar className="text-blue-400" />;
      case 'ensaio': return <Music className="text-purple-400" />;
      case 'reuniao': return <FileText className="text-green-400" />;
      default: return <Calendar className="text-blue-400" />;
    }
  };

  const getEventColor = () => {
    switch (eventType) {
      case 'show': return 'border-blue-900/40';
      case 'ensaio': return 'border-purple-900/40';
      case 'reuniao': return 'border-green-900/40';
      default: return 'border-blue-900/40';
    }
  };

  const getStatusColor = () => {
    switch (event.status) {
      case 'agendado': return 'bg-yellow-500/20 text-yellow-300';
      case 'confirmado': return 'bg-green-500/20 text-green-300';
      case 'cancelado': return 'bg-red-500/20 text-red-300';
      case 'concluido': return 'bg-blue-500/20 text-blue-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <Link href={getEventLink()} className="block">
      <div className={`p-4 rounded-lg ${getEventColor()} bg-gray-800 hover:bg-gray-750 transition-all shadow-md`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-gray-700/50 mr-3">
              {getEventIcon()}
            </div>
            <div>
              <h3 className="font-medium text-white line-clamp-1">{event.titulo || event.nome}</h3>
              <div className="flex items-center text-sm text-gray-400 mt-0.5">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                <span>{formatarData(event.data)}</span>
              </div>
            </div>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor()}`}>
            {event.status}
          </span>
        </div>
        
        <div className="flex items-center mt-3 space-x-4 text-sm">
          <div className="flex items-center text-gray-400">
            <Clock className="w-3.5 h-3.5 mr-1" />
            <span>{event.horaInicio || event.hora_inicio}</span>
          </div>
          <div className="flex items-center text-gray-400 truncate">
            <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
            <span className="truncate">{event.local || 'Local não definido'}</span>
          </div>
        </div>
        
        {event.banda && (
          <div className="mt-3 flex items-center">
            <span className="text-xs px-2 py-1 rounded-full bg-purple-900/30 text-purple-300">
              {event.banda.nome}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

// Componente principal do Dashboard
export default function EventosDashboard() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEventos: 0,
    eventosProximos: 0,
    showsProximos: 0,
    ensaiosProximos: 0,
    reunioesProximas: 0,
    bandasAtivas: 0,
    percentConcluidos: 0,
    percentCancelados: 0
  });

  // Eventos mais próximos de cada tipo
  const [proximoShow, setProximoShow] = useState<any>(null);
  const [proximoEnsaio, setProximoEnsaio] = useState<any>(null);
  const [proximaReuniao, setProximaReuniao] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Tentar buscar eventos da API
        const response = await fetch('/api/eventos');
        let eventosData;
        
        if (response.ok) {
          eventosData = await response.json();
        } else {
          // Se falhar, usar dados mockados
          eventosData = [
            // Shows
            {
              id: '1',
              titulo: 'Show de Rock',
              nome: 'Show de Rock',
              tipo: 'show' as TipoEvento,
              status: 'agendado',
              integrantesIds: [],
              data: '2025-05-20',
              horaInicio: '20:00',
              hora_inicio: '20:00',
              horaFim: '23:30',
              hora_termino: '23:30',
              local: 'Arena Show',
              banda: { id: '1', nome: 'Rock Stars' },
              descricao: 'Show especial de aniversário da casa'
            },
            {
              id: '2',
              titulo: 'Aniversário 30 Anos',
              nome: 'Aniversário 30 Anos',
              tipo: 'show' as TipoEvento,
              status: 'confirmado',
              integrantesIds: [],
              data: '2025-04-15',
              horaInicio: '21:00',
              hora_inicio: '21:00',
              horaFim: '03:00',
              hora_termino: '03:00',
              local: 'Club House',
              banda: { id: '2', nome: 'Electric Sound' },
              descricao: ''
            },
            // Ensaios
            {
              id: '6',
              titulo: 'Ensaio Semanal',
              nome: 'Ensaio Semanal',
              tipo: 'ensaio' as TipoEvento,
              status: 'agendado',
              integrantesIds: [],
              data: '2025-06-01',
              horaInicio: '19:00',
              hora_inicio: '19:00',
              horaFim: '22:00',
              hora_termino: '22:00',
              local: 'Estúdio Central',
              banda: { id: '1', nome: 'Rock Stars' },
              descricao: 'Ensaio semanal para preparação de repertório',
              pautaEnsaio: 'Revisão de novas músicas e ajustes no repertório'
            },
            {
              id: '7',
              titulo: 'Ensaio Pré-Show',
              nome: 'Ensaio Pré-Show',
              tipo: 'ensaio' as TipoEvento,
              status: 'confirmado',
              integrantesIds: [],
              data: '2025-05-18',
              horaInicio: '14:00',
              hora_inicio: '14:00',
              horaFim: '18:00',
              hora_termino: '18:00',
              local: 'Sala de Ensaio Premium',
              banda: { id: '2', nome: 'Electric Sound' },
              descricao: 'Ensaio final antes do show de aniversário',
              pautaEnsaio: 'Passar repertório completo e ajustar detalhes técnicos'
            },
            // Reuniões
            {
              id: '10',
              titulo: 'Reunião de Planejamento',
              nome: 'Reunião de Planejamento',
              tipo: 'reuniao' as TipoEvento,
              status: 'agendado',
              integrantesIds: [],
              data: '2025-06-05',
              horaInicio: '10:00',
              hora_inicio: '10:00',
              horaFim: '12:00',
              hora_termino: '12:00',
              local: 'Escritório Central',
              banda: { id: '1', nome: 'Rock Stars' },
              descricao: 'Reunião para planejamento de novo álbum',
              pautaReuniao: 'Discussão sobre orçamento, cronograma e estratégias'
            },
            {
              id: '11',
              titulo: 'Reunião com Produtora',
              nome: 'Reunião com Produtora',
              tipo: 'reuniao' as TipoEvento,
              status: 'agendado',
              integrantesIds: [],
              data: '2025-05-25',
              horaInicio: '15:00',
              hora_inicio: '15:00',
              horaFim: '16:30',
              hora_termino: '16:30',
              local: 'Estúdio Produções',
              banda: { id: '2', nome: 'Electric Sound' },
              descricao: 'Reunião para discutir detalhes do contrato',
              pautaReuniao: 'Termos contratuais, valores e datas de shows'
            }
          ];
        }
        
        setEventos(eventosData);
        
        // Calcular estatísticas
        const today = new Date();
        const proximosEventos = eventosData.filter((evento: any) => 
          new Date(evento.data) >= today &&
          (evento.status === 'agendado' || evento.status === 'confirmado')
        );
        
        const shows = eventosData.filter((evento: any) => evento.tipo === 'show');
        const ensaios = eventosData.filter((evento: any) => evento.tipo === 'ensaio');
        const reunioes = eventosData.filter((evento: any) => evento.tipo === 'reuniao');
        
        const proximosShows = shows.filter((evento: any) => 
          new Date(evento.data) >= today &&
          (evento.status === 'agendado' || evento.status === 'confirmado')
        );
        
        const proximosEnsaios = ensaios.filter((evento: any) => 
          new Date(evento.data) >= today &&
          (evento.status === 'agendado' || evento.status === 'confirmado')
        );
        
        const proximasReunioes = reunioes.filter((evento: any) => 
          new Date(evento.data) >= today &&
          (evento.status === 'agendado' || evento.status === 'confirmado')
        );
        
        const bandasUnicas = new Set(eventosData.map((e: any) => e.banda?.nome).filter(Boolean)).size;
        
        const concluidos = eventosData.filter((evento: any) => evento.status === 'concluido').length;
        const cancelados = eventosData.filter((evento: any) => evento.status === 'cancelado').length;
        const percentConcluidos = eventosData.length > 0 
          ? Math.round((concluidos / eventosData.length) * 100) 
          : 0;
        const percentCancelados = eventosData.length > 0 
          ? Math.round((cancelados / eventosData.length) * 100) 
          : 0;
        
        setStats({
          totalEventos: eventosData.length,
          eventosProximos: proximosEventos.length,
          showsProximos: proximosShows.length,
          ensaiosProximos: proximosEnsaios.length,
          reunioesProximas: proximasReunioes.length,
          bandasAtivas: bandasUnicas,
          percentConcluidos,
          percentCancelados
        });
        
        // Encontrar o próximo evento de cada tipo
        if (proximosShows.length > 0) {
          setProximoShow(proximosShows.sort((a: any, b: any) => 
            new Date(a.data).getTime() - new Date(b.data).getTime()
          )[0]);
        }
        
        if (proximosEnsaios.length > 0) {
          setProximoEnsaio(proximosEnsaios.sort((a: any, b: any) => 
            new Date(a.data).getTime() - new Date(b.data).getTime()
          )[0]);
        }
        
        if (proximasReunioes.length > 0) {
          setProximaReuniao(proximasReunioes.sort((a: any, b: any) => 
            new Date(a.data).getTime() - new Date(b.data).getTime()
          )[0]);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Distribuição de eventos por tipo
  const eventDistribution = [
    { name: 'Shows', value: eventos.filter(e => e.tipo === 'show').length },
    { name: 'Ensaios', value: eventos.filter(e => e.tipo === 'ensaio').length },
    { name: 'Reuniões', value: eventos.filter(e => e.tipo === 'reuniao').length }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard de Eventos</h1>
        <p className="text-gray-400 mt-2">Visão geral de shows, ensaios e reuniões</p>
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
              value={stats.totalEventos}
              icon={<Calendar className="h-6 w-6 text-indigo-400" />}
              trend={null}
              color="border-indigo-900/40"
            />
            <StatCard
              title="Eventos Próximos"
              value={stats.eventosProximos}
              icon={<Clock3 className="h-6 w-6 text-blue-400" />}
              trend={null}
              color="border-blue-900/40"
            />
            <StatCard
              title="Bandas Ativas"
              value={stats.bandasAtivas}
              icon={<Users className="h-6 w-6 text-purple-400" />}
              trend={null}
              color="border-purple-900/40"
            />
            <StatCard
              title="Taxa de Conclusão"
              value={`${stats.percentConcluidos}%`}
              icon={<CheckCircle className="h-6 w-6 text-green-400" />}
              trend={null}
              color="border-green-900/40"
            />
          </div>
          
          {/* Detalhes por Tipo de Evento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/60 rounded-xl border border-blue-900/40 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Calendar className="mr-2 text-blue-400" /> Shows
                </h2>
                <Link href="/eventos/shows" className="text-blue-400 hover:text-blue-300 flex items-center text-sm">
                  Ver todos <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="flex flex-col space-y-4">
                <div className="bg-gray-750 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-white mb-1">{stats.showsProximos}</div>
                  <div className="text-sm text-gray-400">Shows agendados</div>
                </div>
                {proximoShow ? (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Próximo Show</h3>
                    <UpcomingEventCard event={proximoShow} eventType="show" />
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Nenhum show agendado
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-800/60 rounded-xl border border-purple-900/40 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Music className="mr-2 text-purple-400" /> Ensaios
                </h2>
                <Link href="/eventos/ensaios" className="text-purple-400 hover:text-purple-300 flex items-center text-sm">
                  Ver todos <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="flex flex-col space-y-4">
                <div className="bg-gray-750 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-white mb-1">{stats.ensaiosProximos}</div>
                  <div className="text-sm text-gray-400">Ensaios agendados</div>
                </div>
                {proximoEnsaio ? (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Próximo Ensaio</h3>
                    <UpcomingEventCard event={proximoEnsaio} eventType="ensaio" />
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Nenhum ensaio agendado
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-800/60 rounded-xl border border-green-900/40 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <FileText className="mr-2 text-green-400" /> Reuniões
                </h2>
                <Link href="/eventos/reunioes" className="text-green-400 hover:text-green-300 flex items-center text-sm">
                  Ver todos <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="flex flex-col space-y-4">
                <div className="bg-gray-750 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-white mb-1">{stats.reunioesProximas}</div>
                  <div className="text-sm text-gray-400">Reuniões agendadas</div>
                </div>
                {proximaReuniao ? (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Próxima Reunião</h3>
                    <UpcomingEventCard event={proximaReuniao} eventType="reuniao" />
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Nenhuma reunião agendada
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Distribuição de Eventos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/60 rounded-xl border border-gray-700 p-6 shadow-lg col-span-1 lg:col-span-3">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <BarChart2 className="mr-2 text-purple-400" /> Distribuição de Eventos
              </h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                {eventDistribution.map((item) => (
                  <div key={item.name} className="bg-gray-750 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-white mb-1">{item.value}</div>
                    <div className="text-sm text-gray-400">{item.name}</div>
                    <div className="mt-2 w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          item.name === 'Shows' ? 'bg-blue-500' : 
                          item.name === 'Ensaios' ? 'bg-purple-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${eventos.length > 0 ? (item.value / eventos.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Seção de Gráficos */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Análise Gráfica de Eventos</h2>
            
            {/* Gráficos - primeira linha */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Gráfico de Barras - Eventos por Mês */}
              <div className="bg-gray-800/60 rounded-xl border border-gray-700 p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <BarChart2 className="mr-2 text-blue-400" /> Eventos por Mês
                </h3>
                <div className="h-64">
                  <Bar 
                    data={{
                      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                      datasets: [
                        {
                          label: 'Shows',
                          data: Array(12).fill(0).map((_, i) => {
                            return eventos.filter(e => 
                              e.tipo === 'show' && 
                              new Date(e.data).getMonth() === i
                            ).length;
                          }),
                          backgroundColor: 'rgba(96, 165, 250, 0.7)',
                          borderColor: 'rgb(59, 130, 246)',
                          borderWidth: 1
                        },
                        {
                          label: 'Ensaios',
                          data: Array(12).fill(0).map((_, i) => {
                            return eventos.filter(e => 
                              e.tipo === 'ensaio' && 
                              new Date(e.data).getMonth() === i
                            ).length;
                          }),
                          backgroundColor: 'rgba(167, 139, 250, 0.7)',
                          borderColor: 'rgb(139, 92, 246)',
                          borderWidth: 1
                        },
                        {
                          label: 'Reuniões',
                          data: Array(12).fill(0).map((_, i) => {
                            return eventos.filter(e => 
                              e.tipo === 'reuniao' && 
                              new Date(e.data).getMonth() === i
                            ).length;
                          }),
                          backgroundColor: 'rgba(110, 231, 183, 0.7)',
                          borderColor: 'rgb(52, 211, 153)',
                          borderWidth: 1
                        }
                      ]
                    }}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                          grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        },
                        x: {
                          ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                          grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        }
                      },
                      plugins: {
                        legend: {
                          labels: { color: 'rgba(255, 255, 255, 0.7)' }
                        }
                      }
                    }}
                  />
                </div>
              </div>
              
              {/* Gráfico de Pizza - Distribuição por Tipo */}
              <div className="bg-gray-800/60 rounded-xl border border-gray-700 p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <PieChart className="mr-2 text-purple-400" /> Distribuição por Tipo
                </h3>
                <div className="h-64 flex justify-center">
                  <Pie 
                    data={{
                      labels: ['Shows', 'Ensaios', 'Reuniões'],
                      datasets: [
                        {
                          data: [
                            eventos.filter(e => e.tipo === 'show').length,
                            eventos.filter(e => e.tipo === 'ensaio').length,
                            eventos.filter(e => e.tipo === 'reuniao').length
                          ],
                          backgroundColor: [
                            'rgba(59, 130, 246, 0.7)',
                            'rgba(139, 92, 246, 0.7)',
                            'rgba(52, 211, 153, 0.7)'
                          ],
                          borderColor: [
                            'rgb(59, 130, 246)',
                            'rgb(139, 92, 246)',
                            'rgb(52, 211, 153)'
                          ],
                          borderWidth: 1
                        }
                      ]
                    }}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: { color: 'rgba(255, 255, 255, 0.7)' }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Gráficos - segunda linha */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Linha - Tendência de Eventos */}
              <div className="bg-gray-800/60 rounded-xl border border-gray-700 p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <LineChart className="mr-2 text-yellow-400" /> Tendência de Eventos
                </h3>
                <div className="h-64">
                  <Line 
                    data={{
                      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                      datasets: [
                        {
                          label: 'Total de Eventos',
                          data: Array(12).fill(0).map((_, i) => {
                            return eventos.filter(e => 
                              new Date(e.data).getMonth() === i
                            ).length;
                          }),
                          borderColor: 'rgb(234, 179, 8)',
                          backgroundColor: 'rgba(234, 179, 8, 0.2)',
                          tension: 0.3,
                          fill: true
                        }
                      ]
                    }}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                          grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        },
                        x: {
                          ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                          grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        }
                      },
                      plugins: {
                        legend: {
                          labels: { color: 'rgba(255, 255, 255, 0.7)' }
                        }
                      }
                    }}
                  />
                </div>
              </div>
              
              {/* Gráfico Combinado (Barras e Linhas) - Status dos Eventos */}
              <div className="bg-gray-800/60 rounded-xl border border-gray-700 p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Layers className="mr-2 text-pink-400" /> Status dos Eventos
                </h3>
                <div className="h-64">
                  <Bar 
                    data={{
                      labels: ['Agendados', 'Confirmados', 'Concluídos', 'Cancelados'],
                      datasets: [
                        {
                          label: 'Quantidade',
                          data: [
                            eventos.filter(e => e.status === 'agendado').length,
                            eventos.filter(e => e.status === 'confirmado').length,
                            eventos.filter(e => e.status === 'concluido').length,
                            eventos.filter(e => e.status === 'cancelado').length
                          ],
                          backgroundColor: [
                            'rgba(251, 191, 36, 0.7)',
                            'rgba(52, 211, 153, 0.7)',
                            'rgba(59, 130, 246, 0.7)',
                            'rgba(244, 63, 94, 0.7)'
                          ],
                          borderColor: [
                            'rgb(251, 191, 36)',
                            'rgb(52, 211, 153)',
                            'rgb(59, 130, 246)',
                            'rgb(244, 63, 94)'
                          ],
                          borderWidth: 1
                        }
                      ]
                    }}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                          grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        },
                        x: {
                          ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                          grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        }
                      },
                      plugins: {
                        legend: {
                          labels: { color: 'rgba(255, 255, 255, 0.7)' }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Final do Dashboard */}
          <div className="text-center text-gray-400 text-sm mb-4">
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