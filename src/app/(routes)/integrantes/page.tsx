'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  User, 
  FileEdit, 
  Trash2, 
  Eye,
  List,
  Grid,
  Phone,
  Mail
} from 'lucide-react';
import { Integrante, Banda } from '@/lib/types';
import { useHydratedLocalStorage } from '@/hooks/useHydratedLocalStorage';
import { bandasSeed } from '@/lib/seeds/bandas';
import { integrantesSeed } from '@/lib/seeds/integrantes';
import { confirmar, alertaSucesso, alertaErro } from '@/lib/sweetalert';
import { useRouter } from 'next/navigation';

// Card de estatísticas para a página de integrantes
const IntegranteStatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
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

// Componente de tabela de integrantes
const IntegrantesTable = ({ integrantes, bandas, onDelete, onView, onEdit }: { 
  integrantes: Integrante[]; 
  bandas: Banda[];
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}) => {
  const [sortColumn, setSortColumn] = useState<string>('nome');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [integrantesFiltrados, setIntegrantesFiltrados] = useState<Integrante[]>(integrantes);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroFuncao, setFiltroFuncao] = useState<string>('todas');
  const [modoVisualizacao, setModoVisualizacao] = useState<'lista' | 'cartoes'>('lista');

  // Função para obter os nomes das bandas a partir dos IDs
  const getNomesBandas = (bandasIds: string[]) => {
    if (!Array.isArray(bandas)) return '';
    return bandasIds
      .map(id => bandas.find(banda => banda.id === id)?.nome)
      .filter(Boolean)
      .join(', ');
  };

  useEffect(() => {
    // Filtrar por busca e função
    let filtered = integrantes;
    
    if (searchTerm) {
      filtered = filtered.filter(integrante => 
        (integrante.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (integrante.funcao || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (integrante.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (integrante.telefone || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filtroFuncao !== 'todas') {
      filtered = filtered.filter(integrante => 
        integrante.funcao === filtroFuncao
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
      if (sortColumn === 'funcao') {
        const funcaoA = a.funcao || '';
        const funcaoB = b.funcao || '';
        return sortDirection === 'asc' 
          ? funcaoA.localeCompare(funcaoB) 
          : funcaoB.localeCompare(funcaoA);
      }
      return 0;
    });
    
    setIntegrantesFiltrados(filtered);
  }, [integrantes, sortColumn, sortDirection, searchTerm, filtroFuncao, bandas]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Extrair lista única de funções para o filtro
  const funcoes = ['todas', ...new Set(integrantes.map(e => e.funcao).filter(Boolean) as string[])];

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
            placeholder="Buscar integrantes..." 
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
              value={filtroFuncao}
              onChange={(e) => setFiltroFuncao(e.target.value)}
            >
              {funcoes.map(funcao => (
                <option key={funcao} value={funcao}>
                  {funcao === 'todas' ? 'Todas as funções' : funcao}
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

          <Link href="/integrantes/novo" className="btn-primary">
            <Plus size={18} className="mr-1" />
            Novo Integrante
          </Link>
        </div>
      </div>
      
      {integrantesFiltrados.length > 0 ? (
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
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer ${sortColumn === 'funcao' ? 'text-white' : ''}`}
                    onClick={() => handleSort('funcao')}
                  >
                    <div className="flex items-center space-x-1">
                      <User size={14} />
                      <span>Função</span>
                      {sortColumn === 'funcao' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Contato
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
                {integrantesFiltrados.map((integrante) => (
                  <tr key={integrante.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {integrante.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <span className="px-2 py-1 bg-purple-900 bg-opacity-40 text-purple-300 rounded-full text-xs">
                        {integrante.funcao}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {integrante.telefone && (
                        <div className="flex items-center">
                          <Phone size={14} className="mr-1 text-gray-400" />
                          <span>{integrante.telefone}</span>
                        </div>
                      )}
                      {integrante.email && (
                        <div className="flex items-center mt-1">
                          <Mail size={14} className="mr-1 text-gray-400" />
                          <span>{integrante.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {integrante.bandasIds && integrante.bandasIds.length > 0 ? (
                        getNomesBandas(integrante.bandasIds)
                      ) : (
                        <span className="text-gray-500">Nenhuma banda</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onView(integrante.id)}
                          className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Visualizar"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => onEdit(integrante.id)}
                          className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                          title="Editar"
                        >
                          <FileEdit size={18} />
                        </button>
                        <button
                          onClick={() => onDelete(integrante.id)}
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
            {integrantesFiltrados.map((integrante) => (
              <div 
                key={integrante.id} 
                className="bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-xl border border-gray-700 flex flex-col h-full hover:translate-y-[-3px] hover:border-indigo-500/50"
              >
                {/* Cabeçalho do cartão */}
                <div className="p-3 flex flex-col bg-gradient-to-r from-indigo-800 to-indigo-900 border-b border-indigo-700">
                  <div className="flex items-center w-full">
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="text-base font-medium text-white leading-tight line-clamp-2 text-center"
                        title={integrante.nome || ''}
                      >
                        {integrante.nome}
                      </h3>
                    </div>
                  </div>
                  <div className="mt-1 flex items-center justify-center w-full">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-800/70 text-purple-100 shadow-sm">
                      {integrante.funcao}
                    </span>
                  </div>
                </div>
                
                {/* Corpo do cartão */}
                <div className="px-4 py-4 flex-grow bg-gradient-to-b from-gray-800 to-gray-850">
                  <div className="space-y-3">
                    {/* Telefone */}
                    {integrante.telefone && (
                      <div className="flex items-start">
                        <div className="bg-gray-700/50 p-1.5 rounded-lg mr-2.5 flex-shrink-0">
                          <Phone size={16} className="text-indigo-300" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium mb-0.5">Telefone</p>
                          <p className="text-gray-200 text-sm">
                            {integrante.telefone}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Email */}
                    {integrante.email && (
                      <div className="flex items-start">
                        <div className="bg-gray-700/50 p-1.5 rounded-lg mr-2.5 flex-shrink-0">
                          <Mail size={16} className="text-indigo-300" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium mb-0.5">Email</p>
                          <p className="text-gray-200 text-sm break-all">
                            {integrante.email}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Bandas */}
                    <div className="flex items-start">
                      <div className="bg-gray-700/50 p-1.5 rounded-lg mr-2.5 flex-shrink-0">
                        <Users size={16} className="text-indigo-300" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium mb-0.5">Bandas</p>
                        {integrante.bandasIds && integrante.bandasIds.length > 0 ? (
                          <p className="text-gray-200 text-sm break-words">
                            {getNomesBandas(integrante.bandasIds)}
                          </p>
                        ) : (
                          <p className="text-gray-500 text-sm">
                            Não participa de nenhuma banda
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Observações (se houver) */}
                    {integrante.observacoes && (
                      <div className="mt-2.5 pt-2.5 border-t border-gray-700/50">
                        <p className="text-xs text-gray-400 font-medium mb-0.5">Observações</p>
                        <p className="text-gray-300 text-sm line-clamp-2">{integrante.observacoes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Rodapé com ações */}
                <div className="p-3 sm:px-6 flex justify-end items-center bg-gray-850 border-t border-gray-700/50 mt-auto">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onView(integrante.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-blue-300 hover:bg-blue-800/30 transition-colors duration-200"
                      title="Visualizar integrante"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(integrante.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-yellow-300 hover:bg-yellow-800/30 transition-colors duration-200"
                      title="Editar integrante"
                    >
                      <FileEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(integrante.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-red-300 hover:bg-red-800/30 transition-colors duration-200"
                      title="Excluir integrante"
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
          <div className="text-gray-400">Nenhum integrante encontrado</div>
        </div>
      )}
    </div>
  );
};

export default function IntegrantesPage() {
  const [integrantes, setIntegrantes] = useHydratedLocalStorage<Integrante[]>('integrantes', []);
  const [bandas, setBandas] = useState<Banda[]>(bandasSeed);
  const [modoVisualizacao, setModoVisualizacao] = useState<'lista' | 'cartoes'>('lista');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Efeito para verificar se há integrantes e popular com dados de exemplo se necessário
  useEffect(() => {
    if (integrantes.length === 0) {
      // Verificar se já existem integrantes no localStorage
      const integrantesExistentes = localStorage.getItem('integrantes');
      if (!integrantesExistentes || JSON.parse(integrantesExistentes).length === 0) {
        // Salvar os integrantes de exemplo no localStorage
        localStorage.setItem('integrantes', JSON.stringify(integrantesSeed));
        // Atualizar o estado
        setIntegrantes(integrantesSeed);
        console.log('Integrantes de exemplo populados com sucesso!');
      }
    }
    setLoading(false);
  }, [integrantes.length, setIntegrantes]);

  const handleDelete = async (id: string) => {
    const integrante = integrantes.find(i => i.id === id);
    
    if (!integrante) return;
    
    const confirmado = await confirmar(
      'Excluir integrante',
      `Tem certeza que deseja excluir o integrante "${integrante.nome}"?`,
      'warning'
    );
    
    if (confirmado) {
      try {
        setIntegrantes(integrantes.filter((i) => i.id !== id));
        alertaSucesso('Integrante excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir integrante:', error);
        alertaErro('Erro ao excluir o integrante');
      }
    }
  };

  const handleView = (id: string) => {
    // Na implementação real, redireciona para a página de visualização
    console.log('Visualizar integrante:', id);
  };

  const handleEdit = (id: string) => {
    // Usar o router do Next.js em vez de window.location
    router.push(`/integrantes/editar/${id}`);
  };

  // Calcula estatísticas
  const totalIntegrantes = integrantes.length;
  const funcoesUnicas = new Set(integrantes.map(i => i.funcao).filter(Boolean)).size;
  
  // Calcular quantos integrantes participam de bandas
  const integrantesEmBandas = integrantes.filter(i => i.bandasIds && i.bandasIds.length > 0).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Integrantes</h1>
          <p className="text-gray-400">Gerencie os músicos e membros da sua equipe</p>
        </div>
      </div>
      
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <IntegranteStatCard 
          title="Total de Integrantes" 
          value={totalIntegrantes} 
          icon={<User size={20} />}
        />
        <IntegranteStatCard 
          title="Funções diferentes" 
          value={funcoesUnicas} 
          icon={<User size={20} />}
        />
        <IntegranteStatCard 
          title="Em bandas" 
          value={integrantesEmBandas} 
          icon={<Users size={20} />}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <IntegrantesTable 
          integrantes={integrantes} 
          bandas={bandas}
          onDelete={handleDelete}
          onView={handleView}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
} 