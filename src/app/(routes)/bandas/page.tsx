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
  MusicIcon
} from 'lucide-react';
import { Banda } from '@/lib/types';
import { confirmar, alertaSucesso, alertaErro } from '@/lib/sweetalert';
import { useHydratedLocalStorage } from '@/hooks/useHydratedLocalStorage';
import { useRouter } from 'next/navigation';

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
const BandasTable = ({ bandas, onDelete, onView, onEdit }: { 
  bandas: Banda[]; 
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}) => {
  const [sortColumn, setSortColumn] = useState<string>('nome');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [bandasFiltradas, setBandasFiltradas] = useState<Banda[]>(Array.isArray(bandas) ? bandas : []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroGenero, setFiltroGenero] = useState<string>('todos');
  const [modoVisualizacao, setModoVisualizacao] = useState<'lista' | 'cartoes'>('lista');

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

  // Extrair lista única de gêneros para o filtro
  const generos = ['todos', ...new Set(Array.isArray(bandas) ? bandas.map(e => e.genero).filter(Boolean) : [])];

  return (
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
                          onClick={() => onView(banda.id)}
                          className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Visualizar"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => onEdit(banda.id)}
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
                      onClick={() => onView(banda.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-blue-300 hover:bg-blue-800/30 transition-colors duration-200"
                      title="Visualizar banda"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(banda.id)}
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
  );
};

export default function BandasPage() {
  const [bandas, setBandas] = useHydratedLocalStorage<Banda[]>('bandas', []);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchBandas() {
      try {
        const response = await fetch('/api/bandas');
        if (response.ok) {
          const data = await response.json();
          setBandas(data.bandas || []);
        } else {
          console.error('Erro ao buscar bandas');
          // Usando dados simulados se a API falhar
          setBandas([
            {
              id: '1',
              nome: 'Rock Stars',
              genero: 'Rock',
              descricao: 'Banda especializada em rock clássico anos 70 e 80'
            },
            {
              id: '2',
              nome: 'Electric Sound',
              genero: 'Pop',
              descricao: 'Covers de músicas pop contemporâneas'
            },
            {
              id: '3',
              nome: 'Acoustic Trio',
              genero: 'MPB/Acústico',
              descricao: 'Formato reduzido para eventos intimistas'
            },
            {
              id: '4',
              nome: 'Jazz Quartet',
              genero: 'Jazz',
              descricao: 'Especializada em standards de jazz e bossa nova'
            },
            {
              id: '5',
              nome: 'Baile Total',
              genero: 'Baile/Dançante',
              descricao: 'Repertório variado para festas dançantes'
            }
          ]);
        }
      } catch (error) {
        console.error('Erro ao buscar bandas:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBandas();
  }, []);

  const handleDelete = async (id: string) => {
    if (!Array.isArray(bandas)) {
      alertaErro('Não foi possível excluir a banda');
      return;
    }
    
    const banda = bandas.find(b => b.id === id);
    
    if (!banda) return;
    
    const confirmado = await confirmar(
      'Excluir banda',
      `Tem certeza que deseja excluir a banda "${banda.nome}"?`,
      'warning'
    );
    
    if (confirmado) {
      try {
        setBandas(bandas.filter(banda => banda.id !== id));
        alertaSucesso('Banda excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir banda:', error);
        alertaErro('Erro ao excluir a banda');
      }
    }
  };

  const handleView = (id: string) => {
    // Na implementação real, redireciona para a página de visualização
    console.log('Visualizar banda:', id);
  };

  const handleEdit = (id: string) => {
    // Usar o router do Next.js para navegação
    router.push(`/bandas/editar/${id}`);
  };

  // Calcula estatísticas
  const totalBandas = Array.isArray(bandas) ? bandas.length : 0;
  const generosUnicos = new Set(Array.isArray(bandas) ? bandas.map(b => b.genero).filter(Boolean) : []).size;
  
  // Número estimado de músicos (assumindo uma média de 5 por banda)
  const musicosEstimados = totalBandas * 5;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Bandas</h1>
          <p className="text-gray-400">Gerencie suas bandas e projetos musicais</p>
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
        />
      )}
    </div>
  );
} 