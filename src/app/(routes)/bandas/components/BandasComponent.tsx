'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Music, 
  Users, 
  FileEdit, 
  Trash2, 
  Eye,
  List,
  Grid,
} from 'lucide-react';
import { Banda } from '@/lib/types';
import { confirmar, alertaSucesso, alertaErro } from '@/lib/sweetalert';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Dialog para visualizar/editar banda
const BandaDialog = ({ 
  mode, 
  open, 
  onOpenChange, 
  banda, 
  onUpdate 
}: { 
  mode: "view" | "edit"; 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  banda: Banda | null; 
  onUpdate?: (banda: Banda) => void;
}) => {
  const [formData, setFormData] = useState<Banda | null>(null);

  useEffect(() => {
    if (banda) {
      setFormData(banda);
    }
  }, [banda]);

  if (!banda) return null;

  const isViewMode = mode === "view";

  const handleSave = () => {
    if (formData && onUpdate) {
      onUpdate(formData);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isViewMode ? "Detalhes da Banda" : "Editar Banda"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nome" className="text-right">
              Nome
            </Label>
            <Input
              id="nome"
              value={formData?.nome || ""}
              className="col-span-3 bg-[#1a1c23] border-[#2e2f35]"
              readOnly={isViewMode}
              onChange={(e) =>
                setFormData(formData ? { ...formData, nome: e.target.value } : null)
              }
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="genero" className="text-right">
              Gênero
            </Label>
            <Input
              id="genero"
              value={formData?.genero || ""}
              className="col-span-3 bg-[#1a1c23] border-[#2e2f35]"
              readOnly={isViewMode}
              onChange={(e) =>
                setFormData(formData ? { ...formData, genero: e.target.value } : null)
              }
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="descricao" className="text-right">
              Descrição
            </Label>
            <Textarea
              id="descricao"
              value={formData?.descricao || ""}
              className="col-span-3 bg-[#1a1c23] border-[#2e2f35]"
              readOnly={isViewMode}
              onChange={(e) =>
                setFormData(formData ? { ...formData, descricao: e.target.value } : null)
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-[#1a1c23] border-[#2e2f35] hover:bg-gray-800/50"
          >
            {isViewMode ? "Fechar" : "Cancelar"}
          </Button>
          {!isViewMode && (
            <Button 
              type="button" 
              onClick={handleSave}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Salvar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Card de estatísticas para a página de bandas
const BandaStatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
  <div className="stat-card p-5">
    <div className="flex items-center space-x-3 mb-2">
      <div className="p-2 rounded-md bg-gray-700 text-purple-400">
        {icon}
      </div>
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
  </div>
);

// Componente de tabela de bandas
const BandasTable = ({ bandas, onDelete, onView, onEdit, onUpdate }: { 
  bandas: Banda[]; 
  onDelete: (id: string) => void;
  onView: (banda: Banda) => void;
  onEdit: (banda: Banda) => void;
  onUpdate: (banda: Banda) => void;
}) => {
  const [sortColumn, setSortColumn] = useState<string>('nome');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [bandasFiltradas, setBandasFiltradas] = useState<Banda[]>(Array.isArray(bandas) ? bandas : []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroGenero, setFiltroGenero] = useState<string>('todos');
  const [modoVisualizacao, setModoVisualizacao] = useState<'lista' | 'cartoes'>('lista');
  const [selectedBanda, setSelectedBanda] = useState<Banda | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    // Filtrar por busca e gênero
    let filtered = Array.isArray(bandas) ? [...bandas] : [];
    
    if (searchTerm) {
      filtered = filtered.filter(banda => 
        (banda.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (banda.genero || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (banda.descricao || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filtroGenero !== 'todos') {
      filtered = filtered.filter(banda => 
        banda.genero === filtroGenero
      );
    }
    
    // Ordenar
    filtered = [...filtered].sort((a, b) => {
      if (sortColumn === 'nome') {
        const nomeA = (a.nome || '');
        const nomeB = (b.nome || '');
        return sortDirection === 'asc' 
          ? nomeA.localeCompare(nomeB) 
          : nomeB.localeCompare(nomeA);
      }
      if (sortColumn === 'genero') {
        const generoA = a.genero || '';
        const generoB = b.genero || '';
        return sortDirection === 'asc' 
          ? generoA.localeCompare(generoB) 
          : generoB.localeCompare(generoA);
      }
      return 0;
    });
    
    setBandasFiltradas(filtered);
  }, [bandas, sortColumn, sortDirection, searchTerm, filtroGenero]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleViewBanda = (banda: Banda) => {
    setSelectedBanda(banda);
    setIsViewOpen(true);
    onView(banda);
  };

  const handleEditBanda = (banda: Banda) => {
    setSelectedBanda(banda);
    setIsEditOpen(true);
    onEdit(banda);
  };

  // Extrair lista única de gêneros para o filtro
  const generos = ['todos', ...new Set(Array.isArray(bandas) ? bandas.map(e => e.genero).filter(Boolean) : [])];

  return (
    <>
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
        {/* Filtros e Busca */}
        <div className="p-4 border-b border-gray-700 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar bandas..."
              className="bg-gray-900 text-white pl-10 pr-4 py-2 rounded-md border border-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
                    
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-400" />
              <select
                className="bg-gray-900 text-white px-3 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filtroGenero}
                onChange={(e) => setFiltroGenero(e.target.value)}
              >
                {generos.map(genero => (
                  <option key={genero} value={genero}>
                    {genero === 'todos' ? 'Todos os gêneros' : genero}
                  </option>
                ))}
              </select>
            </div>
          
            {/* Botões de visualização - Lista primeiro, depois cartões */}
            <div className="flex items-center space-x-1 ml-auto">
              <button
                type="button"
                className={`p-2 rounded-l ${
                  modoVisualizacao === 'lista'
                    ? 'bg-gray-700 text-gray-100'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setModoVisualizacao('lista')}
                title="Visualização em Lista"
              >
                <List size={18} />
              </button>
              <button
                type="button"
                className={`p-2 rounded-r ${
                  modoVisualizacao === 'cartoes'
                    ? 'bg-gray-700 text-gray-100'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setModoVisualizacao('cartoes')}
                title="Visualização em Cartões"
              >
                <Grid size={18} />
              </button>
            </div>

            <Link href="/bandas/nova" className="btn-primary">
              <Plus size={18} className="mr-1" />
              Nova Banda
            </Link>
          </div>
        </div>

        {bandasFiltradas.length > 0 ? (
          modoVisualizacao === 'lista' ? (
            /* Tabela */
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th 
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer ${sortColumn === 'nome' ? 'text-white' : ''}`}
                      onClick={() => handleSort('nome')}
                    >
                      <div className="flex items-center">
                        <span>Nome</span>
                        {sortColumn === 'nome' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer ${sortColumn === 'genero' ? 'text-white' : ''}`}
                      onClick={() => handleSort('genero')}
                    >
                      <div className="flex items-center space-x-1">
                        <Music size={14} />
                        <span>Gênero</span>
                        {sortColumn === 'genero' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {bandasFiltradas.map((banda) => (
                    <tr key={banda.id} className="hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {banda.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <span className="px-2 py-1 bg-purple-900 bg-opacity-40 text-purple-300 rounded-full text-xs">
                          {banda.genero || 'Não definido'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {banda.descricao || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewBanda(banda)}
                            className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                            title="Visualizar"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEditBanda(banda)}
                            className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                            title="Editar"
                          >
                            <FileEdit size={18} />
                          </button>
                          <button
                            onClick={() => onDelete(banda.id)}
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Visualização em Cartões */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-900/30 rounded-lg">
              {bandasFiltradas.map((banda) => (
                <div 
                  key={banda.id} 
                  className="bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-xl border border-gray-700 flex flex-col h-full hover:translate-y-[-3px] hover:border-indigo-500/50"
                >
                  {/* Cabeçalho do cartão */}
                  <div className="p-3 flex flex-col bg-gradient-to-r from-indigo-800 to-indigo-900 border-b border-indigo-700">
                    <div className="flex items-center w-full">
                      <div className="flex-1 min-w-0">
                        <h3 
                          className="text-base font-medium text-white leading-tight line-clamp-2 text-center"
                          title={banda.nome || ''}
                        >
                          {banda.nome}
                        </h3>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center justify-center w-full">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-800/70 text-purple-100 shadow-sm">
                        {banda.genero || 'Gênero não definido'}
                      </span>
                    </div>
                  </div>
                              
                  {/* Corpo do cartão */}
                  <div className="px-4 py-4 flex-grow bg-gradient-to-b from-gray-800 to-gray-850">
                    <div className="space-y-3">
                      {/* Descrição (se houver) */}
                      {banda.descricao ? (
                        <div>
                          <p className="text-xs text-gray-400 font-medium mb-0.5">Descrição</p>
                          <p className="text-gray-300 text-sm line-clamp-3">{banda.descricao}</p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-16 text-center text-gray-500">
                          <p className="text-sm">Sem descrição</p>
                        </div>
                      )}
                    </div>
                  </div>
                
                  {/* Rodapé com ações */}
                  <div className="p-3 sm:px-6 flex justify-end items-center bg-gray-850 border-t border-gray-700/50 mt-auto">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewBanda(banda)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-blue-300 hover:bg-blue-800/30 transition-colors duration-200"
                        title="Visualizar banda"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditBanda(banda)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-yellow-300 hover:bg-yellow-800/30 transition-colors duration-200"
                        title="Editar banda"
                      >
                        <FileEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(banda.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-red-300 hover:bg-red-800/30 transition-colors duration-200"
                        title="Excluir banda"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="p-8 text-center">
            <div className="text-gray-400">Nenhuma banda encontrada</div>
          </div>
        )}
      </div>

      {/* Modais para visualização e edição */}
      <BandaDialog
        mode="view"
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        banda={selectedBanda}
      />

      <BandaDialog
        mode="edit"
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        banda={selectedBanda}
        onUpdate={onUpdate}
      />
    </>
  );
};

// Componente principal de bandas
export default function BandasComponent() {
  const [bandas, setBandas] = useState<Banda[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Buscar bandas
  const fetchBandas = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bandas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'list'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setBandas(data.bandas || []);
      } else {
        console.error('Erro ao buscar bandas do servidor');
        alertaErro('Erro ao carregar bandas');
      }
    } catch (error) {
      console.error('Erro ao buscar bandas:', error);
      alertaErro('Erro ao carregar bandas');
    } finally {
      setLoading(false);
    }
  };

  // Carregar bandas na inicialização
  useEffect(() => {
    fetchBandas();
  }, []);

  // Função para excluir banda
  const handleDelete = async (id: string) => {
    const banda = bandas.find(b => b.id === id);
    
    if (!banda) return;
    
    const confirmado = await confirmar(
      'Excluir banda',
      `Tem certeza que deseja excluir a banda "${banda.nome}"?`,
      'warning'
    );
    
    if (confirmado) {
      try {
        // Usar o novo endpoint simplificado
        const response = await fetch('/api/bandas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'delete',
            data: { id }
          })
        });

        if (response.ok) {
          // Atualiza a lista removendo a banda excluída
          setBandas(bandas.filter(b => b.id !== id));
          alertaSucesso('Banda excluída com sucesso!');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao excluir banda');
        }
      } catch (error) {
        console.error('Erro ao excluir banda:', error);
        alertaErro('Erro ao excluir a banda');
      }
    }
  };

  // Função para visualizar banda
  const handleView = (banda: Banda) => {
    // A visualização acontece no modal, implementado no componente BandasTable
    console.log('Visualizando banda:', banda.id);
  };

  // Função para editar banda
  const handleEdit = (banda: Banda) => {
    // A edição acontece no modal, implementado no componente BandasTable
    console.log('Editando banda:', banda.id);
  };

  // Função para atualizar banda
  const handleUpdateBanda = async (bandaAtualizada: Banda) => {
    try {
      // Usar o novo endpoint simplificado
      const response = await fetch('/api/bandas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'update',
          data: bandaAtualizada
        })
      });

      if (response.ok) {
        const { banda } = await response.json();
        // Atualiza a lista substituindo a banda atualizada
        setBandas(prevBandas => 
          prevBandas.map(b => 
            b.id === banda.id ? banda : b
          )
        );
        alertaSucesso('Banda atualizada com sucesso!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar banda');
      }
    } catch (error) {
      console.error('Erro ao atualizar banda:', error);
      alertaErro('Erro ao atualizar a banda');
    }
  };

  // Calcula estatísticas
  const totalBandas = bandas.length;
  const generosUnicos = new Set(bandas.map(b => b.genero).filter(Boolean)).size;
  
  // Número estimado de músicos (assumindo uma média de 5 por banda)
  const musicosEstimados = totalBandas * 5;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Bandas</h1>
          <p className="text-gray-400">Gerencie suas bandas e projetos musicais (Supabase)</p>
        </div>
      </div>
      
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <BandaStatCard 
          title="Total de Bandas" 
          value={totalBandas} 
          icon={<Music size={20} />}
        />
        <BandaStatCard 
          title="Gêneros musicais" 
          value={generosUnicos} 
          icon={<Music size={20} />}
        />
        <BandaStatCard 
          title="Músicos estimados" 
          value={musicosEstimados} 
          icon={<Users size={20} />}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <BandasTable 
          bandas={bandas} 
          onDelete={handleDelete}
          onView={handleView}
          onEdit={handleEdit}
          onUpdate={handleUpdateBanda}
        />
      )}
    </div>
  );
} 