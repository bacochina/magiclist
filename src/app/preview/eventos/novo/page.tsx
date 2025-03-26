'use client';

import { Calendar, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableIcon, Grid } from 'lucide-react';

// Criando uma página de formulário simples
export default function NovoEventoPreview() {
  return (
    <div className="container mx-auto p-6">
      <div className="space-y-1 mb-8">
        <h1 className="text-4xl font-bold text-white">Novo Evento</h1>
        <p className="text-sm text-zinc-400">
          Agende um novo evento para sua banda
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="stat-card group relative overflow-hidden p-3 bg-gradient-to-r from-gray-800 to-gray-800/95 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 hover:shadow-purple-900/20 hover:border-purple-500/30 flex flex-1 items-center justify-between min-w-[200px]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-purple-700/20 text-purple-400 ring-1 ring-purple-500/30 shadow-inner shadow-purple-600/10">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="text-xs text-gray-400">eventos</div>
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-purple-200 group-hover:to-purple-400 transition-colors duration-300">8</div>
        </div>

        <div className="stat-card group relative overflow-hidden p-3 bg-gradient-to-r from-gray-800 to-gray-800/95 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 hover:shadow-indigo-900/20 hover:border-indigo-500/30 flex flex-1 items-center justify-between min-w-[200px]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-600/20 to-indigo-700/20 text-indigo-400 ring-1 ring-indigo-500/30 shadow-inner shadow-indigo-600/10">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="text-xs text-gray-400">locais</div>
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-indigo-200 group-hover:to-indigo-400 transition-colors duration-300">5</div>
        </div>

        <div className="stat-card group relative overflow-hidden p-3 bg-gradient-to-r from-gray-800 to-gray-800/95 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 hover:shadow-blue-900/20 hover:border-blue-500/30 flex flex-1 items-center justify-between min-w-[200px]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-700/20 text-blue-400 ring-1 ring-blue-500/30 shadow-inner shadow-blue-600/10">
              <Clock className="h-5 w-5" />
            </div>
            <div className="text-xs text-gray-400">horas</div>
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:to-blue-400 transition-colors duration-300">24</div>
        </div>
      </div>

      {/* Botões de alternância */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            size="sm"
            className="hidden sm:flex"
            title="Visualização em tabela"
          >
            <TableIcon className="h-4 w-4 mr-1" />
            Tabela
          </Button>
          <Button 
            variant="default"
            size="sm"
            className="hidden sm:flex"
            title="Visualização em cartões"
          >
            <Grid className="h-4 w-4 mr-1" />
            Cartões
          </Button>
        </div>
      </div>
      
      <div className="bg-slate-800 rounded-lg p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Título do Evento</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md"
            placeholder="Digite o título do evento"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Tipo</label>
          <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md">
            <option value="show">Show</option>
            <option value="ensaio">Ensaio</option>
            <option value="reuniao">Reunião</option>
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Data</label>
            <input 
              type="date" 
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Hora</label>
            <input 
              type="time" 
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Local</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md"
            placeholder="Digite o local do evento"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Descrição</label>
          <textarea 
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md min-h-[100px]"
            placeholder="Descreva o evento"
          ></textarea>
        </div>
        
        <div className="pt-4 flex justify-end space-x-3">
          <button className="px-4 py-2 rounded-md bg-slate-700 text-white">Cancelar</button>
          <button className="px-4 py-2 rounded-md bg-purple-600 text-white">Salvar</button>
        </div>
      </div>
    </div>
  );
} 