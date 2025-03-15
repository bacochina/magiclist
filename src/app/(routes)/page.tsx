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
  ListMusic 
} from 'lucide-react';

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

export default function Home() {
  const [recentEvents, setRecentEvents] = useState([
    { 
      title: 'Aniversário de João', 
      subtitle: 'Banda: Rock Stars', 
      date: 'Hoje', 
      icon: <Calendar size={18} /> 
    },
    { 
      title: 'Festa de Formatura', 
      subtitle: 'Banda: Electric Sound', 
      date: 'Amanhã', 
      icon: <Calendar size={18} /> 
    },
    { 
      title: 'Casamento Silva', 
      subtitle: 'Banda: Acoustic Trio', 
      date: '25/03', 
      icon: <Calendar size={18} /> 
    },
  ]);

  const [recentSongs, setRecentSongs] = useState([
    { 
      title: 'Bohemian Rhapsody', 
      subtitle: 'Queen', 
      date: 'Há 2 dias', 
      icon: <Music2 size={18} /> 
    },
    { 
      title: 'Sweet Child O\' Mine', 
      subtitle: 'Guns N\' Roses', 
      date: 'Há 3 dias', 
      icon: <Music2 size={18} /> 
    },
    { 
      title: 'Nothing Else Matters', 
      subtitle: 'Metallica', 
      date: 'Há 5 dias', 
      icon: <Music2 size={18} /> 
    },
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-gray-400">Bem-vindo ao MagicList, gerencie seus eventos musicais.</p>
      </div>

      {/* Grid de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Eventos Totais" 
          value="48" 
          icon={<Calendar size={20} />} 
          change="12%" 
          changeType="up"
          subtitle="Último mês"
        />
        <StatCard 
          title="Músicas Cadastradas" 
          value="1,234" 
          icon={<Music2 size={20} />} 
          change="5%" 
          changeType="up"
        />
        <StatCard 
          title="Integrantes" 
          value="22" 
          icon={<Users size={20} />} 
          change="2" 
          changeType="up"
          subtitle="Novos integrantes"
        />
        <StatCard 
          title="Tempo Médio de Evento" 
          value="3.5h" 
          icon={<Clock size={20} />} 
          change="30min" 
          changeType="down"
        />
      </div>

      {/* Gráficos e listas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ChartCard 
            title="Eventos Mensais" 
            subtitle="Últimos 12 meses"
          />
        </div>
        <div>
          <RecentItemsList title="Próximos Eventos" items={recentEvents} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <RecentItemsList title="Músicas Recentes" items={recentSongs} />
        </div>
        <div className="lg:col-span-2">
          <ChartCard 
            title="Blocos por Gênero" 
            subtitle="Distribuição de repertório"
          />
        </div>
      </div>
    </div>
  );
} 