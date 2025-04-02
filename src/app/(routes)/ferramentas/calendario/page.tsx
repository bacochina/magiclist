"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, List, LayoutGrid, ChevronLeft, ChevronRight, Mic2, Clock, MapPin, ArrowUpDown, ArrowLeft, Music, MoreHorizontal, Sun, Moon, PlusCircle, Sparkles, CalendarDays, Filter, X, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { 
  format, 
  addMonths, 
  subMonths, 
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addYears,
  subYears,
  startOfMonth, 
  endOfMonth, 
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  startOfYear,
  endOfYear,
  eachDayOfInterval, 
  eachMonthOfInterval,
  eachWeekOfInterval,
  isSameMonth, 
  isSameDay, 
  isSameYear,
  parseISO, 
  isToday,
  getWeek
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Show {
  id: string;
  data: string;
  local: string;
  status: string;
  banda: {
    nome: string;
  };
  bandas?: {
    nome: string;
  };
}

export default function CalendarioPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [shows, setShows] = useState<Show[]>([]);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'year' | 'list'>('month');
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterLocal, setFilterLocal] = useState<string | null>(null);
  const [locaisDisponiveis, setLocaisDisponiveis] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/eventos/shows');
        const data = await response.json();
        setShows(data);
        
        // Extrair locais únicos
        const locais = [...new Set(data.map((show: Show) => show.local))].filter(
          (local): local is string => typeof local === 'string' && local.length > 0
        );
        setLocaisDisponiveis(locais);
      } catch (error) {
        console.error('Erro ao carregar shows:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShows();
    
    // Detectar preferência de tema do sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    
    // Adicionar classe dark ao html quando o modo escuro estiver ativo
    const applyDarkMode = (isDark: boolean) => {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    
    applyDarkMode(prefersDark);
    
    // Observar mudanças na preferência de tema do sistema
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleDarkModeChange = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches);
      applyDarkMode(e.matches);
    };
    
    darkModeMediaQuery.addEventListener('change', handleDarkModeChange);
    
    return () => {
      darkModeMediaQuery.removeEventListener('change', handleDarkModeChange);
    };
  }, []);
  
  // Atualizar a classe dark no html quando darkMode mudar
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const navigateToEditShow = (id: string) => {
    router.push(`/eventos/shows/${id}/editar`);
  };

  const navigateToAddShow = () => {
    router.push('/eventos/shows/novo');
  };

  const handlePrev = () => {
    switch (viewMode) {
      case 'day':
        setCurrentDate(subDays(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case 'year':
        setCurrentDate(subYears(currentDate, 1));
        break;
      default:
        setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const handleNext = () => {
    switch (viewMode) {
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case 'year':
        setCurrentDate(addYears(currentDate, 1));
        break;
      default:
        setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const formatHeaderTitle = () => {
    switch (viewMode) {
      case 'day':
        return format(currentDate, "dd 'de' MMMM 'de' yyyy - EEEE", { locale: ptBR });
      case 'week':
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
        return `${format(weekStart, "dd/MM", { locale: ptBR })} - ${format(weekEnd, "dd/MM/yyyy", { locale: ptBR })}`;
      case 'month':
        return format(currentDate, 'MMMM yyyy', { locale: ptBR });
      case 'year':
        return format(currentDate, 'yyyy', { locale: ptBR });
      default:
        return format(currentDate, 'MMMM yyyy', { locale: ptBR });
    }
  };

  // Funções auxiliares para obter intervalos de datas
  const getDaysInMonth = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  };

  const getDaysInWeek = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  };

  const getMonthsInYear = () => {
    const yearStart = startOfYear(currentDate);
    const yearEnd = endOfYear(currentDate);
    return eachMonthOfInterval({ start: yearStart, end: yearEnd });
  };

  // Funções para filtrar shows por período
  const getShowsForDay = (day: Date) => {
    return shows.filter(show => {
      const showDate = parseISO(show.data);
      return isSameDay(showDate, day);
    });
  };

  const getShowsForMonth = (month: Date) => {
    return shows.filter(show => {
      const showDate = parseISO(show.data);
      return isSameMonth(showDate, month) && isSameYear(showDate, month);
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Função para filtrar shows com base nos filtros ativos
  const filterShows = (shows: Show[]) => {
    let filteredShows = [...shows];
    
    if (filterStatus) {
      filteredShows = filteredShows.filter(show => 
        show.status?.toLowerCase() === filterStatus.toLowerCase()
      );
    }
    
    if (filterLocal) {
      filteredShows = filteredShows.filter(show => 
        show.local === filterLocal
      );
    }
    
    return filteredShows;
  };

  // Função para obter cores baseadas no status do show
  function getStatusColors(status: string | undefined, isDarkMode: boolean) {
    if (!status) {
      return {
        bg: isDarkMode ? 'bg-gray-700' : 'bg-gray-200',
        text: isDarkMode ? 'text-gray-300' : 'text-gray-700',
        border: isDarkMode ? 'border-gray-600' : 'border-gray-300',
        hover: isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
      };
    }
    
    switch (status.toLowerCase()) {
      case 'confirmado':
        return {
          bg: isDarkMode ? 'bg-green-800/70' : 'bg-green-100',
          text: isDarkMode ? 'text-green-200' : 'text-green-800',
          border: isDarkMode ? 'border-green-700' : 'border-green-500',
          hover: isDarkMode ? 'hover:bg-green-700' : 'hover:bg-green-50'
        };
      case 'pendente':
        return {
          bg: isDarkMode ? 'bg-yellow-800/70' : 'bg-yellow-100',
          text: isDarkMode ? 'text-yellow-200' : 'text-yellow-800',
          border: isDarkMode ? 'border-yellow-700' : 'border-yellow-500',
          hover: isDarkMode ? 'hover:bg-yellow-700' : 'hover:bg-yellow-50'
        };
      case 'cancelado':
        return {
          bg: isDarkMode ? 'bg-red-800/70' : 'bg-red-100',
          text: isDarkMode ? 'text-red-200' : 'text-red-800',
          border: isDarkMode ? 'border-red-700' : 'border-red-500',
          hover: isDarkMode ? 'hover:bg-red-700' : 'hover:bg-red-50'
        };
      default:
        return {
          bg: isDarkMode ? 'bg-purple-800/70' : 'bg-purple-100',
          text: isDarkMode ? 'text-purple-200' : 'text-purple-800',
          border: isDarkMode ? 'border-purple-700' : 'border-purple-500',
          hover: isDarkMode ? 'hover:bg-purple-700' : 'hover:bg-purple-50'
        };
    }
  }

  // Renderização dos diferentes modos de visualização
  const renderDayView = () => {
    // Filtrar os shows do dia atual
    const currentDateStr = currentDate.toISOString().split('T')[0];
    const todayShows = filterShows(shows.filter(show => {
      const showDate = new Date(show.data);
      return showDate.toISOString().split('T')[0] === currentDateStr;
    }));
    
    // Array de horas do dia para exibição
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    // Agrupar shows por hora
    const showsByHour = hours.reduce((acc, hour) => {
      acc[hour] = todayShows.filter(show => {
        const showDate = new Date(show.data);
        return showDate.getHours() === hour;
      });
      return acc;
    }, {} as Record<number, any[]>);
    
    return (
      <div>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Agenda para {currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </h2>
        
        {todayShows.length > 0 ? (
          <div className="space-y-3">
            {hours.map(hour => {
              const hourShows = showsByHour[hour] || [];
              if (hourShows.length === 0) return null;
              
              return (
                <div key={hour} className={`
                  p-4 rounded-lg transition-all duration-300
                  ${darkMode 
                    ? 'bg-gray-800/80 border border-gray-700 hover:border-purple-700' 
                    : 'bg-white border border-gray-200 hover:border-purple-300 hover:shadow-md'}
                `}>
                  <div className={`font-medium text-lg mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {hour.toString().padStart(2, '0')}:00 - {(hour + 1).toString().padStart(2, '0')}:00
                  </div>
                  
                  <div className="space-y-3">
                    {hourShows.map(show => {
                      const statusColors = getStatusColors(show.status, darkMode);
                      
                      return (
                        <div 
                          key={show.id}
                          className={`
                            p-4 rounded-lg border transition-all duration-300 cursor-pointer
                            ${darkMode 
                              ? 'bg-gray-750 hover:bg-gray-700 border-gray-600' 
                              : 'bg-gray-50 hover:bg-white border-gray-200 hover:shadow-md'}
                          `}
                          onClick={() => navigateToEditShow(show.id)}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {show.bandas?.nome || show.banda?.nome}
                              </h3>
                              <div className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                <p className="flex items-center">
                                  <span className="font-medium">Local:</span>
                                  <span className="ml-2">{show.local}</span>
                                </p>
                                <p className="flex items-center mt-1">
                                  <span className="font-medium">Horário:</span>
                                  <span className="ml-2">
                                    {new Date(show.data).toLocaleTimeString('pt-BR', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </p>
                              </div>
                            </div>
                            
                            <div className={`
                              px-3 py-1.5 rounded-full text-sm font-medium
                              ${statusColors.bg} ${statusColors.text}
                            `}>
                              {show.status || "Pendente"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={`
            p-8 text-center rounded-lg border 
            ${darkMode 
              ? 'bg-gray-800/60 border-gray-700 text-gray-300' 
              : 'bg-gray-50 border-gray-200 text-gray-600'}
          `}>
            <Music className={`h-12 w-12 mx-auto mb-4 opacity-50 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <p className="text-xl font-medium">Nenhum show agendado para este dia</p>
            <button 
              onClick={() => navigateToAddShow()}
              className={`
                mt-4 px-4 py-2 rounded-lg inline-flex items-center transition-all duration-300
                ${darkMode 
                  ? 'bg-purple-700 hover:bg-purple-600 text-white' 
                  : 'bg-purple-600 hover:bg-purple-500 text-white'}
              `}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              <span>Adicionar Show</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderWeekView = () => {
    const days = getDaysInWeek();
    
    // Filtrar shows da semana atual
    const filteredShows = filterShows(shows);
    
    return (
      <div className="rounded-lg overflow-hidden border transition-all duration-300
        ${darkMode ? 'border-gray-700' : 'border-gray-200'}
      ">
        {/* Cabeçalhos dos dias da semana */}
        <div className={`grid grid-cols-7 
          ${darkMode 
            ? 'bg-gradient-to-r from-gray-800 via-gray-750 to-gray-800 border-b border-gray-700' 
            : 'bg-gradient-to-r from-purple-50 via-blue-50 to-purple-50 border-b border-gray-200'}
        `}>
          {days.map((day) => (
            <div 
              key={`header-${day.toString()}`} 
              className={`text-center py-3 transition-all duration-300 ${
                isToday(day) 
                  ? darkMode 
                    ? 'bg-blue-900/30' 
                    : 'bg-blue-100/70' 
                  : ''
              }`}
            >
              <div className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {format(day, 'EEE', { locale: ptBR })}
              </div>
              <div className={`text-2xl mt-1 transition-all duration-300
                ${isToday(day) 
                  ? 'bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto shadow-md animate-pulse' 
                  : darkMode ? 'text-white' : 'text-gray-800'
                }`}
              >
                {format(day, 'd')}
              </div>
              <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {format(day, 'MMM', { locale: ptBR })}
              </div>
            </div>
          ))}
        </div>
        
        {/* Conteúdo dos dias */}
        <div className={`grid grid-cols-7 divide-x 
          ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}
        `}>
          {days.map((day) => {
            const dayShows = filteredShows.filter(show => {
              const showDate = new Date(show.data);
              return showDate.toISOString().split('T')[0] === day.toISOString().split('T')[0];
            });
            
            const hasShows = dayShows.length > 0;
            
            return (
              <div 
                key={`content-${day.toString()}`} 
                className={`min-h-[250px] p-3 transition-all duration-300
                  ${isToday(day) 
                    ? darkMode 
                      ? 'bg-blue-900/20' 
                      : 'bg-blue-50/30'
                    : darkMode 
                      ? 'bg-gray-800/80'
                      : 'bg-white'
                  } 
                  ${darkMode 
                    ? 'hover:bg-gray-750 hover:shadow-inner' 
                    : 'hover:bg-gray-50/70 hover:shadow-sm'}
                `}
                onClick={() => {
                  if (!hasShows) {
                    setCurrentDate(day);
                    navigateToAddShow();
                  }
                }}
              >
                {hasShows ? (
                  <div className="space-y-2">
                    {dayShows.map((show) => {
                      const statusColors = getStatusColors(show.status, darkMode);
                      
                      return (
                        <div 
                          key={show.id}
                          onClick={() => navigateToEditShow(show.id)}
                          className={`p-2 rounded-md cursor-pointer text-sm transition-all duration-300 
                            hover:translate-y-[-2px] hover:shadow-md
                            border-l-3 ${statusColors.border}
                            ${darkMode
                              ? 'bg-gray-700 hover:bg-gray-650 border-t border-r border-b border-gray-600'
                              : 'bg-white hover:bg-purple-50/70 border border-purple-200 hover:border-purple-300'}
                          `}
                          title={`${show.bandas?.nome || show.banda?.nome} - ${show.local}`}
                        >
                          <div className={`font-medium truncate ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                            {show.bandas?.nome || show.banda?.nome}
                          </div>
                          <div className={`text-xs truncate mt-1 flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <MapPin className={`w-3 h-3 mr-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span>{show.local}</span>
                          </div>
                          <div className="flex justify-between items-center mt-1.5">
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {new Date(show.data).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            <div className={`text-xs px-2 py-0.5 rounded-full
                              ${statusColors.bg} ${statusColors.text}
                            `}>
                              {show.status === 'confirmado' ? 'Confirmado' : 
                               show.status === 'cancelado' ? 'Cancelado' : 'Pendente'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className={`h-full flex flex-col items-center justify-center 
                    ${darkMode ? 'text-gray-500' : 'text-gray-400'} 
                    hover:opacity-70 transition-opacity cursor-pointer`
                  }>
                    <PlusCircle className={`h-8 w-8 mb-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <span className="text-xs text-center">Clique para<br/>adicionar show</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthCalendar = () => {
    const days = getDaysInMonth();
    const monthStart = startOfMonth(currentDate);
    
    // Dias da semana começando no domingo (0)
    const daysOfWeek = Array.from({ length: 7 }, (_, i) => i);
    const firstDayOfMonth = monthStart.getDay();
    
    // Filtra os shows com base nos filtros ativos
    const filteredShows = filterShows(shows);
    
    // Função para obter shows para um dia específico usando os shows filtrados
    const getShowsForDay = (day: Date) => {
      const dayStr = day.toISOString().split('T')[0];
      return filteredShows.filter(show => {
        const showDate = new Date(show.data);
        return showDate.toISOString().split('T')[0] === dayStr;
      });
    };
    
    return (
      <div>
        {/* Dias da semana - cabeçalho */}
        <div className="grid grid-cols-7 mb-3">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
            <div key={index} className={`text-center py-2 font-semibold text-lg ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-3">
          {/* Dias vazios para alinhar com o dia da semana */}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className={`border-2 rounded-lg p-1 ${
              darkMode ? 'border-gray-700 bg-gray-800/40' : 'border-dashed border-gray-200 bg-gray-50/30'
            }`}></div>
          ))}
          
          {/* Dias do mês */}
          {days.map((day) => {
            const dayShows = getShowsForDay(day);
            const hasShows = dayShows.length > 0;
            const isCurrentDay = isToday(day);
            
            return (
              <div 
                key={day.toString()}
                className={`border-2 rounded-lg p-3 min-h-[110px] hover:shadow-lg transition-all duration-300 
                  hover:-translate-y-1 hover:scale-105 transform-gpu
                  ${darkMode
                    ? isCurrentDay
                      ? 'bg-blue-900/40 border-blue-600 ring-2 ring-blue-500'
                      : hasShows
                        ? 'bg-purple-900/30 border-purple-700 hover:border-purple-500'
                        : 'bg-gray-800 border-gray-600 hover:border-gray-500'
                    : isCurrentDay
                      ? 'bg-gradient-to-br from-blue-50 to-blue-100/80 border-blue-300 ring-2 ring-blue-300' 
                      : hasShows 
                        ? 'bg-gradient-to-br from-purple-50 to-white border-purple-300 hover:border-purple-400' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
              >
                <div className="flex justify-center mb-2">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-2xl
                    ${isCurrentDay ? 'animate-pulse' : ''}
                    ${darkMode
                      ? isCurrentDay
                        ? 'bg-blue-600 text-white shadow-lg'
                        : hasShows
                          ? 'bg-purple-800/50 text-purple-200 shadow-md'
                          : 'text-white'
                      : isCurrentDay
                        ? 'bg-blue-600 text-white shadow-md'
                        : hasShows
                          ? 'bg-purple-100 text-purple-800 shadow-sm'
                          : 'text-gray-700'
                    }
                  `}>
                    {day.getDate()}
                  </div>
                </div>
                
                <div className="space-y-2 mt-1">
                  {dayShows.slice(0, 3).map((show) => {
                    const statusColors = getStatusColors(show.status, darkMode);
                    
                    return (
                      <div 
                        key={show.id}
                        onClick={() => navigateToEditShow(show.id)}
                        className={`text-xs p-2 rounded-md cursor-pointer truncate shadow-sm transition-all duration-300 
                          hover:translate-y-[-2px] hover:shadow-md
                          border-l-4 ${statusColors.border}
                          ${darkMode
                            ? 'bg-gray-700 hover:bg-gray-600 border-t border-r border-b border-gray-600'
                            : 'bg-white hover:bg-purple-50 border-t border-r border-b border-purple-100'
                          }`}
                        title={`${show.bandas?.nome || show.banda?.nome} - ${show.local}`}
                      >
                        <div className="flex items-center">
                          <Music className={`w-3.5 h-3.5 mr-1.5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                          <span className={`font-medium truncate ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                            {show.bandas?.nome || show.banda?.nome}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  
                  {dayShows.length > 3 && (
                    <div className={`text-xs text-center mt-2 py-1.5 px-2 rounded-full font-medium 
                      ${darkMode
                        ? 'bg-purple-800/40 text-purple-200'
                        : 'bg-purple-100 text-purple-700'}
                      cursor-pointer hover:opacity-80 transition-opacity`}
                      onClick={() => {
                        setCurrentDate(day);
                        setViewMode('day');
                      }}
                    >
                      + {dayShows.length - 3} shows
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderYearView = () => {
    const months = getMonthsInYear();
    
    // Filtrar shows com base nos filtros ativos
    const filteredShows = filterShows(shows);
    
    // Função para obter shows para um mês específico
    const getShowsForMonth = (month: Date) => {
      return filteredShows.filter(show => {
        const showDate = new Date(show.data);
        return showDate.getMonth() === month.getMonth() && 
               showDate.getFullYear() === month.getFullYear();
      });
    };
    
    return (
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
        {months.map((month) => {
          const monthShows = getShowsForMonth(month);
          const hasShows = monthShows.length > 0;
          const isCurrentMonth = isSameMonth(month, new Date()) && isSameYear(month, new Date());
          
          return (
            <div 
              key={month.toString()}
              onClick={() => {
                setCurrentDate(month);
                setViewMode('month');
              }}
              className={`border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all duration-300 
                hover:-translate-y-1 hover:scale-105 transform-gpu
                ${darkMode
                  ? hasShows
                    ? 'bg-gradient-to-br from-purple-900/30 to-gray-800 border-purple-700 hover:border-purple-500'
                    : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  : hasShows
                    ? 'bg-gradient-to-br from-purple-50 to-white border-purple-200'
                    : 'bg-white border-gray-200 hover:bg-gray-50/50'
                }
                ${isCurrentMonth 
                  ? darkMode
                    ? 'ring-2 ring-blue-500'
                    : 'ring-2 ring-blue-400'
                  : ''}
              `}
            >
              <h3 className={`font-medium text-center capitalize mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {format(month, 'MMMM', { locale: ptBR })}
              </h3>
              
              {/* Mini calendário do mês */}
              <div className={`mt-3 grid grid-cols-7 gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                  <div key={`day-${i}`} className="text-center text-xs">
                    {d}
                  </div>
                ))}
                
                {Array.from({ length: new Date(month.getFullYear(), month.getMonth(), 1).getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-5"></div>
                ))}
                
                {Array.from({ length: new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate() }).map((_, i) => {
                  const day = new Date(month.getFullYear(), month.getMonth(), i + 1);
                  const dayShows = filteredShows.filter(show => {
                    const showDate = new Date(show.data);
                    return showDate.toISOString().split('T')[0] === day.toISOString().split('T')[0];
                  });
                  
                  return (
                    <div 
                      key={`day-${i + 1}`} 
                      className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] mx-auto
                        transition-all duration-200
                        ${dayShows.length > 0 
                          ? darkMode
                            ? 'bg-purple-700 text-purple-100 shadow-sm'
                            : 'bg-purple-300 text-purple-900 shadow-sm'
                          : darkMode
                            ? 'text-gray-400 hover:bg-gray-700'
                            : 'hover:bg-gray-100'
                        }
                        ${isToday(day) 
                          ? darkMode
                            ? 'ring-2 ring-blue-500 animate-pulse'
                            : 'ring-2 ring-blue-400 animate-pulse'
                          : ''
                        }
                      `}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
              
              {hasShows && (
                <div className="mt-4 text-center">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium
                    ${darkMode
                      ? 'bg-purple-800/60 text-purple-200 shadow-inner'
                      : 'bg-purple-100 text-purple-800 shadow-sm'}
                  `}>
                    {monthShows.length} {monthShows.length === 1 ? 'show' : 'shows'}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderListView = () => {
    // Filtrar e ordenar shows
    const filteredShows = filterShows(shows).sort((a, b) => 
      new Date(a.data).getTime() - new Date(b.data).getTime()
    );
    
    // Agrupar shows por mês
    const showsByMonth: Record<string, Show[]> = {};
    
    filteredShows.forEach(show => {
      const date = new Date(show.data);
      const monthKey = format(date, 'MM-yyyy');
      
      if (!showsByMonth[monthKey]) {
        showsByMonth[monthKey] = [];
      }
      
      showsByMonth[monthKey].push(show);
    });
    
    const sortedMonthKeys = Object.keys(showsByMonth).sort((a, b) => {
      const [monthA, yearA] = a.split('-').map(Number);
      const [monthB, yearB] = b.split('-').map(Number);
      
      if (yearA !== yearB) {
        return yearA - yearB;
      }
      
      return monthA - monthB;
    });
    
    if (filteredShows.length === 0) {
      return (
        <div className={`text-center py-16 rounded-lg border transition-all duration-300
          ${darkMode 
            ? 'bg-gray-800/70 border-gray-700 text-gray-300' 
            : 'bg-gray-50/50 border-gray-200 text-gray-700'}
        `}>
          <CalendarIcon className={`mx-auto w-12 h-12 mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className="text-xl font-medium">Nenhum show cadastrado</p>
          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Adicione shows para vê-los listados aqui
          </p>
          <button
            onClick={() => navigateToAddShow()}
            className={`mt-6 px-4 py-2 rounded-lg inline-flex items-center transition-all duration-300
              ${darkMode 
                ? 'bg-purple-700 hover:bg-purple-600 text-white' 
                : 'bg-purple-600 hover:bg-purple-500 text-white'}
            `}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            <span>Adicionar Show</span>
          </button>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {sortedMonthKeys.map(monthKey => {
          const monthShows = showsByMonth[monthKey];
          const [month, year] = monthKey.split('-');
          const monthDate = new Date(Number(year), Number(month) - 1, 1);
          
          return (
            <div key={monthKey} className="space-y-3">
              <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} 
                px-3 py-1 capitalize`}
              >
                {format(monthDate, 'MMMM yyyy', { locale: ptBR })}
              </h3>
              
              {monthShows.map((show) => {
                const showDate = new Date(show.data);
                const statusColors = getStatusColors(show.status, darkMode);
                
                return (
                  <div 
                    key={show.id} 
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-300
                      border-l-[6px] ${statusColors.border}
                      ${darkMode 
                        ? 'bg-gray-800/80 hover:bg-gray-750 border-t border-r border-b border-gray-700 hover:border-gray-600' 
                        : 'bg-white hover:bg-gray-50 border-t border-r border-b border-gray-200 hover:border-purple-200'}
                      shadow-sm hover:shadow-md hover:-translate-y-0.5
                    `}
                    onClick={() => navigateToEditShow(show.id)}
                  >
                    <div className="flex justify-between items-start gap-4 flex-wrap sm:flex-nowrap">
                      <div className="flex-grow">
                        <div className="flex items-center space-x-2 mb-1">
                          <CalendarIcon className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                          <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {format(showDate, "dd 'de' MMMM", { locale: ptBR })} • {format(showDate, "EEEE", { locale: ptBR })}
                          </span>
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {format(showDate, "HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                        
                        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {show.bandas?.nome || show.banda?.nome}
                        </h3>
                        
                        <div className={`flex items-center mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <MapPin className={`h-3.5 w-3.5 mr-1.5 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`} />
                          <p>{show.local}</p>
                        </div>
                      </div>
                      
                      <div className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap
                        ${statusColors.bg} ${statusColors.text}
                      `}>
                        {show.status === 'confirmado' ? 'Confirmado' : 
                         show.status === 'cancelado' ? 'Cancelado' : 'Pendente'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const renderCalendarContent = () => {
    switch (viewMode) {
      case 'day':
        return renderDayView();
      case 'week':
        return renderWeekView();
      case 'month':
        return renderMonthCalendar();
      case 'year':
        return renderYearView();
      case 'list':
        return renderListView();
      default:
        return renderMonthCalendar();
    }
  };

  return (
    <div className={`
      container mx-auto p-4 md:p-6 lg:p-8 transition-all duration-300 min-h-screen rounded-xl
      ${darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-800 shadow-sm'}
    `}>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center mb-4 sm:mb-0">
            <h1 className={`text-3xl font-bold mr-2 transition-colors duration-300 
              ${darkMode 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400' 
                : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'}`}
            >
              Calendário de Shows
            </h1>
            <Sparkles className={`h-6 w-6 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <button 
                onClick={() => navigateToAddShow()}
                className={`
                  flex items-center px-3 py-2 rounded-lg shadow-md transition-all duration-300
                  ${darkMode 
                    ? 'bg-purple-700 hover:bg-purple-600 active:bg-purple-800 text-white' 
                    : 'bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white'}
                `}
                title="Adicionar novo show"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                <span>Novo Show</span>
              </button>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`
                  p-2 rounded-lg shadow-md transition-all duration-300
                  ${darkMode 
                    ? 'bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white'}
                `}
                title={darkMode ? "Modo claro" : "Modo escuro"}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setCurrentDate(new Date())}
                className={`
                  p-2 rounded-lg shadow-md transition-all duration-300
                  ${darkMode 
                    ? 'bg-blue-700 hover:bg-blue-600 active:bg-blue-800 text-white' 
                    : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white'}
                `}
                title="Ir para hoje"
              >
                <CalendarDays className="h-5 w-5" />
              </button>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`
                  flex items-center px-3 py-2 rounded-lg shadow-md transition-all duration-300
                  ${(filterStatus || filterLocal) 
                    ? darkMode 
                      ? 'bg-green-700 hover:bg-green-600 active:bg-green-800 text-white' 
                      : 'bg-green-600 hover:bg-green-500 active:bg-green-700 text-white'
                    : darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-white' 
                      : 'bg-gray-600 hover:bg-gray-500 active:bg-gray-700 text-white'}
                `}
                title={showFilters ? "Esconder filtros" : "Mostrar filtros"}
              >
                <Filter className="h-4 w-4 mr-2" />
                <span>{(filterStatus || filterLocal) ? "Filtros ativos" : "Filtrar"}</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Painel de filtros */}
        {showFilters && (
          <div className={`mb-6 p-4 rounded-lg transition-all duration-300 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
          }`}>
            <h3 className={`font-medium mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Filtros</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Status do Show
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Confirmado', 'Pendente', 'Cancelado'].map(status => {
                    const isActive = filterStatus === status;
                    const statusColors = getStatusColors(status.toLowerCase(), darkMode);
                    
                    return (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(isActive ? null : status)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300
                          ${isActive ? statusColors.bg + ' ' + statusColors.text : darkMode 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                        `}
                      >
                        {status}
                        {isActive && <X className="inline-block ml-1 h-3 w-3" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Local
                </label>
                <select
                  value={filterLocal || ''}
                  onChange={(e) => setFilterLocal(e.target.value || null)}
                  className={`w-full rounded-lg px-3 py-2 border transition-colors duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500' 
                      : 'bg-white border-gray-300 text-gray-800 focus:border-blue-500'
                  }`}
                >
                  <option value="">Todos os locais</option>
                  {locaisDisponiveis.map(local => (
                    <option key={local} value={local}>{local}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {(filterStatus || filterLocal) && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setFilterStatus(null);
                    setFilterLocal(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    darkMode 
                      ? 'bg-red-700 text-white hover:bg-red-600' 
                      : 'bg-red-600 text-white hover:bg-red-500'
                  }`}
                >
                  Limpar todos os filtros
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Filtros ativos - badges */}
        {(filterStatus || filterLocal) && !showFilters && (
          <div className={`mb-4 p-3 rounded-lg transition-all duration-300 ${
            darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'
          }`}>
            <div className="flex items-center flex-wrap gap-2">
              <Info className="h-4 w-4 text-blue-500 mr-1" />
              <span className="mr-2">Filtros ativos:</span>
              
              {filterStatus && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  getStatusColors(filterStatus.toLowerCase(), darkMode).bg + ' ' + 
                  getStatusColors(filterStatus.toLowerCase(), darkMode).text
                } flex items-center`}>
                  {filterStatus}
                  <button onClick={() => setFilterStatus(null)} className="ml-1 hover:opacity-80">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {filterLocal && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  darkMode ? 'bg-blue-800/70 text-blue-200' : 'bg-blue-100 text-blue-800'
                } flex items-center`}>
                  {filterLocal}
                  <button onClick={() => setFilterLocal(null)} className="ml-1 hover:opacity-80">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className={`
          mb-6 p-5 rounded-xl shadow-lg transition-all duration-300
          ${darkMode 
            ? 'bg-gradient-to-r from-gray-800 via-gray-750 to-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'}
        `}>
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mb-4">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-2 rounded-lg transition-all duration-300 flex items-center
                ${viewMode === 'day'
                  ? darkMode
                    ? 'bg-blue-700 text-white font-medium'
                    : 'bg-blue-600 text-white font-medium'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-gray-200'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-800'
                }
                active:scale-95 transform-gpu
              `}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Dia
            </button>
            
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-2 rounded-lg transition-all duration-300 flex items-center
                ${viewMode === 'week'
                  ? darkMode
                    ? 'bg-blue-700 text-white font-medium'
                    : 'bg-blue-600 text-white font-medium'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-gray-200'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-800'
                }
                active:scale-95 transform-gpu
              `}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Semana
            </button>
            
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-2 rounded-lg transition-all duration-300 flex items-center
                ${viewMode === 'month'
                  ? darkMode
                    ? 'bg-blue-700 text-white font-medium'
                    : 'bg-blue-600 text-white font-medium'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-gray-200'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-800'
                }
                active:scale-95 transform-gpu
              `}
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Mês
            </button>
            
            <button
              onClick={() => setViewMode('year')}
              className={`px-3 py-2 rounded-lg transition-all duration-300 flex items-center
                ${viewMode === 'year'
                  ? darkMode
                    ? 'bg-blue-700 text-white font-medium'
                    : 'bg-blue-600 text-white font-medium'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-gray-200'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-800'
                }
                active:scale-95 transform-gpu
              `}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Ano
            </button>
            
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg transition-all duration-300 flex items-center
                ${viewMode === 'list'
                  ? darkMode
                    ? 'bg-blue-700 text-white font-medium'
                    : 'bg-blue-600 text-white font-medium'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-gray-200'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-800'
                }
                active:scale-95 transform-gpu
              `}
            >
              <List className="h-4 w-4 mr-2" />
              Lista
            </button>
          </div>
          
          {/* Seletor de mês e ano com navegação */}
          {(viewMode === 'month' || viewMode === 'year') && (
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  if (viewMode === 'month') {
                    newDate.setMonth(newDate.getMonth() - 1);
                  } else {
                    newDate.setFullYear(newDate.getFullYear() - 1);
                  }
                  setCurrentDate(newDate);
                }}
                className={`p-2 rounded-lg transition-all duration-300
                  ${darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-gray-200'
                    : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700'}
                  active:scale-95 transform-gpu
                `}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {viewMode === 'month' ? 
                  currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }) :
                  currentDate.getFullYear().toString()
                }
              </h2>
              
              <button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  if (viewMode === 'month') {
                    newDate.setMonth(newDate.getMonth() + 1);
                  } else {
                    newDate.setFullYear(newDate.getFullYear() + 1);
                  }
                  setCurrentDate(newDate);
                }}
                className={`p-2 rounded-lg transition-all duration-300
                  ${darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-gray-200'
                    : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700'}
                  active:scale-95 transform-gpu
                `}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
          
          {/* Navegação para visualização de dia e semana */}
          {(viewMode === 'day' || viewMode === 'week') && (
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  if (viewMode === 'day') {
                    newDate.setDate(newDate.getDate() - 1);
                  } else {
                    newDate.setDate(newDate.getDate() - 7);
                  }
                  setCurrentDate(newDate);
                }}
                className={`p-2 rounded-lg transition-all duration-300
                  ${darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-gray-200'
                    : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700'}
                  active:scale-95 transform-gpu
                `}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {viewMode === 'day' ? 
                  format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) :
                  `${format(startOfWeek(currentDate, { weekStartsOn: 0 }), "dd 'de' MMM", { locale: ptBR })} - ${format(endOfWeek(currentDate, { weekStartsOn: 0 }), "dd 'de' MMM, yyyy", { locale: ptBR })}`
                }
              </h2>
              
              <button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  if (viewMode === 'day') {
                    newDate.setDate(newDate.getDate() + 1);
                  } else {
                    newDate.setDate(newDate.getDate() + 7);
                  }
                  setCurrentDate(newDate);
                }}
                className={`p-2 rounded-lg transition-all duration-300
                  ${darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-gray-200'
                    : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700'}
                  active:scale-95 transform-gpu
                `}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className={`
        rounded-xl p-5 shadow-lg 
        ${darkMode 
          ? 'bg-gradient-to-r from-gray-800 via-gray-750 to-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'}
      `}>
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center">
              <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                darkMode ? 'border-purple-400' : 'border-purple-600'
              }`}></div>
              <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Carregando shows...
              </p>
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'day' && renderDayView()}
            {viewMode === 'week' && renderWeekView()}
            {viewMode === 'month' && renderMonthCalendar()}
            {viewMode === 'year' && renderYearView()}
            {viewMode === 'list' && renderListView()}
          </>
        )}
      </div>
      
      {/* Exibe total de shows no sistema */}
      <div className={`
        mt-8 p-4 rounded-xl shadow-md transition-all duration-300 text-center
        ${darkMode 
          ? 'bg-gradient-to-r from-purple-900/30 via-purple-800/20 to-purple-900/30 border border-purple-800/50' 
          : 'bg-gradient-to-r from-purple-50 via-white to-purple-50 border border-purple-200'}
      `}>
        <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          {shows.length} shows cadastrados no sistema
        </p>
        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Última atualização: {new Date().toLocaleString('pt-BR')}
        </p>
      </div>
    </div>
  );
} 