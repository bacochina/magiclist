'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Music, 
  Plus, 
  Search, 
  Filter, 
  FileEdit, 
  Trash2, 
  Eye,
  List,
  Grid,
  Clock,
  Tag
} from 'lucide-react';
import { Musica, Banda } from '@/lib/types';
import { useHydratedLocalStorage } from '@/hooks/useHydratedLocalStorage';
import { musicasSeed, gerarMusicasSeed } from '@/lib/seeds/musicas';
import { bandasSeed } from '@/lib/seeds/bandas';
import { confirmar, alertaSucesso, alertaErro } from '@/lib/sweetalert';
import { useRouter } from 'next/navigation';

// Card de estatísticas para a página de músicas
const MusicaStatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
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

// Componente de tabela de músicas
const MusicasTable = ({ musicas, bandas, onDelete, onView, onEdit }: { 
  musicas: Musica[]; 
  bandas: Banda[];
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}) => {
  const [sortColumn, setSortColumn] = useState<string>('nome');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [musicasFiltradas, setMusicasFiltradas] = useState<Musica[]>(Array.isArray(musicas) ? musicas : []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTom, setFiltroTom] = useState<string>('todos');
  const [modoVisualizacao, setModoVisualizacao] = useState<'lista' | 'cartoes'>('lista');

  // Função para obter os nomes das bandas a partir dos IDs
  const getNomesBandas = (bandasIds: string[] = []) => {
    if (!Array.isArray(bandas) || !Array.isArray(bandasIds)) return '';
    return bandasIds
      .map(id => bandas.find(banda => banda.id === id)?.nome)
      .filter(Boolean)
      .join(', ');
  };

  useEffect(() => {
    // Garantir que musicas é um array
    if (!Array.isArray(musicas)) {
      setMusicasFiltradas([]);
      return;
    }
    
    // Filtrar por busca e tom
    let filtered = [...musicas];
    
    if (searchTerm) {
      filtered = filtered.filter(musica => 
        (musica.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (musica.artista || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (musica.tom || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filtroTom !== 'todos') {
      filtered = filtered.filter(musica => 
        musica.tom === filtroTom
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
      if (sortColumn === 'artista') {
        const artistaA = a.artista || '';
        const artistaB = b.artista || '';
        return sortDirection === 'asc' 
          ? artistaA.localeCompare(artistaB) 
          : artistaB.localeCompare(artistaA);
      }
      if (sortColumn === 'bpm') {
        const bpmA = a.bpm || 0;
        const bpmB = b.bpm || 0;
        return sortDirection === 'asc' 
          ? bpmA - bpmB 
          : bpmB - bpmA;
      }
      return 0;
    });
    
    setMusicasFiltradas(filtered);
  }, [musicas, sortColumn, sortDirection, searchTerm, filtroTom]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Extrair lista única de tons para o filtro
  const tons = useMemo(() => {
    if (!Array.isArray(musicas)) return ['todos'];
    const tonsUnicos = ['todos', ...new Set(musicas.map(m => m.tom).filter(Boolean) as string[])];
    return tonsUnicos.sort();
  }, [musicas]);

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
                        placeholder="Buscar músicas..."
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
              value={filtroTom}
              onChange={(e) => setFiltroTom(e.target.value)}
            >
              {tons.map(tom => (
                <option key={tom} value={tom}>
                  {tom === 'todos' ? 'Todos os tons' : tom}
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

          <Link href="/musicas/nova" className="btn-primary">
            <Plus size={18} className="mr-1" />
            Nova Música
          </Link>
              </div>
            </div>

      {musicasFiltradas.length > 0 ? (
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
                      <span>Título</span>
                      {sortColumn === 'nome' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer ${sortColumn === 'artista' ? 'text-white' : ''}`}
                    onClick={() => handleSort('artista')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Artista</span>
                      {sortColumn === 'artista' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Tom
                  </th>
                  <th 
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer ${sortColumn === 'bpm' ? 'text-white' : ''}`}
                    onClick={() => handleSort('bpm')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>BPM</span>
                      {sortColumn === 'bpm' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Bandas
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {musicasFiltradas.map((musica) => (
                  <tr key={musica.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {musica.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {musica.artista}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <span className="px-2 py-1 bg-purple-900 bg-opacity-40 text-purple-300 rounded-full text-xs">
                        {musica.tom || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {musica.bpm || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {musica.bandasIds && musica.bandasIds.length > 0 ? (
                        getNomesBandas(musica.bandasIds)
                      ) : (
                        <span className="text-gray-500">Nenhuma banda</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onView(musica.id)}
                          className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Visualizar"
                        >
                          <Eye size={18} />
                        </button>
                      <button
                          onClick={() => onEdit(musica.id)}
                          className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                          title="Editar"
                        >
                          <FileEdit size={18} />
                      </button>
                        <button
                          onClick={() => onDelete(musica.id)}
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
            {musicasFiltradas.map((musica) => (
              <div 
                key={musica.id} 
                className="bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-xl border border-gray-700 flex flex-col h-full hover:translate-y-[-3px] hover:border-indigo-500/50"
              >
                {/* Cabeçalho do cartão */}
                <div className="p-3 flex flex-col bg-gradient-to-r from-indigo-800 to-indigo-900 border-b border-indigo-700">
                  <div className="flex items-center w-full">
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="text-base font-medium text-white leading-tight line-clamp-1 text-center"
                        title={musica.nome || ''}
                      >
                        {musica.nome}
                      </h3>
                    </div>
                  </div>
                  <div className="mt-1 flex items-center justify-center w-full">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-800/70 text-purple-100 shadow-sm">
                      {musica.artista}
                    </span>
                    </div>
                  </div>

                {/* Corpo do cartão */}
                <div className="px-4 py-4 flex-grow bg-gradient-to-b from-gray-800 to-gray-850">
                  <div className="space-y-3">
                    {/* Tom */}
                    <div className="flex items-start">
                      <div className="bg-gray-700/50 p-1.5 rounded-lg mr-2.5 flex-shrink-0">
                        <Tag size={16} className="text-indigo-300" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium mb-0.5">Tom</p>
                        <p className="text-gray-200 text-sm">
                          {musica.tom || 'Não definido'}
                        </p>
                      </div>
                    </div>

                    {/* BPM */}
                    <div className="flex items-start">
                      <div className="bg-gray-700/50 p-1.5 rounded-lg mr-2.5 flex-shrink-0">
                        <Clock size={16} className="text-indigo-300" />
                  </div>
                                <div>
                        <p className="text-xs text-gray-400 font-medium mb-0.5">BPM</p>
                        <p className="text-gray-200 text-sm">
                          {musica.bpm || 'Não definido'}
                        </p>
                </div>
              </div>
                              
                    {/* Bandas */}
                    <div className="flex items-start">
                      <div className="bg-gray-700/50 p-1.5 rounded-lg mr-2.5 flex-shrink-0">
                        <Music size={16} className="text-indigo-300" />
                              </div>
              <div>
                        <p className="text-xs text-gray-400 font-medium mb-0.5">Bandas</p>
                        {musica.bandasIds && musica.bandasIds.length > 0 ? (
                          <p className="text-gray-200 text-sm break-words">
                            {getNomesBandas(musica.bandasIds)}
                          </p>
                        ) : (
                          <p className="text-gray-500 text-sm">
                            Não incluída em nenhuma banda
                              </p>
                            )}
                          </div>
                        </div>
                              
                    {/* Observações (se houver) */}
                              {musica.observacoes && (
                      <div className="mt-2.5 pt-2.5 border-t border-gray-700/50">
                        <p className="text-xs text-gray-400 font-medium mb-0.5">Observações</p>
                        <p className="text-gray-300 text-sm line-clamp-2">{musica.observacoes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                
                {/* Rodapé com ações */}
                <div className="p-3 sm:px-6 flex justify-end items-center bg-gray-850 border-t border-gray-700/50 mt-auto">
                            <div className="flex space-x-2">
                              <button
                      onClick={() => onView(musica.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-blue-300 hover:bg-blue-800/30 transition-colors duration-200"
                      title="Visualizar música"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                          <button
                      onClick={() => onEdit(musica.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-yellow-300 hover:bg-yellow-800/30 transition-colors duration-200"
                            title="Editar música"
                          >
                      <FileEdit className="h-4 w-4" />
                          </button>
                          <button
                      onClick={() => onDelete(musica.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-red-300 hover:bg-red-800/30 transition-colors duration-200"
                            title="Excluir música"
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
          <div className="text-gray-400">Nenhuma música encontrada</div>
                </div>
              )}
            </div>
  );
};

export default function MusicasPage() {
  const [musicas, setMusicas] = useHydratedLocalStorage<Musica[]>('musicas', []);
  const [bandas, setBandas] = useHydratedLocalStorage<Banda[]>('bandas', bandasSeed);
  const [modoVisualizacao, setModoVisualizacao] = useState<'lista' | 'cartoes'>('lista');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Efeito para verificar se há músicas e popular com dados de exemplo se necessário
  useEffect(() => {
    // Carregar bandas
    const bandasFromStorage = localStorage.getItem('bandas');
    if (bandasFromStorage) {
      try {
        const parsedBandas = JSON.parse(bandasFromStorage);
        if (Array.isArray(parsedBandas)) {
          setBandas(parsedBandas);
        } else {
          setBandas(bandasSeed);
          localStorage.setItem('bandas', JSON.stringify(bandasSeed));
        }
      } catch (error) {
        console.error('Erro ao fazer parse das bandas:', error);
        setBandas(bandasSeed);
        localStorage.setItem('bandas', JSON.stringify(bandasSeed));
      }
    } else {
      setBandas(bandasSeed);
      localStorage.setItem('bandas', JSON.stringify(bandasSeed));
    }

    if (!Array.isArray(musicas) || musicas.length === 0) {
      // Verificar se já existem músicas no localStorage
      const musicasExistentes = localStorage.getItem('musicas');
      if (!musicasExistentes || JSON.parse(musicasExistentes).length === 0) {
        // Verificar se temos dados de exemplo
        if (typeof musicasSeed !== 'undefined' && Array.isArray(musicasSeed)) {
          // Salvar as músicas de exemplo no localStorage
          localStorage.setItem('musicas', JSON.stringify(musicasSeed));
          // Atualizar o estado
          setMusicas(musicasSeed);
          console.log('Músicas de exemplo populadas com sucesso!');
        }
      }
    }
    setLoading(false);
  }, []);

  const handleDelete = async (id: string) => {
    if (!Array.isArray(musicas)) {
      alertaErro('Não foi possível excluir a música');
      return;
    }
    
    const musica = musicas.find(m => m.id === id);
    
    if (!musica) return;
    
    const confirmado = await confirmar(
      'Excluir música',
      `Tem certeza que deseja excluir a música "${musica.nome}"?`,
      'warning'
    );
    
    if (confirmado) {
      try {
        setMusicas(musicas.filter((m) => m.id !== id));
        alertaSucesso('Música excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir música:', error);
        alertaErro('Erro ao excluir a música');
      }
    }
  };

  const handleView = (id: string) => {
    // Na implementação real, redireciona para a página de visualização
    console.log('Visualizar música:', id);
  };

  const handleEdit = (id: string) => {
    // Usar o router do Next.js em vez de window.location
    router.push(`/musicas/editar/${id}`);
  };

  // Calcula estatísticas
  const totalMusicas = Array.isArray(musicas) ? musicas.length : 0;
  const tonsUnicos = new Set(Array.isArray(musicas) ? musicas.map(m => m.tom).filter(Boolean) : []).size;
  
  // Calcular BPM médio
  const bpmTotal = Array.isArray(musicas) ? musicas.reduce((sum, musica) => sum + (musica.bpm || 0), 0) : 0;
  const bpmMedio = totalMusicas > 0 ? Math.round(bpmTotal / totalMusicas) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Músicas</h1>
          <p className="text-gray-400">Gerencie o repertório das suas bandas</p>
        </div>
      </div>
      
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MusicaStatCard 
          title="Total de Músicas" 
          value={totalMusicas} 
          icon={<Music size={20} />}
        />
        <MusicaStatCard 
          title="Tons diferentes" 
          value={tonsUnicos} 
          icon={<Tag size={20} />}
        />
        <MusicaStatCard 
          title="BPM médio" 
          value={bpmMedio ? `${bpmMedio} BPM` : 'N/A'} 
          icon={<Clock size={20} />}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <MusicasTable 
          musicas={musicas} 
          bandas={bandas}
          onDelete={handleDelete}
          onView={handleView}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
} 