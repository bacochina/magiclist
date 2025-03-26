'use client';

import { Users, Layers, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableIcon, Grid } from 'lucide-react';

// Criando uma página de formulário simples para novo integrante
export default function NovoIntegrantePreview() {
  return (
    <div className="container mx-auto p-6">
      <div className="space-y-1 mb-8">
        <h1 className="text-4xl font-bold text-white">Novo Integrante</h1>
        <p className="text-sm text-zinc-400">
          Adicione um novo integrante à sua banda
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="stat-card group relative overflow-hidden p-3 bg-gradient-to-r from-gray-800 to-gray-800/95 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 hover:shadow-purple-900/20 hover:border-purple-500/30 flex flex-1 items-center justify-between min-w-[200px]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-purple-700/20 text-purple-400 ring-1 ring-purple-500/30 shadow-inner shadow-purple-600/10">
              <Users className="h-5 w-5" />
            </div>
            <div className="text-xs text-gray-400">integrantes</div>
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-purple-200 group-hover:to-purple-400 transition-colors duration-300">24</div>
        </div>

        <div className="stat-card group relative overflow-hidden p-3 bg-gradient-to-r from-gray-800 to-gray-800/95 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 hover:shadow-indigo-900/20 hover:border-indigo-500/30 flex flex-1 items-center justify-between min-w-[200px]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-600/20 to-indigo-700/20 text-indigo-400 ring-1 ring-indigo-500/30 shadow-inner shadow-indigo-600/10">
              <Layers className="h-5 w-5" />
            </div>
            <div className="text-xs text-gray-400">bandas</div>
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-indigo-200 group-hover:to-indigo-400 transition-colors duration-300">12</div>
        </div>

        <div className="stat-card group relative overflow-hidden p-3 bg-gradient-to-r from-gray-800 to-gray-800/95 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 hover:shadow-blue-900/20 hover:border-blue-500/30 flex flex-1 items-center justify-between min-w-[200px]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-700/20 text-blue-400 ring-1 ring-blue-500/30 shadow-inner shadow-blue-600/10">
              <Music2 className="h-5 w-5" />
            </div>
            <div className="text-xs text-gray-400">instrumentos</div>
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:to-blue-400 transition-colors duration-300">8</div>
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
          <label className="text-sm font-medium text-white">Nome</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md"
            placeholder="Nome do integrante"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Função</label>
          <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md">
            <option value="">Selecione uma função</option>
            <option value="vocal">Vocal</option>
            <option value="guitarra">Guitarra</option>
            <option value="baixo">Baixo</option>
            <option value="bateria">Bateria</option>
            <option value="teclado">Teclado</option>
            <option value="violao">Violão</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Banda</label>
          <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md">
            <option value="">Selecione uma banda</option>
            <option value="1">Rock Stars</option>
            <option value="2">Electric Sound</option>
            <option value="3">Acoustic Vibes</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Contato</label>
          <input 
            type="tel" 
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md"
            placeholder="(00) 00000-0000"
          />
        </div>
        
        <div className="pt-4 flex justify-end space-x-3">
          <button className="px-4 py-2 rounded-md bg-slate-700 text-white">Cancelar</button>
          <button className="px-4 py-2 rounded-md bg-purple-600 text-white">Salvar</button>
        </div>
      </div>
    </div>
  );
} 