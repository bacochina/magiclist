'use client';

import { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Evento, TipoEvento } from '@/lib/types';
import { format, parse, getMonth, getYear, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Registrar os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Tipos de gráficos disponíveis
type TipoGrafico = 'barra' | 'linha' | 'pizza' | 'barraLinha';

// Tipos de períodos para filtrar
type PeriodoGrafico = 'ultimos6meses' | 'ultimos12meses' | 'anoAtual' | 'todos';

// Propriedades do componente
interface EventosGraficosProps {
  eventos: Evento[];
}

// Cores para os diferentes tipos de eventos - cores mais vibrantes e harmoniosas
const coresTipoEvento: Record<TipoEvento, string> = {
  show: 'rgba(22, 163, 74, 0.75)', // Verde (green-600)
  ensaio: 'rgba(234, 88, 12, 0.75)', // Laranja (orange-600)
  reuniao: 'rgba(202, 138, 4, 0.75)', // Amarelo (yellow-600)
};

// Cores para os diferentes tipos de eventos (borda)
const coresBordaTipoEvento: Record<TipoEvento, string> = {
  show: 'rgba(22, 163, 74, 1)', // Verde (green-600)
  ensaio: 'rgba(234, 88, 12, 1)', // Laranja (orange-600)
  reuniao: 'rgba(202, 138, 4, 1)', // Amarelo (yellow-600)
};

// Cores de fundo para os cards de estatísticas
const coresBackgroundTipoEvento: Record<TipoEvento | 'total', string> = {
  total: 'rgba(75, 85, 99, 0.6)',
  show: 'rgba(22, 163, 74, 0.6)', // Verde (green-600)
  ensaio: 'rgba(234, 88, 12, 0.6)', // Laranja (orange-600)
  reuniao: 'rgba(202, 138, 4, 0.6)', // Amarelo (yellow-600)
};

export function EventosGraficos({ eventos }: EventosGraficosProps) {
  // Estados para controlar o tipo de gráfico e período
  const [tipoGrafico, setTipoGrafico] = useState<TipoGrafico>('barra');
  const [periodoGrafico, setPeriodoGrafico] = useState<PeriodoGrafico>('ultimos6meses');
  const [filtroTipoEvento, setFiltroTipoEvento] = useState<TipoEvento | 'todos'>('todos');
  
  // Estado para armazenar os dados do gráfico
  const [dadosGrafico, setDadosGrafico] = useState<ChartData<any>>({
    labels: [],
    datasets: []
  });

  // Opções do gráfico com melhor design
  const opcoesGrafico: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.9)',
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif',
            weight: '500'
          },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: 'Eventos por Mês',
        color: 'rgba(255, 255, 255, 0.9)',
        font: {
          size: 16,
          weight: 'bold',
          family: 'Inter, system-ui, sans-serif',
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: 'rgba(255, 255, 255, 1)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true,
        boxPadding: 6,
        titleFont: {
          size: 14,
          weight: 'bold',
          family: 'Inter, system-ui, sans-serif',
        },
        bodyFont: {
          size: 13,
          family: 'Inter, system-ui, sans-serif',
        },
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || context.parsed || 0;
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: tipoGrafico !== 'pizza' ? {
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 11,
            family: 'Inter, system-ui, sans-serif',
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        border: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          precision: 0,
          font: {
            size: 11,
            family: 'Inter, system-ui, sans-serif',
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        border: {
          display: false
        }
      }
    } : undefined,
    elements: {
      line: {
        tension: 0.3, // Suaviza as linhas no gráfico de linha
        borderWidth: 2,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2,
      },
      arc: {
        borderWidth: 1,
        borderColor: 'rgba(30, 41, 59, 0.8)',
        hoverBorderColor: 'white',
        hoverBorderWidth: 2,
      },
      bar: {
        borderWidth: 1,
        borderColor: 'rgba(30, 41, 59, 0.8)',
        borderRadius: 4,
        hoverBorderColor: 'white',
        hoverBorderWidth: 2,
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    },
    layout: {
      padding: 10
    }
  };

  // Função para filtrar eventos por período
  const filtrarEventosPorPeriodo = (eventos: Evento[], periodo: PeriodoGrafico): Evento[] => {
    const hoje = new Date();
    const anoAtual = getYear(hoje);
    
    switch (periodo) {
      case 'ultimos6meses': {
        const dataLimite = new Date();
        dataLimite.setMonth(dataLimite.getMonth() - 6);
        return eventos.filter(evento => {
          const dataEvento = parse(evento.data, 'yyyy-MM-dd', new Date());
          return dataEvento >= dataLimite;
        });
      }
      case 'ultimos12meses': {
        const dataLimite = new Date();
        dataLimite.setMonth(dataLimite.getMonth() - 12);
        return eventos.filter(evento => {
          const dataEvento = parse(evento.data, 'yyyy-MM-dd', new Date());
          return dataEvento >= dataLimite;
        });
      }
      case 'anoAtual':
        return eventos.filter(evento => {
          const dataEvento = parse(evento.data, 'yyyy-MM-dd', new Date());
          return getYear(dataEvento) === anoAtual;
        });
      case 'todos':
      default:
        return eventos;
    }
  };

  // Função para filtrar eventos por tipo
  const filtrarEventosPorTipo = (eventos: Evento[], tipo: TipoEvento | 'todos'): Evento[] => {
    if (tipo === 'todos') return eventos;
    return eventos.filter(evento => evento.tipo === tipo);
  };

  // Função para gerar os dados do gráfico
  const gerarDadosGrafico = () => {
    // Filtrar eventos por período e tipo
    const eventosFiltradosPorPeriodo = filtrarEventosPorPeriodo(eventos, periodoGrafico);
    const eventosFiltrados = filtrarEventosPorTipo(eventosFiltradosPorPeriodo, filtroTipoEvento);
    
    if (eventosFiltrados.length === 0) {
      setDadosGrafico({
        labels: ['Sem dados'],
        datasets: [{
          label: 'Nenhum evento encontrado',
          data: [0],
          backgroundColor: 'rgba(200, 200, 200, 0.5)',
          borderColor: 'rgba(200, 200, 200, 1)',
          borderWidth: 1
        }]
      });
      return;
    }

    // Determinar o intervalo de meses para o gráfico
    const datasEventos = eventosFiltrados.map(evento => parse(evento.data, 'yyyy-MM-dd', new Date()));
    const dataMinima = datasEventos.reduce((min, data) => data < min ? data : min, datasEventos[0]);
    const dataMaxima = datasEventos.reduce((max, data) => data > max ? data : max, datasEventos[0]);
    
    // Gerar array com todos os meses no intervalo
    const mesesIntervalo = eachMonthOfInterval({
      start: startOfMonth(dataMinima),
      end: endOfMonth(dataMaxima)
    });

    // Formatar os labels dos meses
    const labels = mesesIntervalo.map(data => format(data, 'MMM yyyy', { locale: ptBR }));

    if (tipoGrafico === 'pizza') {
      // Para gráfico de pizza, contamos eventos por tipo
      const contagem: Record<string, number> = {};
      
      if (filtroTipoEvento === 'todos') {
        // Contar por tipo de evento
        eventosFiltrados.forEach(evento => {
          contagem[evento.tipo] = (contagem[evento.tipo] || 0) + 1;
        });
        
        setDadosGrafico({
          labels: Object.keys(contagem).map(tipo => 
            tipo === 'show' ? 'Shows' : 
            tipo === 'ensaio' ? 'Ensaios' : 'Reuniões'
          ),
          datasets: [{
            label: 'Eventos por Tipo',
            data: Object.values(contagem),
            backgroundColor: Object.keys(contagem).map(tipo => coresTipoEvento[tipo as TipoEvento]),
            borderColor: Object.keys(contagem).map(tipo => coresBordaTipoEvento[tipo as TipoEvento]),
            borderWidth: 1
          }]
        });
      } else {
        // Contar por mês para um tipo específico
        mesesIntervalo.forEach(mes => {
          const mesFormatado = format(mes, 'MMM yyyy', { locale: ptBR });
          contagem[mesFormatado] = 0;
        });
        
        eventosFiltrados.forEach(evento => {
          const dataEvento = parse(evento.data, 'yyyy-MM-dd', new Date());
          const mesFormatado = format(dataEvento, 'MMM yyyy', { locale: ptBR });
          contagem[mesFormatado] = (contagem[mesFormatado] || 0) + 1;
        });
        
        setDadosGrafico({
          labels: Object.keys(contagem),
          datasets: [{
            label: filtroTipoEvento === 'show' ? 'Shows' : 
                   filtroTipoEvento === 'ensaio' ? 'Ensaios' : 'Reuniões',
            data: Object.values(contagem),
            backgroundColor: Array(Object.keys(contagem).length).fill(coresTipoEvento[filtroTipoEvento]),
            borderColor: Array(Object.keys(contagem).length).fill(coresBordaTipoEvento[filtroTipoEvento]),
            borderWidth: 1
          }]
        });
      }
    } else {
      // Para gráficos de barra ou linha
      if (filtroTipoEvento === 'todos') {
        // Separar por tipo de evento
        const tiposEvento: TipoEvento[] = ['show', 'ensaio', 'reuniao'];
        const datasets = tiposEvento.map(tipo => {
          // Contar eventos por mês para este tipo
          const contagemPorMes = mesesIntervalo.map(mes => {
            return eventosFiltrados.filter(evento => {
              const dataEvento = parse(evento.data, 'yyyy-MM-dd', new Date());
              return evento.tipo === tipo && 
                     getMonth(dataEvento) === getMonth(mes) && 
                     getYear(dataEvento) === getYear(mes);
            }).length;
          });
          
          return {
            label: tipo === 'show' ? 'Shows' : tipo === 'ensaio' ? 'Ensaios' : 'Reuniões',
            data: contagemPorMes,
            backgroundColor: coresTipoEvento[tipo],
            borderColor: coresBordaTipoEvento[tipo],
            borderWidth: 1
          };
        });
        
        setDadosGrafico({
          labels,
          datasets
        });
      } else {
        // Apenas um tipo de evento
        const contagemPorMes = mesesIntervalo.map(mes => {
          return eventosFiltrados.filter(evento => {
            const dataEvento = parse(evento.data, 'yyyy-MM-dd', new Date());
            return getMonth(dataEvento) === getMonth(mes) && 
                   getYear(dataEvento) === getYear(mes);
          }).length;
        });
        
        setDadosGrafico({
          labels,
          datasets: [{
            label: filtroTipoEvento === 'show' ? 'Shows' : 
                   filtroTipoEvento === 'ensaio' ? 'Ensaios' : 'Reuniões',
            data: contagemPorMes,
            backgroundColor: coresTipoEvento[filtroTipoEvento],
            borderColor: coresBordaTipoEvento[filtroTipoEvento],
            borderWidth: 1
          }]
        });
      }
    }
  };

  // Atualizar dados do gráfico quando mudar o tipo, período ou filtro
  useEffect(() => {
    gerarDadosGrafico();
  }, [tipoGrafico, periodoGrafico, filtroTipoEvento, eventos]);

  // Renderizar o gráfico apropriado com melhor design
  const renderizarGrafico = () => {
    switch (tipoGrafico) {
      case 'barra':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <Bar 
              data={dadosGrafico} 
              options={opcoesGrafico}
              className="max-h-full"
            />
          </div>
        );
      case 'linha':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <Line 
              data={dadosGrafico} 
              options={opcoesGrafico}
              className="max-h-full"
            />
          </div>
        );
      case 'pizza':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-3/4 h-3/4 max-w-md">
              <Pie 
                data={dadosGrafico} 
                options={opcoesGrafico}
                className="max-h-full"
              />
            </div>
          </div>
        );
      case 'barraLinha':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <Bar 
              data={{
                ...dadosGrafico,
                datasets: dadosGrafico.datasets.map((dataset, index) => ({
                  ...dataset,
                  // O primeiro dataset é barra, os outros são linha
                  type: index === 0 ? 'bar' : 'line',
                  // Ajustando as propriedades específicas para o tipo de linha
                  ...(index !== 0 && {
                    pointBackgroundColor: dataset.borderColor,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 1,
                    tension: 0.4,
                    // Suavizar borda para linhas
                    borderWidth: 2
                  })
                }))
              }}
              options={{
                ...opcoesGrafico,
                // Permitindo múltiplos tipos de gráficos
                scales: {
                  ...opcoesGrafico.scales
                }
              }}
              className="max-h-full"
            />
          </div>
        );
      default:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <Bar 
              data={dadosGrafico} 
              options={opcoesGrafico}
              className="max-h-full"
            />
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg">
      <h3 className="text-xl font-semibold text-white mb-4">Análise de Eventos</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Seletor de tipo de gráfico */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Tipo de Gráfico
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTipoGrafico('barra')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center 
                ${tipoGrafico === 'barra'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              Barras
            </button>
            <button
              onClick={() => setTipoGrafico('linha')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center 
                ${tipoGrafico === 'linha'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              Linhas
            </button>
            <button
              onClick={() => setTipoGrafico('pizza')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center 
                ${tipoGrafico === 'pizza'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              Pizza
            </button>
            <button
              onClick={() => setTipoGrafico('barraLinha')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center 
                ${tipoGrafico === 'barraLinha'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              Barra+Linha
            </button>
          </div>
        </div>
        
        {/* Seletor de período */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Período
          </label>
          <select
            value={periodoGrafico}
            onChange={(e) => setPeriodoGrafico(e.target.value as PeriodoGrafico)}
            className="block w-full rounded-xl bg-gray-700/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 font-medium"
            style={{ color: 'rgba(255, 255, 255, 0.95)' }}
          >
            <option value="ultimos6meses" className="bg-gray-800 text-white font-medium">Últimos 6 meses</option>
            <option value="ultimos12meses" className="bg-gray-800 text-white font-medium">Últimos 12 meses</option>
            <option value="anoAtual" className="bg-gray-800 text-white font-medium">Ano atual</option>
            <option value="todos" className="bg-gray-800 text-white font-medium">Todos os períodos</option>
          </select>
        </div>
        
        {/* Filtro por tipo de evento */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Tipo de Evento
          </label>
          <select
            value={filtroTipoEvento}
            onChange={(e) => setFiltroTipoEvento(e.target.value as TipoEvento | 'todos')}
            className="block w-full rounded-xl bg-gray-700/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 font-medium"
            style={{ color: 'rgba(255, 255, 255, 0.95)' }}
          >
            <option value="todos" className="bg-gray-800 text-white font-medium">Todos os tipos</option>
            <option value="show" className="bg-gray-800 text-white font-medium">Shows</option>
            <option value="ensaio" className="bg-gray-800 text-white font-medium">Ensaios</option>
            <option value="reuniao" className="bg-gray-800 text-white font-medium">Reuniões</option>
          </select>
        </div>
      </div>
      
      {/* Área do gráfico com melhor design */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 h-80 flex items-center justify-center">
        {renderizarGrafico()}
      </div>
      
      {/* Resumo estatístico com melhor design */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`rounded-lg p-3 border border-white/10 transition-all duration-300 hover:border-white/20 backdrop-blur-sm`} style={{ backgroundColor: coresBackgroundTipoEvento.total }}>
          <p className="text-xs text-gray-300 mb-1">Total de Eventos</p>
          <p className="text-xl font-bold text-white">{eventos.length}</p>
        </div>
        <div className={`rounded-lg p-3 border border-white/10 transition-all duration-300 hover:border-white/20 backdrop-blur-sm`} style={{ backgroundColor: coresBackgroundTipoEvento.show }}>
          <p className="text-xs text-gray-300 mb-1">Shows</p>
          <p className="text-xl font-bold text-white">{eventos.filter(e => e.tipo === 'show').length}</p>
        </div>
        <div className={`rounded-lg p-3 border border-white/10 transition-all duration-300 hover:border-white/20 backdrop-blur-sm`} style={{ backgroundColor: coresBackgroundTipoEvento.ensaio }}>
          <p className="text-xs text-gray-300 mb-1">Ensaios</p>
          <p className="text-xl font-bold text-white">{eventos.filter(e => e.tipo === 'ensaio').length}</p>
        </div>
        <div className={`rounded-lg p-3 border border-white/10 transition-all duration-300 hover:border-white/20 backdrop-blur-sm`} style={{ backgroundColor: coresBackgroundTipoEvento.reuniao }}>
          <p className="text-xs text-gray-300 mb-1">Reuniões</p>
          <p className="text-xl font-bold text-white">{eventos.filter(e => e.tipo === 'reuniao').length}</p>
        </div>
      </div>
    </div>
  );
} 